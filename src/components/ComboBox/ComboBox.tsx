import { Autocomplete, CircularProgress, Fade, TextField } from "@mui/material";
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

  const handleDebounceFn = async (
    inputValue: string,
    setIsLoading: Function
  ) => {
    setIsLoading(true);
    try {
      const cities = await getCitiesByName(inputValue);
      setOptions(cities);
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const debounceFn = useCallback(_debounce(handleDebounceFn, 2000), []);

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
