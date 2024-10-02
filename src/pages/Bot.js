import React, { useState, useEffect, useContext, useRef } from "react";
import { FaEllipsisV } from "react-icons/fa";
import { AuthContext } from "../auth/AuthContext";
import { io } from "socket.io-client";
import { IoEllipseSharp } from "react-icons/io5";

const Bot = () => {
  const [qrCode, setQrCode] = useState(null);
  const [sessionStatus, setSessionStatus] = useState("No conectado");
  const [backendStatus, setBackendStatus] = useState("Esperando conexión...");
  const [clientId, setClientId] = useState(() => {
    // Recuperar clientId de sessionStorage al iniciar el componente
    return sessionStorage.getItem("clientId") || null;
  });

  const { user } = useContext(AuthContext);

  var socket = useRef();

  useEffect(() => {
    const clientId = sessionStorage.getItem("clientId");
    // Conectar el socket al montar el componente
    socket.current = io("http://localhost:3001"); // Cambia a la URL de tu servidor de sockets
    socket.current.emit("destroy-client", clientId);
    // Desconectar el socket cuando el componente se desmonte
    return () => {
      socket.current.disconnect();
    };
  }, []);

  // Escuchar eventos de Socket.current.io
  useEffect(() => {
    if (socket.current) {
      console.log("cambio");
      const clientId = sessionStorage.getItem("clientId");

      if (clientId) {
        // Si ya hay un clientId en sessionStorage, reconectar
        socket.current.emit("reconnect-client", clientId);
      }
      // Escuchar el evento de conexión al backend
      socket.current.on("connected", (message) => {
        console.log("Conectado al backend:", message);
        setBackendStatus(message);
      });

      // Escuchar el evento de código QR
      socket.current.on("qr", ({ clientId, url }) => {
        console.log(clientId);
        if (clientId === sessionStorage.getItem("clientId")) {
          // Verificar que el QR corresponde al clientId
          setQrCode(url);
          setSessionStatus("Escanea el QR");
        }
      });
      // Escuchar cuando el cliente se está conectando después de escanear el QR
      socket.current.on("connecting", ({ clientId }) => {
        if (clientId === sessionStorage.getItem("clientId")) {
          setSessionStatus("Conectando..."); // Mostrar que se está conectando
        }
      });
      // Escuchar cuando la sesión está lista
      socket.current.on("ready", ({ clientId }) => {
        if (clientId === sessionStorage.getItem("clientId")) {
          // Verificar que la sesión corresponde al clientId
          setSessionStatus("Conectado");
          setQrCode(null); // Limpiamos el QR una vez conectado
        }
      });

      // Escuchar cuando la sesión se desconecta
      socket.current.on("disconnected", ({ clientId }) => {
        if (clientId === sessionStorage.getItem("clientId")) {
          sessionStorage.removeItem("clientId");
          // Verificar que la desconexión corresponde al clientId
          setSessionStatus("Desconectado");
          setClientId(null);
        }
      });

      return () => {
        socket.current.off("connected");
        socket.current.off("qr");
        socket.current.off("ready");
        socket.current.off("disconnected");
        socket.current.off("connecting");
      };
    } else {
      console.log("sockect no conectado");
    }
  }, [socket]);

  const handleRequestQr = async () => {
    if (!clientId) {
      setSessionStatus("Solicitando");
      const newClientId = user?.celular; // Generar un nuevo clientId único
      setClientId(newClientId);
      sessionStorage.setItem("clientId", newClientId); // Guardar el clientId en sessionStorage
    }
    socket.current.emit("request-qr", sessionStorage.getItem("clientId"));
  };
  // Nueva función para desconectar el cliente
  const handleDisconnectClient = () => {
    const clientId = sessionStorage.getItem("clientId");
    if (clientId) {
      socket.current.emit("disconnect-client", clientId); // Emitir evento para desconectar el cliente
    }
  };

  return (
    <div className="bg-gray-300">
      <div className="w-full p-8 bg-white shadow rounded">
        <div className="flex gap-8 w-full items-center">
          <div className="content">
            <h1 className="text-2xl font-bold mb-4 text-main">
              ¡Conecta tu chatBot de Whatsapp <br /> desde una computadora!
            </h1>
            <ul className="w-full">
              <li className="flex gap-4">
                <span className="text-blue-700 font-bold">1.</span>
                <p className="text-sm">Abre Whatsapp en tu telefono</p>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-700 font-bold">2.</span>
                <p className="text-sm flex gap-2">
                  Toca <b>Menu</b>{" "}
                  <span className="p-1 text-sm rounded bg-gray-100">
                    <FaEllipsisV />{" "}
                  </span>
                  , selecciona <b>Dispositivos Vinculados</b> y toca{" "}
                  <b>Vincular dispositivo</b>
                </p>
              </li>
              <li className="flex gap-4">
                <span className="text-blue-700 font-bold">3.</span>
                <p className="text-sm">
                  Cuando se active la camara, apunta tu telfono hacia esta
                  pantalla para escanear el codigo Qr
                </p>
              </li>
            </ul>
            {/* <p className="text-xl mb-4">
              Una herramienta poderosa para vender y responder automáticamente a
              tus clientes.
            </p>
            <p className="text-xl mb-4">
              <b>
                ¡Úsalo con un solo clic, sin necesidad de conocimientos de
                programación!
              </b>
            </p> */}
          </div>
          <div className="qr-content">
            <div className="w-full bg-green-600 rounded p-5 text-white">
              {qrCode && (
                <div className="w-full flex flex-col items-center justify-center mb-6 relative z-10">
                  {sessionStatus === "Conectando..." && (
                    <div className="absolute top-0 left-0 right-0 bottom-0 blur-md flex items-center justify-center">
                      <p>Escaneando</p>
                    </div>
                  )}
                  <img
                    className="rounded p-2 bg-white w-[200px]"
                    src={qrCode}
                    alt="Código QR de WhatsApp"
                  />
                  <h3 className="text-sm">
                    Escanea el código QR para conectarte
                  </h3>
                </div>
              )}

              <p className="mb-4 text-sm">
                Estado de la sesión:{" "}
                <span
                  className={`bg-white p-2 whitespace-nowrap rounded-full font-bold text-sm ${
                    sessionStatus === "No conectado"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {" "}
                  {sessionStatus}
                </span>
              </p>
              <p className="mb-4 text-sm">
                Estado del backend: {backendStatus}
              </p>
              {sessionStatus === "Desconectado" && (
                <button
                  className="bg-white p-3 text-sm rounded text-green-600"
                  onClick={handleRequestQr}
                >
                  Regenerar Código QR
                </button>
              )}

              {sessionStatus === "No conectado" && (
                <button
                  className="bg-white p-3 text-sm rounded text-green-600"
                  onClick={handleRequestQr}
                >
                  Generar Código QR
                </button>
              )}
              {sessionStatus === "Conectado" && (
                <button
                  className="bg-white p-3 text-sm rounded-full text-red-600 font-bold"
                  onClick={handleDisconnectClient}
                >
                  Desconectar Cliente
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bot;
