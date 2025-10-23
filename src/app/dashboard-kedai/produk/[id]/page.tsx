import NotFoundResource from "@/app/_components/not-found-resource";
import EditProductForm from "./edit-product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import BackButton from "@/app/_components/back-button";
import { getCategories } from "@/app/admin/kategori/queries";
import { getProductIncludeCategory } from "../queries";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const product = await getProductIncludeCategory(id);

  if (!product) {
    return <NotFoundResource />;
  }

  const categories = await getCategories();

  return (
    <div>
      <BackButton url="/dashboard-kedai/produk" />

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Edit Produk</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProductForm initialData={product} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
