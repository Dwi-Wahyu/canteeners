import { toast } from "sonner";
import { useSocketEvent } from "./use-socket-event";

export function useNotificationEvents(userId: string) {
  useSocketEvent(
    "notification",
    (notif) => {
      console.log("🔔 Notifikasi baru untuk", userId, ":", notif);
      toast.info("pesan baru masuk");
    },
    [userId]
  );
}
