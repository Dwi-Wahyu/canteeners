import { useNotificationDialogStore } from "@/store/use-notification-store";

type NotificationOptions = {
  title: string;
  message?: string;
  actionButtons?: React.ReactNode;
};

type NotificationDialog = {
  success: (opts: NotificationOptions) => void;
  error: (opts: NotificationOptions) => void;
  info: (opts: NotificationOptions) => void;
};

// Gunakan di client component atau di server via callback
export const notificationDialog = {
  success: (opts: NotificationOptions) =>
    useNotificationDialogStore.getState().show({ ...opts, type: "success" }),
  error: (opts: NotificationOptions) =>
    useNotificationDialogStore.getState().show({ ...opts, type: "error" }),
  info: (opts: NotificationOptions) =>
    useNotificationDialogStore.getState().show({ ...opts, type: "info" }),
} satisfies NotificationDialog;
