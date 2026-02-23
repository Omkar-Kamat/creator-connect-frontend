import { io } from "socket.io-client";

let socket = null;

export const connectSocket = () => {
  if (socket) return socket;

  const token = document.cookie
    .split("; ")
    .find((row) => row.startsWith("token="))
    ?.split("=")[1];

  socket = io(import.meta.env.VITE_API_URL || "http://localhost:8080", {
    autoConnect: false,
    transports: ["websocket"],
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    auth: {
      token
    }
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("disconnect", (reason) => {
    console.log("Socket disconnected:", reason);
  });

  socket.on("reconnect", (attemptNumber) => {
    console.log("Socket reconnected after", attemptNumber, "attempts");
  });

  socket.on("chat:error", (error) => {
    console.error("Chat error:", error);
  });

  socket.on("auth:error", (error) => {
    console.error("Auth error:", error);
  });

  return socket;
};

export const getSocket = () => {
  if (!socket) {
    throw new Error("Socket not initialized. Call connectSocket first.");
  }
  return socket;
};

export const startSocket = () => {
  const instance = connectSocket();

  if (!instance.connected) {
    instance.connect();
  }

  return instance;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const authenticateSocket = (token) => {
  if (!socket) return;
  socket.emit("auth:register", token);
};