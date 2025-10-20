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

import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EditProductSchema,
  EditProductSchemaType,
  InputProductSchema,
  InputProductSchemaType,
} from "@/validations/schemas/product";
import { toast } from "sonner";
import { InputProduct, uploadProductImage } from "../actions";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Loader, Pencil, Save, Trash } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Category, Product, ProductOption } from "@/app/generated/prisma";
import InputProductOptionDialog from "../input-product-option-dialog";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemTitle,
} from "@/components/ui/item";
import { SelectWithSearch } from "@/components/select-with-search";

type ProductWithIncludeOptions = Product & {
  options: ProductOption[];
};

export default function EditProductForm({
  initialData,
  categories,
}: {
  initialData: ProductWithIncludeOptions;
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
      price: initialData.price.toString(),
      options: initialData.options,
      categories: null,
    },
  });

  const { append, remove, insert, fields, update } = useFieldArray({
    control: form.control,
    name: "options",
  });

  const router = useRouter();

  const onSubmit = async (payload: EditProductSchemaType) => {
    if (files.length > 0) {
      payload.image_url = await uploadProductImage(files[0], payload.name);
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

    const result = await InputProduct(payload);

    if (result.success) {
      toast.success(result.message);

      setTimeout(() => {
        router.push("/dashboard-kedai/produk");
      }, 2000);
    } else {
      console.log(result.error);

      toast.error(result.error.message);
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

        <div>
          <FormLabel>Pilihan Produk</FormLabel>
          <div className="">
            {fields.length === 0 && (
              <Empty className="border mt-2">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Trash />
                  </EmptyMedia>
                  <EmptyTitle>Belum Ada Pilihan</EmptyTitle>
                  <EmptyDescription>Ketik tombol dibawah</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <InputProductOptionDialog
                    product_name={form.watch("name")}
                    append={append}
                  />
                </EmptyContent>
              </Empty>
            )}

            {fields.map((option, idx) => (
              <Item variant={"outline"} size={"sm"} key={idx} className="mt-2">
                <ItemContent>
                  <ItemTitle>{option.option}</ItemTitle>

                  <ItemDescription>
                    Biaya tambahan : {option.additional_price}
                  </ItemDescription>
                </ItemContent>
                <ItemActions>
                  <Button size={"icon"} variant={"outline"}>
                    <Pencil />
                  </Button>

                  <Button size={"icon"} variant={"outline"}>
                    <Trash />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3">
          {fields.length > 0 && (
            <InputProductOptionDialog
              product_name={form.watch("name")}
              append={append}
            />
          )}

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
