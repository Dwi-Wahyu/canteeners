import NotFoundResource from "@/app/_components/not-found-resource";
import { getCanteenMap, getCanteenWithAllRelations } from "../../../queries";
import QrcodeMejaClient from "./qrcode-meja-client";

export default async function QrcodeMeja({
  params,
}: {
  params: Promise<{ map_id: string }>;
}) {
  const { map_id } = await params;

  const map = await getCanteenMap(parseInt(map_id));

  if (!map) {
    return <NotFoundResource />;
  }

  return <QrcodeMejaClient map={map} />;
}
