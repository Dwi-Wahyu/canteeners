"use client";

import CustomerBottombar from "./customer-bottombar";
import CustomerTopbar from "./customer-topbar";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";

import {
  useIsSocketConnected,
  useSocketConnect,
  useSocketDisconnect,
} from "@/hooks/use-socket";
import { useEffect } from "react";

export default function ClientCustomerLayout({
  children,
  userId,
  role,
}: {
  children: React.ReactNode;
  userId: string;
  role: string;
}) {
  const pathname = usePathname();

  const router = useRouter();

  const connect = useSocketConnect();
  const connected = useIsSocketConnected();
  const disconnect = useSocketDisconnect();

  useEffect(() => {
    if (!userId) return;
    if (connected) return;

    connect(userId);

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  if (role === "SHOP_OWNER") {
    router.push("/dashboard-kedai");
  }

  const excludedPath = [
    "/kantin",
    "/pengajuan-refund",
    "/pelanggaran",
    "/chat/",
    "order",
    "/keranjang/",
  ];

  function isExcluded() {
    return excludedPath.some((path) => pathname.includes(path));
  }

  return (
    <>
      {isExcluded() ? (
        <div className="p-5 pt-20">{children}</div>
      ) : (
        <div className="w-full relative min-h-svh pt-12 pb-16">
          <CustomerTopbar connected={connected} subscribed={false} />

          <div className="p-5 pt-7">{children}</div>

          <CustomerBottombar />
        </div>
      )}
    </>
  );
}
