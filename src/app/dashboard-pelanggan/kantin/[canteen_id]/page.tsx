import NotFoundResource from "@/app/_components/not-found-resource";
import CanteenPageClient from "./canteen-page-client";

export default async function DetailKantinPage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const parsedCanteenId = parseInt(canteen_id);

  if (isNaN(parsedCanteenId)) {
    return <NotFoundResource />;
  }

  return <CanteenPageClient id={parsedCanteenId} />;
}
