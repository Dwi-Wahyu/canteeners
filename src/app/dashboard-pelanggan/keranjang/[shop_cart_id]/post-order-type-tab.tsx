"use client";

import { PostOrderType } from "@/app/generated/prisma";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { IconExclamationCircle, IconRun } from "@tabler/icons-react";
import { HandPlatter } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getCustomerProfile } from "@/app/admin/users/queries";
import { NavigationButton } from "@/app/_components/navigation-button";
import Link from "next/link";
import CustomerPositionBreadcrumb from "./customer-position-breadcrumb";

export default function PostOrderTypeTab({
  postOrderType,
  setPostOrderType,
  customerProfile,
  canteen_id,
  canteen_name,
}: {
  postOrderType: PostOrderType;
  setPostOrderType: (type: PostOrderType) => void;
  customerProfile: NonNullable<Awaited<ReturnType<typeof getCustomerProfile>>>;
  canteen_id: number;
  canteen_name: string;
}) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="font-semibold mb-2">Pilih Jenis Order</h1>

        <IconExclamationCircle className="w-4 h-4 text-muted-foreground" />
      </div>

      <Tabs
        defaultValue={postOrderType}
        value={postOrderType}
        onValueChange={(value) => setPostOrderType(value as PostOrderType)}
        className=""
      >
        <TabsList>
          <TabsTrigger value="DELIVERY_TO_TABLE">
            <HandPlatter />
            Makan Di Meja
          </TabsTrigger>
          <TabsTrigger value="TAKEAWAY">
            <IconRun />
            Take Away
          </TabsTrigger>
        </TabsList>
        <TabsContent value="DELIVERY_TO_TABLE">
          <Card>
            <CardContent>
              {customerProfile.floor && customerProfile.table_number ? (
                <div className="flex flex-col w-full items-center gap-4">
                  <CustomerPositionBreadcrumb
                    canteen_name={canteen_name}
                    floor={customerProfile.floor}
                    table_number={customerProfile.table_number}
                  />

                  <NavigationButton
                    url={`/dashboard-pelanggan/kantin/${canteen_id}/pilih-meja`}
                    size="lg"
                  >
                    Pilih Ulang
                  </NavigationButton>
                </div>
              ) : (
                <>
                  <h1 className="font-semibold mb-2">
                    Pesanan diantarkan ke meja kamu
                  </h1>
                  <h1 className="text-sm text-muted-foreground">
                    Belum memilih nomor meja, scan QR Code di meja anda atau{" "}
                    <Link
                      href={`/dashboard-pelanggan/kantin/${canteen_id}/pilih-meja`}
                      className="underline text-blue-600"
                    >
                      Klik disini untuk pilih meja
                    </Link>
                  </h1>
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="TAKEAWAY">
          <Card>
            <CardContent>
              <h1 className="font-semibold mb-2">Ambil pesanan di kedai</h1>
              <h1 className="text-sm text-muted-foreground">
                Opsi jika kedai sedang sibuk dan tidak sempat mengantarkan
                pesanan
              </h1>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
