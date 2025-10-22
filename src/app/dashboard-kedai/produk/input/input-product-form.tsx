"use client";

import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputProductSchema,
  InputProductSchemaType,
} from "@/validations/schemas/product";
import { toast } from "sonner";
import { InputProduct, uploadProductImage } from "../actions";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Loader, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Category } from "@/app/generated/prisma";
import { SelectWithSearch } from "@/components/select-with-search";

export default function InputProductForm({
  shop_id,
  categories,
}: {
  shop_id: string;
  categories: Category[];
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputProductSchemaType>({
    resolver: zodResolver(InputProductSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      price: "",
      shop_id,
      category: null,
    },
  });

  const router = useRouter();

  const onSubmit = async (payload: InputProductSchemaType) => {
    console.log(payload);

    // if (files.length > 0) {
    //   payload.image_url = await uploadProductImage(files[0], payload.name);
    // }

    // if (payload.image_url === "") {
    //   form.setError("image_url", { message: "Tolong pilih gambar" });
    //   return;
    // }

    // const parsedPrice = parseInt(payload.price);

    // if (isNaN(parsedPrice)) {
    //   form.setError("price", { message: "Harga tidak valid" });
    //   return;
    // }

    // const result = await InputProduct(payload);

    // if (result.success) {
    //   toast.success(result.message);

    //   setTimeout(() => {
    //     router.push("/dashboard-kedai/produk");
    //   }, 2000);
    // } else {
    //   console.log(result.error);

    //   toast.error(result.error.message);
    // }
  };

  const categoryOptions = categories.map((category) => ({
    label: category.name,
    value: category.slug,
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Kategori</FormLabel>
              <FormControl>
                <SelectWithSearch
                  options={categoryOptions}
                  onValueChange={field.onChange}
                  placeholder="Pilih kategori"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <FormLabel className="mb-2">Gambar</FormLabel>

          <FileUploadImage
            multiple={false}
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
