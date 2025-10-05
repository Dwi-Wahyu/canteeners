import { prisma } from "@/lib/prisma";
import ShopProductList from "./shop-product-list";
import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import Link from "next/link";
import { IconChevronLeft } from "@tabler/icons-react";

export default async function ShopDetailsPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const session = await auth();

  const shop = await prisma.shop.findFirst({
    where: {
      id: shop_id,
    },
  });

  const isLoggedIn =
    (session && new Date(session.expires) > new Date()) || false;

  if (!shop) {
    return <NotFoundResource title="Warung Tidak Ditemukan" />;
  }

  return (
    <div className="p-5">
      <div className="md:hidden mb-2">
        <Link
          href={"/kantin/" + shop.canteen_id}
          className="flex gap-2 items-center text-sm text-muted-foreground"
        >
          <IconChevronLeft className="w-4 h-4 mb-1" />
          Kembali
        </Link>
      </div>

      <ShopProductList
        shop={shop}
        isLoggedIn={isLoggedIn}
        customerId={session?.user.id}
      />
    </div>
  );
}
