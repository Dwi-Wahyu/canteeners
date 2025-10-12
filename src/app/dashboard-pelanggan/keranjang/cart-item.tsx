"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Ellipsis } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";

import {
  KeranjangItem,
  useKeranjangActions,
} from "@/store/use-keranjang-store";

export default function CartItemComponent({
  item,
  shopId,
}: {
  item: KeranjangItem;
  shopId: string;
}) {
  const { updateItem } = useKeranjangActions();

  const [qty, setQty] = useState(item.quantity);
  const [notes, setNotes] = useState(item.note || "");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleSave = () => {
    const currentNotes = item.note || "";

    if (qty < 1) return;

    if (notes.trim() !== currentNotes || qty !== item.quantity) {
      updateItem(shopId, item.productId, {
        quantity: qty,
        note: notes.trim() === "" ? undefined : notes.trim(),
      });
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

          {item.note && (
            <div className="text-xs bg-secondary text-muted-foreground py-1 px-2 rounded">
              {item.note}
            </div>
          )}
        </div>

        <Dialog open={isDialogOpen} onOpenChange={handleDialogOpenChange}>
          <DialogTrigger asChild>
            <Button size={"icon"} variant={"ghost"}>
              <Ellipsis />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="hidden">Product Details</DialogTitle>
              <DialogDescription className="hidden">
                Product Details Description
              </DialogDescription>

              <div className="text-start flex flex-col gap-2">
                <div>
                  <h1 className="text-center font-semibold">{item.name}</h1>
                </div>

                <div className="mb-1">
                  <h1 className="text-sm text-muted-foreground mb-1">Jumlah</h1>
                  <Input
                    value={qty}
                    onChange={(e) => {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value) && value > 0) {
                        setQty(value);
                      } else if (e.target.value === "") {
                        setQty(0);
                      }
                    }}
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
