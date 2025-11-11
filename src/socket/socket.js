import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  reconnection: true,
  autoConnect: false, // để chủ động connect sau khi login
});

export default socket;
