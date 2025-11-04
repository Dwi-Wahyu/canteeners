"use client";

import BackButton from "../_components/back-button";

import { EllipsisVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";

export default function DetailConversationTopbar({
  avatar,
  name,
  last_login,
  role,
}: {
  avatar: string;
  name: string;
  last_login: Date | null;
  role: string;
}) {
  const backUrl =
    role === "CUSTOMER" ? "/dashboard-pelanggan/chat" : "/dashboard-kedai/chat";

  return (
    <div className="w-full fixed z-30 left-0 top-0 shadow bg-background">
      <div className="py-4 px-5 flex justify-between items-center">
        <BackButton url={backUrl} />

        <div className="flex gap-2 items-center">
          <Avatar className="">
            <AvatarImage src={`/uploads/avatar/${avatar}`} />
            <AvatarFallback>{name.charAt(0)}</AvatarFallback>
          </Avatar>

          <div className="text-start">
            <h1 className="leading-tight font-semibold">{name}</h1>
            <h1 className="text-xs leading-tight text-muted-foreground">
              {formatDateToYYYYMMDD(last_login)} {formatToHour(last_login)}
            </h1>
          </div>
        </div>

        <div>
          <Button size={"icon"} variant={"ghost"}>
            <EllipsisVertical />
          </Button>
        </div>
      </div>
    </div>
  );
}
