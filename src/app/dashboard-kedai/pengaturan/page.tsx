import { Card, CardContent } from "@/components/ui/card";

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/config/auth";
import { redirect } from "next/navigation";
import {
  IconBell,
  IconChevronRight,
  IconCreditCard,
  IconExclamationCircle,
  IconFileTextShield,
  IconMessageUser,
  IconUserEdit,
} from "@tabler/icons-react";
import { MessagesSquare, Store } from "lucide-react";
import Link from "next/link";
import LogoutButtonDialog from "@/app/dashboard-pelanggan/pengaturan/logout-button-dialog";

export default async function OwnerSettingsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div className="">
      <h1 className="mb-2 font-semibold">Personal</h1>
      <Link href={"/pengaturan/profil/edit"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconUserEdit className="w-5 h-5" />
              <h1>Edit Profil Anda</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Link href={"/pengaturan/profil-kedai/edit"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <Store className="w-5 h-5" />
              <h1>Edit Profil Kedai</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Link href={"/pengaturan/pesan-singkat"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <MessagesSquare className="w-5 h-5" />
              <h1>Pesan Singkat</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <LogoutButtonDialog />

      <h1 className="mt-2 mb-2 font-semibold">Notifikasi</h1>
      <Link href={"/pengaturan/notifikasi"}>
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconBell className="w-5 h-5" />
              <h1>Atur Notifikasi</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <h1 className="mt-4 mb-2 font-semibold">Pembayaran</h1>
      <Link href={"/pengaturan/metode-pembayaran"}>
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconCreditCard className="w-5 h-5" />
              <h1>Metode Pembayaran</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <h1 className="mt-4 mb-2 font-semibold">Tentang Aplikasi</h1>
      <Link href={"/pengaturan/kebijakan-privasi"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconFileTextShield className="w-5 h-5" />
              <h1>Kebijakan & Privasi</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Link href={"/pengaturan/kebijakan-privasi"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconExclamationCircle className="w-5 h-5" />
              <h1>Versi Aplikasi</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>

      <Link href={"/pengaturan/kebijakan-privasi"} className="mb-4 block">
        <Card className="p-4">
          <CardContent className="flex px-0 justify-between items-center">
            <div className="flex gap-2 items-center">
              <IconMessageUser className="w-5 h-5" />
              <h1>Pusat Bantuan</h1>
            </div>

            <IconChevronRight className="text-muted-foreground" />
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
