import {
  Alert,
  AlertTitle,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { styles } from "./styles";
import { useEffect, useState } from "react";
import { calculateDistance } from "../../api/actions";
import { sumArray } from "../../utils/utils";

function SearchResults() {
  // const { ...all } = useLocation();
  // const { state } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const cityOrigin = searchParams.get("cityOrigin");
  const cityDestination = searchParams.get("cityDestination");
  const passenger = searchParams.get("passenger");
  const intermediateCities = searchParams.get("intermediateCities");
  const date = searchParams.get("date");
  const citiesData = searchParams.get("citiesData");

  const citiesDataParsed = citiesData ? JSON.parse(citiesData) : citiesData;
  const intermediateCitiesParsed = intermediateCities
    ? JSON.parse(intermediateCities)
    : intermediateCities;

  const [cityDistances, setCityDistances] = useState([]);
  const [totalDistance, setTotalDistance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    const cityDaTaToArray = Object.values(citiesDataParsed);
    setError(false);
    setLoading(true);
    calculateDistance(cityDaTaToArray)
      .then((data: any) => {
        setCityDistances(data);
        setTotalDistance(data[data.length - 1]);
        setLoading(false);
      })
      .catch((err) => {
        setError(true);
        setErrorText(err);
        setLoading(false);
      });
  }, []);

  return (
    <>
      <Typography
        variant={"h1"}
        color={"#9765C3"}
        textAlign="center"
        fontWeight="bold"
      >
        City Search
      </Typography>
      <Typography variant={"h4"} color={"#8b789c"} textAlign="center" mt={2}>
        Search Results
      </Typography>

      <Card sx={styles["distances-container"]}>
        <CardContent>
          {loading && (
            <>
              <Typography variant="h6">Calculating distances...</Typography>
              <CircularProgress sx={{ margin: "10px" }} color="primary" />
            </>
          )}
          {error && (
            <Alert severity="error">
              <AlertTitle>Error</AlertTitle>
              {errorText}
            </Alert>
          )}
          {cityDistances.map(({ route, distance }) => (
            <>
              <Typography variant="h6">{route}</Typography>
              <Typography variant="body1" mb={2}>
                {distance}
              </Typography>
            </>
          ))}
          {totalDistance !== 0 && (
            <>
              <Typography variant="h6">Total Distance</Typography>
              <Typography>{totalDistance} Km</Typography>
            </>
          )}
        </CardContent>
      </Card>

      <Box sx={styles.container}>
        <TextField
          size="small"
          sx={styles.container__input}
          value={cityOrigin}
          disabled
          label={"City of Origin"}
        />
        <TextField
          value={cityDestination}
          size="small"
          disabled
          label={"City of Origin"}
          sx={styles.container__input}
        />
        {Object.values(intermediateCitiesParsed).map((city: any) => (
          <TextField
            value={city.value}
            size="small"
            disabled
            label={"Intermediate Cities"}
            sx={styles.container__input}
          />
        ))}
        <TextField
          value={cityDestination}
          size="small"
          disabled
          label={"City of Destination"}
          sx={styles.container__input}
        />
        <TextField
          value={date}
          size="small"
          disabled
          label={"Date"}
          sx={styles.container__input}
        />
        <TextField
          value={passenger}
          size="small"
          disabled
          label={"Passengers"}
          sx={styles.container__input}
        />
      </Box>
    </>
  );
}

export default SearchResults;
