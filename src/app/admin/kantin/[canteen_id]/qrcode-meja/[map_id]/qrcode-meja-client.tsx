"use client";

import { NavigationButton } from "@/app/_components/navigation-button";
import { getCanteenMap } from "../../../queries";
import { Card, CardContent } from "@/components/ui/card";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { createNewTableQRCode } from "./actions";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { IconQrcodeOff } from "@tabler/icons-react";
import QRCodeMejaCard from "./qrcode-meja-card";

export default function QrcodeMejaClient({
  map,
}: {
  map: NonNullable<Awaited<ReturnType<typeof getCanteenMap>>>;
}) {
  const router = useRouter();

  const mutations = useMutation({
    mutationKey: ["generate-table-qrcode"],
    mutationFn: async () => {
      return await createNewTableQRCode({
        canteen_id: map.canteen_id,
        floor: map.floor,
        map_id: map.id,
        previousTableNumber: map.qrcodes.length,
      });
    },
    onSuccess: () => {
      toast.success("Berhasil generate QR Code");
      router.refresh();
    },
  });

  return (
    <div>
      <div className="my-4 text-center">
        <h1 className="font-semibold text-xl">{map.canteen.name}</h1>
        <h1 className="font-semibold text-lg">Lantai {map.floor}</h1>
      </div>

      <div className="flex justify-center">
        <img
          src={"/uploads/map/" + map.image_url}
          alt=""
          className="rounded-lg shadow w-full md:w-lg"
        />
      </div>

      <div className="my-4 flex justify-between items-center">
        <NavigationButton url={`/admin/kantin/${map.canteen_id}`} />

        {map.qrcodes.length > 0 && (
          <Button
            onClick={async () => mutations.mutateAsync()}
            disabled={mutations.isPending}
          >
            Tambah QR Code
          </Button>
        )}
      </div>

      {map.qrcodes.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconQrcodeOff />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Data</EmptyTitle>
            <EmptyDescription>
              Klik "Tambah QR Code" untuk menambahkan Qr Code
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button
              onClick={async () => mutations.mutateAsync()}
              disabled={mutations.isPending}
            >
              Tambah QR Code
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {map.qrcodes.length > 0 && (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {map.qrcodes.map((map) => (
            <QRCodeMejaCard data={map} key={map.id} />
          ))}
        </div>
      )}
    </div>
  );
}
