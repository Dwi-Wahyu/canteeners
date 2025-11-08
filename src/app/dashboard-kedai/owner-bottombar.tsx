"use client";

import { Home, MessageCircle, Settings, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerBottomBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-secondary border-t p-4 pb-2 fixed bottom-0 left-0 z-50 flex justify-evenly">
      <Link
        href={"/dashboard-kedai"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-kedai" && "border-b-[3px]"
        }`}
      >
        <Home />
      </Link>

      <Link
        href={"/dashboard-kedai/produk"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-kedai/produk" && "border-b-[3px]"
        }`}
      >
        <Utensils />
      </Link>

      <Link
        href={"/dashboard-kedai/chat"}
        className={`relative border-b-foreground pb-1 ${
          pathname === "/dashboard-kedai/chat" && "border-b-[3px]"
        }`}
      >
        <MessageCircle />
      </Link>

      <Link
        href={"/dashboard-kedai/pengaturan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-kedai/pengaturan" && "border-b-[3px]"
        }`}
      >
        <Settings />
      </Link>
    </div>
  );
}
