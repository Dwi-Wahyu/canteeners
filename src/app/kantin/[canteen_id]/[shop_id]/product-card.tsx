import { Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useRouter } from "nextjs-toploader/app";

export default function ProductCard({ product }: { product: Product }) {
  const [qty, setQty] = useState(0);

  useEffect(() => {
    if (qty < 0) {
      setQty(0);
    }
  }, [qty]);

  const router = useRouter();

  const handleAddToCart = () => {
    router.push("/dashboard-pelanggan");
  };

  return (
    <Card className="h-fit">
      <CardContent>
        <h1 className="font-semibold">{product.name}</h1>

        <img
          src={product.image_url}
          alt=""
          className="my-3 rounded-lg w-full"
        />

        <p className="text-muted-foreground mb-3 text-sm">
          {product.description}
        </p>

        <h1 className="text-end font-semibold">Rp {product.price}</h1>

        <div className="flex items-center gap-2 mt-3">
          <div className="grow flex items-center gap-2">
            <Button
              variant={"outline"}
              onClick={() => setQty((prev) => prev - 1)}
            >
              <IconMinus />
            </Button>
            <Input value={qty} className="text-center" disabled />
            <Button
              variant={"outline"}
              onClick={() => setQty((prev) => prev + 1)}
            >
              <IconPlus />
            </Button>
          </div>
          <Button
            disabled={qty === 0}
            onClick={handleAddToCart}
            variant={"outline"}
          >
            <IconShoppingCartPlus />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
