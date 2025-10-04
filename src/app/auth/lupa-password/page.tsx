import { Card, CardContent } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { NavigationButton } from "../../_components/navigation-button";
import { ChevronLeft } from "lucide-react";

export default async function LupaPasswordPage() {
  const allAdmin = await prisma.user.findMany({
    where: {
      role: "admin",
    },
    select: {
      phone_number: true,
      name: true,
      avatar: true,
    },
  });

  const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL;

  return (
    <div className="flex gap-4 justify-center items-center flex-col h-svh p-6">
      <h1 className="text-lg font-semibold leading-tight">Lupa Password</h1>
      <h1 className="text-muted-foreground text-sm text-center">
        Silahkan Hubungi Salah Satu Admin Yang Terdaftar, Untuk Merubah Password
        Akun Anda
      </h1>

      <div className="flex gap-4 my-2">
        {allAdmin.length > 0 ? (
          <div className="flex gap-4">
            {/* {allAdmin.map((admin, idx) => (
              <Card key={idx}>
                <CardContent className="flex flex-col gap-1 items-center justify-center">
                  <Avatar className="size-14">
                    <AvatarImage
                      src={admin.avatar ?? "/uploads/avatar/default-avatar.jpg"}
                      alt={admin.name}
                    />
                    <AvatarFallback className="text-xs">HR</AvatarFallback>
                  </Avatar>

                  <h1 className="font-semibold text-lg mt-1">{admin.name}</h1>
                  <h1 className="text-muted-foreground">
                    {admin.phone_number ?? "-"}
                  </h1>
                </CardContent>
              </Card>
            ))} */}
          </div>
        ) : null}
      </div>

      <NavigationButton url="/" size="lg">
        <ChevronLeft />
        Kembali
      </NavigationButton>
    </div>
  );
}
