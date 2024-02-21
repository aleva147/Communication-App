"use client";

import { createContext, useContext, useEffect, useState } from "react";

import { io as ClientIO } from "socket.io-client";



type SocketContextType = {
  socket: any | null;
  isConnected: boolean;
};


const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});


export const useSocket = () => {
  return useContext(SocketContext);
};


export const SocketProvider = ({ 
  children 
}: { 
  children: React.ReactNode 
}) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);


  useEffect(() => {
    // process.env.NEXT_PUBLIC_SITE_URL will use the localhost address (useful during development, after deployment change to deployment ip)
    const socketInstance = new (ClientIO as any)(process.env.NEXT_PUBLIC_SITE_URL!, {
      path: "/api/socket/io",
      addTrailingSlash: false,
    });

    socketInstance.on("connect", () => {
      setIsConnected(true);
    });

    socketInstance.on("disconnect", () => {
      setIsConnected(false);
    });

    setSocket(socketInstance);

    // Secas se iz React dokumentacije da je neophodno zbog duplog pozivanja u fazi programiranja
    return () => {
      socketInstance.disconnect();
    }
  }, []);


  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}