"use client";

import UnauthorizedPage from "../_components/unauthorized-page";
import { usePathname } from "next/navigation";
import OwnerTopbar from "./owner-topbar";
import OwnerBottomBar from "./owner-bottombar";

import {
  useIsSocketConnected,
  useSocket,
  useSocketConnect,
  useSocketDisconnect,
} from "@/hooks/use-socket";
import { useEffect } from "react";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { MessageData } from "@/store/socket/types";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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
  const socket = useSocket();

  useEffect(() => {
    if (!userId) return;
    if (connected) {
      return;
    }

    connect(userId);

    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  // disini nanti watch kalau ada orderan baru masuk
  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        let data: MessageData;

        try {
          data = JSON.parse(event.data);
        } catch (error) {
          return;
        }

        if (data.type === "NEW_ORDER") {
          notificationDialog.success({
            title: "Pesanan Baru Masuk",
            message: "Segera cek detail pesanan",
            actionButtons: (
              <div className="flex gap-2 items-center">
                <Button variant={"outline"} onClick={notificationDialog.hide}>
                  Tutup
                </Button>

                <Button asChild>
                  <Link href={"/dashboard-kedai/order/" + data.order_id}>
                    Detail
                  </Link>
                </Button>
              </div>
            ),
          });
        }
      };
    }
  }, [socket]);

  if (role === "CUSTOMER") {
    return <UnauthorizedPage />;
  }

  const excludedPath = [
    "pengajuan-refund",
    "/chat/",
    "order",
    "/ulasan-pelanggan",
    "/pengaturan/",
    "/produk/",
    "metode-pembayaran",
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
          <OwnerTopbar connected={connected} subscribed={false} />

          <div className="p-5 pt-7">{children}</div>

          <OwnerBottomBar />
        </div>
      )}
    </>
  );
}
