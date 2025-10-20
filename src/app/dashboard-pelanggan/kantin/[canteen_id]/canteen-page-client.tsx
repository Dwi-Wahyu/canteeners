"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { getCanteenById } from "../queries";
import { useQuery } from "@tanstack/react-query";
import BackButton from "@/app/_components/back-button";

export default function CanteenPageClient({ id }: { id: number }) {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["canteen", id],
    queryFn: async function () {
      return await getCanteenById(id);
    },
  });

  return (
    <div className="container mx-auto max-w-5xl w-full">
      <div className="mb-4 flex justify-between items-center">
        <BackButton />

        <Button size="icon">
          <Link href={"/dashboard-pelanggan/keranjang"}>
            <ShoppingBasket />
          </Link>
        </Button>
      </div>

      {isLoading && <div>loading . . .</div>}

      {!isLoading && isError && <div>error</div>}

      {!isLoading && !isError && !data && <div>kantin tidak ditemukan</div>}

      {!isLoading && !isError && data && (
        <>
          <div className="text-center w-full">
            <h1 className="font-semibold text-xl">{data.name}</h1>
            <h1 className="text-muted-foreground text-lg">
              Pilih kedai yang tersedia
            </h1>
          </div>

          <Card className="max-w-lg py-0 sm:flex-row sm:gap-0">
            <CardContent className="grow-1 px-0">
              <img
                src="https://cdn.shadcnstudio.com/ss-assets/components/card/image-3.png"
                alt="Banner"
                className="size-full rounded-l-xl"
              />
            </CardContent>
            <div className="sm:min-w-54">
              <CardHeader className="pt-6">
                <CardTitle>Dreamy Colorwave Gradient</CardTitle>
                <CardDescription>
                  A smooth blend of vibrant pinks, purples, and blues for a
                  magical touch.
                </CardDescription>
              </CardHeader>
              <CardFooter className="gap-3 py-6">
                <Button className="bg-transparent bg-gradient-to-br from-purple-500 to-pink-500 text-white focus-visible:ring-pink-600/20">
                  Explore More
                </Button>
              </CardFooter>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 mt-4 gap-4">
            {data.shops.map((shop) => (
              <Link
                className="group"
                href={`/dashboard-pelanggan/kantin/${data.id}/${shop.id}`}
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
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
