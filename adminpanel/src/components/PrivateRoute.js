import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({ children }) {
  // console.log(children, "children");
  const karigarToken = localStorage.getItem("karigar_token");
  return karigarToken ? children : <Navigate to="/login" />;
}

export default PrivateRoute;
