"use client";

import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export default function BackButton({ url }: { url?: string }) {
  const router = useRouter();

  if (!url) {
    return (
      <button
        onClick={() => router.back()}
        className="flex gap-1 cursor-pointer items-center text-sm text-muted-foreground"
      >
        <IconChevronLeft className="w-4 h-4" />
        Kembali
      </button>
    );
  }

  return (
    <Link
      href={url}
      className="flex gap-1 cursor-pointer items-center text-sm text-muted-foreground"
    >
      <IconChevronLeft className="w-4 h-4" />
      Kembali
    </Link>
  );
}
