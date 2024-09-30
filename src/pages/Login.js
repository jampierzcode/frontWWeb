import axios from "axios";
import React, { useState } from "react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/login`,
        {
          email,
          password,
        }
      );
      const { token, user } = response.data;
      // Guardar token en localStorage
      localStorage.setItem("token", token);
      console.log("Datos del usuario:", user);
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Credenciales incorrectas");
    }
  };

  return (
    <div
      className="flex justify-center items-center h-screen bg-green-600"
      //   style={{
      //     backgroundImage: "url('/fondologin.jpg'",
      //     backgroundPosition: "center center",
      //     backgroundRepeat: "no-repeat",
      //     backgroundSize: "cover",
      //   }}
    >
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded shadow-md w-[600px] mx-auto"
      >
        <div className="w-full flex flex-col items-center justify-center mb-4">
          <img className="w-[80px]" src={`/logobot.png`} alt="" />
          <h1 className="text-2xl font-bold">MiBot</h1>
        </div>
        <h2 className="text-xl mb-4 font-bold">Iniciar Sesión</h2>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mb-4">
          <label className="block text-sm mb-2 font-bold" htmlFor="email">
            Correo electrónico:
          </label>
          <input
            type="email"
            id="email"
            className="w-full p-2 border rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm mb-2 font-bold" htmlFor="password">
            Contraseña:
          </label>
          <input
            type="password"
            id="password"
            className="w-full p-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="w-full bg-green-500 text-white p-2 rounded"
          type="submit"
        >
          Iniciar sesión
        </button>
      </form>
    </div>
  );
};

export default Login;
