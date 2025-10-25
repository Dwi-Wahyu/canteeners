import NotFoundResource from "@/app/_components/not-found-resource";
import { getCanteenMap, getCanteenWithAllRelations } from "../../../queries";
import QrcodeMejaClient from "./qrcode-meja-client";
import { headers } from "next/headers";

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

  const headersList = await headers();
  const host = headersList.get("host");
  const protocol = headersList.get("x-forwarded-proto") || "http";
  const currentUrl = `${protocol}://${host}`;

  return (
    <>
      <h1>{currentUrl}</h1>
      <QrcodeMejaClient map={map} baseUrl={currentUrl} />
    </>
  );
}
