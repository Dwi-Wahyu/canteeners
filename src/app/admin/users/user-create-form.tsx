"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import Link from "next/link";
import { IconChevronLeft, IconLoader, IconPlus } from "@tabler/icons-react";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { useState } from "react";
import { NotificationDialog } from "@/components/notification-dialog";

import { useRouter } from "nextjs-toploader/app";
import {
  InputUserSchema,
  InputUserSchemaType,
} from "@/validations/schemas/user";
import { createUser, uploadAvatar } from "./actions";
import { Role } from "@/app/generated/prisma";
import { NavigationButton } from "@/app/_components/navigation-button";

export function CreateUserForm({
  backUrl,
  role,
  roleLabel,
}: {
  backUrl: string;
  role: Role;
  roleLabel: string;
}) {
  const router = useRouter();

  const form = useForm<InputUserSchemaType>({
    resolver: zodResolver(InputUserSchema),
    defaultValues: {
      username: "",
      password: "",
      name: "",
      avatar: "/uploads/avatar/default-avatar.jpg",
      role,
      email: "",
      phone_number: "",
    },
  });

  const [files, setFiles] = useState<File[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccessOpen, setIsSuccessOpen] = useState(false);
  const [isErrorOpen, setIsErrorOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState(
    `Terjadi kesalahan saat menyimpan data ${roleLabel}. Silakan coba lagi.`
  );

  const onSubmit = async (payload: InputUserSchemaType) => {
    setIsLoading(true);
    if (files.length > 0) {
      payload.avatar = await uploadAvatar(files[0], payload.username);
    }

    const result = await createUser(payload);

    if (result.success) {
      setIsSuccessOpen(true);
      setTimeout(() => {
        router.push(backUrl);
      }, 2000);
    } else {
      setErrorMessage(result.error.message);
      setIsErrorOpen(true);
    }

    setIsLoading(false);
  };

  return (
    <div className="w-full flex justify-center">
      <NotificationDialog
        isOpen={isSuccessOpen}
        onClose={() => setIsSuccessOpen(false)}
        title="Aksi Berhasil!"
        message={`Data ${roleLabel} berhasil disimpan.`}
        variant="success"
      />

      <NotificationDialog
        isOpen={isErrorOpen}
        onClose={() => setIsErrorOpen(false)}
        title={`Gagal menyimpan data ${roleLabel}!`}
        message={errorMessage}
        variant="error"
      />

      <Card className="w-full relative max-w-xl shadow-none">
        <Button
          className="top-6 hidden md:inline-flex absolute -left-14"
          variant={"secondary"}
          asChild
        >
          <Link href={backUrl}>
            <IconChevronLeft />
          </Link>
        </Button>
        <CardHeader>
          <CardTitle>Daftarkan {roleLabel}</CardTitle>
          <CardDescription>
            Isi detail di bawah untuk mendaftarkan pengguna baru ke dalam
            sistem.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-lg space-y-6"
            >
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
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama Lengkap</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Nomor Telpon / WA (Opsional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="w-full">
                <h1 className="mb-2 text-sm">Pasfoto (Opsional)</h1>

                <FileUploadImage
                  multiple={false}
                  onFilesChange={(newFiles) => {
                    setFiles(newFiles);
                  }}
                />
              </div>

              <div className="flex justify-end gap-2">
                <NavigationButton url={backUrl}>
                  <IconChevronLeft />
                  Kembali
                </NavigationButton>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <IconLoader className="animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      <IconPlus />
                      Submit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
