import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import {
  IconBell,
  IconChevronRight,
  IconExclamationCircle,
  IconMessageUser,
  IconReceipt,
  IconReceiptRefund,
  IconUser,
  IconUserExclamation,
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
        <Link href="/dashboard-pelanggan/profil">
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

      <Item variant="outline" size="sm" className="mt-4" asChild>
        <Link href="/dashboard-pelanggan/order">
          <ItemMedia>
            <IconReceipt className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Riwayat Transaksi</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <Item variant="outline" size="sm" className="mt-4" asChild>
        <Link href="/dashboard-pelanggan/pengajuan-refund">
          <ItemMedia>
            <IconReceiptRefund className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Pengajuan Refund</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <h1 className="mt-4 mb-2 font-semibold">Notifikasi</h1>

      <Item variant="outline" size="sm" asChild>
        <Link href="/dashboard-pelanggan/pengaturan/notifikasi">
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
        <Link href="/dashboard-pelanggan/pelanggaran">
          <ItemMedia>
            <IconUserExclamation className="size-5" />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Pelanggaran</ItemTitle>
          </ItemContent>
          <ItemActions>
            <IconChevronRight className="size-4" />
          </ItemActions>
        </Link>
      </Item>

      <Item variant="outline" size="sm" className="mb-4" asChild>
        <Link href="/dashboard-pelanggan/pusat-bantuan">
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
        <Link href="/dashboard-pelanggan/pengaturan/versi-aplikasi">
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
