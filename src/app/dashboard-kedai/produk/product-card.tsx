import { Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";
import { ToggleProductAvailable } from "./actions";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";

export default function ProductCard({ product }: { product: Product }) {
  const [isAvailable, setIsAvailable] = useState(product.is_available);

  const mutation = useMutation({
    mutationFn: async () => {
      return await ToggleProductAvailable(product.id);
    },
    onSuccess: (data) => {
      if (data.success) {
        setIsAvailable((prev) => !prev);
        toast.success("Status produk berhasil diperbarui!");
      } else {
        console.log(data.error.message);
        toast.error(data.error.message);
      }
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui status produk");
    },
  });

  return (
    <Card className="max-w-xl">
      <div className="flex p-4 py-0">
        <div className="w-1/3 pr-4">
          <img
            src={"/uploads/product/" + product.image_url}
            alt="Product Image"
            className="aspect-square w-full rounded-md object-cover"
          />
        </div>

        <div className="w-2/3">
          <div className="p-0 mb-2">
            <CardTitle>{product.name}</CardTitle>
            <CardDescription>{product.description}</CardDescription>{" "}
          </div>
          <div className="p-0">
            <div className="flex justify-between items-center">
              <h1>Harga Jual</h1>

              <h1 className="text-muted-foreground">Rp {product.price}</h1>
            </div>
            <div className="flex justify-between items-center">
              <h1>Harga Modal</h1>

              {!product.cost ? (
                <h1 className="text-muted-foreground">N/A</h1>
              ) : (
                <h1 className="text-muted-foreground">Rp {product.cost}</h1>
              )}
            </div>

            <div className="flex justify-between items-center">
              <h1>Margin</h1>

              {!product.cost ? (
                <h1 className="text-muted-foreground">N/A</h1>
              ) : (
                <h1 className="text-primary font-semibold">
                  Rp {product.price - product.cost}
                </h1>
              )}
            </div>
          </div>
        </div>
      </div>
      <CardFooter className="gap-3 flex justify-end items-center border-t pt-3">
        <Button
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          variant={isAvailable ? "default" : "destructive"}
        >
          {mutation.isPending
            ? "Mengubah Status..."
            : isAvailable
            ? "Produk Tersedia"
            : "Produk Tidak Tersedia"}
        </Button>

        <Button asChild variant={"outline"} size={"icon"}>
          <Link href={"/dashboard-kedai/produk/" + product.id}>
            <Edit className="w-4 h-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
