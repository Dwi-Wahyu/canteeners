"use client";

import TopbarAvatar from "@/components/topbar-avatar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { UtensilsCrossed } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerTopbar() {
  const session = useSession();

  if (!session.data) {
    return (
      <div className="justify-between px-5 py-3 bg-secondary shadow flex items-center z-50 fixed top-0 left-0 w-full">
        <div className="flex gap-2 items-center text-primary">
          <UtensilsCrossed className="w-5 h-5" />
          <h1 className="text-lg font-semibold">Canteeners</h1>
        </div>

        <div className="flex gap-3 items-center">
          <h1 className="font-semibold hidden md:block text-sm">Username</h1>
          <Avatar className="size-8">
            <AvatarImage
              src={"/uploads/avatar/default-avatar.jpg"}
              alt={"avatar"}
            />
            <AvatarFallback className="text-xs">AV</AvatarFallback>
          </Avatar>
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
        <TopbarAvatar />

        {/* <ToggleDarkMode /> */}
      </div>
    </div>
  );
}
