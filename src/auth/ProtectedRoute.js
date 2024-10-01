// src/components/ProtectedRoute.js
import React, { useContext, useEffect } from "react";
import { Route, Navigate, useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user, loading, hasPermission } = useContext(AuthContext);
  const navigate = useNavigate();
  const token = sessionStorage.getItem("token");
  useEffect(() => {
    if (!token) {
      navigate("/login"); // Redirigir si ya está autenticado
    }
  }, [token, navigate]);
  if (loading) {
    return <div>Loading...</div>; // Puedes añadir un loader mientras se verifica el token
  }
  return children;
};

export default ProtectedRoute;
