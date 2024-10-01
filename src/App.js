import React from "react";
import { Routes, Route } from "react-router-dom";

// Importa tus componentes de página
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Notfound from "./pages/Notfound";
import Login from "./pages/Login";
import Bot from "./pages/Bot";
import AuthProvider from "./auth/AuthContext";
import LayoutAdmin from "./components/admin/LayoutAdmin";
import ProtectedRoute from "./auth/ProtectedRoute";

const App = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <Dashboard />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bot"
          element={
            <ProtectedRoute>
              <LayoutAdmin>
                <Bot />
              </LayoutAdmin>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />

        {/* Ruta para manejar errores 404 */}
        <Route path="*" element={<Notfound />} />
      </Routes>
    </AuthProvider>
  );
};

export default App;
