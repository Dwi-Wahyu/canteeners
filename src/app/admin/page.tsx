import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import DashboardCard from "../_components/dashboard-card";

import { getUserSum } from "./users/queries";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const userSum = await getUserSum();

  return (
    <div>
      <h1 className="mb-4 font-semibold text-primary-foreground text-xl">
        Selamat Datang, {session.user.name}
      </h1>
    </div>
  );
}
