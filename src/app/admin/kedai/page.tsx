import { getShops } from "./server-queries";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { shopOrderModeMapping } from "@/constant/order-mode-mapping";
import { shopStatusMapping } from "@/constant/shop-status-mapping";

export default async function KedaiPage() {
  const data = await getShops();

  return (
    <div className="container max-w-7xl mx-auto">
      <h1 className="font-semibold text-lg mb-4">Daftar Kedai</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {data.map((kedai, idx) => (
          <Link key={idx} href={`/admin/kedai/${kedai.id}`}>
            <Card>
              <CardHeader>
                <CardTitle>{kedai.name}</CardTitle>
                <CardDescription>{kedai.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <img
                  src={"/uploads/shop/" + kedai.image_url}
                  className="rounded-lg w-full"
                  alt=""
                />

                <div className="flex gap-2 justify-center mt-4">
                  <Badge
                    variant={
                      kedai.status === "SUSPENDED" ? "destructive" : "default"
                    }
                  >
                    {shopStatusMapping[kedai.status]}
                  </Badge>
                  <Badge variant={"outline"}>
                    {shopOrderModeMapping[kedai.order_mode]}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
