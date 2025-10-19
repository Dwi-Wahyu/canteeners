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

export default function ProductCard({ product }: { product: Product }) {
  const [isAvailable, setIsAvailable] = useState(product.is_available);

  // 🧠 Gunakan mutationFn dengan parameter (mutation variable)
  const mutation = useMutation({
    mutationFn: async (newStatus: boolean) => {
      return await ToggleProductAvailable(product.id, newStatus);
    },
    onSuccess: (data) => {
      // update UI setelah sukses
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
      </CardHeader>
      <CardFooter className="gap-3 flex justify-center items-center">
        <Button
          onClick={handleToggle}
          disabled={mutation.isPending}
          variant={isAvailable ? "default" : "destructive"}
        >
          {mutation.isPending
            ? "Memproses..."
            : isAvailable
            ? "Produk Tersedia"
            : "Produk Tidak Tersedia"}
        </Button>

        <Button variant={"outline"}>Edit Produk</Button>
      </CardFooter>
    </Card>
  );
}
