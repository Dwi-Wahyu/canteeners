"use client";

import { useEffect } from "react";
import CustomerBottombar from "./customer-bottombar";
import CustomerTopbar from "./customer-topbar";
import {
  useConnectSocket,
  useDisconnectSocket,
  useIsSocketConnected,
  useIsSubscribedNotifications,
  useSocketInstance,
  useSubscribeNotifications,
} from "@/store/use-socket-store";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import { useRouter } from "nextjs-toploader/app";

export default function ClientCustomerLayout({
  children,
  userId,
  role,
}: {
  children: React.ReactNode;
  userId: string;
  role: string;
}) {
  const isSocketConnected = useIsSocketConnected();
  const connect = useConnectSocket();
  const disconnect = useDisconnectSocket();
  const isSubscribed = useIsSubscribedNotifications();

  const socketInstance = useSocketInstance();

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

  if (role === "SHOP_OWNER") {
    router.push("/dashboard-kedai");
  }

  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      {!pathname.includes("/chat/") && <CustomerTopbar />}

      <div className="p-5 pt-6">
        {isSocketConnected ? <div>Terkoneksi</div> : <div>Belum konek</div>}
        {isSubscribed ? <div>Disubscribe</div> : <div>Belum subscribe</div>}

        {children}
      </div>

      {!pathname.includes("/chat/") && <CustomerBottombar />}
    </div>
  );
}
