import { useSocketStore } from "@/store/socket";
import { useStoreWithEqualityFn } from "zustand/traditional";
import { shallow } from "zustand/shallow";
import { useEffect } from "react";

export const useSocketInstance = () => useSocketStore((state) => state.socket);

export const useIsSocketConnected = () =>
  useSocketStore((state) => state.connected);

export const useIsSubscribedNotifications = () =>
  useSocketStore((state) => state.subscribed);

export const useIsJoinedConversation = () =>
  useSocketStore((state) => state.joinedConversation);

export const useSocketActions = () =>
  useStoreWithEqualityFn(
    useSocketStore,
    (state) => ({
      connect: state.connect,
      disconnect: state.disconnect,
      joinConversation: state.joinConversation,
      leaveConversation: state.leaveConversation,
      subscribeNotifications: state.subscribeNotifications,
    }),
    shallow
  );

export function useSocketConnection(userId: string) {
  const { connect, disconnect } = useSocketActions();
  const connected = useIsSocketConnected();
  const subscribed = useIsSubscribedNotifications();

  useEffect(() => {
    connect(userId);
    return () => disconnect();
  }, [connect, disconnect, userId]);

  useEffect(() => {
    if (connected && !subscribed) {
      connect(userId);
    }
  }, [connected, subscribed, connect, userId]);

  return { connected, subscribed };
}
