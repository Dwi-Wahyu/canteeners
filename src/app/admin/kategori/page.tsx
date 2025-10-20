import { prisma } from "@/lib/prisma";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { NavigationButton } from "@/app/_components/navigation-button";

export default async function CategoryPage() {
  const categories = await prisma.category.findMany();

  return (
    <div>
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <h1 className="text-lg font-semibold mb-4">Kategori Produk</h1>

        <NavigationButton
          url="/admin/kategori/input"
          variant="default"
          label="Tambahkan Kategori"
        />
      </div>

      {categories.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Trash />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Kategori</EmptyTitle>
            <EmptyDescription>Silakan tambahkan kategori</EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button asChild>
              <Link href={"/admin/kategori/input"}>Tambahkan Kategori</Link>
            </Button>
          </EmptyContent>
        </Empty>
      )}

      {categories.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              href={`/admin/kategori/${category.id}/edit`}
              key={category.id}
            >
              <Card>
                <CardContent>
                  <h1 className="text-center mb-4 font-semibold">
                    {category.name}
                  </h1>
                  <img src={"/uploads/category/" + category.image_url} alt="" />
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
