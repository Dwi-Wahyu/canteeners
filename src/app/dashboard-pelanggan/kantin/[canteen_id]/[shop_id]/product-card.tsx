import { addCartItem } from "@/app/dashboard-pelanggan/keranjang/actions";
import { Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconLoader } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductCard({
  product,
  customer_id,
}: {
  product: Product;
  customer_id: string;
}) {
  const mutations = useMutation({
    mutationKey: ["add-product-to-cart"],
    mutationFn: async () => {
      return await addCartItem({ product, customer_id });
    },
  });

  const [added, setAdded] = useState(false);

  const handleAddToCart = async () => {
    setAdded(true);

    const result = await mutations.mutateAsync();

    if (result.success) {
      toast.success(`Menambahkan ${product.name} ke keranjang`);
    } else {
      toast.error(result.error.message);
    }
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
            disabled={mutations.isPending || added}
            onClick={handleAddToCart}
            variant={added ? "default" : "outline"}
          >
            {mutations.isPending ? (
              <IconLoader className="animate-spin" />
            ) : (
              <div>{added ? "Berhasil" : "Tambah"}</div>
            )}
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
