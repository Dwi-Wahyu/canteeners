"use client";

import { ShieldX, Lock, ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  const router = useRouter();

  function handleLogout() {
    signOut({
      redirect: false,
    });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-col items-center sm:p-6 lg:p-8">
      <Card className="text-center max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        <CardContent>
          <div className="mb-6">
            <ShieldX className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-red-500 mx-auto drop-shadow-lg" />
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-700 mb-4 leading-tight">
            Akses Ditolak
          </h1>

          <p className="text-card-foreground mb-6">
            Maaf, Anda tidak memiliki izin untuk mengakses halaman ini. Konten
            yang Anda coba kunjungi mungkin memerlukan hak akses khusus atau
            peran yang berbeda.
          </p>

          <div className="flex flex-col items-center md:flex-row justify-center gap-2">
            <Link href="/admin" passHref>
              <Button>
                <ArrowLeftCircle className="w-5 h-5" /> Kembali ke Dashboard
              </Button>
            </Link>
            <Button variant="outline" className="w-fit" onClick={handleLogout}>
              <Lock className="w-5 h-5" /> Login Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
