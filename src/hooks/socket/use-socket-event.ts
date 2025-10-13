import { useEffect } from "react";
import { useSocketInstance } from "./core";

export function useSocketEvent<T = any>(
  event: string,
  handler: (data: T) => void,
  deps: any[] = []
) {
  const socket = useSocketInstance();

  useEffect(() => {
    if (!socket || !socket.connected) return;

    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler, ...deps]);
}
