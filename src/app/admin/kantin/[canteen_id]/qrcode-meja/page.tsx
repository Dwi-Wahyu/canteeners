import NotFoundResource from "@/app/_components/not-found-resource";
import { getCanteenWithAllRelations } from "../../queries";
import QrcodeMejaClient from "./qrcode-meja-client";

export default async function QrcodeMeja({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await getCanteenWithAllRelations(parseInt(canteen_id));

  if (!canteen) {
    return <NotFoundResource />;
  }

  return <QrcodeMejaClient data={canteen} />;
}
