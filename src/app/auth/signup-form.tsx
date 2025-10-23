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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { SignUpSchema, SignUpSchemaType } from "@/validations/schemas/auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { PasswordInput } from "@/components/password-input";
import { useState } from "react";
import OtpForm from "./otp-form";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [customerData, setCustomerData] = useState<SignUpSchemaType | null>(
    null
  );

  const form = useForm<SignUpSchemaType>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      username: "",
      password: "",
      email: "",
      phone_number: null,
    },
  });

  const onSubmit = async (data: SignUpSchemaType) => {
    console.log(data);

    setCustomerData(data);
    setShowOTPForm(true);
  };

  return (
    <div className={"flex flex-col gap-6"} {...props}>
      {showOTPForm ? (
        <OtpForm customerData={customerData} />
      ) : (
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
                        <FormLabel>
                          Nama Lengkap <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Username <span className="text-red-500">*</span>
                        </FormLabel>
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
                        <FormLabel>
                          Password <span className="text-red-500">*</span>
                        </FormLabel>

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

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Email <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="px-4 py-2"
                            placeholder="user@gmail.com"
                            {...field}
                            value={field.value || ""}
                          />
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
                        <FormLabel>Nomor Telepon</FormLabel>
                        <FormControl>
                          <Input
                            className="px-4 py-2"
                            placeholder="0896xxxx"
                            {...field}
                            value={field.value || ""}
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
      )}
    </div>
  );
}
