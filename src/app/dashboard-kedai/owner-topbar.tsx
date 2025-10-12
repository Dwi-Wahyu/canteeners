"use client";

import TopbarAvatar from "@/components/topbar-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useIsSocketConnected } from "@/store/use-socket-store";
import { UtensilsCrossed } from "lucide-react";
import { useSession } from "next-auth/react";

export default function OwnerTopbar() {
  const session = useSession();

  const isSocketConnected = useIsSocketConnected();

  if (!session.data) {
    return (
      <div className="justify-between px-5 py-3 bg-secondary shadow flex items-center z-50 fixed top-0 left-0 w-full">
        <div className="flex gap-2 items-center text-primary">
          <UtensilsCrossed className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Canteeners</h1>
        </div>

        <div className="flex gap-3 items-center">
          <h1 className="font-semibold hidden md:block text-sm">Username</h1>
          <div className="relative w-fit">
            <Avatar className="size-8">
              <AvatarImage
                src={"/uploads/avatar/default-avatar.jpg"}
                alt={"avatar"}
              />
              <AvatarFallback className="text-xs">AV</AvatarFallback>
            </Avatar>
            <span className="border-background bg-destructive absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2">
              <span className="sr-only">Busy</span>
            </span>
          </div>
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

      <div className="flex gap-3 items-center">
        <h1 className="font-semibold hidden md:block text-sm">
          {session.data.user.name}
        </h1>

        <Avatar className="size-8">
          <AvatarImage
            src={session.data.user.avatar}
            alt={session.data.user.name}
          />
          <AvatarFallback className="text-xs">HR</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
