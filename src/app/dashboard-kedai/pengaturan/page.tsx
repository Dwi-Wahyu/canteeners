"use client";

import LoadingUserSessionPage from "@/app/_components/loading-user-session-page";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IconDoorExit, IconEdit, IconPlus } from "@tabler/icons-react";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import AddShopPaymentMethodDialog from "./add-shop-payment-method-dialog";
import { getUserProfile } from "@/app/admin/users/queries";

type UserProfile = Awaited<ReturnType<typeof getUserProfile>>;

export default function PengaturanPage() {
  const session = useSession();
  const [userProfile, setUserProfile] = useState<UserProfile>(null);

  function handleLogout() {
    signOut({
      redirectTo: "/auth/signin",
    });
  }

  useEffect(() => {
    if (session.data) {
      getUserProfile(session.data.user.id).then((data) => {
        setUserProfile(data);
      });
    }
  }, [session.data]);

  if (session.status === "loading") {
    return <LoadingUserSessionPage />;
  }

  if (!session.data) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <h1 className="text-xl mb-5 font-semibold">Pengaturan</h1>

      {userProfile ? (
        <>
          <Card>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <h1 className="text-lg font-semibold">Profil Anda</h1>

                <Button onClick={handleLogout} size={"sm"}>
                  <IconDoorExit />
                  Logout
                </Button>
              </div>

              {userProfile && (
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Avatar className="size-10">
                      <AvatarImage
                        src={
                          userProfile.avatar ??
                          "/uploads/avatar/default-avatar.jpg"
                        }
                      />
                      <AvatarFallback>
                        {userProfile.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="leading-tight">
                      <h1 className="font-semibold">{userProfile.name}</h1>
                      <h1>{userProfile.username}</h1>
                    </div>
                  </div>

                  <div className="mt-2">
                    <h1>Login Terakhir Pada</h1>
                    <h1 className="text-muted-foreground">
                      {formatDateToYYYYMMDD(userProfile.last_login)}{" "}
                      {formatToHour(userProfile.last_login)}
                    </h1>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {userProfile.shop_owned && (
            <Card className="mt-5">
              <CardContent className="flex flex-col gap-4">
                <div className="flex justify-between items-center mb-2">
                  <h1 className="text-lg font-semibold">Profil Warung</h1>

                  <Button onClick={handleLogout} size={"sm"}>
                    Ubah Data
                  </Button>
                </div>

                <img
                  src={userProfile.shop_owned.image_url}
                  alt=""
                  className="rounded-xl"
                />

                <div>
                  <h1>Nama</h1>
                  <h1 className="text-muted-foreground">
                    {userProfile.shop_owned.name}
                  </h1>
                </div>

                <div>
                  <h1>Deskripsi</h1>
                  <h1 className="text-muted-foreground">
                    {userProfile.shop_owned.description}
                  </h1>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <h1>Metode Pembayaran</h1>

                    <AddShopPaymentMethodDialog
                      shop_id={userProfile.shop_owned.id}
                    />
                  </div>

                  {userProfile.shop_owned.payments.length === 0 ? (
                    <div className="text-muted-foreground">
                      Belum ada metode pembayaran
                    </div>
                  ) : (
                    <>
                      {userProfile.shop_owned.payments.map((payment) => (
                        <div key={payment.id}>
                          <h1>{payment.method}</h1>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <div>
          <h1>Data Profil Tidak Ditemukan</h1>
        </div>
      )}
    </div>
  );
}
