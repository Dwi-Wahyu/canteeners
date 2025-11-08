"use client";

import { useState } from "react";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProductSchema,
  EditProductSchemaType,
} from "@/validations/schemas/product";
import { UpdateProduct, uploadProductImage } from "../actions";
import { Button } from "@/components/ui/button";
import { Loader, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Category } from "@/app/generated/prisma";

import MultipleSelector from "@/components/multiple-select";
import { getProductIncludeCategory } from "../queries";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { IconAlertCircle } from "@tabler/icons-react";

export default function EditProductForm({
  initialData,
  categories,
}: {
  initialData: NonNullable<
    Awaited<ReturnType<typeof getProductIncludeCategory>>
  >;
  categories: Category[];
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<EditProductSchemaType>({
    resolver: zodResolver(EditProductSchema),
    defaultValues: {
      id: initialData.id,
      name: initialData.name,
      description: initialData.description ?? "",
      image_url: initialData.image_url,
      shop_id: initialData.shop_id,
      price: initialData.price.toString(),
      cost: initialData.cost ? initialData.cost.toString() : "",
      categories: initialData.categories.map((each) => ({
        label: each.category.name,
        value: each.category.id.toString(),
      })),
    },
  });

  const onSubmit = async (payload: EditProductSchemaType) => {
    if (files.length > 0) {
      payload.image_url = await uploadProductImage(files[0]);
    }

    if (payload.image_url === "") {
      form.setError("image_url", { message: "Tolong pilih gambar" });
      return;
    }

    const parsedPrice = parseInt(payload.price);

    if (isNaN(parsedPrice)) {
      form.setError("price", { message: "Harga tidak valid" });
      return;
    }

    if (payload.cost && isNaN(parseInt(payload.cost))) {
      form.setError("cost", { message: "Harga modal tidak valid" });
      return;
    }

    const result = await UpdateProduct(payload);

    if (result.success) {
      notificationDialog.success({
        title: "Sukses Edit Produk",
      });
    } else {
      notificationDialog.error({
        title: "Terjadi Kesalahan Saat Memperbarui Produk",
      });
    }
  };

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.id.toString(),
  }));

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

        <FormField
          control={form.control}
          name="price"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    Rp
                  </div>
                  <Input
                    placeholder="5000"
                    type="number"
                    className="peer pl-9"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="cost"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Harga Modal</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    Rp
                  </div>
                  <Input
                    type="number"
                    className="peer pl-9"
                    {...field}
                    value={field.value ?? ""}
                  />
                </div>
              </FormControl>
              <FormDescription>Untuk menghitung keuntungan</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <FormLabel className="mb-2">Gambar</FormLabel>

          <FileUploadImage
            multiple={false}
            initialPreviewUrl={"/uploads/product/" + initialData.image_url}
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
          name="categories"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <MultipleSelector
                  value={field.value}
                  options={categoryOptions}
                  onChange={field.onChange}
                  placeholder="Pilih kategori"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          size={"lg"}
          disabled={form.formState.isSubmitting}
          type="submit"
        >
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
      </form>
    </Form>
  );
}
