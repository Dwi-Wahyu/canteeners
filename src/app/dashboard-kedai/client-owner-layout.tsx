"use client";

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
  const pathname = usePathname();

  const router = useRouter();

  if (role === "CUSTOMER") {
    router.push("/dashboard-pelanggan");
  }

  const excludedPath = ["/chat/", "/pengajuan-refund/"];

  return (
    <div className="w-full relative min-h-svh pt-12 pb-16">
      {!excludedPath.includes(pathname) && (
        <OwnerTopbar connected={false} subscribed={false} />
      )}

      <div className="p-5 pt-7">{children}</div>

      {!excludedPath.includes(pathname) && <OwnerBottombar />}
    </div>
  );
}
