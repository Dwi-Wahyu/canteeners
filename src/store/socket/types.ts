export type MessageData = {
  type:
    | "TEXT"
    | "SYSTEM"
    | "ORDER"
    | "PAYMENT_PROOF"
    | "JOIN_CONVERSATION"
    | "LEAVE_CONVERSATION"
    | "ACK_READ"
    | "ACK_DELIVERY"
    | "NEW_ORDER"
    | "SUBSCRIBE_ORDER"
    | "UNSUBSCRIBE_ORDER"
    | "UPDATE_ORDER";

  id: string;
  sender_id: string;
  conversation_id: string;
  receiver_id?: string;
  text: string | null;
  is_read: boolean;
  media: MessageMedia[];
  order_id: string | null;
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
  refreshTriggers: Record<string, number>; // key: Sinyal refresh per order_id (timestamp)
  readTriggers: Record<string, number>; // key: conversation_id, value: timestamp terakhir ada ACK

  connect: (user_id: string) => void;
  disconnect: () => void;
  sendMessage: (msg: string) => void;
  joinRoom: (conversation_id: string) => void;
  leaveRoom: (conversation_id: string) => void;
  subscribeOrder: (order_id: string) => void;
  unsubscribeOrder: (order_id: string) => void;
  sendReadAck: (conversation_id: string) => void;
};
