import NotFoundResource from "@/app/_components/not-found-resource";
import { getShopConversations, getShopOwner } from "../../server-queries";
import ShopConversationList from "./shop-conversation-list";

export default async function ShopConversationPage({
  params,
}: {
  params: Promise<{ shop_id: string }>;
}) {
  const { shop_id } = await params;

  const shopOwner = await getShopOwner(shop_id);

  if (!shopOwner) {
    return <NotFoundResource />;
  }

  const conversations = await getShopConversations(shopOwner.owner_id);

  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Percakapan Pemilik Kedai</h1>

      {conversations.length === 0 && <div>Tidak ada percakapan ditemukan.</div>}

      <ShopConversationList
        shop_id={shop_id}
        shopOwner={shopOwner}
        conversations={conversations}
      />
    </div>
  );
}
