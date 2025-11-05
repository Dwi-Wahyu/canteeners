"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { Home, MessageCircle, Settings, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerBottomBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-secondary border-t p-4 pb-2 fixed bottom-0 left-0 z-50 flex justify-evenly">
      <Link
        href={"/dashboard-pelanggan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan" && "border-b-[3px]"
        }`}
      >
        <Home />
      </Link>

      <Link
        href={"/dashboard-pelanggan/keranjang"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan/keranjang" && "border-b-[3px]"
        }`}
      >
        <IconShoppingCart />
      </Link>

      <Link
        href={"/dashboard-pelanggan/chat"}
        className={`relative border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan/chat" && "border-b-[3px]"
        }`}
      >
        <MessageCircle />
      </Link>

      <Link
        href={"/dashboard-pelanggan/pengaturan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan/pengaturan" && "border-b-[3px]"
        }`}
      >
        <Settings />
      </Link>
    </div>
  );
}
