"use client";

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { IconLogout } from "@tabler/icons-react";
import { signOut } from "next-auth/react";
import { useState } from "react";

export default function LogoutButtonDialog() {
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  function handleLogout() {
    setOpenLogoutDialog(false);
    signOut({
      redirectTo: "/auth/signin",
    });
  }

  return (
    <AlertDialog open={openLogoutDialog} onOpenChange={setOpenLogoutDialog}>
      <button onClick={() => setOpenLogoutDialog(true)} className="w-full mb-3">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconLogout />
              <h1>Logout</h1>
            </div>
          </CardContent>
        </Card>
      </button>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Anda yakin logout ?</AlertDialogTitle>
          <AlertDialogDescription>
            Anda akan keluar dari sesi saat ini. Anda dapat masuk kembali kapan
            saja.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Batal</AlertDialogCancel>
          <Button variant={"destructive"} onClick={handleLogout}>
            Yakin
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
