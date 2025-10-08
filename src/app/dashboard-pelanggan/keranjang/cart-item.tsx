import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CartItem } from "@/store/cart/types";
import { Ellipsis } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import { useCartStore } from "@/store/cart";

export default function CartItemComponent({ item }: { item: CartItem }) {
  const { updateQuantity, updateItemDetails } = useCartStore((state) => ({
    updateQuantity: state.updateQuantity,
    updateItemDetails: state.updateItemDetails,
  }));

  const [qty, setQty] = useState(item.quantity);
  const [notes, setNotes] = useState(item.note || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    const newQtyInt = parseInt(String(qty));
    if (!isNaN(newQtyInt) && newQtyInt >= 0 && newQtyInt !== item.quantity) {
      updateQuantity(item.productId, item.shopId, newQtyInt);
    }

    const currentNotes = item.note || "";
    if (notes.trim() !== currentNotes) {
      updateItemDetails(item.productId, item.shopId, { note: notes.trim() });
    }

    setIsDialogOpen(false);
  };

  const handleDialogOpenChange = (open: boolean) => {
    if (open) {
      setQty(item.quantity);
      setNotes(item.note || "");
    }
    setIsDialogOpen(open);
  };

  useEffect(() => {
    if (!isDialogOpen) {
      setQty(item.quantity);
      setNotes(item.note || "");
    }
  }, [item.quantity, item.note, isDialogOpen]);

  return (
    <div className="mb-2">
      <div className="flex justify-between items-center mb-2">
        <div className="">
          <div className="flex gap-2 items-center">
            <h1>{item.name}</h1>

            <div className="text-xs bg-primary text-primary-foreground py-1 px-2 rounded">
              {item.quantity}
            </div>
          </div>

          <h1 className="text-muted-foreground">
            Rp {item.quantity * item.price}
          </h1>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <Ellipsis />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="hidden"></DialogTitle>

              <div className="text-start flex flex-col gap-2">
                <div>
                  <h1 className="text-center font-semibold">{item.name}</h1>
                </div>

                <div className="mb-1">
                  <h1 className="text-sm text-muted-foreground mb-1">Jumlah</h1>
                  <Input
                    value={qty}
                    onChange={(e) => setQty(parseInt(e.target.value))}
                    type="number"
                  />
                </div>

                <div>
                  <h1 className="text-sm text-muted-foreground mb-1">
                    Catatan
                  </h1>
                  <Input
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

      <Separator />
    </div>
  );
}
