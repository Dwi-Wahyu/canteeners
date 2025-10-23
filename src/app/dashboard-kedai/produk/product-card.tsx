import { Product } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
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
    mutationFn: async (newStatus: boolean) => {
      return await ToggleProductAvailable(product.id, newStatus);
    },
    onSuccess: (data) => {
      setIsAvailable((prev) => !prev);
      toast.success("Status produk berhasil diperbarui!");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Gagal memperbarui status produk");
    },
  });

  const handleToggle = () => {
    const newStatus = !isAvailable;
    mutation.mutate(newStatus);
  };

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
            <h1 className="font-semibold text-primary">Rp {product.price}</h1>
          </div>
        </div>
      </div>
      <CardFooter className="gap-3 flex justify-end items-center border-t pt-3">
        <Button
          onClick={handleToggle}
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
