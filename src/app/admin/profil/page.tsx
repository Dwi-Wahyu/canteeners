import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import UnauthorizedPage from "../../_components/unauthorized-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { NavigationButton } from "../../_components/navigation-button";
import { formatDate } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { IconPasswordUser, IconUserEdit } from "@tabler/icons-react";

export default async function ProfilePage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const user_details = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!user_details) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="container">
      <Card className="w-full max-w-lg mx-auto shadow-lg">
        <CardHeader className="flex flex-col items-center gap-4">
          <Avatar className="w-24 h-24">
            <AvatarImage
              src={
                user_details.avatar || "https://api.dicebear.com/7.x/shapes/svg"
              }
              alt={user_details.name}
            />
            <AvatarFallback>
              <User2 className="w-12 h-12" />
            </AvatarFallback>
          </Avatar>
          <div className="text-center">
            <CardTitle className="text-2xl font-bold">
              {user_details.name}
            </CardTitle>
            <CardDescription className="text-lg mb-3">
              {user_details.username}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-sm">
            {/* <div className="p-4 border rounded-lg">
              <p className="font-semibold">Email</p>
              {user_details.email ? (
                <p>{user_details.email}</p>
              ) : (
                <p className="text-muted-foreground">Belum menetapkan email</p>
              )}
            </div>

            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Nomor HP</p>
              {user_details.phone_number ? (
                <p>{user_details.phone_number}</p>
              ) : (
                <p className="text-muted-foreground">
                  Belum menetapkan nomor HP
                </p>
              )}
            </div> */}

            <div className="p-4 border rounded-lg">
              <p className="font-semibold">Akun Dibuat Pada</p>
              <p>{formatDate(user_details.created_at)}</p>
            </div>
            {user_details.last_login && (
              <div className="p-4 border rounded-lg">
                <p className="font-semibold">Terakhir Login</p>
                <p>
                  {formatDate(user_details.last_login)}{" "}
                  {formatToHour(user_details.last_login)}
                </p>
              </div>
            )}
          </div>

          <div className="flex justify-center mt-6 gap-2">
            <NavigationButton url="/admin/ganti-password">
              <IconPasswordUser />
              Ganti Password
            </NavigationButton>

            <NavigationButton url="/admin/profil/ubah-data" variant="default">
              <IconUserEdit /> Ubah Data
            </NavigationButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
