"use client";

import { Home, MessageCircle, Settings, ShoppingBasket } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerBottombar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-secondary p-4 pb-2 fixed border-t bottom-0 left-0 z-50 flex justify-evenly">
      <Link
        href={"/dashboard-pelanggan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan" && "border-b-[3px]"
        }`}
      >
        <Home />
      </Link>

      <Link
        href={"/dashboard-pelanggan/chat"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan/chat" && "border-b-[3px]"
        }`}
      >
        <MessageCircle />
      </Link>

      <Link
        href={"/dashboard-pelanggan/keranjang"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-pelanggan/keranjang" && "border-b-[3px]"
        }`}
      >
        <ShoppingBasket />
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
