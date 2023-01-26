import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styles } from "./styles";
import AddRemoveButtons from "../AddRemoveButtons/AddRemoveButtons";
import { useState, MouseEventHandler } from "react";
import { Button, Fade } from "@mui/material";
import BasicDatePicker from "../DatePicker/BasicDatePicker";
import * as yup from "yup";
import { validateDate } from "@mui/x-date-pickers/internals/hooks/validation/useDateValidation";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface formSchema {
  cityOrigin: string;
  cityIntermediate?: string;
  cityDestination: string;
  date?: any;
  passenger: string;
}

type Dictionary = { [index: string]: any };

const formInputValidation: Dictionary = {
  cityOrigin: { empty: false, touched: false, error: false, completed: false },
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
  const [intermediateCities, setIntermediateCities] = useState<string[]>([]);
  const [dateValue, setDateValue] = React.useState<Dayjs | null>(null);
  const [formState, setFormState] = useState<formSchema>({
    cityOrigin: "",
    cityDestination: "",
    passenger: "0",
  });

  const [formInputValidationState, setFormInputValidationState] =
    useState<Dictionary>(formInputValidation);

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
      `cityIntermediate${intermediateCityCounter}`,
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

    console.log(formStateValidationCopy[`${removedCity}`]);

    if (removedCity) delete formStateCopy[`${removedCity}`];
    if (removedCity) delete formStateValidationCopy[`${removedCity}`];

    setFormInputValidationState(formStateValidationCopy);
  };

  const handleSubmit: MouseEventHandler = (e) => {
    console.log(formState);
  };

  const isFormCompleted = () => {
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
        onChange={(e) => {
          setFormState({ ...formState, cityOrigin: e.target.value });
          updateTouchElement("cityOrigin");
        }}
        name={"cityOrigin"}
        error={formInputValidationState["cityOrigin"].error}
      />
      <AddRemoveButtons add={add} remove={remove} state={intermediateCities} />
      {intermediateCities.map((city) => (
        <Fade in={true} timeout={600}>
          <TextField
            sx={styles.form__input}
            onBlur={onBlurHandler}
            label="Intermediate City"
            variant="outlined"
            required
            onChange={(e) => {
              setFormState({
                ...formState,
                [city]: e.target.value,
              });
              updateTouchElement(city);
            }}
            name={city}
            error={formInputValidationState[city].error}
          />
        </Fade>
      ))}
      <TextField
        sx={styles.form__input}
        label="City of destination"
        variant="outlined"
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
              date: newValue?.format("DD/MM/YYYYY"),
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
