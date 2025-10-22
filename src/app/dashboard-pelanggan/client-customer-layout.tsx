"use client";

import CustomerBottombar from "./customer-bottombar";
import CustomerTopbar from "./customer-topbar";

import { usePathname } from "next/navigation";
import { useRouter } from "nextjs-toploader/app";
// import { useSocketConnection } from "@/hooks/socket/core";

export default function ClientCustomerLayout({
  children,
  userId,
  role,
}: {
  children: React.ReactNode;
  userId: string;
  role: string;
}) {
  // const { connected, subscribed } = useSocketConnection(userId);

  const pathname = usePathname();

  const router = useRouter();

  if (role === "SHOP_OWNER") {
    router.push("/dashboard-kedai");
  }

  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      {!pathname.includes("/chat/") && (
        <CustomerTopbar connected={false} subscribed={false} />
      )}

      <div className="p-5 pt-7">{children}</div>

      {!pathname.includes("/chat/") && <CustomerBottombar />}
    </div>
  );
}
