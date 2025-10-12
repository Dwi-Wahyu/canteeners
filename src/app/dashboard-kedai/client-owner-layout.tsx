"use client";

import { useEffect } from "react";
import OwnerBottombar from "./owner-bottombar";
import OwnerTopbar from "./owner-topbar";
import {
  useConnectSocket,
  useDisconnectSocket,
  useIsSocketConnected,
  useIsSubscribedNotifications,
  useSocketInstance,
} from "@/store/use-socket-store";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export default function ClientOwnerLayout({
  children,
  userId,
  role,
}: {
  children: React.ReactNode;
  userId: string;
  role: string;
}) {
  const connect = useConnectSocket();
  const disconnect = useDisconnectSocket();

  const isSocketConnected = useIsSocketConnected();
  const socketInstance = useSocketInstance();
  const isSubscribed = useIsSubscribedNotifications();

  useEffect(() => {
    connect(userId);
  }, [connect]);

  useEffect(() => {
    if (isSubscribed) {
      const handleNewMessage = (data: any) => {
        // console.log(data);
        // toast.info(`${data.content}`);
      };

      socketInstance?.on("new_message", handleNewMessage);
    }
  }, [isSubscribed]);

  const pathname = usePathname();

  const router = useRouter();

  if (role === "CUSTOMER") {
    router.push("/dashboard-pelanggan");
  }

  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      {!pathname.includes("/chat/") && <OwnerTopbar />}

      <div className="p-5 pt-6">
        {isSocketConnected ? <div>Terkoneksi</div> : <div>Belum konek</div>}
        {isSubscribed ? <div>Disubscribe</div> : <div>Belum subscribe</div>}

        {children}
      </div>

      {!pathname.includes("/chat/") && <OwnerBottombar />}
    </div>
  );
}
