"use client";

import { Card, CardContent } from "@/components/ui/card";
import { IconLoader, IconUserScan } from "@tabler/icons-react";
import { LoaderPinwheel } from "lucide-react";

export default function LoadingUserSessionPage() {
  return (
    <div className="flex flex-col items-center sm:p-6 lg:p-8">
      <Card className="text-center max-w-lg w-full transform transition-all duration-300 hover:scale-105 bg-card text-card-foreground">
        <CardContent className="p-8">
          <div className="mb-6">
            <IconUserScan className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-primary mx-auto drop-shadow-lg" />
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary mb-4 leading-tight">
            Memuat Sesi
          </h1>
          <p className="text-card-foreground mb-6">
            Mohon tunggu. Kami sedang memuat informasi sesi login Anda.
          </p>
          <div className="flex flex-col items-center md:flex-row justify-center gap-2">
            <div className="flex items-center gap-2">
              <IconLoader className="animate-spin w-5 h-5" />
              <span className="text-sm">Memeriksa kredensial...</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
