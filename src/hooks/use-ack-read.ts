"use client";

import { socketStore } from "@/store/socket";
import { useEffect } from "react";

export const useSendReadAck = () => socketStore((state) => state.sendReadAck);

export const useReadTriggers = () => socketStore((state) => state.readTriggers);

export const useReadAck = (conversation_id: string) => {
  const sendReadAck = useSendReadAck();
  const readTriggers = useReadTriggers();

  // Otomatis kirim ACK saat komponen mount (artinya user buka chat)
  useEffect(() => {
    sendReadAck(conversation_id);
  }, [conversation_id, sendReadAck]);

  // Return timestamp sinyal terakhir
  return readTriggers[conversation_id] || 0;
};
