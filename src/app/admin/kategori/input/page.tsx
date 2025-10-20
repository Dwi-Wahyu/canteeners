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
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";
import { Button } from "@/components/ui/button";
import { Loader, Save } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { InputCategory, uploadCategoryImage } from "../actions";
import {
  InputCategorySchema,
  InputCategorySchemaType,
} from "@/validations/schemas/category";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NavigationButton } from "@/app/_components/navigation-button";

export default function InputCategoryForm() {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputCategorySchemaType>({
    resolver: zodResolver(InputCategorySchema),
    defaultValues: {
      name: "",
      image_url: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (payload: InputCategorySchemaType) => {
    if (files.length > 0) {
      payload.image_url = await uploadCategoryImage(files[0], payload.name);
    }

    if (payload.image_url === "") {
      form.setError("image_url", { message: "Tolong pilih gambar" });
      return;
    }

    const result = await InputCategory(payload);

    if (result.success) {
      toast.success(result.message);

      setTimeout(() => {
        router.push("/admin/kategori");
        form.reset();
      }, 2000);
    } else {
      console.log(result.error);

      toast.error(result.error.message);
    }
  };

  return (
    <Card className="container mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Input Kategori</CardTitle>
      </CardHeader>
      <CardContent>
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
              <NavigationButton url="/admin/kategori" />
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
      </CardContent>
    </Card>
  );
}
