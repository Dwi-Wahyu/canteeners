"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UtensilsCrossed } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerTopbar({
  connected = false,
  subscribed = false,
}: {
  connected: boolean;
  subscribed: boolean;
}) {
  const session = useSession();

  if (!session.data) {
    return (
      <div className="justify-between px-5 py-3 bg-secondary shadow flex items-center z-50 fixed top-0 left-0 w-full">
        <div className="flex gap-2 items-center text-primary">
          <UtensilsCrossed className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Canteeners</h1>
        </div>

        <div className="relative w-fit">
          <Avatar>
            <AvatarImage
              src={`/uploads/avatar/default-avatar.jpg`}
              alt="Hallie Richards"
            />
            <AvatarFallback className="text-xs">HR</AvatarFallback>
          </Avatar>
          <span className="border-background bg-destructive absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2">
            <span className="sr-only">Busy</span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="justify-between px-5 py-3 bg-secondary shadow flex items-center z-50 fixed top-0 left-0 w-full">
      <div className="flex gap-2 items-center text-primary">
        <UtensilsCrossed className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Canteeners</h1>
      </div>

      <div className="relative w-fit">
        <Avatar>
          <AvatarImage
            src={`/uploads/avatar/` + session.data.user.avatar}
            alt="Hallie Richards"
          />
          <AvatarFallback className="text-xs">HR</AvatarFallback>
        </Avatar>
        <span
          className={`border-background absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 ${
            connected ? "bg-success" : "bg-destructive"
          }`}
        >
          <span className="sr-only">Busy</span>
        </span>
      </div>
    </div>
  );
}
