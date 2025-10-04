import NotFoundResource from "@/app/_components/not-found-resource";
import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { IconChevronLeft } from "@tabler/icons-react";
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
      <div className="md:hidden mb-4">
        <Link
          href={"/dashboard-pelanggan"}
          className="flex gap-2 items-center text-sm text-muted-foreground"
        >
          <IconChevronLeft className="w-4 h-4 mb-1" />
          Kembali
        </Link>
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="relative">
          <img
            src={"/uploads/canteens/" + canteen.image_url}
            alt=""
            className="w-full rounded-xl z-10 object-cover"
          />
          <div className="w-full h-full bg-gradient-to-t flex justify-center items-center rounded-xl absolute left-0 top-0 z-20 bg-black/50">
            <h1 className="font-bold text-2xl text-center mb-5 text-background">
              {canteen.name}
            </h1>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 mt-4">
          {canteen.shops.map((shop, idx) => (
            <Link href={`/kantin/${canteen.id}/${shop.id}`} key={shop.id}>
              <Card className="group">
                <CardContent>
                  <h1 className="font-semibold text-lg">{shop.name}</h1>
                  <p className="text-muted-foreground mb-3 line-clamp-2 text-sm">
                    {shop.description}
                  </p>

                  <div className="w-full rounded-lg overflow-hidden">
                    <img
                      src={shop.image_url}
                      alt=""
                      className="w-full rounded-lg group-hover:scale-105 ease-in-out transition-all duration-300"
                    />
                  </div>

                  <div className="flex flex-col my-3 gap-2">
                    {shop.products.map((product) => (
                      <div key={product.id} className="flex items-center gap-2">
                        <img
                          src={product.image_url}
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

                  <div className="flex justify-center">
                    <Link
                      className="text-blue-500 group-hover:underline group-hover:underline-offset-2 text-center"
                      href={`/admin/kantin/${parsedCanteenId}/${shop.id}`}
                    >
                      Lihat Menu Lengkap
                    </Link>
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
