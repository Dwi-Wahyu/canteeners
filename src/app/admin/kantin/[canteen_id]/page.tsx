import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Store } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

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

  const canteen = await prisma.canteen.findFirst({
    where: {
      id: parsedCanteenId,
    },
    include: {
      shops: {
        select: {
          name: true,
          id: true,
          image_url: true,
          owner: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!canteen) {
    return <NotFoundResource />;
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div className="container">
      <Suspense
        fallback={
          <div>
            <h1>Loading . . .</h1>
          </div>
        }
      >
        <Card className="mx-auto max-w-2xl">
          <CardContent>
            <h1 className="text-xl font-bold mb-3">{canteen.name}</h1>

            <img
              src={"/uploads/canteens/" + canteen.image_url}
              alt=""
              className="w-full rounded-lg"
            />

            <div className="mt-7 mb-3 flex justify-between items-center">
              <h1 className="text-lg font-semibold">Daftar Warung</h1>

              <NavigationButton
                url={`/admin/kantin/${canteen.id}/input-warung/`}
                size="sm"
              >
                <Store />
                Input Warung
              </NavigationButton>
            </div>

            {canteen.shops.length > 0 ? (
              <div className="grid grid-cols-3 gap-4">
                {canteen.shops.map((shop, idx) => (
                  <Link href={"/admin/kantin/edit-warung/" + shop.id} key={idx}>
                    <img src={shop.image_url} className="rounded-lg" alt="" />
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
      </Suspense>
    </div>
  );
}
