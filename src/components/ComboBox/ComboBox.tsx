import { Autocomplete, CircularProgress, Fade, TextField } from "@mui/material";
import React, { FocusEventHandler, useState } from "react";
import { Dictionary } from "../../types/types";

function ComboBox({
  onBlurHandler,
  options,
  value,
  updateTouchElement,
  setFormState,
  formState,
  debounceFn,
  inputName,
  inputLabel,
  formInputValidation,
  isIterationChild = false,
	sx,
  ...props
}: {
  onBlurHandler: any;
  options: any[];
  value: string;
  updateTouchElement: Function;
  setFormState: Function;
  formState: any;
  debounceFn: Function;
  inputName: string;
  inputLabel: string;
  formInputValidation: Dictionary;
  isIterationChild?: boolean;
	sx?: any
}) {
  const onChangeIteration = (newValue: any[]) => {
    setFormState({
      ...formState,
      intermediateCities: {
        ...formState.intermediateCities,
        [inputName]: newValue[0],
        [inputName + "Data"]: newValue,
      },
    });
  };

  const [loading, setIsloading] = useState(false);

  return (
    <>
      <Fade in={true} timeout={600}>
        <Autocomplete
          {...props}
          disablePortal
					onBlur={(event) => onBlurHandler(event, inputName)}
          options={options}
          filterOptions={(x) => x}
          value={value}
          autoComplete
          noOptionsText="No Cities Found"
          getOptionLabel={(option) =>
            typeof option === "string" ? option : option[0]
          }
          includeInputInList
          isOptionEqualToValue={(option, value) => option[0] === value[0]}
          filterSelectedOptions
          onChange={(event: any, newValue: any) => {
            if (isIterationChild) {
              onChangeIteration(newValue);
            } else {
              setFormState({
                ...formState,
                [inputName]: newValue[0],
                [inputName + "Data"]: newValue,
              });
            }
          }}
          onInputChange={(event, newInputValue) => {
            updateTouchElement(inputName);
            debounceFn(newInputValue, setIsloading);
          }}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              onBlur={(event) => onBlurHandler(event, inputName)}
							sx={sx}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <React.Fragment>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </React.Fragment>
                ),
              }}
              name={inputName}
              error={formInputValidation[inputName].error}
              label={inputLabel}
            />
          )}
        />
      </Fade>
    </>
  );
}

export default ComboBox;
