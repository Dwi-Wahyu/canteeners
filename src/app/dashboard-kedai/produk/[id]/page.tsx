import NotFoundResource from "@/app/_components/not-found-resource";
import EditProductForm from "./edit-product-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCategories } from "@/app/admin/kategori/queries";
import { getProductIncludeCategory } from "../queries";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

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
      <TopbarWithBackButton
        title="Edit Produk"
        backUrl="/dashboard-kedai/produk"
      />

      <Card>
        <CardContent>
          <EditProductForm initialData={product} categories={categories} />
        </CardContent>
      </Card>
    </div>
  );
}
