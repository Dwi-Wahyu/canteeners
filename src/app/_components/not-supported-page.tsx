"use client";

import { AlertCircle, FileWarning, ArrowLeftCircle } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IconDeviceImacStar } from "@tabler/icons-react";

interface NotSupportedPageProps {
  title?: string;
  description?: string;
}

export default function NotSupportedPage({
  title = "Fitur Belum Didukung",
  description = "Maaf, fitur ini belum didukung untuk data atau pengaturan yang Anda gunakan.",
}: NotSupportedPageProps) {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center">
      <Card className="text-center max-w-lg w-full transform transition-all duration-300 hover:scale-[1.02] shadow-xl">
        <CardHeader className="rounded-t-lg">
          <div className="mb-4">
            <IconDeviceImacStar className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 text-orange-500 mx-auto drop-shadow-lg" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-orange-700 mb-2 leading-tight">
            {title}
          </CardTitle>
          <CardDescription className="text-orange-600 font-semibold text-lg">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            Silakan hubungi tim dukungan teknis untuk meminta akses ke fitur
            ini.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center mt-4">
          <Button onClick={() => router.back()} className="w-fit">
            <ArrowLeftCircle className="w-5 h-5 mr-2" /> Kembali
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
