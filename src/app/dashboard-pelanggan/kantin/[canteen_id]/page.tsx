import NotFoundResource from "@/app/_components/not-found-resource";
import CanteenPageClient from "./canteen-page-client";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

import { Button } from "@/components/ui/button";
import { IconMap } from "@tabler/icons-react";
import Link from "next/link";
import { NavigationButton } from "@/app/_components/navigation-button";

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
