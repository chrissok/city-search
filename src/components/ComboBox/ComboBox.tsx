import {
  Alert,
  Autocomplete,
  CircularProgress,
  Fade,
  TextField,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { Dictionary } from "../../types/types";
import _debounce from "lodash/debounce";
import { getCitiesByName } from "../../api/actions";

function ComboBox({
  onBlurHandler,
  value,
  updateTouchElement,
  setFormState,
  formState,
  inputName,
  inputLabel,
  formInputValidation,
  isIterationChild = false,
  sx,
  ...props
}: {
  onBlurHandler: any;
  value: string;
  updateTouchElement: Function;
  setFormState: Function;
  formState: any;
  inputName: string;
  inputLabel: string;
  formInputValidation: Dictionary;
  isIterationChild?: boolean;
  sx?: any;
}) {
  const [options, setOptions] = useState<string[]>([]);

  const [loading, setIsloading] = useState(false);

  const [errorText, setErrorText] = useState("");
  const [error, setError] = useState(false);

  const handleDebounceFn = async (
    inputValue: string,
    setIsLoading: Function
  ) => {
    setIsLoading(true);
    setError(false);
    setOptions([]);
    try {
      const cities = await getCitiesByName(inputValue);
      setOptions(cities);
    } catch (error: any) {
      setErrorText(error);
      setOptions([]);
      setOpen(false);
      setError(true);
    }
    setIsLoading(false);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 1000), []);

  const onChangeIteration = (newValue: any[]) => {
    setFormState({
      ...formState,
      citiesData: {
        ...formState.citiesData,
        [inputName]: {
          id: inputName,
          name: newValue ? newValue[0] : "",
          latitude: newValue ? newValue[1] : "",
          longitude: newValue ? newValue[2] : "",
        },
      },
      intermediateCities: [
        ...formState.intermediateCities,
        { id: inputName, value: newValue ? newValue[0] : "" },
      ],
    });
  };

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) {
      setOptions([]);
    }
  }, [open]);

  return (
    <>
      <Fade in={true} timeout={600}>
        <Autocomplete
          {...props}
          disablePortal
          open={open}
          onOpen={() => {
            setOpen(true);
          }}
          onClose={() => {
            setOpen(false);
          }}
          onBlur={(event) => onBlurHandler(event, inputName)}
          options={options}
          filterOptions={(x) => x}
          value={value}
          autoComplete
          noOptionsText="Please enter a city"
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
                [inputName]: newValue ? newValue[0] : "",
                citiesData: {
                  ...formState.citiesData,
                  [inputName]: {
                    id: inputName,
                    name: newValue ? newValue[0] : "",
                    latitude: newValue ? newValue[1] : "",
                    longitude: newValue ? newValue[2] : "",
                  },
                },
              });
            }
          }}
          onInputChange={(event: any, newInputValue: any, reason) => {
            if (newInputValue.length > 0 && reason === "input") {
              updateTouchElement(inputName);
              debounceFn(newInputValue, setIsloading);
            }
          }}
          sx={{ width: 300 }}
          renderInput={(params) => (
            <TextField
              {...params}
              sx={sx}
							required
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
              error={formInputValidation[inputName].error || error}
              label={inputLabel}
            />
          )}
        />
      </Fade>
      {error && <Alert severity="error">{errorText}</Alert>}
    </>
  );
}

export default ComboBox;
