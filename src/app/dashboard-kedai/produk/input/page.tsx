import InputProductForm from "./input-product-form";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import NotFoundResource from "@/app/_components/not-found-resource";
import BackButton from "@/app/_components/back-button";
import { getCategories } from "@/app/admin/kategori/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function InputProductPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const shop_owned = await prisma.shop.findFirst({
    where: {
      owner_id: session.user.id,
    },
  });

  if (!shop_owned) {
    return <NotFoundResource />;
  }

  const categories = await getCategories();

  return (
    <div>
      <BackButton url="/dashboard-kedai/produk" />

      <div className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Input Produk</CardTitle>
          </CardHeader>
          <CardContent>
            <InputProductForm shop_id={shop_owned.id} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
