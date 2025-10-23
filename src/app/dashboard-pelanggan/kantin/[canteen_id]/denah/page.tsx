import BackButton from "@/app/_components/back-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { prisma } from "@/lib/prisma";
import { IconDownload, IconMapOff } from "@tabler/icons-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

import DenahCard from "./denah-card";

export default async function CanteenMapPage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await prisma.canteen.findFirst({
    where: {
      id: parseInt(canteen_id),
    },
    select: {
      name: true,
      maps: {
        select: {
          _count: {
            select: {
              qrcodes: true,
            },
          },
          floor: true,
          image_url: true,
        },
      },
    },
  });

  if (!canteen) {
    return <NotFoundResource />;
  }

  return (
    <div>
      <BackButton />

      <h1 className="text-lg font-semibold mb-4">Denah {canteen.name}</h1>

      {canteen.maps.length === 0 && (
        <Empty className="border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconMapOff />
            </EmptyMedia>
            <EmptyTitle>Belum Ada Denah</EmptyTitle>
            <EmptyDescription>
              Denah kantin akan tersedia secepatnya
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}

      {canteen.maps.length > 0 && (
        <div className="flex flex-col gap-4">
          {canteen.maps.map((map) => (
            <DenahCard
              key={map.floor}
              floor={map.floor}
              image_url={map.image_url}
              table_count={map._count.qrcodes}
            />
          ))}
        </div>
      )}
    </div>
  );
}
