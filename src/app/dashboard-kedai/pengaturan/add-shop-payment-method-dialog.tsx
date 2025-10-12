import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputPaymentSchema,
  InputPaymentSchemaType,
} from "@/validations/schemas/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PaymentMethod } from "@/app/generated/prisma";
import { paymentMethodMapping } from "@/constant/payment-method";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Input } from "@/components/ui/input";

export default function AddShopPaymentMethodDialog({
  shop_id,
}: {
  shop_id: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputPaymentSchemaType>({
    resolver: zodResolver(InputPaymentSchema),
    defaultValues: {
      method: "QRIS",
    },
  });

  const onSubmit = async (data: InputPaymentSchemaType) => {};

  const watchPaymentMethodQris = form.watch("method") === "QRIS";
  const watchPaymentMethodBankTF = form.watch("method") === "BANK_TRANSFER";

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <IconPlus />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Tambahkan Metode Pembayaran</AlertDialogTitle>

          <Form {...form}>
            <form
              className="mt-4 flex flex-col gap-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="method"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Metode</FormLabel>
                    <FormControl>
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Kode QR Qris atau Transfer Bank" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.values(PaymentMethod).map((method, idx) => {
                            if (method === "CASH") {
                              return;
                            }

                            return (
                              <SelectItem key={idx} value={method}>
                                {paymentMethodMapping[method]}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {watchPaymentMethodQris && (
                <>
                  <div className="w-full mt-2">
                    <FormLabel className="mb-2 block text-start">
                      Gambar Kode QR
                    </FormLabel>

                    <FileUploadImage
                      multiple={false}
                      onFilesChange={(newFiles) => {
                        setFiles(newFiles);
                      }}
                    />

                    {form.formState.errors.qr_url && (
                      <p
                        data-slot="form-message"
                        className="text-destructive text-sm"
                      >
                        {form.formState.errors.qr_url.message}
                      </p>
                    )}
                  </div>

                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bisa berupa biaya tambahan"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              {watchPaymentMethodBankTF && (
                <>
                  <FormField
                    control={form.control}
                    name="account_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nomor Rekening</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="note"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Catatan</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Bisa berupa nama rekening atau bank"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <div className="flex flex-col w-full gap-2 mt-2">
                <AlertDialogCancel type="button">Batal</AlertDialogCancel>
                <Button type="submit">Simpan</Button>
              </div>
            </form>
          </Form>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
}
