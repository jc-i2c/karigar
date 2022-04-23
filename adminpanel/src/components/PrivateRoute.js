import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const karigarToken = localStorage.getItem("karigar_token");

  return karigarToken ? <Navigate to="*" /> : <Navigate to="/login" />;
};

export default PrivateRoute;
