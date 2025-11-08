"use client";

import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import {
  PaymentSchema,
  PaymentSchemaType,
} from "@/validations/schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function QrisShopPayment({
  active,
  qr_url,
}: {
  active: boolean;
  qr_url?: string;
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      account_number: "",
      method: "QRIS",
      note: "",
      qr_url: "",
    },
  });

  const [isActive, setIsActive] = useState(active);

  const onSubmit = async (payload: PaymentSchemaType) => {
    if (payload.method === "QRIS" && files.length === 0) {
      form.setError("qr_url", { message: "Masukkan Gambar QR Code" });
      return;
    }
  };

  return (
    <Card>
      <CardContent>
        <div className="flex gap-4 justify-between items-center">
          <div>
            <CardTitle>QRIS</CardTitle>
            <CardDescription>
              Quick Response Code Indonesian Standard
            </CardDescription>
          </div>
        </div>

        {!qr_url && (
          <Form {...form}>
            <form
              className="gap-5 flex flex-col"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FileUploadImage
                multiple={false}
                onFilesChange={(newFiles) => {
                  setFiles(newFiles);
                }}
              />
            </form>
          </Form>
        )}

        <Button
          size="sm"
          onClick={() => setIsActive(!isActive)}
          variant={isActive ? "default" : "outline"}
        >
          {isActive ? "Aktif" : "Nonaktif"}
        </Button>
      </CardContent>
    </Card>
  );
}
