"use client";

import { ToggleDarkMode } from "@/components/toggle-darkmode";
import { Button } from "@/components/ui/button";
import { IconLogout } from "@tabler/icons-react";
import { ScanQrCode } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { TopbarDrawer } from "./topbar-drawer";

export function HomeTopbar() {
  function handleLogout() {
    signOut({
      redirectTo: "/",
    });
  }

  return (
    <div className="flex justify-between bg-card absolute top-0 left-0 border-b shadow items-center w-full p-5">
      <div className="flex items-center gap-1">
        <ScanQrCode width={40} height={40} />

        <div>
          <h1 className="font-bold leading-tight">Presensi Digital</h1>
          <h1 className="leading-tight">PT SkytelIndo</h1>
        </div>
      </div>

      <TopbarDrawer />
    </div>
  );
}
