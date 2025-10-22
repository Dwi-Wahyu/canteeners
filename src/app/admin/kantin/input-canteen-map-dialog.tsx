"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  InputCanteenMapSchema,
  InputCanteenMapSchemaType,
} from "@/validations/schemas/canteen";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Input } from "@/components/ui/input";
import { Loader, Save } from "lucide-react";
import { InputCanteenMap, uploadCanteenMapImage } from "./actions";
import { toast } from "sonner";

export default function InputCanteenMapDialog({
  canteen_id,
  last_floor,
}: {
  canteen_id: number;
  last_floor: number;
}) {
  const [files, setFiles] = useState<File[]>([]);
  const [open, setOpen] = useState(false);

  const form = useForm<InputCanteenMapSchemaType>({
    resolver: zodResolver(InputCanteenMapSchema),
    defaultValues: {
      canteen_id,
      floor: last_floor + 1,
      image_url: "",
    },
  });

  const onSubmit = async (payload: InputCanteenMapSchemaType) => {
    if (files.length > 0) {
      payload.image_url = await uploadCanteenMapImage(files[0]);
    }

    if (payload.image_url === "") {
      form.setError("image_url", { message: "Tolong pilih gambar denah" });
      return;
    }

    const result = await InputCanteenMap(payload);

    if (result.success) {
      toast.success(result.message);
    } else {
      console.log(result.error);

      toast.error(result.error.message);
    }

    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Tambah denah</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Pilih Gambar Denah</DialogTitle>
          <DialogDescription></DialogDescription>

          <Form {...form}>
            <form
              className="gap-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="floor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lantai</FormLabel>
                    <FormControl>
                      <Input {...field} disabled />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="w-full">
                <FormLabel>Gambar</FormLabel>

                <div className="mt-2">
                  <FileUploadImage
                    multiple={false}
                    onFilesChange={(newFiles) => {
                      setFiles(newFiles);
                    }}
                  />
                </div>

                {form.formState.errors.image_url && (
                  <p
                    data-slot="form-message"
                    className="text-destructive text-sm"
                  >
                    {form.formState.errors.image_url.message}
                  </p>
                )}
              </div>

              <div className="flex justify-center gap-3">
                <Button disabled={form.formState.isSubmitting} type="submit">
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader className="animate-spin" /> Loading
                    </>
                  ) : (
                    <>
                      <Save />
                      Simpan
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
