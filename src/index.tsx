import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { theme } from "./theme/theme";
import Home from "./routes/home/Home";
import { ThemeProvider } from "@emotion/react";
import ErrorPage from "./routes/error/ErrorPage";
import SearchResults from "./routes/search-results/SearchResults";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
		errorElement: <ErrorPage />,
  },
  {
    path: "/search",
    element: <SearchResults />,
		errorElement: <ErrorPage />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  </React.StrictMode>
);
