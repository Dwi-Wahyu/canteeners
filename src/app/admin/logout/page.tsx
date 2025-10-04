"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconLogout2 } from "@tabler/icons-react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  function handleLogout() {
    signOut({
      redirectTo: "/",
    });
  }

  return (
    <div className="w-full h-[75vh] flex justify-center items-center">
      <Card className="max-w-lg">
        <CardContent className="flex text-center flex-col justify-center items-center gap-2">
          <h1 className="font-semibold text-lg">Yakin Logout ?</h1>
          <h1 className="text-muted-foreground">
            Anda Perlu Memasukkan Username dan Password Lagi Pada Halaman Login
          </h1>

          <Button
            variant={"destructive"}
            size={"lg"}
            className="mt-1"
            onClick={handleLogout}
          >
            <IconLogout2 />
            Ya, Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
