"use client";

import { Button } from "@/components/ui/button";
import { IconDoorExit } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

export default function PengaturanPage() {
  function handleLogout() {
    signOut({
      redirectTo: "/auth/signin",
    });
  }

  return (
    <div>
      <h1>Pengaturan</h1>

      <Button onClick={handleLogout}>
        <IconDoorExit />
        Logout
      </Button>
    </div>
  );
}
