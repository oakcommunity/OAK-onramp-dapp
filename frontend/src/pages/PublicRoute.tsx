import React from "react";
import { Route, Redirect } from "react-router-dom";

const PublicRoute = ({ component: Component, restricted, ...rest }: any) => {
  const isAuth = localStorage.getItem("oak-crypto");

  return (
    <Route
      {...rest}
      render={(props) =>
        isAuth && restricted ? (
          <Redirect to="/Home" />
        ) : (
          <Component {...props} />
        )
      }
    />
  );
};

export default PublicRoute;
