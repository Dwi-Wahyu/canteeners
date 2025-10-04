"use client";

import { ToggleDarkMode } from "@/components/toggle-darkmode";
import TopbarAvatar from "@/components/topbar-avatar";
import { UtensilsCrossed } from "lucide-react";
import { useSession } from "next-auth/react";

export default function CustomerTopbar() {
  const session = useSession();

  if (!session.data) {
    return <div></div>;
  }

  return (
    <div className="justify-between px-5 py-4 flex items-center fixed top-0 left-0 w-full">
      <div className="flex gap-2 items-center text-primary">
        <UtensilsCrossed className="w-5 h-5" />
        <h1 className="text-lg font-semibold">Canteeners</h1>
      </div>

      <div className="flex gap-3 items-center">
        <TopbarAvatar />

        <ToggleDarkMode />
      </div>
    </div>
  );
}
