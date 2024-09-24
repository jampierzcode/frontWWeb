import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectar con el backend

const WhatsAppBot = () => {
  const [qrCode, setQrCode] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("No conectado");
  const [backendStatus, setBackendStatus] = useState("Esperando conexión...");

  // Escuchar eventos de Socket.io
  useEffect(() => {
    // Escuchar el evento de conexión al backend
    socket.on("connected", (message) => {
      setBackendStatus(message);
      console.log("Conectado al backend:", message);
    });

    // Escuchar el evento de código QR
    socket.on("qr", (qr) => {
      setQrCode(qr);
      setSessionStatus("Escanea el QR");
    });

    // Escuchar cuando la sesión está lista
    socket.on("ready", () => {
      setSessionStatus("Conectado");
      setQrCode(null); // Limpiamos el QR una vez conectado
    });

    // Escuchar cuando la sesión se desconecta
    socket.on("disconnected", () => {
      setSessionStatus("Desconectado");
      // Opción para regenerar el QR
    });

    return () => {
      socket.off("connected");
      socket.off("qr");
      socket.off("ready");
      socket.off("disconnected");
    };
  }, []);

  const handleRequestQr = async () => {
    socket.emit("request-qr");
  };

  return (
    <div>
      <h1>WhatsApp Bot</h1>
      <p>Estado de la sesión: {sessionStatus}</p>
      <p>Estado del backend: {backendStatus}</p>

      {qrCode && (
        <div>
          <h3>Escanea el código QR para conectarte</h3>
          <img src={qrCode} alt="Código QR de WhatsApp" />
        </div>
      )}

      {sessionStatus === "No conectado" && (
        <button onClick={handleRequestQr}>Generar Código QR</button>
      )}

      {sessionStatus === "Desconectado" && (
        <button onClick={handleRequestQr}>Regenerar Código QR</button>
      )}
    </div>
  );
};

export default WhatsAppBot;
