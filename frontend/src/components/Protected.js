import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";

const Protected = ({ children }) => {
  const { user } = useAppContext();
  return user ? children : <Navigate to="/signin" />;
};

export default Protected;
