import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ProductOptionSchema,
  ProductOptionSchemaType,
} from "@/validations/schemas/product";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { UseFieldArrayAppend, useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function InputProductOptionDialog({
  product_name,
  append,
}: {
  product_name: string;
  append: UseFieldArrayAppend<
    {
      name: string;
      image_url: string;
      price: string;
      shop_id: string;
      options: {
        option: string;
        additional_price: number;
      }[];
      description?: string | undefined;
    },
    "options"
  >;
}) {
  const [open, setOpen] = useState(false);

  const form = useForm<ProductOptionSchemaType>({
    resolver: zodResolver(ProductOptionSchema),
    defaultValues: {
      option: "",
      additional_price: 0,
    },
  });

  const onSubmit = async (payload: ProductOptionSchemaType) => {
    append({
      option: payload.option,
      additional_price: payload.additional_price,
    });
    form.reset();

    setOpen(false);
  };

  const handleSave = async () => {
    await form.handleSubmit(onSubmit)();
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"outline"}>Tambah Pilihan Produk</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <div className="gap-5 flex flex-col">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-start">
              Pilihan {product_name}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-start">
              Masukkan data dibawah untuk pilihan produk
            </AlertDialogDescription>
          </AlertDialogHeader>

          <FormField
            control={form.control}
            name="option"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nama Pilihan</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="additional_price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Harga Tambahan</FormLabel>
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

          <AlertDialogFooter>
            <AlertDialogCancel type="button">Batal</AlertDialogCancel>
            <Button type="button" onClick={handleSave}>
              Simpan
            </Button>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
