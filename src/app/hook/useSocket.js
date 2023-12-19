"use client";
import { useEffect, useState } from "react";

const useWebSocket = () => {
  const [socket, setSocket] = useState(null);
  const [connect, setConnect] = useState(null);

  useEffect(() => {
    // Create a WebSocket connection
    const ws = new WebSocket(
      "ws://localhost:3001/socket.io/?EIO=3&transport=websocket"
    );

    // Connection opened
    ws.addEventListener("open", (event) => {
      console.log("WebSocket connection opened:", event);
      setConnect(true);
    });

    // Connection closed
    ws.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event);
      setConnect(false);
    });

    // Set the WebSocket instance in state
    setSocket(ws);

    // Clean up the WebSocket connection on unmount
    return () => {
      if (
        ws.readyState === WebSocket.OPEN ||
        ws.readyState === WebSocket.CONNECTING
      ) {
        ws.close();
      }
    };
  }, []);

  return { socket, connected: connect };
};
export default useWebSocket;
