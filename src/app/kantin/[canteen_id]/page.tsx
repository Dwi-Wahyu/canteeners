import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  IconChevronLeft,
  IconMessageCircleUser,
  IconStar,
  IconStarFilled,
} from "@tabler/icons-react";
import Link from "next/link";

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
          description: true,
          average_rating: true,
          total_ratings: true,
          products: {
            take: 3,
          },
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
    <div className="container w-full p-5">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4">
          <Link
            href={"/"}
            className="flex gap-2 items-center text-sm text-muted-foreground"
          >
            <IconChevronLeft className="w-4 h-4 mb-1" />
            Kembali
          </Link>
        </div>

        <div className="text-center w-full">
          <h1 className="font-semibold text-xl">{canteen.name}</h1>
          <h1 className="text-muted-foreground text-lg">
            Pilih warung yang tersedia
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          {canteen.shops.map((shop) => (
            <Link
              className="group"
              href={`/kantin/${canteen.id}/${shop.id}`}
              key={shop.id}
            >
              <Card>
                <CardContent>
                  <h1 className="font-semibold text-lg">{shop.name}</h1>
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {shop.description}
                  </p>

                  <div className="w-full rounded-lg overflow-hidden">
                    <img
                      src={"/uploads/shop/" + shop.image_url}
                      alt=""
                      className="w-full rounded-lg group-hover:scale-105 ease-in-out transition-all duration-300"
                    />
                  </div>

                  <div className="flex flex-col my-3 gap-2">
                    {shop.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-2">
                        <img
                          src={"/uploads/product/" + product.image_url}
                          alt=""
                          className="w-14 h-14 rounded-lg object-cover"
                        />
                        <div>
                          <h1 className="font-semibold">{product.name}</h1>
                          <h1 className="text-muted-foreground">
                            Rp {product.price}
                          </h1>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end gap-4">
                    <div className="flex gap-1 items-center">
                      <IconStar />
                      <h1 className="font-semibold">{shop.average_rating}</h1>
                    </div>

                    <div className="flex gap-1 items-center">
                      <IconMessageCircleUser />
                      <h1 className="font-semibold">{shop.average_rating}</h1>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
