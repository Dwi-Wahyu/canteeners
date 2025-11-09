import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import ShopDashboardTestimonyClient from "./shop-dashboard-testimony-client";
import { getShopRatings } from "../server-queries";
import NotFoundResource from "@/app/_components/not-found-resource";

export default async function CustomerReviewsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const shopRatings = await getShopRatings(session.user.id);

  if (!shopRatings) {
    return <NotFoundResource />;
  }

  return (
    <div>
      <TopbarWithBackButton title="Ulasan Pelanggan" />

      <ShopDashboardTestimonyClient
        owner_id={session.user.id}
        shopRatings={shopRatings}
      />
    </div>
  );
}
