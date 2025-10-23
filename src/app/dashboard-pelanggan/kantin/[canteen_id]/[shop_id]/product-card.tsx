import { PaymentMethod, Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useKeranjang, useKeranjangActions } from "@/store/use-keranjang-store";
import {
  IconCheck,
  IconMinus,
  IconPlus,
  IconShoppingCartPlus,
} from "@tabler/icons-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function ProductCard({
  product,
  shopId,
  ownerId,
  shopName,
  availablePaymentMethod,
}: {
  product: Product;
  shopId: string;
  ownerId: string;
  shopName: string;
  availablePaymentMethod: PaymentMethod[];
}) {
  const [qty, setQty] = useState(1);

  const keranjang = useKeranjang();
  const { addKedai, addItem } = useKeranjangActions();

  useEffect(() => {
    if (qty < 0) {
      setQty(0);
    }
  }, [qty]);

  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    setAdded(true);

    if (qty === 0) return;

    if (!keranjang[shopId]) {
      addKedai(shopId, shopName, availablePaymentMethod, ownerId);
    }

    addItem(shopId, {
      productId: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
      quantity: qty,
    });

    toast.success(`Menambahkan ${product.name} x${qty} ke keranjang`);
  };

  return (
    <Card className="h-fit">
      <CardContent className="flex gap-4">
        <Image
          src={"/uploads/product/" + product.image_url}
          alt="product image"
          className="rounded-md object-cover"
          width={100}
          height={100}
        />

        <div>
          <div className="mb-5">
            <h1 className="font-semibold mb-3">{product.name}</h1>

            {/* <p className="text-muted-foreground text-sm">
              {product.description}
            </p> */}

            <h1 className="text-muted-foreground">Rp {product.price}</h1>
          </div>

          <Button
            disabled={qty === 0}
            onClick={handleAddToCart}
            variant={added ? "default" : "outline"}
          >
            {added ? "Berhasil" : "Tambah"}
          </Button>
        </div>

        {/* <div className="flex items-center gap-2 mt-3">
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
            variant={added ? "default" : "outline"}
          >
            {added ? <IconCheck /> : <IconShoppingCartPlus />}
          </Button>
        </div> */}
      </CardContent>
    </Card>
  );
}
