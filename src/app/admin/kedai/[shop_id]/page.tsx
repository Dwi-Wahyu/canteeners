import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import {
  paymentMethodIconMapping,
  paymentMethodMapping,
} from "@/constant/payment-method";
import { prisma } from "@/lib/prisma";
import {
  IconBan,
  IconCash,
  IconCashPlus,
  IconList,
  IconMessage,
  IconPencil,
} from "@tabler/icons-react";

export default async function ShopDetails({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const shop = await prisma.shop.findFirst({
    where: {
      id: shop_id,
    },
    include: {
      _count: {
        select: {
          orders: true,
          shop_carts: {
            where: {
              status: "PENDING",
            },
          },
          products: true,
        },
      },
      payments: true,
      owner: {
        select: {
          name: true,
          avatar: true,
        },
      },
    },
  });

  if (!shop) {
    return <NotFoundResource />;
  }

  return (
    <Card className="">
      <CardContent>
        <div>
          <h1 className="font-semibold text-xl">{shop.name}</h1>
          <p className="text-muted-foreground mb-2">{shop.description}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
          <img
            src={"/uploads/shop/" + shop.image_url}
            alt=""
            className="w-full rounded-lg"
          />

          <div className="gap-4">
            <NavigationButton url={`/admin/kedai/${shop.id}/percakapan`}>
              <IconMessage /> Lihat Percakapan
            </NavigationButton>

            <NavigationButton url={`/admin/kedai/${shop.id}/edit`}>
              <IconList />
              Daftar Produk
            </NavigationButton>

            <NavigationButton url={`/admin/kedai/${shop.id}/metode-pembayaran`}>
              <IconCashPlus />
              Input Metode Pembayaran
            </NavigationButton>

            <NavigationButton url={`/admin/kedai/${shop.id}/edit`}>
              <IconPencil />
              Edit Data
            </NavigationButton>

            <NavigationButton url={`/admin/kedai/${shop.id}/edit`}>
              <IconCash />
              Riwayat Order dan Tagihan
            </NavigationButton>

            <NavigationButton url={`/admin/kedai/${shop.id}/edit`}>
              <IconBan />
              Suspend Kedai
            </NavigationButton>
          </div>
        </div>

        <div className="grid grid-cols-2 mt-4 gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="font-semibold mb-1">Informasi Kedai</h1>

            <div>
              <h1 className="font-medium">Pemilik</h1>
              <h1 className="text-muted-foreground">{shop.owner.name}</h1>
            </div>

            <div>
              <h1 className="font-medium">Jumlah Produk</h1>
              <h1 className="text-muted-foreground">{shop._count.products}</h1>
            </div>

            <div>
              <h1 className="font-medium">Jumlah Order</h1>
              <h1 className="text-muted-foreground">{shop._count.orders}</h1>
            </div>

            <div>
              <h1 className="font-medium">Jumlah Keranjang Customer</h1>
              <h1 className="text-muted-foreground">
                {shop._count.shop_carts}
              </h1>
            </div>
          </div>

          <div>
            <h1 className="font-semibold mb-2">Metode Pembayaran Tersedia</h1>

            {shop.payments.map((payment) => (
              <div
                key={payment.id}
                className="p-4 border rounded-lg flex flex-col gap-3 mt-2"
              >
                <div className="flex gap-1 items-center">
                  {paymentMethodIconMapping[payment.method]}
                  <h1 className="font-semibold">
                    {paymentMethodMapping[payment.method]}
                  </h1>
                </div>

                {payment.method === "QRIS" && (
                  <img
                    className="max-w-52"
                    src={`/uploads/shop-qrcode/${payment.qr_url}`}
                  />
                )}

                {payment.method === "BANK_TRANSFER" && (
                  <div>
                    <h1>Nomor Rekening</h1>

                    <h1 className="text-muted-foreground">
                      {payment.account_number}
                    </h1>
                  </div>
                )}

                {payment.note && (
                  <div>
                    <h1>Catatan</h1>
                    <h1 className="text-muted-foreground">{payment.note}</h1>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
