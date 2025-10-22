"use client";

// import { useSocketConnection } from "@/hooks/socket/core";
import OwnerBottombar from "./owner-bottombar";
import OwnerTopbar from "./owner-topbar";
import { usePathname } from "next/navigation";
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
  // const { connected, subscribed } = useSocketConnection(userId);

  const pathname = usePathname();

  const router = useRouter();

  if (role === "CUSTOMER") {
    router.push("/dashboard-pelanggan");
  }

  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      {!pathname.includes("/chat/") && (
        <OwnerTopbar connected={false} subscribed={false} />
      )}

      <div className="p-5 pt-7">{children}</div>

      {!pathname.includes("/chat/") && <OwnerBottombar />}
    </div>
  );
}
