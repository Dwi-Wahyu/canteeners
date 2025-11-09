"use client";

import Image from "next/image";
import { getShopConversationDetails } from "../../../server-queries";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

export default function ShopConversationDetails({
  details,
  owner_id,
}: {
  details: NonNullable<Awaited<ReturnType<typeof getShopConversationDetails>>>;
  owner_id: string;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        {details.messages.map((message, idx) => {
          const sender = message.sender;

          return (
            <div
              key={idx}
              className={`w-full flex flex-col ${
                message.sender_id === owner_id ? "items-end" : "items-start"
              }`}
            >
              <h1 className="font-medium mb-1">{sender.name}</h1>

              <div
                className={`flex gap-2 items-start w-[40%] ${
                  message.sender_id === owner_id
                    ? "flex-row-reverse"
                    : "flex-row"
                }`}
              >
                <div>
                  <Image
                    src={"/uploads/avatar/" + sender.avatar}
                    alt="customer avatar"
                    className="rounded-full"
                    width={50}
                    height={50}
                  />
                </div>

                <div className="w-full bg-primary shadow rounded-lg text-primary-foreground px-4 py-3">
                  {message.text}
                </div>
              </div>

              <span className="mt-1 text-muted-foreground text-sm">
                {formatDateToYYYYMMDD(message.created_at)}{" "}
                {formatToHour(message.created_at)}
              </span>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
