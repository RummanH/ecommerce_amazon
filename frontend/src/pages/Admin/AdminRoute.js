import React from "react";
import { Navigate } from "react-router-dom";
import { useAppContext } from "../../context/appContext";

const AdminRoute = ({ children }) => {
  const { user } = useAppContext();
  return user && user.role === "admin" ? children : <Navigate to="/signin" />;
};

export default AdminRoute;
