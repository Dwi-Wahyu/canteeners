import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { ShoppingBag } from "lucide-react";

export default async function DetailKantinPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const canteenId = parseInt(id);

  if (isNaN(canteenId)) {
    return <NotFoundResource />;
  }

  const canteen = await prisma.canteen.findFirst({
    where: {
      id: canteenId,
    },
    include: {
      shops: {
        select: {
          name: true,
          id: true,
          image_url: true,
          description: true,
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

  return (
    <div className="relative">
      <img
        src={"/uploads/canteens/" + canteen.image_url}
        alt=""
        className="w-full absolute left-0 top-0 z-10 h-96 object-cover"
      />
      <div className="w-full h-96 bg-gradient-to-t absolute left-0 top-0 z-20 from-background to-transparent"></div>
      <div className="container w-full relative z-30 p-4">
        <div className="mx-auto max-w-5xl">
          <h1 className="font-bold text-xl text-center mb-4 text-background">
            {canteen.name}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
            {canteen.shops.map((shop, idx) => (
              <Card key={idx}>
                <CardContent>
                  <h1>{shop.name}</h1>
                  <p className="text-muted-foreground mb-2 line-clamp-2 text-sm">
                    {shop.description}
                  </p>
                  <img
                    src={shop.image_url}
                    alt=""
                    className="w-full rounded-lg"
                  />

                  <div></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
