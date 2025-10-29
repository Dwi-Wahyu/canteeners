import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Store } from "lucide-react";
import Link from "next/link";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconMap } from "@tabler/icons-react";
import { getCanteenWithAllRelations } from "../queries";
import InputCanteenMapDialog from "../input-canteen-map-dialog";

export default async function DetailKantinPage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await getCanteenWithAllRelations(parseInt(canteen_id));

  if (!canteen) {
    return <NotFoundResource />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <img
            src={"/uploads/canteen/" + canteen.image_url}
            alt=""
            className="rounded-lg md:w-lg w-full"
          />

          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold">{canteen.name}</h1>
            <h1 className="">Jumlah Lantai : {canteen.maps.length}</h1>
            <h1 className="">Jumlah Pengunjung Hari Ini : 192</h1>
            <h1 className="">Jumlah Transaksi Hari Ini : 123</h1>
            <h1 className="">Jumlah Kedai : {canteen.shops.length}</h1>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex justify-between mb-4 items-center">
            <h1 className="font-semibold">Denah & Nomor Meja</h1>

            {canteen.maps.length > 0 && (
              <InputCanteenMapDialog
                canteen_id={canteen.id}
                last_floor={canteen.maps.length}
              />
            )}
          </div>

          {canteen.maps.length === 0 && (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconMap />
                </EmptyMedia>
                <EmptyTitle>Belum Ada Data</EmptyTitle>
                <EmptyDescription>Ketuk tambah denah</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <InputCanteenMapDialog
                  canteen_id={canteen.id}
                  last_floor={canteen.maps.length}
                />
              </EmptyContent>
            </Empty>
          )}

          <div className="flex flex-col gap-5">
            {canteen.maps.map((map) => {
              return (
                <div className="grid grid-cols-3 gap-4" key={map.id}>
                  <img
                    src={"/uploads/map/" + map.image_url}
                    className="shadow rounded-lg col-span-2"
                    alt=""
                  />

                  <div className="col-span-1 flex flex-col gap-4">
                    <h1 className="font-semibold">Lantai {map.floor}</h1>
                    <h1>Jumlah QR Code : {map.qrcodes.length}</h1>
                    <NavigationButton
                      label="Kelola QR Code"
                      url={`/admin/kantin/${canteen_id}/qrcode-meja/${map.id}`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="mb-4 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Daftar Kedai</h1>

            <NavigationButton
              url={`/admin/kantin/${canteen.id}/input-kedai/`}
              size="sm"
            >
              <Store />
              Input Kedai
            </NavigationButton>
          </div>

          {canteen.shops.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {canteen.shops.map((shop, idx) => (
                <Link href={"/admin/kedai/" + shop.id} key={idx}>
                  <img
                    src={"/uploads/shop/" + shop.image_url}
                    className="rounded-lg"
                    alt=""
                  />
                  <h1 className="text-center font-semibold mt-1">
                    {shop.name}
                  </h1>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center h-20 w-full">
              <h1 className="text-muted-foreground">
                Belum Ada Warung Terdaftar
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
