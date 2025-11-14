import NotFoundResource from "@/app/_components/not-found-resource";
import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import BackButton from "@/app/_components/back-button";
import { IconSettings } from "@tabler/icons-react";
import { formatDate } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import { Button } from "@/components/ui/button";

export default async function CustomerProfilePage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const data = await prisma.user.findFirst({
    where: {
      id: session.user.id,
    },
  });

  if (!data) {
    return <NotFoundResource />;
  }

  return (
    <div className="h-screen bg-gradient-to-b from-primary via-background to-background relative">
      <div className="p-5 text-primary-foreground flex justify-between items-center">
        <div className="flex items-center">
          <BackButton />
          <h1 className="text-lg font-semibold">Profil</h1>
        </div>
      </div>

      <div className="h-[80vh] fixed bottom-0 left-0 w-full rounded-t-4xl shadow p-5 bg-card">
        <div className="text-center w-full absolute left-0 -top-10 text-primary-foreground">
          <h1 className="text-sm">
            Terakhir login {formatDate(data.last_login)}{" "}
            {formatToHour(data.last_login)}
          </h1>
        </div>

        <div className="flex gap-4 w-full items-center">
          <Avatar className="size-14">
            <AvatarImage
              src={"/uploads/avatar/" + data.avatar}
              alt={data.name}
            />
            <AvatarFallback className="text-xs">HR</AvatarFallback>
          </Avatar>

          <div className="">
            <h1 className="text-xl font-semibold">{data.name}</h1>
            <h1>{data.username}</h1>
          </div>
        </div>

        <div className="flex mt-4 flex-col gap-2">
          <div>
            <h1 className="font-medium">Email</h1>
            <h1 className="text-muted-foreground">{data.email ?? "-"}</h1>
          </div>

          <div>
            <h1 className="font-medium">Nomor Telepon</h1>
            <h1 className="text-muted-foreground">
              {data.phone_number ?? "-"}
            </h1>
          </div>
        </div>

        <div className="mt-4">
          <Button size={"lg"}>Ubah Password</Button>
        </div>
      </div>
    </div>
  );
}
