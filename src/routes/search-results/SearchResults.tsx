import {
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

  useEffect(() => {
    const cityDaTaToArray =  Object.values(citiesDataParsed)

    setLoading(true);
    calculateDistance(cityDaTaToArray)
      .then((data: any) => {
        setCityDistances(data);
        setTotalDistance(data[data.length - 1]);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
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
      <Box sx={styles.container}>
        <TextField
          sx={styles.container__input}
          value={cityOrigin}
          disabled
          label={"City of Origin"}
        />
        <TextField
          value={cityDestination}
          disabled
          label={"City of Origin"}
          sx={styles.container__input}
        />
        {Object.values(intermediateCitiesParsed).map((city) => (
          <TextField
            value={city}
            disabled
            label={"Intermediate Cities"}
            sx={styles.container__input}
          />
        ))}
        <TextField
          value={date}
          disabled
          label={"Date"}
          sx={styles.container__input}
        />
        <TextField
          value={passenger}
          disabled
          label={"City of Origin"}
          sx={styles.container__input}
        />
      </Box>

      <Card sx={styles["distances-container"]}>
        <CardContent>
          {loading && (
            <>
              <Typography variant="h6">Calculating distances...</Typography>
              <CircularProgress sx={{ margin: "10px" }} color="primary" />
            </>
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
    </>
  );
}

export default SearchResults;
