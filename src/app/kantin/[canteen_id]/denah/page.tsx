import BackButton from "@/app/_components/back-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { prisma } from "@/lib/prisma";
import { IconMapOff } from "@tabler/icons-react";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import DenahCard from "@/app/dashboard-pelanggan/kantin/[canteen_id]/denah/denah-card";
import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

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
      <TopbarWithBackButton title={"Denah " + canteen.name} />

      <div className="p-5 pt-20">
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
    </div>
  );
}
