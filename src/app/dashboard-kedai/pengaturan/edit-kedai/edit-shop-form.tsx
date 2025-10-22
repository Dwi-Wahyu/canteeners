"use client";

import { FileUploadImage } from "@/app/_components/file-upload-image";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  UpdateShopSchema,
  UpdateShopSchemaType,
} from "@/validations/schemas/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Loader, Save, Plus, Trash2 } from "lucide-react";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { uploadShopImage } from "@/app/admin/kantin/actions";
import { getShopById } from "../queries";
import { formatToHour } from "@/helper/hour-helper";
import { UpdateShop } from "@/app/admin/kedai/actions";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderMode } from "@/app/generated/prisma";
import { orderModeMapping } from "@/constant/order-mode-mapping";

export default function EditShopForm({
  initialData,
}: {
  initialData: NonNullable<Awaited<ReturnType<typeof getShopById>>>;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<UpdateShopSchemaType>({
    resolver: zodResolver(UpdateShopSchema),
    defaultValues: {
      id: initialData.id,
      name: initialData.name,
      description: initialData.description ?? "",
      image_url: initialData.image_url,
      order_mode: initialData.order_mode,
      open_time: formatToHour(initialData.open_time),
      close_time: formatToHour(initialData.close_time),
    },
  });

  const router = useRouter();

  const onSubmit = async (payload: UpdateShopSchemaType) => {
    if (files.length > 0) {
      payload.image_url = await uploadShopImage(files[0]);
    }

    console.log(payload);

    const result = await UpdateShop(payload);

    console.log(result);

    if (result.success) {
      toast.success(result.message);

      router.push("/dashboard-kedai/pengaturan");
    } else {
      console.log(result.error);

      toast.error(
        result.error.message || "Terjadi kesalahan saat menyimpan data."
      );
    }
  };

  return (
    <Form {...form}>
      <form
        className="gap-5 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nama</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <h1 className="mb-2 text-sm">Gambar</h1>

          <FileUploadImage
            multiple={false}
            initialPreviewUrl={"/uploads/shop/" + initialData.image_url}
            onFilesChange={(newFiles) => {
              setFiles(newFiles);
            }}
          />

          {form.formState.errors.image_url && (
            <p data-slot="form-message" className="text-destructive text-sm">
              {form.formState.errors.image_url.message}
            </p>
          )}
        </div>

        <FormField
          control={form.control}
          name="order_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode Pemesanan</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="READY_ONLY"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Pemilik Warung" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(OrderMode).map((mode, idx) => (
                      <SelectItem key={idx} value={mode}>
                        {orderModeMapping[mode]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="open_time"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormLabel className="px-1">Jam Operasional Buka</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <FormField
          control={form.control}
          name="close_time"
          render={({ field }) => (
            <div className="flex flex-col gap-3">
              <FormItem>
                <FormLabel className="px-1">Jam Operasional Tutup</FormLabel>

                <FormControl>
                  <Input
                    {...field}
                    type="time"
                    className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            </div>
          )}
        />

        <div className="flex justify-center">
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
  );
}
