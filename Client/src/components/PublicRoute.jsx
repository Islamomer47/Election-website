import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PublicRoute = ({ element, ...rest }) => {
  const { isAuthenticated } = useAuth();

  return !isAuthenticated ? element : <Navigate to="/" replace />;
};

export default PublicRoute;
