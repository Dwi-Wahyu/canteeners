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
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Ellipsis, NotebookPen } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { IconTrash } from "@tabler/icons-react";

type CartItemType = NonNullable<
  Awaited<ReturnType<typeof getCustomerShopCart>>
>["items"][number];

export default function CartItemCard({ cartItem }: { cartItem: CartItemType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [qty, setQty] = useState(cartItem.quantity);
  const [notes, setNotes] = useState(cartItem.notes || "");

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setQty(cartItem.quantity);
      setNotes(cartItem.notes || "");
    }
    setIsDialogOpen(open);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setQty(cartItem.quantity);
      setNotes(cartItem.notes || "");
    }
  }, [cartItem.quantity, cartItem.notes, isDialogOpen]);

  function handleSave() {
    const currentNotes = cartItem.notes || "";

    if (qty < 1) return;

    if (notes.trim() !== currentNotes || qty !== cartItem.quantity) {
    }

    setIsDialogOpen(false);
  }

  function changeQuantity(newQty: number) {
    if (qty < 2) {
      setQty(1);
    } else {
      setQty(newQty);
    }
  }

  return (
    <Card>
      <CardContent className="flex gap-4">
        <Image
          src={"/uploads/product/" + cartItem.product.image_url}
          alt="cart item image"
          width={100}
          height={100}
          className="rounded-lg"
        />
        <div className="w-full">
          <div className="flex justify-between items-center w-full">
            <h1 className="font-semibold">{cartItem.product.name}</h1>

            <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
              <DialogTrigger>
                <NotebookPen className="w-4 h-4 text-muted-foreground" />
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="hidden">Product Details</DialogTitle>
                  <DialogDescription className="hidden">
                    Product Details Description
                  </DialogDescription>

                  <div className="text-start flex flex-col gap-2">
                    <div>
                      <h1 className="text-center font-semibold">
                        {cartItem.product.name}
                      </h1>
                    </div>

                    <div>
                      <h1 className="text-sm text-muted-foreground mb-1">
                        Catatan
                      </h1>
                      <Textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                      />
                    </div>

                    <Button onClick={handleSave} className="mt-4">
                      Simpan
                    </Button>
                  </div>
                </DialogHeader>
              </DialogContent>
            </Dialog>
          </div>

          <h1>{cartItem.price_at_add * qty}</h1>

          <div className="flex gap-4 mt-4 items-center">
            <div className="flex gap-5 items-center">
              <Button size={"icon"} onClick={() => changeQuantity(qty - 1)}>
                -
              </Button>

              <h1>{qty}</h1>

              <Button size={"icon"} onClick={() => changeQuantity(qty + 1)}>
                +
              </Button>
            </div>

            <Button variant={"destructive"} size={"icon"} disabled>
              <IconTrash />
            </Button>
          </div>

          {/* <h1 className="text-lg font-semibold">{cartItem.quantity}x</h1> */}
        </div>
      </CardContent>
    </Card>
  );
}
