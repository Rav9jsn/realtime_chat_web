import React from "react";
import Signin from "./Components/Sign";
import Home from "./Components/Home";
import { createBrowserRouter, RouterProvider } from "react-router";

const Router = createBrowserRouter([
  { path: "", Component: Signin },
  { path: "Home", Component: Home },
]);

const App = () => {
  return (
    <>
      <RouterProvider router={Router} />
    </>
  );
};

export default App;
