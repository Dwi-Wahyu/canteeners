"use client";

import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Canteen, Shop, User } from "@/app/generated/prisma";
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
  InputPaymentSchemaType,
  InputShopSchema,
  InputShopSchemaType,
  PaymentMethodEnum,
  UpdateShopSchema,
  UpdateShopSchemaType, // Import enum Zod
} from "@/validations/schemas/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Save, Plus, Trash2 } from "lucide-react";
import { NavigationButton } from "@/app/_components/navigation-button";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { getShopDataWithPayment } from "../../queries";
import { uploadShopImage } from "@/app/admin/kantin/actions";
import { UpdateShop } from "../../actions";
import { IconCashPlus } from "@tabler/icons-react";

// Ambil nilai enum dari Zod
const paymentMethodOptions = PaymentMethodEnum.options.map((method) => ({
  label: method.replace("_", " "),
  value: method,
}));

export default function EditShopForm({
  initialData,
}: {
  initialData: NonNullable<Awaited<ReturnType<typeof getShopDataWithPayment>>>;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<UpdateShopSchemaType>({
    resolver: zodResolver(UpdateShopSchema),
    defaultValues: {
      name: initialData.name,
      description: initialData.description ?? "",
      image_url: initialData.image_url,
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

      router.push("/admin/kantin/" + initialData.canteen_id);
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
              <FormLabel>Nama Warung</FormLabel>
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
            initialPreviewUrl={initialData.image_url}
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

        <div className="flex justify-center gap-3">
          <NavigationButton url={"/admin/kedai"} />

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
