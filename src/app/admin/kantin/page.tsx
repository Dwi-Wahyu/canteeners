import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Suspense } from "react";

export default async function KantinPage() {
  const canteens = await prisma.canteen.findMany();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL;

  return (
    <div>
      <Suspense
        fallback={
          <div className="grid grid-cols-1 md:grid-cols-3">
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
            <Skeleton className="w-full h-40" />
          </div>
        }
      >
        <div className="grid grid-cols-3 gap-4">
          {canteens.map((canteen, idx) => (
            <Link href={"/admin/kantin/" + canteen.id} key={idx}>
              <Card>
                <CardContent>
                  <img
                    src={appUrl + "/uploads/canteen/" + canteen.image_url}
                    alt=""
                    className="rounded-lg"
                  />

                  <h1 className="text-center font-semibold mt-4">
                    {canteen.name}
                  </h1>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </Suspense>
    </div>
  );
}
