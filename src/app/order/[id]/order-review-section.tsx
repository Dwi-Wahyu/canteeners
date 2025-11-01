"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { AddShopTestimony } from "../actions";
import { toast } from "sonner";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { ShopTestimony } from "@/app/generated/prisma";

type Customer = {
  name: string;
  avatar: string;
};

export default function OrderReviewSection({
  order_id,
  prevTestimony,
  isUserCustomer,
  customer,
}: {
  order_id: string;
  prevTestimony: ShopTestimony | null;
  isUserCustomer: boolean;
  customer: Customer;
}) {
  const [rating, setRating] = useState(0);
  const [message, setMessage] = useState("");

  const [testimony, setTestimony] = useState<ShopTestimony | null>(
    prevTestimony
  );

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async () => {
      return await AddShopTestimony({ message, rating, order_id });
    },
  });

  async function handleSend() {
    if (!message.trim()) {
      toast.info("Berikan ulasan sebelum mengirim");
      return;
    }

    const result = await mutateAsync();

    if (result.success) {
      toast.success(result.message);

      if (result.data) {
        setTestimony(result.data);
      }
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <Card>
      <CardContent className="flex flex-col">
        {testimony && (
          <>
            <div className="flex gap-3 mb-2 items-center">
              <Avatar className="size-12">
                <AvatarImage src={"/uploads/avatar/" + customer.avatar} />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div className="flex flex-col gap-1">
                <h1 className="font-semibold">{customer.name}</h1>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((rate) => (
                    <button key={rate} className="">
                      {testimony.rating >= rate ? (
                        <IconStarFilled className="w-5 h-5" />
                      ) : (
                        <IconStar className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <h1 className="mt-2">{testimony.message}</h1>
          </>
        )}

        {!testimony && !isUserCustomer && (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <IconStar />
              </EmptyMedia>
              <EmptyTitle>Ulasan & Rating</EmptyTitle>
              <EmptyDescription>
                Customer belum menambahkan ulasan atau rating
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        )}

        {!testimony && isUserCustomer && (
          <>
            <CardTitle className="mb-4">Ulasan & Rating</CardTitle>

            <div className="flex mb-4 gap-2 items-center">
              {[1, 2, 3, 4, 5].map((rate) => (
                <button
                  key={rate}
                  className="cursor-pointer block "
                  onClick={() => setRating(rate)}
                >
                  {rating >= rate ? (
                    <IconStarFilled className="w-5 h-5" />
                  ) : (
                    <IconStar className="w-5 h-5" />
                  )}
                </button>
              ))}
            </div>

            <div className="mb-4">
              <Label htmlFor="ulasan">Ulasan</Label>
              <Textarea
                id="ulasan"
                className="mt-2"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </div>

            <Button
              size={"lg"}
              className="w-full bg-gradient-to-t from-primary to-primary/80 border border-primary"
              disabled={isPending}
              onClick={handleSend}
            >
              Kirim
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
