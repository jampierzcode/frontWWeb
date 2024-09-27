import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:3001"); // Conectar con el backend

const WhatsAppBot = () => {
  const [qrCode, setQrCode] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("No conectado");
  const [backendStatus, setBackendStatus] = useState("Esperando conexión...");
  const [clientId, setClientId] = useState(() => {
    // Recuperar clientId de sessionStorage al iniciar el componente
    return sessionStorage.getItem("clientId") || null;
  });

  // Escuchar eventos de Socket.io
  useEffect(() => {
    const clientId = sessionStorage.getItem("clientId");

    if (clientId) {
      // Si ya hay un clientId en sessionStorage, reconectar
      socket.emit("reconnect-client", clientId);
    }
    // Escuchar el evento de conexión al backend
    socket.on("connected", (message) => {
      setBackendStatus(message);
      console.log("Conectado al backend:", message);
    });

    // Escuchar el evento de código QR
    socket.on("qr", ({ clientId, url }) => {
      if (clientId === sessionStorage.getItem("clientId")) {
        // Verificar que el QR corresponde al clientId
        setQrCode(url);
        setSessionStatus("Escanea el QR");
      }
    });

    // Escuchar cuando la sesión está lista
    socket.on("ready", ({ clientId }) => {
      if (clientId === sessionStorage.getItem("clientId")) {
        // Verificar que la sesión corresponde al clientId
        setSessionStatus("Conectado");
        setQrCode(null); // Limpiamos el QR una vez conectado
      }
    });

    // Escuchar cuando la sesión se desconecta
    socket.on("disconnected", ({ clientId }) => {
      if (clientId === sessionStorage.getItem("clientId")) {
        sessionStorage.removeItem("clientId");
        // Verificar que la desconexión corresponde al clientId
        setSessionStatus("Desconectado");
      }
    });

    return () => {
      socket.off("connected");
      socket.off("qr");
      socket.off("ready");
      socket.off("disconnected");
    };
  }, []);

  const handleRequestQr = async () => {
    if (!clientId) {
      const newClientId = Date.now().toString(); // Generar un nuevo clientId único
      setClientId(newClientId);
      sessionStorage.setItem("clientId", newClientId); // Guardar el clientId en sessionStorage
    }
    socket.emit("request-qr", sessionStorage.getItem("clientId"));
  };
  // Nueva función para desconectar el cliente
  const handleDisconnectClient = () => {
    const clientId = sessionStorage.getItem("clientId");
    if (clientId) {
      socket.emit("disconnect-client", clientId); // Emitir evento para desconectar el cliente
    }
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

      {sessionStatus === "Conectado" && (
        <button onClick={handleDisconnectClient}>Desconectar Cliente</button>
      )}
    </div>
  );
};

export default WhatsAppBot;
