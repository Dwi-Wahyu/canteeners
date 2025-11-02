"use client";

import UnauthorizedPage from "../_components/unauthorized-page";
import { usePathname } from "next/navigation";
import OwnerTopbar from "./owner-topbar";
import OwnerBottomBar from "./owner-bottombar";

import {
  useIsSocketConnected,
  useSocketConnect,
  useSocketDisconnect,
} from "@/hooks/use-socket";
import { useEffect } from "react";

export default function ClientOwnerLayout({
  children,
  userId,
  role,
}: {
  children: React.ReactNode;
  userId: string;
  role: string;
}) {
  const pathname = usePathname();

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

  if (role === "CUSTOMER") {
    return <UnauthorizedPage />;
  }

  const excludedPath = ["chat", "pengajuan-refund", "order"];

  function isExcluded() {
    return excludedPath.some((path) => pathname.includes(path));
  }

  return (
    <>
      {isExcluded() ? (
        <div className="p-5 pt-20">{children}</div>
      ) : (
        <div className="w-full relative min-h-svh pt-12 pb-16">
          <OwnerTopbar connected={connected} subscribed={false} />

          <div className="p-5 pt-7">{children}</div>

          <OwnerBottomBar />
        </div>
      )}
    </>
  );
}
