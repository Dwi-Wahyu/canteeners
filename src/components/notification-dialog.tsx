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
import { AlertCircle, CheckCircle, Info } from "lucide-react";
import { useEffect } from "react";

const icons = {
  success: <CheckCircle className="w-6 h-6 text-success" />,
  error: <AlertCircle className="w-6 h-6 text-destructive" />,
  info: <Info className="w-6 h-6 text-blue-600" />,
};

const bgColors = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  info: "bg-blue-50 border-blue-200",
};

export default function NotificationDialog() {
  const { notification, hide } = useNotificationDialogStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(hide, 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, hide]);

  if (!notification) return null;

  return (
    <AlertDialog open={!!notification} onOpenChange={() => hide()}>
      <AlertDialogContent className={`${bgColors[notification.type]}`}>
        <AlertDialogHeader className="flex flex-row items-start gap-3">
          <div className="flex-shrink-0 mt-1">{icons[notification.type]}</div>
          <div className="space-y-1">
            <AlertDialogTitle className="text-lg font-semibold">
              {notification.title}
            </AlertDialogTitle>
            {notification.message && (
              <AlertDialogDescription className="text-sm">
                {notification.message}
              </AlertDialogDescription>
            )}
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
