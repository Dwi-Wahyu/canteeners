import NotFoundResource from "@/app/_components/not-found-resource";
import {
  getShopConversationDetails,
  getShopOwner,
} from "../../../server-queries";
import ShopConversationDetails from "./shop-conversation-details";
import BackButton from "@/app/_components/back-button";

export default async function ShopConversationDetailsPage({
  params,
}: {
  params: Promise<{ shop_id: string; conversation_id: string }>;
}) {
  const { conversation_id, shop_id } = await params;

  const shopOwner = await getShopOwner(shop_id);

  if (!shopOwner) {
    return <NotFoundResource />;
  }

  const details = await getShopConversationDetails(conversation_id);

  if (!details) {
    return <NotFoundResource />;
  }

  return (
    <div>
      <div className="flex mb-3 items-center">
        <BackButton />
        <h1 className="font-semibold text-lg">Detail Percakapan</h1>
      </div>

      <ShopConversationDetails
        details={details}
        owner_id={shopOwner.owner_id}
      />
    </div>
  );
}
