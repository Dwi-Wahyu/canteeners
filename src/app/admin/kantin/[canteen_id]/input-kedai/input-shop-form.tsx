"use client";

import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Canteen, User } from "@/app/generated/prisma";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  InputPaymentSchemaType,
  InputShopSchema,
  InputShopSchemaType,
  PaymentMethodEnum, // Import enum Zod
} from "@/validations/schemas/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Save, Plus, Trash2 } from "lucide-react";
import { NavigationButton } from "@/app/_components/navigation-button";
import { InputShop, uploadShopImage } from "../../actions";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const paymentMethodOptions = PaymentMethodEnum.options.map((method) => ({
  label: method.replace("_", " "),
  value: method,
}));

export default function InputShopForm({
  canteen,
  shopOwners,
}: {
  canteen: Canteen;
  shopOwners: User[];
}) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputShopSchemaType>({
    resolver: zodResolver(InputShopSchema),
    defaultValues: {
      name: "",
      description: "",
      image_url: "",
      canteen_id: canteen.id,
      // Default setidaknya ada satu metode pembayaran CASH
      payments: [
        {
          method: "CASH",
          qr_url: "",
          account_number: "",
          note: "",
        },
      ],
    },
  });

  // =========================================================================
  // LOGIKA useFieldArray untuk 'payments'
  // =========================================================================
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "payments",
  });
  // =========================================================================

  const ownerOptions = shopOwners.map((owners) => ({
    label: owners.name,
    value: owners.id,
  }));

  const router = useRouter();

  const onSubmit = async (payload: InputShopSchemaType) => {
    // Tambahkan shop_id ke setiap payment, ini harusnya di handle di server/action
    // tapi untuk kasus input form agar data terstruktur
    const finalPayload = {
      ...payload,
      // Hapus data yang tidak perlu (string kosong) sesuai dengan model Prisma
      payments: payload.payments.map((p) => {
        const payment: Partial<InputPaymentSchemaType> = {
          ...p,
        };

        // Hapus qr_url jika methodnya bukan QRIS
        if (p.method !== "QRIS") {
          delete payment.qr_url;
        } else if (payment.qr_url === "") {
          // Ganti string kosong menjadi undefined/null jika masih ada
          delete payment.qr_url;
        }

        // Hapus account_number jika methodnya bukan BANK_TRANSFER
        if (p.method !== "BANK_TRANSFER") {
          delete payment.account_number;
        } else if (payment.account_number === "") {
          // Ganti string kosong menjadi undefined/null jika masih ada
          delete payment.account_number;
        }

        // Hapus note jika string kosong
        if (payment.note === "") {
          delete payment.note;
        }

        // Asumsi skema Zod sudah memfilter ini, tapi ini untuk memastikan data bersih
        return payment as InputPaymentSchemaType;
      }),
    };

    if (files.length > 0) {
      finalPayload.image_url = await uploadShopImage(files[0]);
    }

    if (finalPayload.image_url === "") {
      form.setError("image_url", { message: "Tolong pilih gambar" });
      return;
    }

    console.log(payload);

    const result = await InputShop(finalPayload);

    console.log(result);

    if (result.success) {
      toast.success(result.message);

      router.push("/admin/kantin/" + finalPayload.canteen_id);
    } else {
      console.log(result.error);

      toast.error(
        result.error.message || "Terjadi kesalahan saat menyimpan data."
      );
    }
  };

  const addPaymentMethod = () => {
    append({
      method: "CASH",
      qr_url: "",
      account_number: "",
      note: "",
    });
  };

  return (
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
              <FormLabel>Nama Warung</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Deskripsi Singkat</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="owner_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Pemilik Warung</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Pemilik Warung" />
                  </SelectTrigger>
                  <SelectContent>
                    {ownerOptions.map((owner, idx) => (
                      <SelectItem key={idx} value={owner.value}>
                        {owner.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

          {form.formState.errors.image_url && (
            <p data-slot="form-message" className="text-destructive text-sm">
              {form.formState.errors.image_url.message}
            </p>
          )}
        </div>

        {/* ================================================================= */}
        {/* LOGIKA INPUT METODE PEMBAYARAN DENGAN useFieldArray */}
        {/* ================================================================= */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Metode Pembayaran</h2>

          <div className="space-y-4">
            {fields.map((item, index) => (
              // Gunakan Card untuk mengelompokkan setiap metode pembayaran
              <Card
                key={item.id}
                className="shadow-none border border-border/70"
              >
                <CardContent className="space-y-3">
                  <div className="flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="font-medium">
                      Metode Pembayaran {index + 1}
                    </CardTitle>
                    {/* Tombol Hapus */}
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1} // Minimal 1 metode
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Field Select Method */}
                  <FormField
                    control={form.control}
                    name={`payments.${index}.method`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilih Metode</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            // Setel ulang (reset) field kondisional saat method berubah
                            form.setValue(`payments.${index}.qr_url`, "", {
                              shouldValidate: true,
                            });
                            form.setValue(
                              `payments.${index}.account_number`,
                              "",
                              { shouldValidate: true }
                            );
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
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Tampilan Kondisional */}
                  {/* Field QR URL (Hanya untuk QRIS) */}
                  {form.watch(`payments.${index}.method`) === "QRIS" && (
                    <FormField
                      control={form.control}
                      name={`payments.${index}.qr_url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL QRIS</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Masukkan URL Gambar QRIS"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Field Account Number (Hanya untuk BANK_TRANSFER) */}
                  {form.watch(`payments.${index}.method`) ===
                    "BANK_TRANSFER" && (
                    <FormField
                      control={form.control}
                      name={`payments.${index}.account_number`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nomor Rekening</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Masukkan Nomor Rekening"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Field Note (Opsional untuk semua method) */}
                  {(form.watch(`payments.${index}.method`) === "QRIS" ||
                    form.watch(`payments.${index}.method`) ===
                      "BANK_TRANSFER") && (
                    <FormField
                      control={form.control}
                      name={`payments.${index}.note`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Catatan Tambahan (misalnya: Nama Bank/Akun)
                          </FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Opsional" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  {/* Field Additional Price (opsional, tapi tidak ada di skema Zod/Prisma Anda) 
                      Anda bisa menambahkannya jika diperlukan di masa depan.
                      
                      Saat ini, field additional_price tidak ada dalam skema Zod dan model Prisma Anda.
                      Jika ingin menambahkannya, Anda harus memperbarui Zod dan Prisma. 
                  */}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Tombol Tambah Metode Pembayaran */}
          <Button
            type="button"
            variant="outline"
            className="w-full mt-4"
            onClick={addPaymentMethod}
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah Metode Pembayaran
          </Button>

          {/* Tampilkan pesan error untuk array payments secara keseluruhan */}
          {form.formState.errors.payments && (
            <p className="text-destructive text-sm mt-2">
              {form.formState.errors.payments.message}
            </p>
          )}
        </div>
        {/* ================================================================= */}

        <div className="flex justify-end gap-3">
          <NavigationButton url={"/admin/kantin/" + canteen.id} />

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
