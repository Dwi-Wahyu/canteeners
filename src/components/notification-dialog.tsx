"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import { useNotificationDialogStore } from "@/store/use-notification-store";
import { AlertCircle, Check, Info } from "lucide-react";
import { Button } from "./ui/button";

const icons = {
  success: <Check className="w-24 h-24 text-primary-foreground" />,
  error: <AlertCircle className="w-24 h-24 text-destructive-foreground" />,
  info: <Info className="w-24 h-24 text-blue-600" />,
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
};

const colors = {
  success: "primary",
  error: "destructive",
  info: "blue-500",
};

export default function NotificationDialog() {
  const { notification, hide } = useNotificationDialogStore();

  // useEffect(() => {
  //   if (notification) {
  //     const timer = setTimeout(hide, 4000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [notification, hide]);

  if (!notification) return null;

  return (
    <AlertDialog open={!!notification} onOpenChange={() => hide()}>
      <AlertDialogContent className={`${bgColors[notification.type]}`}>
        <AlertDialogHeader className="flex flex-col items-center gap-4">
          <div className="fixed left-0 -top-[50%] w-full flex justify-center">
            <div
              className={`rounded-full p-4 bg-${colors[notification.type]}/20`}
            >
              <div
                className={`rounded-full p-4 bg-${
                  colors[notification.type]
                }/50`}
              >
                <div
                  className={`rounded-full p-4 bg-${colors[notification.type]}`}
                >
                  {icons[notification.type]}
                </div>
              </div>
            </div>
          </div>
          <div className="pt-24">
            <AlertDialogTitle className="text-lg font-semibold">
              {notification.title}
            </AlertDialogTitle>
            {notification.message && (
              <AlertDialogDescription>
                {notification.message}
              </AlertDialogDescription>
            )}

            {notification.actionButtons && (
              <div className="mt-5">{notification.actionButtons}</div>
            )}
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
