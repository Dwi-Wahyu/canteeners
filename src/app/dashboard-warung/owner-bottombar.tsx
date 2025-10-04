"use client";

import { Home, MessageCircle, Settings, Utensils } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function OwnerBottomBar() {
  const pathname = usePathname();

  return (
    <div className="w-full bg-secondary p-4 pb-2 fixed bottom-0 left-0 z- flex justify-evenly">
      <Link
        href={"/dashboard-warung"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-warung" && "border-b-[3px]"
        }`}
      >
        <Home />
      </Link>

      <Link
        href={"/dashboard-warung/produk"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-warung/produk" && "border-b-[3px]"
        }`}
      >
        <Utensils />
      </Link>

      <Link
        href={"/dashboard-warung/pesan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-warung/pesan" && "border-b-[3px]"
        }`}
      >
        <MessageCircle />
      </Link>

      <Link
        href={"/dashboard-warung/pengaturan"}
        className={` border-b-foreground pb-1 ${
          pathname === "/dashboard-warung/pengaturan" && "border-b-[3px]"
        }`}
      >
        <Settings />
      </Link>
    </div>
  );
}
