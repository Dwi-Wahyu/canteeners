"use client";

import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export default function BackButton({ url }: { url?: string }) {
  const router = useRouter();

  if (!url) {
    return (
      <button onClick={() => router.back()}>
        <IconChevronLeft className="w-5 h-5 mr-2 cursor-pointer" />
      </button>
    );
  }

  return (
    <Link href={url}>
      <IconChevronLeft className="w-5 h-5 mr-2 cursor-pointer" />
    </Link>
  );
}
