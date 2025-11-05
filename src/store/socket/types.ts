export type MessageData = {
  type:
    | "TEXT"
    | "SYSTEM"
    | "ORDER"
    | "PAYMENT_PROOF"
    | "JOIN_CONVERSATION"
    | "LEAVE_CONVERSATION"
    | "ACK_READ";
  id: string;
  sender_id: string;
  conversation_id: string;
  text: string | null;
  media: MessageMedia[];
  order_id: string | null;
  is_read: boolean;
  created_at: Date;
};

export type MessageMedia = {
  url: String;
  mime_type: "VIDEO" | "IMAGE";
  order_id: string | null;
  message_id: String;
};

export type SocketState = {
  socket: WebSocket | null;
  connected: boolean;
  messages: MessageData[];
  connect: (user_id: string) => void;
  disconnect: () => void;
  sendMessage: (msg: string) => void;
  joinRoom: (conversation_id: string) => void;
  leaveRoom: (conversation_id: string) => void;
  subscribeOrder: (order_id: string) => void;
  unsubscribeOrder: (order_id: string) => void;
};
