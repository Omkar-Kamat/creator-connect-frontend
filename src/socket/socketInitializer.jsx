import { useEffect } from "react";
import { useSelector } from "react-redux";
import { startSocket, disconnectSocket } from "./socket";

const SocketInitializer = () => {
    const { user, loading } = useSelector((state) => state.auth);

    useEffect(() => {
        console.log("SocketInitializer - user:", user, "loading:", loading);
        if (loading) return;

        if (!user) {
            disconnectSocket();
            return;
        }

        console.log("Starting socket connection...");
        const socket = startSocket();

        const handleConnect = () => {
            console.log("Socket connected");
            if (user.token) {
                console.log("Sending auth:register with token");
                socket.emit("auth:register", user.token);
            } else {
                console.error("No token in user object");
            }
        };

        const handleAuthSuccess = (data) => {
            console.log("Socket authenticated:", data);
        };

        const handleAuthError = (error) => {
            console.error("Socket auth error:", error);
        };

        socket.on("connect", handleConnect);
        socket.on("auth:success", handleAuthSuccess);
        socket.on("auth:error", handleAuthError);

        return () => {
            socket.off("connect", handleConnect);
            socket.off("auth:success", handleAuthSuccess);
            socket.off("auth:error", handleAuthError);
        };
    }, [user, loading]);

    return null;
};

export default SocketInitializer;
