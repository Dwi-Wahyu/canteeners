"use client";

import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  IconBell,
  IconLockPassword,
  IconLogout,
  IconUser,
} from "@tabler/icons-react";
import { Menu } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export function TopbarDrawer() {
  function handleLogout() {
    signOut({
      redirectTo: "/",
    });
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Menu className="w-7 h-7" />
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Navigasi</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col items-center gap-5 h-96">
          <Button asChild size={"lg"} variant={"outline"}>
            <Link href={"/notifikasi"}>
              <IconBell />
              Notifikasi
            </Link>
          </Button>

          <Button asChild size={"lg"} variant={"outline"}>
            <Link href={"/profil"}>
              <IconUser />
              Profil Anda
            </Link>
          </Button>

          <Button asChild size={"lg"} variant={"outline"}>
            <Link href={"/ganti-password"}>
              <IconLockPassword />
              Ubah Password
            </Link>
          </Button>

          <Button size={"lg"} variant={"outline"} onClick={handleLogout}>
            <IconLogout />
            Logout
          </Button>
        </div>

        <DrawerFooter></DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
