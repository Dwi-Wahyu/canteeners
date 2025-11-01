"use client";

import { ArrowUp, Paperclip, Upload, X } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadItemProgress,
  FileUploadList,
  type FileUploadProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { useChatRoom } from "@/hooks/use-chat-room";
import { getConversationMessages } from "./queries";
import { getOrderWaitingPayment } from "../order/queries";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ChatInput({
  conversation,
  sender_id,
  order_waiting_payment,
}: {
  conversation: NonNullable<
    Awaited<ReturnType<typeof getConversationMessages>>
  >;
  sender_id: string;
  order_waiting_payment: Awaited<ReturnType<typeof getOrderWaitingPayment>>;
}) {
  const [isUploading, setIsUploading] = React.useState(false);

  const [isSendingPayment, setIsSendingPayment] = React.useState(false);

  const { text, setText, media, setMedia, handleSend, isLoading } = useChatRoom(
    {
      conversationId: conversation.id,
      senderId: sender_id,
      initialMessages: conversation.messages,
    }
  );

  const onInputChange = React.useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(event.target.value);
    },
    []
  );

  const onUpload: NonNullable<FileUploadProps["onUpload"]> = React.useCallback(
    async (files, { onProgress, onSuccess, onError }) => {
      try {
        setIsUploading(true);
        const uploadPromises = files.map(async (file) => {
          try {
            const totalChunks = 10;
            let uploadedChunks = 0;

            for (let i = 0; i < totalChunks; i++) {
              uploadedChunks++;
              const progress = (uploadedChunks / totalChunks) * 100;
              onProgress(file, progress);
            }

            onSuccess(file);
          } catch (error) {
            onError(
              file,
              error instanceof Error ? error : new Error("Upload failed")
            );
          } finally {
            setIsUploading(false);
          }
        });

        // Wait for all uploads to complete
        await Promise.all(uploadPromises);
      } catch (error) {
        // This handles any error that might occur outside the individual upload processes
        console.error("Unexpected error during upload:", error);
      }
    },
    []
  );

  const onFileReject = React.useCallback((file: File, message: string) => {
    toast(message, {
      description: `"${
        file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name
      }" has been rejected`,
    });
  }, []);

  const onSubmit = async () => {
    if (isSendingPayment) {
      await handleSend("PAYMENT_PROOF", order_waiting_payment?.id);
    }

    await handleSend("TEXT");

    console.log(media);
    console.log(text);
  };

  return (
    <FileUpload
      value={media}
      onValueChange={setMedia}
      onUpload={onUpload}
      onFileReject={onFileReject}
      maxFiles={10}
      maxSize={5 * 1024 * 1024}
      className="relative w-full items-center p-5"
      multiple
      disabled={isUploading}
    >
      <FileUploadDropzone
        tabIndex={-1}
        onClick={(event) => event.preventDefault()}
        className="absolute top-0 left-0 z-0 flex size-full items-center justify-center rounded-none border-none bg-background/50 p-0 opacity-0 backdrop-blur transition-opacity duration-200 ease-out data-[dragging]:z-10 data-[dragging]:opacity-100"
      >
        <div className="flex flex-col items-center gap-1 text-center">
          <div className="flex items-center justify-center rounded-full border p-2.5">
            <Upload className="size-6 text-muted-foreground" />
          </div>
          <p className="font-medium text-sm">Drag & drop files here</p>
          <p className="text-muted-foreground text-xs">
            Upload max 5 files each up to 5MB
          </p>
        </div>
      </FileUploadDropzone>
      <div className="relative flex w-full max-w-md flex-col gap-2.5 rounded-md border border-input bg-secondary/70 backdrop-blur-sm shadow-sm px-3 py-2 outline-none focus-within:ring-1 focus-within:ring-ring/50">
        <FileUploadList
          orientation="horizontal"
          className="overflow-x-auto px-0 py-1"
        >
          {media.map((file, index) => (
            <FileUploadItem key={index} value={file} className="max-w-52 p-1.5">
              <FileUploadItemPreview className="size-8 [&>svg]:size-5">
                <FileUploadItemProgress variant="fill" />
              </FileUploadItemPreview>
              <FileUploadItemMetadata size="sm" />
              <FileUploadItemDelete asChild>
                <Button
                  variant="secondary"
                  className="-top-1 -right-1 absolute size-5 shrink-0 cursor-pointer rounded-full"
                >
                  <X />
                </Button>
              </FileUploadItemDelete>
            </FileUploadItem>
          ))}
        </FileUploadList>
        <Textarea
          value={text}
          onChange={onInputChange}
          placeholder="Ketik pesan"
          className="field-sizing-content min-h-10 w-full resize-none border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 dark:bg-transparent"
          disabled={isUploading}
        />
        <div className="flex items-center justify-end gap-1.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size={"icon"}
                type="button"
                variant="ghost"
                className="size-10 rounded-sm"
              >
                <Paperclip />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuItem asChild>
                  <FileUploadTrigger className="w-full">
                    Kirim Gambar
                    <span className="sr-only">Attach file</span>
                  </FileUploadTrigger>
                </DropdownMenuItem>
                <DropdownMenuItem asChild disabled={!order_waiting_payment}>
                  <FileUploadTrigger
                    className="w-full"
                    onClick={() => setIsSendingPayment(true)}
                  >
                    Kirim bukti pembayaran
                    <span className="sr-only">Send payment proof</span>
                  </FileUploadTrigger>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            size="icon"
            type="submit"
            className="size-10 rounded-sm"
            disabled={(!text.trim() && media.length === 0) || isUploading}
            onClick={onSubmit}
          >
            <ArrowUp />
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </FileUpload>
  );
}
