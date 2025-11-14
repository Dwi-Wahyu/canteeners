"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Scroller } from "../../../components/ui/scroller";
import { getSidebarMenu } from "./menu";
import { useSession } from "next-auth/react";
import { useRouter } from "nextjs-toploader/app";
import { Skeleton } from "@/components/ui/skeleton";
import { NavMenu } from "./nav-menu";
import SidebarUserDetail from "./user-detail";
import { UtensilsCrossed } from "lucide-react";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { open } = useSidebar();

  const { data, status } = useSession();

  const router = useRouter();

  if (status === "loading") {
    return <LoadingSidebarMenu {...props} />;
  }

  if (!data) {
    router.push("/auth/signin");
    return;
  }

  const menu = getSidebarMenu(data.user.role);

  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0 flex items-center justify-between">
            {open ? (
              <div className="flex gap-2 items-center">
                <Image
                  src={"/app-logo.svg"}
                  width={36}
                  height={36}
                  alt="app logo"
                />

                <div>
                  <h1 className="text-lg font-bold leading-tight">
                    CANTEENERS
                  </h1>
                  <h1 className="text-sm text-muted-foreground">
                    Kantin Naik Level
                  </h1>
                </div>
              </div>
            ) : (
              // <img src="/supercoridor.png" width={40} height={40} alt="" />
              <div>
                <UtensilsCrossed className="w-5 h-5" />
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10">
        <Scroller orientation={"vertical"} hideScrollbar>
          <NavMenu items={menu.navMain} groupLabel="UTAMA" />

          {menu.navProject.length !== 0 && (
            <NavMenu items={menu.navProject} groupLabel="PROJECT" />
          )}

          {menu.navUser.length !== 0 && (
            <NavMenu items={menu.navUser} groupLabel="USER" />
          )}

          {menu.navSetting.length !== 0 && (
            <NavMenu items={menu.navSetting} groupLabel="PENGATURAN" />
          )}
        </Scroller>
      </SidebarContent>
    </Sidebar>
  );
}

function LoadingSidebarMenu({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" variant="floating" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="p-2 pb-0 flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <Image
                src={"/app-logo.svg"}
                width={36}
                height={36}
                alt="app logo"
              />

              <div>
                <h1 className="text-lg font-bold leading-tight">CANTEENERS</h1>
                <h1 className="text-sm text-muted-foreground">
                  Kantin Naik Level
                </h1>
              </div>
            </div>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="px-4 pt-6">
        <SidebarSkeleton />
      </SidebarContent>
    </Sidebar>
  );
}

function SidebarSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-60 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-44 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
      </div>

      <div className="flex flex-col gap-4 mt-2">
        <Skeleton className="w-16 h-3 bg-sidebar-foreground" />
        <Skeleton className="w-40 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-28 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-36 h-5 bg-sidebar-foreground" />
        <Skeleton className="w-32 h-5 bg-sidebar-foreground" />
      </div>
    </div>
  );
}
