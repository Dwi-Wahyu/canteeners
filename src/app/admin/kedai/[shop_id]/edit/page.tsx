import NotFoundResource from "@/app/_components/not-found-resource";
import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getShopDataWithPayment } from "../../queries";
import LoadingForm from "@/app/_components/loading-form";
import EditShopForm from "./edit-shop-form";

export default async function EditShopPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const initialData = await getShopDataWithPayment(shop_id);

  if (!initialData) {
    return <NotFoundResource />;
  }

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className="container">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <h1 className="text-lg font-semibold leading-tight">Edit Kedai</h1>
          </CardHeader>
          <CardContent>
            <EditShopForm initialData={initialData} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}
