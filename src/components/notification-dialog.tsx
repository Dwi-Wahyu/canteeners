import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Info, Check } from "lucide-react";
import { Badge } from "./ui/badge";
import { IconCopy } from "@tabler/icons-react";
import { Button } from "./ui/button";

type NotificationVariant = "success" | "error" | "info";

interface NotificationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  url?: string;
  variant: NotificationVariant;
}

export function NotificationDialog({
  isOpen,
  onClose,
  title,
  message,
  variant,
  url,
}: NotificationDialogProps) {
  const [copied, setCopied] = useState(false);

  const getVariantStyles = (variant: NotificationVariant) => {
    switch (variant) {
      case "success":
        return "text-primary";
      case "error":
        return "text-destructive";
      case "info":
        return "text-muted";
    }
  };

  const getVariantIcon = (variant: NotificationVariant) => {
    switch (variant) {
      case "success":
        return <CheckCircle className="h-16 w-16 text-primary" />;
      case "error":
        return <XCircle className="h-16 w-16 text-destructive" />;
      case "info":
        return <Info className="h-16 w-16 text-muted" />;
      default:
        return null;
    }
  };

  async function copyToClipboard() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // reset after 2 seconds
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  }

  const variantStyles = getVariantStyles(variant);
  const variantIcon = getVariantIcon(variant);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={`sm:max-w-[425px] flex items-center justify-center flex-col ${variantStyles}`}
      >
        <DialogTitle className="text-xl font-bold">{title}</DialogTitle>
        {variantIcon}
        <DialogDescription className={`text-center ${variantStyles}`}>
          {message}
        </DialogDescription>

        {url && (
          <Button
            variant={copied ? "secondary" : "outline"}
            onClick={copyToClipboard}
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Disalin
              </>
            ) : (
              <>
                <IconCopy className="h-4 w-4" />
                Salin Tautan Media
              </>
            )}
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
