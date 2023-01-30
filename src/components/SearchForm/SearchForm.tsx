import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styles } from "./styles";
import AddRemoveButtons from "../AddRemoveButtons/AddRemoveButtons";
import _debounce from "lodash/debounce";
import { useState, MouseEventHandler, useCallback } from "react";
import {
  Autocomplete,
  Button,
  Fade,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { serialize } from "../../utils/utils";
import { getCitiesByName } from "../../api/actions";
import ComboBox from "../ComboBox/ComboBox";
import { Dictionary } from "../../types/types";

dayjs.extend(customParseFormat); // needed to format date from params (string) to dayjs again

export default function SearchForm() {
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
  const { search } = useLocation();

  const dateParam = dayjs(searchParams.get("date"), "L");

  const [dateValue, setDateValue] = useState<Dayjs | null>(dateParam || null);

  const cityOriginParam = searchParams.get("cityOrigin");
  const cityDestinationParam = searchParams.get("cityDestination");
  const passengerParam = searchParams.get("passenger");
  const intermediateCitiesParam = searchParams.get("intermediateCities");

  let intermediateCitiesParamParsed = "";

  if (intermediateCitiesParam)
    intermediateCitiesParamParsed = JSON.parse(intermediateCitiesParam);

  const [formState, setFormState] = useState<Dictionary>({
    cityOrigin: cityOriginParam || "",
    cityDestination: cityDestinationParam || "",
    passenger: passengerParam || "0",
    intermediateCities: Object.values(intermediateCitiesParamParsed) || [],
  });

  const mapIntermediateCitiesParams = () => {
    return Object.values(intermediateCitiesParamParsed).map((value, index) => ({
      id: `cityIntermediate${index}`,
      value,
    }));
  };

  const formInputValidation: Dictionary = {
    cityOrigin: {
      empty: false,
      touched: false,
      error: false,
      completed: false,
    },
    cityDestination: {
      empty: false,
      touched: false,
      error: false,
      completed: false,
    },
    date: { empty: false, touched: false, error: false, completed: false },
    passenger: { empty: false, touched: false, error: false, completed: false },
  };

  const setIntermediateCitiesValidation = () => {
    let validationsIntermediateCities = { ...formInputValidation };

    mapIntermediateCitiesParams().forEach((city) => {
      return (validationsIntermediateCities = {
        ...validationsIntermediateCities,
        [`${city.id}`]: {
          empty: false,
          touched: false,
          error: false,
          completed: false,
        },
      });
    });
    return validationsIntermediateCities;
  };

  const [formInputValidationState, setFormInputValidationState] =
    useState<Dictionary>(setIntermediateCitiesValidation());

  const [intermediateCities, setIntermediateCities] = useState<any[]>(
    mapIntermediateCitiesParams || []
  );

  const updateTouchElement = (element: string) => {
    if (formInputValidation[element])
      formInputValidation[element].touched = true;
  };

  const isEmpty = (element: string) => {
    if (element === "") return true;
  };

  const onBlurHandler: any = (event: any, inputName: string) => {
    if (isEmpty(event.target.value)) {
      setFormInputValidationState({
        ...formInputValidationState,
        [inputName]: {
          ...formInputValidationState[inputName],
          error: true,
          completed: false,
        },
      });
    } else {
      setFormInputValidationState({
        ...formInputValidationState,
        [inputName]: {
          ...formInputValidationState[inputName],
          error: false,
          completed: true,
        },
      });
      console.log(formInputValidationState);
    }
  };

  const add: MouseEventHandler = () => {
    const intermediateCityCounter = intermediateCities.length;
    setIntermediateCities([
      ...intermediateCities,
      { id: `cityIntermediate${intermediateCityCounter}` },
    ]);
    setFormInputValidationState({
      ...formInputValidationState,
      ["cityIntermediate" + intermediateCityCounter]: {
        empty: false,
        touched: false,
        error: false,
      },
    });
  };

  const remove: MouseEventHandler = () => {
    const intermediateCitiesCopy = [...intermediateCities]; //to avoid state mutation
    const removedCity = intermediateCitiesCopy.pop();
    setIntermediateCities(intermediateCitiesCopy);

    const formStateCopy: any = { ...formState }; //to avoid state mutation
    const formStateValidationCopy: any = { ...formInputValidationState }; //to avoid state mutation

    formStateCopy.intermediateCities.pop();

    if (removedCity) delete formStateValidationCopy[`${removedCity.id}`];

    setFormInputValidationState(formStateValidationCopy);
  };

  const handleSubmit: MouseEventHandler = () => {
    navigate(
      `/search?${serialize({
        ...formState,
        intermediateCities: JSON.stringify({ ...formState.intermediateCities }),
      })}`,
      {
        state: {
          ...formState,
        },
      }
    );
  };

  const isFormCompleted = () => {
    console.log(formInputValidationState);

    if (cityOriginParam && dateParam && cityDestinationParam && passengerParam)
      return true;

    for (const property in formInputValidationState) {
      if (!formInputValidationState[property].completed) return false;
    }
    return true;
  };

  const [originCityOptions, setOriginCityOptions] = useState<string[]>([]);

  const handleDebounceFn = async (
    inputValue: string,
    setIsLoading: Function
  ) => {
    setIsLoadedOriginCity(false);
    setIsLoading(true);
    try {
      const cities = await getCitiesByName(inputValue);
      setOriginCityOptions(cities);
      setIsLoadedOriginCity(true);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const handleChangeOriginCity = (event: SelectChangeEvent) => {
    console.log(event.target.value[0]);

    setSelectedOriginCity(event.target.value[0]);
    setFormState({ ...formState, cityOriginData: event.target.value });
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 2000), []);

  const [loadingOriginCity, setLoadingOriginCity] = useState(false);
  const [isLoadedOriginCity, setIsLoadedOriginCity] = useState(false);
  const [selectedOriginCity, setSelectedOriginCity] = useState("");

  return (
    <Box sx={styles.form}>
      <ComboBox
        inputLabel="City of Origin"
        inputName={"cityOrigin"}
        debounceFn={debounceFn}
        onBlurHandler={onBlurHandler}
        updateTouchElement={updateTouchElement}
        value={formState.cityOrigin}
        options={originCityOptions}
        setFormState={setFormState}
        formState={formState}
        formInputValidation={formInputValidationState}
        sx={styles.form__input}
      />
      <AddRemoveButtons add={add} remove={remove} state={intermediateCities} />
      {intermediateCities.map((city, index) => (
        <ComboBox
          inputLabel="Intermediate City"
          isIterationChild={true}
          inputName={city.id}
          debounceFn={debounceFn}
          onBlurHandler={onBlurHandler}
          updateTouchElement={updateTouchElement}
          value={formState.intermediateCities[index]}
          options={originCityOptions}
          setFormState={setFormState}
          formState={formState}
          formInputValidation={formInputValidationState}
          sx={styles.form__input}
        />
      ))}
      {/* <TextField
            sx={styles.form__input}
            onBlur={onBlurHandler}
            label="Intermediate City"
            variant="outlined"
            required
            value={formState.intermediateCities[index]}
            onChange={(e) => {
              setFormState({
                ...formState,
                intermediateCities: {
                  ...formState.intermediateCities,
                  [city.id]: e.target.value,
                },
              });
              updateTouchElement(city.id);
            }}
            name={city.id}
            error={formInputValidationState[city.id].error}
          /> */}
      <ComboBox
        inputLabel="City of destination"
        inputName={"cityDestination"}
        debounceFn={debounceFn}
        onBlurHandler={onBlurHandler}
        updateTouchElement={updateTouchElement}
        value={formState.cityDestination}
        options={originCityOptions}
        setFormState={setFormState}
        formState={formState}
        formInputValidation={formInputValidationState}
        sx={styles.form__input}
      />
      {/* <TextField
        sx={styles.form__input}
        label="City of destination"
        variant="outlined"
        value={formState.cityDestination}
        required
        onChange={(e) => {
          setFormState({ ...formState, cityDestination: e.target.value });
          updateTouchElement("cityDestination");
        }}
        name={"cityDestination"}
        error={formInputValidationState["cityDestination"].error}
        onBlur={onBlurHandler}
      /> */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Pick a date"
          value={dateValue}
          onChange={(newValue) => {
            setDateValue(newValue);
            setFormState({
              ...formState,
              date: newValue?.format("L").toString(),
            });
            updateTouchElement("date");
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              onBlur={(event) => onBlurHandler(event, "date")}
              sx={styles.form__input}
              name={"date"}
              error={formInputValidationState["date"].error}
              value={dateValue}
            />
          )}
        />
      </LocalizationProvider>
      <TextField
        label="Number of Passengers"
        type={"number"}
        required
        value={formState.passenger}
        onChange={(e) => {
          setFormState({ ...formState, passenger: e.target.value });
          updateTouchElement("passenger");
        }}
        name={"passenger"}
        error={formInputValidationState["passenger"].error}
        onBlur={(event) => onBlurHandler(event, "passenger")}
      />
      <Button
        variant="contained"
        sx={styles.form__submit}
        onClick={handleSubmit}
        disabled={!isFormCompleted()}
      >
        Submit
      </Button>
    </Box>
  );
}
