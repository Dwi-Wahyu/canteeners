import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDate } from "@/helper/date-helper";
import { getUserById } from "../queries";
import { NavigationButton } from "@/app/_components/navigation-button";
import NotFoundResource from "@/app/_components/not-found-resource";
import { ChevronLeft, Edit } from "lucide-react";

export default async function DetailEmployeePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  const { id } = await params;

  const userData = await getUserById(id);

  if (!userData) {
    return <NotFoundResource />;
  }

  if (!ADMIN_URL) {
    return <NotFoundResource />;
  }

  const AVATAR_URL = ADMIN_URL + userData.avatar;

  const backUrl =
    userData.role === "admin"
      ? "/admin/users/admin"
      : "/admin/users/pekerja-lapangan";

  const editUrl =
    userData.role === "admin"
      ? "/admin/users/admin/edit/" + userData.id
      : "/admin/users/pekerja-lapangan/edit/" + userData.id;

  return (
    <div className="relative container py-4">
      <Card className="animate-in w-full mx-auto max-w-lg fade-in duration-500 shadow-lg">
        <CardContent className="space-y-6 pt-3">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-36 w-36 border-4 border-accent shadow-lg">
              <AvatarImage
                src={AVATAR_URL}
                alt={userData.name || "User Avatar"}
              />
              <AvatarFallback className="bg-muted text-muted-foreground text-4xl font-bold">
                {userData.name ? userData.name.charAt(0).toUpperCase() : "U"}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <h1 className="text-2xl font-bold">{userData.name}</h1>
              <p className="text-sm text-muted-foreground">
                {userData.username}
              </p>
            </div>
          </div>

          <hr />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Nomor Telepon</p>
              <p className="font-medium">{userData.phone_number || "-"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="font-medium">{userData.email || "-"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userData.last_login && (
              <div>
                <p className="text-sm text-muted-foreground">Terakhir Login</p>
                <p className="font-medium">{formatDate(userData.last_login)}</p>
              </div>
            )}
            <div>
              <p className="text-sm text-muted-foreground">Akun Dibuat Pada</p>
              <p className="font-medium">{formatDate(userData.created_at)}</p>
            </div>
          </div>

          <div className="flex justify-center items-center gap-4">
            <NavigationButton url={backUrl} label="Kembali">
              <ChevronLeft />
              Kembali
            </NavigationButton>
            <NavigationButton url={editUrl} variant="default">
              <Edit />
              Edit
            </NavigationButton>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
