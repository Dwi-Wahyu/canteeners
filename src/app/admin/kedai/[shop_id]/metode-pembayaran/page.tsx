import LoadingForm from "@/app/_components/loading-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Suspense } from "react";
import InputPaymentForm from "./input-payment-form";
import { prisma } from "@/lib/prisma";
import NotFoundResource from "@/app/_components/not-found-resource";

export default async function InputShopPayment({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const shop = await prisma.shop.findFirst({
    where: {
      id: shop_id,
    },
  });

  if (!shop) {
    return <NotFoundResource />;
  }

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className="container">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <h1 className="text-lg font-semibold leading-tight">
              Input Metode Pembayaran
            </h1>
            <h1 className="text-muted-foreground leading-tight">{shop.name}</h1>
          </CardHeader>
          <CardContent>
            <InputPaymentForm shop_id={shop_id} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
