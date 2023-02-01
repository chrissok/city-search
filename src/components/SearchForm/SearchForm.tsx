import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styles } from "./styles";
import AddRemoveButtons from "../AddRemoveButtons/AddRemoveButtons";
import { useState, MouseEventHandler } from "react";
import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useNavigate, useSearchParams } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { isEmpty, serialize } from "../../utils/utils";
import ComboBox from "../ComboBox/ComboBox";
import { Dictionary } from "../../types/types";

dayjs.extend(customParseFormat); // needed to format date from params (string) to dayjs again

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

export default function SearchForm() {
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();

  const dateParam = dayjs(searchParams.get("date"), "L");

  const [dateValue, setDateValue] = useState<Dayjs | null>(dateParam || null);

  const cityOriginParam = searchParams.get("cityOrigin");
  const cityDestinationParam = searchParams.get("cityDestination");
  const passengerParam = searchParams.get("passenger");
  const intermediateCitiesParam = searchParams.get("intermediateCities");
  const citiesDataParam = searchParams.get("citiesData");

  let intermediateCitiesParamParsed: any[] = [];

  if (intermediateCitiesParam)
    intermediateCitiesParamParsed = JSON.parse(intermediateCitiesParam);

  let citiesDataParamParsed = "";

  if (citiesDataParam) citiesDataParamParsed = JSON.parse(citiesDataParam);

  const [formState, setFormState] = useState<Dictionary>({
    cityOrigin: cityOriginParam || "",
    cityDestination: cityDestinationParam || "",
    citiesData: citiesDataParamParsed || {},
    passenger: passengerParam || "",
    date: dateParam.format("L").toString() || null,
    intermediateCities: intermediateCitiesParamParsed || [],
  });

  const setIntermediateCitiesValidation = () => {
    let validationsIntermediateCities = { ...formInputValidation };

    intermediateCitiesParamParsed.forEach((city) => {
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
    intermediateCitiesParamParsed || []
  );

  const updateTouchElement = (element: string) => {
    if (formInputValidation[element])
      formInputValidation[element].touched = true;
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
      setSearchParams({
        ...formState,
        intermediateCities: JSON.stringify([...formState.intermediateCities]),
        citiesData: JSON.stringify({ ...formState.citiesData }),
      });
      setFormInputValidationState({
        ...formInputValidationState,
        [inputName]: {
          ...formInputValidationState[inputName],
          error: false,
          completed: true,
        },
      });
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

    const cityDataCopy = { ...formState.citiesData }; //to avoid state mutation

    const filteredCityData = Object.values(cityDataCopy).filter((city: any) => {
      return city.id !== removedCity.id;
    });

    setIntermediateCities(intermediateCitiesCopy);

    setFormState({ ...formState, citiesData: filteredCityData });

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
        citiesData: JSON.stringify({ ...formState.citiesData }),
      })}`,
      {
        state: {
          ...formState,
        },
      }
    );
  };

  const isFormCompleted = () => {
    // if (cityOriginParam && dateParam && cityDestinationParam && passengerParam)
    //   return true;
    for (const property in formState) {
      if (property === "intermediateCities") {
        if (formState[property].length < intermediateCities.length)
          return false;
      }
      if (formState[property] === "") return false;
    }
    return true;
  };

  console.log(formState);

  return (
    <Box sx={styles.form}>
      <ComboBox
        inputLabel="City of Origin"
        inputName={"cityOrigin"}
        onBlurHandler={onBlurHandler}
        updateTouchElement={updateTouchElement}
        value={formState.cityOrigin}
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
          onBlurHandler={onBlurHandler}
          updateTouchElement={updateTouchElement}
          value={formState.intermediateCities[index]?.value}
          setFormState={setFormState}
          formState={formState}
          formInputValidation={formInputValidationState}
          sx={styles.form__input}
        />
      ))}
      <ComboBox
        inputLabel="City of destination"
        inputName={"cityDestination"}
        onBlurHandler={onBlurHandler}
        updateTouchElement={updateTouchElement}
        value={formState.cityDestination}
        setFormState={setFormState}
        formState={formState}
        formInputValidation={formInputValidationState}
        sx={styles.form__input}
      />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Pick a date"
          value={dateValue}
					onClose={onBlurHandler}
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
              required
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
        InputProps={{
          inputProps: { min: 0 },
        }}
        onChange={(e) => {
          setFormState({
            ...formState,
            passenger:
              e.target.value < "0" ? (e.target.value = "0") : e.target.value,
          });
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
