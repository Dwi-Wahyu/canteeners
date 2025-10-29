"use client";

import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Canteen, ShopOrderMode, User } from "@/app/generated/prisma";
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
} from "@/validations/schemas/shop";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader, Save } from "lucide-react";
import { NavigationButton } from "@/app/_components/navigation-button";
import { InputShop, uploadShopImage } from "../../actions";
import { useRouter } from "nextjs-toploader/app";
import { toast } from "sonner";
import { shopOrderModeMapping } from "@/constant/order-mode-mapping";

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
      order_mode: "READY_ONLY",
      owner_id: "",
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

  const ownerOptions = shopOwners.map((owners) => ({
    label: owners.name,
    value: owners.id,
  }));

  const router = useRouter();

  const onSubmit = async (payload: InputShopSchemaType) => {
    // Tambahkan shop_id ke setiap payment, ini harusnya di handle di server/action
    // tapi untuk kasus input form agar data terstruktur

    if (files.length > 0) {
      payload.image_url = await uploadShopImage(files[0]);
    }

    if (payload.image_url === "") {
      form.setError("image_url", { message: "Tolong pilih gambar" });
      return;
    }

    console.log(payload);

    const result = await InputShop(payload);

    console.log(result);

    if (result.success) {
      toast.success(result.message);

      router.push("/admin/kantin/" + payload.canteen_id);
    } else {
      console.log(result.error);

      toast.error(
        result.error.message || "Terjadi kesalahan saat menyimpan data."
      );
    }
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
              <FormLabel>Nama</FormLabel>
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

        <FormField
          control={form.control}
          name="order_mode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mode Pemesanan</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  defaultValue="READY_ONLY"
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih Pemilik Warung" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(ShopOrderMode).map((mode, idx) => (
                      <SelectItem key={idx} value={mode}>
                        {shopOrderModeMapping[mode]}
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
