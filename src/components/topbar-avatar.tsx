"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconDoorExit, IconPasswordUser } from "@tabler/icons-react";
import { CircleUser } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

export default function TopbarAvatar() {
  const session = useSession();

  if (!session.data) {
    return null;
  }

  function handleLogout() {
    signOut({
      redirectTo: "/auth/signin",
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex gap-2 items-center">
        <h1 className="font-semibold hidden md:block text-sm">
          {session.data.user.name}
        </h1>
        <Avatar className="size-8">
          <AvatarImage
            src={`/uploads/avatar/${session.data.user.avatar}`}
            alt={session.data.user.name}
          />
          <AvatarFallback className="text-xs">HR</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem asChild>
          <Link href={"/admin/profil/"}>
            <CircleUser />
            Profil
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={"/admin/ganti-password/"}>
            <IconPasswordUser />
            Ganti Password
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout}>
          <IconDoorExit />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
