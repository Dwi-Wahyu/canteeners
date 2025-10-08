import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";
import { IconUsers } from "@tabler/icons-react";
import {
  BanknoteArrowDown,
  BanknoteArrowUp,
  DollarSign,
  MessageCircleDashed,
} from "lucide-react";

export default async function DashboardWarungAnda() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div>
      <h1>
        Selamat Datang,{" "}
        <span className="font-semibold text-primary">{session.user.name}</span>
      </h1>

      <div className="my-4 grid md:grid-cols-4 grid-cols-1 gap-4">
        <DashboardCard
          icon={<DollarSign />}
          title="Keuntungan"
          value="24.000"
        />

        <DashboardCard
          icon={<BanknoteArrowDown />}
          title="Transaksi Belum Selesai"
          value="3"
        />

        <DashboardCard
          icon={<BanknoteArrowUp />}
          title="Transaksi Selesai"
          value="10"
        />

        <DashboardCard
          icon={<MessageCircleDashed />}
          title="Pesan Belum Dibaca"
          value="23"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex justify-between items-center">
        <div>
          <CardTitle>{title}</CardTitle>

          <h1 className="mt-2 text-lg font-semibold">{value}</h1>
        </div>

        {icon}
      </CardContent>
    </Card>
  );
}
