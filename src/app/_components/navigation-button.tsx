"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "nextjs-toploader/app";
import { ReactNode } from "react";

export function BackButton({ label = "Kembali" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      onClick={() => router.back()}
      variant={"outline"}
      type="button"
      size={label === null ? "icon" : "default"}
    >
      {label}
    </Button>
  );
}

export function NavigationButton({
  label = "Kembali",
  url,
  size = "default",
  children,
  variant = "outline",
}: {
  label?: string;
  url: string;
  size?: "default" | "sm" | "lg" | "icon";
  children?: ReactNode;
  variant?:
    | "default"
    | "link"
    | "success"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost";
}) {
  return (
    <Link href={url} passHref>
      <Button variant={variant} type="button" size={size}>
        {children ?? label}
      </Button>
    </Link>
  );
}
