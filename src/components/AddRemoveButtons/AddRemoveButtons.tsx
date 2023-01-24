import { Box, Button, Fade } from "@mui/material";
import React, { MouseEventHandler } from "react";
import { styles } from "./styles";

function AddRemoveButtons({
  add,
  remove,
  state,
}: {
  add: MouseEventHandler;
  remove: MouseEventHandler;
  state: number[];
}) {
  const stateNotEmpty: boolean = state.length > 0;

  return (
    <Box>
      <Button
        sx={styles.button}
        variant="contained"
        size="medium"
        onClick={add}
      >
        +
      </Button>
      <Fade in={stateNotEmpty} timeout={400}>
        <Button
          sx={styles.button}
          variant="contained"
          size="medium"
          onClick={remove}
        >
          -
        </Button>
      </Fade>
    </Box>
  );
}

export default AddRemoveButtons;
