"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  ShopComplaintSchema,
  ShopComplaintSchemaType,
} from "@/validations/schemas/complaint";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import Link from "next/link";
import { AddShopComplaint, uploadShopComplaintImage } from "../actions";
import { toast } from "sonner";
import { ShopComplaint } from "@/app/generated/prisma";
import { useMutation } from "@tanstack/react-query";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { orderComplaintStatusMapping } from "@/constant/order-complaint-status-mapping";
import { Badge } from "@/components/ui/badge";
import { Eye } from "lucide-react";

type Customer = {
  name: string;
  avatar: string;
};

export default function OrderComplaintClient({
  order_id,
  isUserCustomer,
  customer,
  prevComplaint,
}: {
  order_id: string;
  isUserCustomer: boolean;
  customer: Customer;
  prevComplaint: ShopComplaint | null;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const [complaint, setComplaint] = useState<ShopComplaint | null>(
    prevComplaint
  );

  const form = useForm<ShopComplaintSchemaType>({
    resolver: zodResolver(ShopComplaintSchema),
    defaultValues: {
      order_id,
      cause: "",
      proof_url: "",
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (payload: ShopComplaintSchemaType) => {
      return await AddShopComplaint(payload);
    },
    onSuccess: (data) => {
      if (data.success) {
        toast.success(data.message);

        if (data.data) {
          setComplaint(data.data);
        }
      } else {
        console.log(data.error);

        toast.error(data.error.message);
      }
    },
  });

  const onSubmit = async (payload: ShopComplaintSchemaType) => {
    if (files.length > 0) {
      payload.proof_url = await uploadShopComplaintImage(files[0]);
    }

    await mutateAsync(payload);
  };

  return (
    <Card>
      <CardContent>
        <CardTitle className="mb-4">Saran Dan Kritik</CardTitle>

        {complaint && (
          <>
            <div className="flex gap-3 mb-2 items-center">
              <Avatar className="size-12">
                <AvatarImage src={"/uploads/avatar/" + customer.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold text-muted-foreground">
                  {customer.name}
                </h1>
                <Badge>{orderComplaintStatusMapping[complaint.status]}</Badge>
                <div className="flex items-center gap-1"></div>
              </div>
            </div>

            <h1 className="mt-2">{complaint.cause}</h1>
          </>
        )}

        {isUserCustomer && !complaint && (
          <>
            <Form {...form}>
              <form
                className="gap-5 flex flex-col"
                onSubmit={form.handleSubmit(onSubmit)}
              >
                <FormField
                  control={form.control}
                  name="cause"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Keluhan</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="w-full">
                  <FormLabel className="mb-2">Bukti (Opsional)</FormLabel>

                  <FileUploadImage
                    multiple={false}
                    onFilesChange={(newFiles) => {
                      setFiles(newFiles);
                    }}
                  />

                  {form.formState.errors.proof_url && (
                    <p
                      data-slot="form-message"
                      className="text-destructive text-sm"
                    >
                      {form.formState.errors.proof_url.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col gap-4">
                  <Button
                    size={"lg"}
                    className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary py-6"
                  >
                    Kirim
                  </Button>

                  <Button
                    asChild
                    size={"lg"}
                    className="py-6"
                    variant={"outline"}
                  >
                    <Link href={`/order/${order_id}/refund`}>
                      Ajukan Refund
                    </Link>
                  </Button>
                </div>
              </form>
            </Form>
          </>
        )}
      </CardContent>
    </Card>
  );
}
