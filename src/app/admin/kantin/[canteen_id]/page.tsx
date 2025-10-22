import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Store } from "lucide-react";
import Link from "next/link";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconMap } from "@tabler/icons-react";
import { getCanteenWithAllRelations } from "../queries";

export default async function DetailKantinPage({
  params,
}: {
  params: Promise<{ canteen_id: string }>;
}) {
  const { canteen_id } = await params;

  const canteen = await getCanteenWithAllRelations(parseInt(canteen_id));

  if (!canteen) {
    return <NotFoundResource />;
  }

  return (
    <div className="flex flex-col gap-4">
      <Card>
        <CardContent>
          <h1 className="text-xl font-bold mb-4">{canteen.name}</h1>

          <div className="flex justify-center">
            <img
              src={"/uploads/canteen/" + canteen.image_url}
              alt=""
              className="rounded-lg md:w-xl w-full"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="flex justify-between mb-4 items-center">
            <h1 className="font-semibold">Denah Kantin</h1>

            <Button>Input Denah</Button>
          </div>

          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconMap />
              </EmptyMedia>
              <EmptyTitle>Belum Ada Data</EmptyTitle>
              <EmptyDescription>Ketuk tambah denah</EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button>Tambah denah</Button>
            </EmptyContent>
          </Empty>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <div className="mt-7 mb-3 flex justify-between items-center">
            <h1 className="text-lg font-semibold">Daftar Kedai</h1>

            <NavigationButton
              url={`/admin/kantin/${canteen.id}/input-kedai/`}
              size="sm"
            >
              <Store />
              Input Kedai
            </NavigationButton>
          </div>

          {canteen.shops.length > 0 ? (
            <div className="grid grid-cols-3 gap-4">
              {canteen.shops.map((shop, idx) => (
                <Link href={"/admin/kantin/kedai/" + shop.id} key={idx}>
                  <img
                    src={"/uploads/shop/" + shop.image_url}
                    className="rounded-lg"
                    alt=""
                  />
                  <h1 className="text-center font-semibold mt-1">
                    {shop.name}
                  </h1>
                </Link>
              ))}
            </div>
          ) : (
            <div className="flex gap-2 items-center justify-center h-20 w-full">
              <h1 className="text-muted-foreground">
                Belum Ada Warung Terdaftar
              </h1>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
