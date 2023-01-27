import { TextField } from "@mui/material";
import { Box } from "@mui/system";
import { useLocation, useParams, useSearchParams } from "react-router-dom";
import { styles } from "./styles";
import { useEffect } from "react";
import { calculateDistance } from "../../api/actions";

function SearchResults() {
  // const { ...all } = useLocation();
  // const { state } = useLocation();

  const [searchParams, setSearchParams] = useSearchParams();

  const cityOrigin = searchParams.get("cityOrigin");
  const cityDestination = searchParams.get("cityDestination");
  const passenger = searchParams.get("passenger");
  const intermediateCities = searchParams.get("intermediateCities");
  const date = searchParams.get("date");

  const cities = [
    ["Paris", 48.856614, 2.352222],

    ["hola", 43.296482, 5.36978],

    ["Lyon", 45.764043, 4.835659],

    ["Toulouse", 43.604652, 1.444209],
  ];

  calculateDistance(cities)
    .then((e) => console.log(e))
    .catch((err) => console.log(err));

  return (
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
      <TextField
        value={intermediateCities}
        disabled
        label={"Intermediate Cities"}
        sx={styles.container__input}
      />
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
  );
}

export default SearchResults;
