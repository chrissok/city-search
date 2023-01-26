import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styles } from "./styles";
import AddRemoveButtons from "../AddRemoveButtons/AddRemoveButtons";
import { useState, MouseEventHandler } from "react";
import { Button, Fade } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";

type Dictionary = { [index: string]: any };

dayjs.extend(customParseFormat); // needed to format date from params (string) to dayjs again

export default function SearchForm() {
  let [searchParams, setSearchParams] = useSearchParams();

  const navigate = useNavigate();
	const {search} = useLocation()

  const dateParam = dayjs(searchParams.get("date"), "L");

  const [dateValue, setDateValue] = React.useState<Dayjs | null>(
    dateParam || null
  );

  const cityOriginParam = searchParams.get("cityOrigin");
  const cityDestinationParam = searchParams.get("cityDestination");
  const passengerParam = searchParams.get("passenger");
  const intermediateCitiesParam = searchParams.get("intermediateCities");

  let intermediateCitiesParamParsed = "";

  if (intermediateCitiesParam)
    intermediateCitiesParamParsed = JSON.parse(intermediateCitiesParam);

  const [formState, setFormState] = useState<Dictionary>({
    cityOrigin: searchParams.get("cityOrigin") || "",
    cityDestination: searchParams.get("cityDestination") || "",
    passenger: searchParams.get("passenger") || "0",
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

  console.log(mapIntermediateCitiesParams());

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

  const onBlurHandler: React.FocusEventHandler = (
    event: React.FocusEvent<HTMLInputElement>
  ) => {
    if (isEmpty(event.currentTarget?.value)) {
      setFormInputValidationState({
        ...formInputValidationState,
        [event.target.name]: {
          ...[event.target.name],
          error: true,
          completed: false,
        },
      });
    } else {
      setFormInputValidationState({
        ...formInputValidationState,
        [event.target.name]: {
          ...[event.target.name],
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
    setIntermediateCities(intermediateCitiesCopy);

    const formStateCopy: any = { ...formState }; //to avoid state mutation
    const formStateValidationCopy: any = { ...formInputValidationState }; //to avoid state mutation

    formStateCopy.intermediateCities.pop();

    if (removedCity) delete formStateValidationCopy[`${removedCity.id}`];

    setFormInputValidationState(formStateValidationCopy);
  };

  const handleSubmit: MouseEventHandler = () => {
    setSearchParams({
      ...formState,
      intermediateCities: JSON.stringify(formState.intermediateCities),
    });
    navigate("/search" + search );
  };

  const isFormCompleted = () => {
    if (cityOriginParam && dateParam && cityDestinationParam && passengerParam)
      return true;

    for (const property in formInputValidationState) {
      if (!formInputValidationState[property].completed) return false;
    }
    return true;
  };

  return (
    <Box sx={styles.form}>
      <TextField
        onBlur={onBlurHandler}
        sx={styles.form__input}
        label="City of origin"
        variant="outlined"
        required
        value={formState.cityOrigin}
        onChange={(e) => {
          setFormState({ ...formState, cityOrigin: e.target.value });
          updateTouchElement("cityOrigin");
        }}
        name={"cityOrigin"}
        error={formInputValidationState["cityOrigin"].error}
      />
      <AddRemoveButtons add={add} remove={remove} state={intermediateCities} />
      {intermediateCities.map((city, index) => (
        <Fade in={true} timeout={600}>
          <TextField
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
          />
        </Fade>
      ))}
      <TextField
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
      />
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
              onBlur={onBlurHandler}
              sx={styles.form__input}
              name={"date"}
              error={formInputValidationState["date"].error}
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
        onBlur={onBlurHandler}
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
