import { socketStore } from "@/store/socket";

export const useIsSocketConnected = () =>
  socketStore((state) => state.connected);

export const useSocketConnect = () => socketStore((state) => state.connect);

export const useSocketDisconnect = () =>
  socketStore((state) => state.disconnect);

export const useSocketSendMessage = () =>
  socketStore((state) => state.sendMessage);

export const useSocketJoinRoom = () => socketStore((state) => state.joinRoom);

export const useSocketLeaveRoom = () => socketStore((state) => state.leaveRoom);

export const useSocketSubscribeOrder = () =>
  socketStore((state) => state.subscribeOrder);

export const useSocketUnsubscribeOrder = () =>
  socketStore((state) => state.unsubscribeOrder);
