import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { styles } from "./styles";
import AddRemoveButtons from "../AddRemoveButtons/AddRemoveButtons";
import { useState, MouseEventHandler } from "react";
import { Button, Fade } from "@mui/material";
import BasicDatePicker from "../DatePicker/BasicDatePicker";

interface formSchema {
  cityOrigin: string;
  cityIntermediate?: string;
  cityDestination: string;
  date?: Date;
  passanger: number;
}

export default function SearchForm() {
  const [intermediateCities, setIntermediateCities] = useState<number[]>([]);
  const [formState, setFormState] = useState<formSchema>({
    cityOrigin: "",
    cityDestination: "",
    passanger: 0,
  });

  const add: MouseEventHandler = () => {
    setIntermediateCities([...intermediateCities, 0]);
  };

  const remove: MouseEventHandler = () => {
    const intermediateCitiesCopy = [...intermediateCities]; //to avoid state mutation
    intermediateCitiesCopy.pop();
    setIntermediateCities(intermediateCitiesCopy);
  };

  const handleSubmit: MouseEventHandler = (e) => {
    console.log(formState);
  };

  return (
    <Box sx={styles.form}>
      <TextField
        sx={styles.form__input}
        label="City of origin"
        variant="outlined"
        onChange={(e) => setFormState({ ...formState, cityOrigin: e.target.value })}
      />
      <AddRemoveButtons add={add} remove={remove} state={intermediateCities} />
      {intermediateCities.map(() => (
        <Fade in={true} timeout={600}>
          <TextField
            sx={styles.form__input}
            label="Intermediate City"
            variant="outlined"
          />
        </Fade>
      ))}
      <TextField
        sx={styles.form__input}
        label="City of destination"
        variant="outlined"
      />
      <BasicDatePicker sx={styles.form__input} />
      <TextField
        label="Number of Passengers"
        inputProps={{ inputMode: "numeric", pattern: "[0-9]*" }}
      />
      <Button
        variant="contained"
        sx={styles.form__submit}
        onClick={handleSubmit}
      >
        Submit
      </Button>
    </Box>
  );
}
