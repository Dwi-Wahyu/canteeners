"use client";

import { BreadCrumbs } from "@/components/breadcrumb";
import { ToggleDarkMode } from "@/components/toggle-darkmode";
import TopbarAvatar from "@/components/topbar-avatar";
import { useSession } from "next-auth/react";

export default function OwnerTopbar() {
  const session = useSession();

  if (!session.data) {
    return <div></div>;
  }

  return (
    <div className="justify-between flex mb-3 items-center">
      <BreadCrumbs />

      <div className="flex gap-3 items-center">
        <TopbarAvatar />

        <ToggleDarkMode />
      </div>
    </div>
  );
}
