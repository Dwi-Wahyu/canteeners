"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  InputUserSchema,
  InputUserSchemaType,
} from "@/validations/schemas/user";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Loader, Save } from "lucide-react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { createUser, uploadAvatar } from "../actions";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { FileUploadImage } from "@/app/_components/file-upload-image";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InputUserPage() {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputUserSchemaType>({
    resolver: zodResolver(InputUserSchema),
    defaultValues: {
      name: "",
      username: "",
      avatar: "default-avatar.jpg",
      email: "",
      phone_number: "",
      password: "",
      role: "SHOP_OWNER",
    },
  });

  const onSubmit = async (payload: InputUserSchemaType) => {
    if (files.length > 0) {
      payload["avatar"] = await uploadAvatar(files[0]);
    }

    const result = await createUser(payload);

    if (result.success) {
      toast.success("Berhasil input user");
      form.reset();
      setFiles([]);
    } else {
      toast.error(result.error.message || "Gagal input user");
    }
  };

  return (
    <Card className="max-w-xl container mx-auto">
      <CardHeader>
        <h1 className="text-lg font-semibold leading-tight">Input User</h1>
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

            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={"SHOP_OWNER"}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="SHOP_OWNER">
                          Pemilik Kedai
                        </SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                        <SelectItem value="COURIER">Kurir</SelectItem>
                        <SelectItem value="CUSTOMER">Customer</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone_number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nomor Telepon (Opsional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="w-full">
              <h1 className="mb-2 text-sm">Gambar</h1>

              <FileUploadImage
                multiple={false}
                onFilesChange={(newFiles) => {
                  setFiles(newFiles);
                }}
              />

              {form.formState.errors.avatar && (
                <p
                  data-slot="form-message"
                  className="text-destructive text-sm"
                >
                  {form.formState.errors.avatar.message}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-3">
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
