import TitleWithPrevButton from "../../title-with-prev-button";
import InputProductForm from "./input-product-form";
import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import NotFoundResource from "@/app/_components/not-found-resource";

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
      <TitleWithPrevButton title="Input Produk" />

      <div className="mt-4">
        <InputProductForm shop_id={shop_owned.id} />
      </div>
    </div>
  );
}
