import { Card, CardContent } from "@/components/ui/card";
import { getCustomerShopCart } from "../server-queries";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Ellipsis, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { IconTrash } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { changeCartItemDetails } from "../actions";
import { toast } from "sonner";

type CartItemType = NonNullable<
  Awaited<ReturnType<typeof getCustomerShopCart>>
>["items"][number];

export default function CartItemCard({
  cartItem,
  disabled,
}: {
  cartItem: CartItemType;
  disabled: boolean;
}) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [qty, setQty] = useState(cartItem.quantity);
  const [notes, setNotes] = useState(cartItem.notes || "");

  const mutation = useMutation({
    mutationFn: async ({
      quantity,
      notes,
    }: {
      quantity: number;
      notes: string;
    }) => {
      return await changeCartItemDetails({
        id: cartItem.id,
        quantity,
        notes,
      });
    },
    onSuccess: () => {
      toast.success("Perubahan keranjang berhasil disimpan.");
    },
    onError: (error) => {
      toast.success("Gagal menyimpan perubahan. Silakan coba lagi.");
    },
  });

  const handleDialogOpenChange = useCallback(
    (open: boolean) => {
      if (open) {
        setQty(cartItem.quantity);
        setNotes(cartItem.notes || "");
      }
      setIsDialogOpen(open);
    },
    [cartItem.quantity, cartItem.notes]
  );

  const changeQuantity = useCallback(
    (newQty: number) => {
      if (newQty >= 1) {
        setQty(newQty);
        mutation.mutate({ quantity: newQty, notes });
      }
    },
    [mutation, notes]
  );

  const handleSave = useCallback(() => {
    if (qty !== cartItem.quantity || notes.trim() !== (cartItem.notes || "")) {
      mutation.mutate({ quantity: qty, notes });
    }
    setIsDialogOpen(false);
  }, [qty, notes, cartItem.quantity, cartItem.notes, mutation]);

  return (
    <Card>
      <CardContent className="flex gap-4">
        <Image
          src={
            cartItem.product.image_url
              ? `/Uploads/product/${cartItem.product.image_url}`
              : "/placeholder-image.jpg"
          }
          alt={cartItem.product.name}
          width={100}
          height={100}
          className="rounded-lg object-cover"
          onError={(e) => (e.currentTarget.src = "/placeholder-image.jpg")} // Fallback jika gambar gagal dimuat
        />
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <h1 className="font-semibold">{cartItem.product.name}</h1>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <NotebookPen className="w-3 h-3 text-muted-foreground" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="hidden">Product Details</DialogTitle>
                  <DialogDescription className="hidden">
                    Product Details Description
                  </DialogDescription>

                  <div className="text-start flex flex-col gap-2">
                    <h1 className="text-center font-semibold">
                      {cartItem.product.name}
                    </h1>
                    <div>
                      <h1 className="text-sm text-muted-foreground mb-1">
                        Catatan
                      </h1>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Tambahkan catatan untuk produk ini..."
                        disabled={disabled}
                      />
                    </div>
                    <Button
                      onClick={handleSave}
                      className="mt-4"
                      disabled={mutation.isPending || disabled}
                    >
                      {mutation.isPending ? "Menyimpan..." : "Simpan"}
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <div className="mt-2">
            <h1 className="text-sm text-muted-foreground">
              Rp {cartItem.price_at_add * qty}
            </h1>
          </div>

          <div className="flex gap-4 mt-4 items-center">
            <div className="flex gap-2 items-center">
              <Button
                size="icon"
                onClick={() => changeQuantity(qty - 1)}
                disabled={qty <= 1 || mutation.isPending || disabled}
              >
                -
              </Button>
              <Input
                type="number"
                value={qty}
                onChange={(e) => changeQuantity(Number(e.target.value))}
                className="w-16 text-center"
                min={1}
              />
              <Button
                size="icon"
                onClick={() => changeQuantity(qty + 1)}
                disabled={mutation.isPending || disabled}
              >
                +
              </Button>
            </div>

            <Button
              variant="destructive"
              size="icon"
              disabled={mutation.isPending || disabled}
            >
              <IconTrash />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
