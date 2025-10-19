"use client";

import {
  QuickChatSchema,
  QuickChatSchemaType,
} from "@/validations/schemas/quick-chat";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconMessagePlus } from "@tabler/icons-react";
import { useForm } from "react-hook-form";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createQuickChat } from "../actions";
import { toast } from "sonner";
import { Loader, Save } from "lucide-react";
import { useState } from "react";

export default function QuickChatForm({ user_id }: { user_id: string }) {
  const [showDialog, setShowDialog] = useState(false);

  const form = useForm<QuickChatSchemaType>({
    resolver: zodResolver(QuickChatSchema),
    defaultValues: {
      message: "",
      user_id,
    },
  });

  const onSubmit = async (data: QuickChatSchemaType) => {
    const result = await createQuickChat(data);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error.message);
    }

    setShowDialog(false);
  };

  return (
    <Dialog onOpenChange={setShowDialog} open={showDialog}>
      <DialogTrigger asChild>
        <Button size={"icon"}>
          <IconMessagePlus />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="hidden"></DialogTitle>
          <DialogDescription className="hidden"></DialogDescription>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tambahkan Pesan Singkat</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                disabled={form.formState.isSubmitting}
                type="submit"
                className="mt-4"
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Loader className="animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan
                  </>
                )}
              </Button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
