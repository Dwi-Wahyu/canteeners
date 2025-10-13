import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { IconCashPlus, IconPencil } from "@tabler/icons-react";

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
      payments: true,
    },
  });

  if (!shop) {
    return <NotFoundResource />;
  }

  return (
    <Card className="container max-w-2xl mx-auto">
      <CardContent>
        <h1 className="font-semibold text-center text-xl">{shop.name}</h1>
        <p className="text-muted-foreground text-center mb-2">
          {shop.description}
        </p>

        <div className="my-4">
          <h1 className="font-semibold mb-1">Metode Pembayaran</h1>

          {shop.payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 border rounded-lg flex flex-col gap-2 mt-2"
            >
              <div>
                <h1>Metode</h1>
                <h1 className="text-muted-foreground">{payment.method}</h1>
              </div>

              {payment.method === "QRIS" && (
                <img
                  className="max-w-52"
                  src={`/uploads/shop-qrcode/${payment.qr_url}`}
                />
              )}

              {payment.method === "BANK_TRANSFER" && (
                <h1>{payment.account_number}</h1>
              )}

              <div>
                <h1>Catatan</h1>
                <h1 className="text-muted-foreground">{payment.note ?? "-"}</h1>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-4 flex-col md:flex-row">
          <NavigationButton url={`/admin/kedai`} />

          <NavigationButton url={`/admin/kedai/${shop.id}/metode-pembayaran`}>
            <IconCashPlus />
            Input Metode Pembayaran
          </NavigationButton>

          <NavigationButton url={`/admin/kedai/${shop.id}/edit`}>
            <IconPencil />
            Edit
          </NavigationButton>
        </div>
      </CardContent>
    </Card>
  );
}
