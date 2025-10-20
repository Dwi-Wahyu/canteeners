import NotFoundResource from "@/app/_components/not-found-resource";
import { prisma } from "@/lib/prisma";
import EditProductForm from "./edit-product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/app/_components/back-button";
import { getCategories } from "@/app/admin/kategori/queries";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return <NotFoundResource />;
  }

  const product = await prisma.product.findFirst({
    where: {
      id: parsedId,
    },
    include: {
      options: true,
    },
  });

  if (!product) {
    return <NotFoundResource />;
  }

  const categories = await getCategories();

  return (
    <>
      <BackButton url="/dashboard-kedai/produk" />

      <Card>
        <CardHeader>
          <CardTitle>Edit Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm initialData={product} categories={categories} />
        </CardContent>
      </Card>
    </>
  );
}
