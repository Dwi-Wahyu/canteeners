"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { IconLoader, IconLockPassword } from "@tabler/icons-react";
import {
  ChangePasswordSchema,
  ChangePasswordSchemaType,
} from "@/validations/schemas/change-password";
import { toast } from "sonner";
import { changePassword } from "./actions";
import { NavigationButton } from "../../_components/navigation-button";
import { Save } from "lucide-react";

export function ChangePasswordForm() {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<ChangePasswordSchemaType>({
    resolver: zodResolver(ChangePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_password: "",
    },
  });

  const onSubmit = async (values: ChangePasswordSchemaType) => {
    setIsLoading(true);
    const result = await changePassword(values);
    setIsLoading(false);

    if (!result.success) {
      toast.error(result.error.message);
    } else {
      toast.success(result.message);
      form.reset();
    }
  };

  return (
    <Card className="w-full relative max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Ubah Kata Sandi</CardTitle>
        <CardDescription>
          Ganti kata sandi Anda untuk meningkatkan keamanan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="current_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Saat Ini</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="new_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirm_password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Konfirmasi Kata Sandi Baru</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} disabled={isLoading} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 mt-5">
              <NavigationButton url="/admin/profil" />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <IconLoader className="animate-spin mr-2" />
                    Memproses...
                  </>
                ) : (
                  <>
                    <Save />
                    Simpan Perubahan
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
