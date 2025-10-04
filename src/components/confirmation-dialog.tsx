import React from "react";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { IconLoader } from "@tabler/icons-react";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonVariant?: "default" | "success" | "destructive" | "secondary";
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  isLoading = false,
  confirmButtonText = "Konfirmasi",
  cancelButtonText = "Batal",
  confirmButtonVariant = "destructive",
}: ConfirmationDialogProps) {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
        <AlertDialogHeader className="flex flex-col items-center text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground" />{" "}
          {/* Ikon peringatan */}
          <AlertDialogTitle className="text-xl text-center font-bold mt-2">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-base text-center">
            {message}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center sm:space-x-2">
          {" "}
          <Button variant="outline" onClick={onClose}>
            {cancelButtonText}
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isLoading}
            variant={confirmButtonVariant}
            className="w-full sm:w-auto mb-2 sm:mb-0"
          >
            {isLoading ? (
              <IconLoader className="animate-spin" />
            ) : (
              confirmButtonText
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
