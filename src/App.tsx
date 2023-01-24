import { ThemeProvider } from "@emotion/react";
import React from "react";
import SearchForm from "./components/SearchForm/SearchForm";
import { theme } from "./theme/theme";

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <SearchForm />
      </ThemeProvider>
    </>
  );
}

export default App;
