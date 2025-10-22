import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import {
  IconBell,
  IconChevronRight,
  IconExclamationCircle,
  IconMessageUser,
  IconUser,
} from "@tabler/icons-react";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";

import LogoutButtonDialog from "./logout-button-dialog";
import Link from "next/link";
import ToggleSettingDarkMode from "@/app/toggle-setting-dark-mode";

export default async function CustomerSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="">
      <h1 className="mb-2 font-semibold">Personal</h1>

      <Item variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/profil">
          <ItemMedia>
            <IconUser className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Profil Anda</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <LogoutButtonDialog />

      <h1 className="mt-4 mb-2 font-semibold">Notifikasi</h1>

      <Item variant="outline" size="sm" asChild>
        <Link href="/pengaturan/notifikasi">
          <ItemMedia>
            <IconBell className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Atur Notifikasi</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <h1 className="mt-4 mb-2 font-semibold">Lainnya</h1>

      <ToggleSettingDarkMode />

      <Item variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/pengaturan/notifikasi">
          <ItemMedia>
            <IconMessageUser className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Pusat Bantuan</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <Item variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/pengaturan/notifikasi">
          <ItemMedia>
            <IconExclamationCircle className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Versi Aplikasi</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>
    </div>
  );
}
