"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  PaymentSchema,
  PaymentSchemaType,
} from "@/validations/schemas/payment";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader, Save } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethodEnum } from "@/validations/schemas/shop";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { uploadShopQRCode } from "@/app/admin/kantin/actions";
import { InputPaymentMethod } from "../../actions";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

const paymentMethodOptions = PaymentMethodEnum.options.map((method) => ({
  label: method.replace("_", " "),
  value: method,
}));

export default function InputPaymentForm({ shop_id }: { shop_id: string }) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<PaymentSchemaType>({
    resolver: zodResolver(PaymentSchema),
    defaultValues: {
      method: "CASH",
      qr_url: null,
      account_number: null,
      note: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (payload: PaymentSchemaType) => {
    if (payload.method === "QRIS" && files.length === 0) {
      form.setError("qr_url", { message: "Masukkan Gambar QR Code" });
      return;
    }

    if (payload.method === "BANK_TRANSFER" && !payload.account_number) {
      form.setError("account_number", { message: "Masukkan Nomor Rekening" });
      return;
    }

    if (payload.method === "QRIS") {
      payload.qr_url = await uploadShopQRCode(files[0]);
    }

    const result = await InputPaymentMethod({ payload, shop_id });

    if (result.success) {
      toast.success(result.message);
      router.push("/admin/kedai/" + result.data?.shop_id);
    } else {
      toast.error(result.error.message);
    }
  };

  const watchMethod = form.watch("method");

  return (
    <Form {...form}>
      <form
        className="gap-5 flex flex-col"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name={`method`}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pilih Metode</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Metode Pembayaran" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {paymentMethodOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchMethod === "QRIS" && (
          <div className="w-full">
            <h1 className="mb-2 text-sm">QRCode QRIS</h1>

            <FileUploadImage
              multiple={false}
              onFilesChange={(newFiles) => {
                setFiles(newFiles);
              }}
            />

            {form.formState.errors.qr_url && (
              <p data-slot="form-message" className="text-destructive text-sm">
                {form.formState.errors.qr_url.message}
              </p>
            )}
          </div>
        )}

        {watchMethod === "BANK_TRANSFER" && (
          <FormField
            control={form.control}
            name="account_number"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nomor Rekening</FormLabel>
                <FormControl>
                  <Input {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="note"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Catatan</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3">
          <NavigationButton url={"/admin/kantin/edit-warung/" + shop_id} />

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
  );
}
