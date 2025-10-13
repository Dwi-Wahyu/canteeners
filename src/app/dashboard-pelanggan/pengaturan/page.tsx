import { Card, CardContent } from "@/components/ui/card";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import {
  IconBell,
  IconChevronRight,
  IconTrash,
  IconUserEdit,
} from "@tabler/icons-react";

import LogoutButtonDialog from "./logout-button-dialog";

export default async function CustomerSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="">
      <Card className="p-4">
        <CardContent className="flex items-center gap-4 px-0">
          <Avatar className="size-16">
            <AvatarImage
              src={`/uploads/avatar/${session.user.avatar}`}
              alt={session.user.name}
            />
            <AvatarFallback className="text-xs">HR</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-lg font-semibold">{session.user.name}</h1>
            <h1 className="text-muted-foreground">{session.user.username}</h1>
          </div>
        </CardContent>
      </Card>

      <h1 className="mt-4 mb-2 font-semibold">Profil</h1>
      <Card className="p-4 mb-4">
        <CardContent className="flex px-0 justify-between items-center">
          <div className="flex gap-2 items-center">
            <IconUserEdit />
            <h1>Edit Profil Anda</h1>
          </div>

          <IconChevronRight className="text-muted-foreground" />
        </CardContent>
      </Card>

      <h1 className="mt-4 mb-2 font-semibold">Notifikasi</h1>
      <Card className="p-4">
        <CardContent className="flex px-0 justify-between items-center">
          <div className="flex gap-2 items-center">
            <IconBell />
            <h1>Atur Notifikasi</h1>
          </div>

          <IconChevronRight className="text-muted-foreground" />
        </CardContent>
      </Card>

      <h1 className="mt-4 mb-2 font-semibold">Lainnya</h1>

      <LogoutButtonDialog />

      <button className="w-full">
        <Card className="p-4 bg-destructive text-destructive-foreground">
          <CardContent className="flex bg-destructive text-destructive-foreground px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconTrash />
              <h1>Hapus Akun</h1>
            </div>
          </CardContent>
        </Card>
      </button>
    </div>
  );
}
