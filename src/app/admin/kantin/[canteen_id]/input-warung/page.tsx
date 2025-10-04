import NotFoundResource from "@/app/_components/not-found-resource";
import { Skeleton } from "@/components/ui/skeleton";
import { prisma } from "@/lib/prisma";
import { Suspense } from "react";
import InputWarungForm from "./input-warung-form";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function InputWarungPage({
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
  });

  if (!canteen) {
    return <NotFoundResource />;
  }

  const shopOwners = await prisma.user.findMany({
    where: {
      role: "SHOP_OWNER",
    },
  });

  return (
    <Suspense fallback={<LoadingForm />}>
      <div className="container">
        <Card className="max-w-xl mx-auto">
          <CardHeader>
            <h1 className="text-lg font-semibold leading-tight">
              Input Warung
            </h1>
            <h1 className="text-sm text-muted-foreground leading-tight">
              {canteen.name}
            </h1>
          </CardHeader>
          <CardContent>
            <InputWarungForm canteen={canteen} shopOwners={shopOwners} />
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

function LoadingForm() {
  return (
    <div className="container">
      <Skeleton className="max-w-xl mx-auto" />
    </div>
  );
}
