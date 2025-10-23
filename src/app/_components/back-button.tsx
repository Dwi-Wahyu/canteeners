"use client";

import { Button } from "@/components/ui/button";
import { IconChevronLeft } from "@tabler/icons-react";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";

export default function BackButton({ url }: { url?: string }) {
  const router = useRouter();

  if (!url) {
    return (
      <Button onClick={() => router.back()} size={"icon"} variant={"outline"}>
        <IconChevronLeft />
      </Button>
    );
  }

  return (
    <Button variant={"outline"} asChild size={"icon"}>
      <Link href={url}>
        <IconChevronLeft />
      </Link>
    </Button>
  );
}
