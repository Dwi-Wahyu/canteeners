"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormDescription,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignUpSchema, SignUpSchemaType } from "@/validations/schemas/auth";
import { useForm } from "react-hook-form";
import { useRouter } from "nextjs-toploader/app";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { SignUpCustomer } from "./actions";
import { toast } from "sonner";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      nim: "",
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log(data);

    const result = await SignUpCustomer(data);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1000);
    } else {
      toast.error(result.error.message);
    }
  };

  return (
    <div className={"flex flex-col gap-6"} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Formulir Pendaftaran</CardTitle>
          <CardDescription>
            Masukkan Data Diri Anda Untuk Mendaftar Sebagai Pelanggan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <div className="flex flex-col gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama Lengkap</FormLabel>
                      <FormControl>
                        <Input
                          className="px-4 py-2"
                          placeholder="Nama Lengkap Anda"
                          {...field}
                        />
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
                  name="nim"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>NIM</FormLabel>
                      <FormControl>
                        <Input
                          className="px-4 py-2"
                          placeholder="NIM Anda"
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
                      <FormLabel>Password</FormLabel>

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
                    {form.formState.isSubmitting ? "Loading..." : "Daftar"}
                  </Button>

                  <div className="flex text-sm justify-center gap-1 mt-2 items-center">
                    <h1>Atau Sudah Punya Akun ?</h1>
                    <Link
                      href={"/auth/signin"}
                      className=" underline underline-offset-2 text-blue-400"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
