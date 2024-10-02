// src/context/AuthContext.js
import React, { createContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() =>
    JSON.parse(sessionStorage.getItem("user"))
  );
  const [token, setToken] = useState(() => sessionStorage.getItem("token"));
  const [loading, setLoading] = useState(true); // Cargar el estado de la autenticación

  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      if (token) {
        try {
          await axios.post(`${process.env.REACT_APP_API_URL}/verify-token`, {
            token,
          });
        } catch (error) {
          setToken(null);
          setUser(null);
          sessionStorage.removeItem("token");
          sessionStorage.removeItem("user");
          navigate("/login");
        }
      }
      setLoading(false); // Terminar la carga
    };
    validateToken();
  }, [token, navigate]);

  const login = async (email, password) => {
    return axios
      .post(`${process.env.REACT_APP_API_URL}/login`, { email, password })
      .then((response) => {
        console.log(response.data);
        setToken(response.data.token);
        setUser(response.data.user);
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("user", JSON.stringify(response.data.user));
        navigate("/dashboard");
      });
  };
  const hasPermission = (requiredRole) => {
    return true; // Verificar permisos según el rol
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, hasPermission, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
