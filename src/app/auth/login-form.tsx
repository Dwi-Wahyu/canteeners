"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { LoginSchemaType, LoginSchema } from "@/validations/schemas/auth";
import { toast } from "sonner";

import { signIn } from "next-auth/react";

import { useRouter } from "nextjs-toploader/app";
import { PasswordInput } from "@/components/password-input";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { getUserRoleByUsernameAction } from "../admin/users/actions";

export default function LoginForm() {
  const router = useRouter();

  const form = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchemaType) => {
    const res = await signIn("credentials", {
      username: data.username,
      password: data.password,
      redirect: false,
    });

    if (res?.error) {
      form.setError("username", {
        type: "manual",
        message: "Username atau Password salah",
      });
      form.setError("password", {
        type: "manual",
        message: "Username atau Password salah",
      });
    } else {
      const role = await getUserRoleByUsernameAction(data.username);

      switch (role) {
        case "ADMIN":
          router.push("/admin");
          break;
        case "SHOP_OWNER":
          router.push("/dashboard-kedai");
          break;
        case "CUSTOMER":
          router.push("/dashboard-pelanggan");
          break;
        default:
          router.push("/");
          break;
      }
    }
  };

  return (
    <Card>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <h1 className="text-2xl font-bold">Selamat Datang</h1>
                <p className="text-muted-foreground text-balance">
                  Masukkan Username Dan Password
                </p>
              </div>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        className="px-4 py-2"
                        placeholder="Username Anda"
                        {...field}
                      />
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
                    <div className="flex justify-between items-center">
                      <FormLabel>Password</FormLabel>

                      <Link
                        href={"/lupa-password"}
                        className="text-sm underline underline-offset-2 text-blue-400"
                      >
                        Lupa Password
                      </Link>
                    </div>
                    <FormControl>
                      <PasswordInput
                        placeholder="Password Anda"
                        className="px-4 py-2"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-2 items-center mb-3">
                <Button
                  disabled={form.formState.isSubmitting}
                  type="submit"
                  className="w-full bg-gradient-to-b from-primary to-primary/70"
                  size={"lg"}
                >
                  {form.formState.isSubmitting ? "Loading..." : "Login"}
                </Button>

                <div className="flex text-sm justify-center gap-1 mt-2 items-center">
                  <h1>Atau</h1>
                  <Link
                    href={"/auth/signup"}
                    className=" underline underline-offset-2 text-blue-400"
                  >
                    Daftar Sebagai Pelanggan
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
