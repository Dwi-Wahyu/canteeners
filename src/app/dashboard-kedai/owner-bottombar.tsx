"use client";

import { Home, MessageCircle, Settings, Utensils } from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { getConversationNotReadedSum } from "./owner-dashboard-queries";

export default function OwnerBottomBar() {
  const pathname = usePathname();

  const session = useSession();

  const [convNotReaded, setConvNotReaded] = useState(0);

  useEffect(() => {
    if (session.data) {
      getConversationNotReadedSum(session.data.user.id).then((sum) => {
        setConvNotReaded(sum);
      });
    }
  }, [session.data]);

  return (
    <div className="w-full bg-secondary border-t p-4 pb-2 fixed bottom-0 left-0 z- flex justify-evenly">
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

        {convNotReaded > 0 && (
          <div className="absolute -top-2 -right-2 bg-primary px-2 py-1 text-primary-foreground leading-none rounded text-xs ">
            {convNotReaded}
          </div>
        )}
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
