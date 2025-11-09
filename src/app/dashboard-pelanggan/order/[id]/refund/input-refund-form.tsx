"use client";

import { useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  InputRefundSchema,
  InputRefundSchemaType,
} from "@/validations/schemas/refund";
import { Input } from "@/components/ui/input";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RefundReason } from "@/app/generated/prisma";
import { refundReasonMapping } from "@/constant/refund-mapping";
import { FileUploadImage } from "@/app/_components/file-upload-image";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { InputRefund, uploadRefundComplaintProofImage } from "./actions";
import { toast } from "sonner";
import { IconLoader } from "@tabler/icons-react";

export default function InputRefundForm({ order_id }: { order_id: string }) {
  const [files, setFiles] = useState<File[]>([]);

  const form = useForm<InputRefundSchemaType>({
    resolver: zodResolver(InputRefundSchema),
    defaultValues: {
      order_id,
      amount: "0",
      complaint_proof_url: "",
      reason: "LATE_DELIVERY",
      description: "",
      status: "PENDING",
    },
  });

  const onSubmit = async (payload: InputRefundSchemaType) => {
    if (files.length > 0) {
      payload.complaint_proof_url = await uploadRefundComplaintProofImage(
        files[0]
      );
    }

    const parsedPrice = parseInt(payload.amount);

    if (isNaN(parsedPrice)) {
      form.setError("amount", { message: "Jumlah tidak valid" });
      return;
    }

    if (parsedPrice < 1) {
      form.setError("amount", { message: "Jumlah tidak valid" });
      return;
    }

    const result = await InputRefund(payload);

    if (result.success) {
      toast.success(result.message);
    } else {
      toast.error(result.error.message);
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
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Jumlah</FormLabel>
              <FormControl>
                <div className="relative">
                  <div className="text-muted-foreground pointer-events-none absolute inset-y-0 left-0 flex items-center justify-center pl-3 peer-disabled:opacity-50">
                    Rp
                  </div>
                  <Input type="number" className="peer pl-9" {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reason"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alasan</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  required
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih alasan" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RefundReason).map((reason, idx) => (
                      <SelectItem value={reason} key={idx}>
                        {refundReasonMapping[reason]}
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
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keterangan</FormLabel>
              <FormControl>
                <Textarea {...field} value={field.value || ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="w-full">
          <FormLabel className="mb-2">Bukti</FormLabel>

          <FileUploadImage
            multiple={false}
            onFilesChange={(newFiles) => {
              setFiles(newFiles);
            }}
          />

          {form.formState.errors.complaint_proof_url && (
            <p data-slot="form-message" className="text-destructive text-sm">
              {form.formState.errors.complaint_proof_url.message}
            </p>
          )}
        </div>

        <Button
          className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary"
          type="submit"
          size={"lg"}
          disabled={
            form.formState.isSubmitting || form.formState.isSubmitSuccessful
          }
        >
          {form.formState.isSubmitting ? (
            <IconLoader className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
}
