import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import EditCategoryForm from "./edit-category-form";
import NotFoundResource from "@/app/_components/not-found-resource";
import { prisma } from "@/lib/prisma";

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const parsedId = parseInt(id);

  if (isNaN(parsedId)) {
    return <NotFoundResource />;
  }

  const category = await prisma.category.findFirst({
    where: {
      id: parsedId,
    },
  });

  if (!category) {
    return <NotFoundResource />;
  }

  return (
    <Card className="container mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Edit Kategori</CardTitle>
      </CardHeader>
      <CardContent>
        <EditCategoryForm initialData={category} />
      </CardContent>
    </Card>
  );
}
