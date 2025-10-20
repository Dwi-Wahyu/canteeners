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

  // Fungsi untuk toggle
  const handleToggle = () => {
    const newStatus = !isAvailable;
    mutation.mutate(newStatus);
  };

  return (
    <Card className="max-w-md pt-0">
      <CardContent className="px-0">
        <img
          src={"/uploads/product/" + product.image_url}
          alt="Banner"
          className="aspect-video h-80 rounded-t-xl object-cover"
        />
      </CardContent>
      <CardHeader>
        <CardTitle>{product.name}</CardTitle>
        <CardDescription>{product.description}</CardDescription>
        <h1 className="text-muted-foreground">Rp {product.price}</h1>
      </CardHeader>
      <CardFooter className="gap-3 flex justify-end items-center">
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
            <Edit />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
