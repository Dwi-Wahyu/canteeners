import InputProductForm from "./input-product-form";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import NotFoundResource from "@/app/_components/not-found-resource";
import BackButton from "@/app/_components/back-button";

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

  return (
    <div>
      <BackButton url="/dashboard-kedai/produk" />

      <h1 className="text-lg font-semibold mt-2">Input Produk</h1>

      <div className="mt-4">
        <InputProductForm shop_id={shop_owned.id} />
      </div>
    </div>
  );
}
