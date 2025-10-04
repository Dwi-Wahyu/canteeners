// components/FormDialog.tsx
import React, { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface FormDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function FormDialog({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
}: FormDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px] bg-card text-card-foreground border-border ${
          className || ""
        }`}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children} {/* Ini adalah tempat komponen form Anda akan dirender */}
      </DialogContent>
    </Dialog>
  );
}
