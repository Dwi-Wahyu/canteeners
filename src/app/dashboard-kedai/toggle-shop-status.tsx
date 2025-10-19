"use client";

import { Card, CardContent } from "@/components/ui/card";
import { useMutation } from "@tanstack/react-query";
import { toggleShopStatus } from "./pengaturan/actions";
import { ShopStatus } from "../generated/prisma";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Loader } from "lucide-react";
import { formatToHour } from "@/helper/hour-helper";

export default function ToggleShopStatus({
  id,
  currentStatus,
  open_time,
  close_time,
}: {
  id: string;
  currentStatus: ShopStatus;
  open_time: Date | null;
  close_time: Date | null;
}) {
  const [status, setStatus] = useState<ShopStatus>(currentStatus);

  const mutation = useMutation({
    mutationFn: async () => {
      return await toggleShopStatus(id, status);
    },
  });

  async function handleToggle() {
    const result = await mutation.mutateAsync();

    if (result.success) {
      toast.success(result.message);
      if (result.data) {
        setStatus(result.data);
      }
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <Card className="mb-2">
      <CardContent>
        {status === "ACTIVE" && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-green-500"></div>
              <h1 className="font-semibold">Buka</h1>
            </div>

            <Button size={"sm"} onClick={handleToggle}>
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Tutup"
              )}
            </Button>
          </div>
        )}

        {status === "INACTIVE" && (
          <div className="flex justify-between items-center">
            <div className="flex gap-2 items-center">
              <div className="w-4 h-4 rounded-full bg-red-500"></div>
              <h1 className="font-semibold">Tutup</h1>
            </div>

            <Button size={"sm"} onClick={handleToggle}>
              {mutation.isPending ? (
                <Loader className="animate-spin" />
              ) : (
                "Buka"
              )}
            </Button>
          </div>
        )}

        {!open_time && !close_time && (
          <h1 className="text-sm mt-4">
            Belum menentukan jam operasional{" "}
            <Link
              className="underline"
              href={"/dashboard-kedai/pengaturan/edit-kedai"}
            >
              Edit Pengaturan Kedai Anda
            </Link>
          </h1>
        )}

        <h1 className="mt-2">Jam Operasional</h1>

        <h1 className="text-muted-foreground">
          {formatToHour(open_time)} - {formatToHour(close_time)}
        </h1>
      </CardContent>
    </Card>
  );
}
