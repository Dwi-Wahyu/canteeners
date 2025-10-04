"use client";

import { Frown, SearchX } from "lucide-react"; // Menggunakan ikon Frown dan SearchX dari lucide-react
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";

interface NotFoundPageProps {
  title?: string;
  description?: string;
}

export default function NotFoundResource({
  title = "Halaman Tidak Ditemukan",
  description = "Maaf, sumber daya yang Anda cari tidak ditemukan. Mungkin halaman telah dihapus, namanya diubah, atau Anda mengetikkan alamat yang salah.",
}: NotFoundPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center sm:p-6 lg:p-8">
      <Card className="text-center max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        <CardContent>
          <div className="mb-6">
            <SearchX className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-secondary mx-auto drop-shadow-lg" />
            {/* <Frown className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-secondary mx-auto drop-shadow-lg" /> */}
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-secondary mb-4 leading-tight">
            {title}
          </h1>

          {description && (
            <p className="text-card-foreground mb-6">{description}</p>
          )}

          <div className="flex flex-col items-center md:flex-row justify-center gap-2">
            <Link href="/" passHref>
              <Button>Kembali ke Beranda</Button>
            </Link>
            <Button
              variant="outline"
              className="w-fit"
              onClick={() => router.back()}
            >
              Kembali ke Halaman Sebelumnya
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
