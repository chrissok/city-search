import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import SearchForm from "../../components/SearchForm/SearchForm";
import { styles } from "./styles";

function Home() {
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
      <Box sx={styles.container}>
        <SearchForm />
      </Box>
    </>
  );
}

export default Home;
