"use client";

import { IconChevronLeft } from "@tabler/icons-react";
import { useRouter } from "nextjs-toploader/app";

export default function TitleWithPrevButton({
  title,
  url,
}: {
  title: string;
  url?: string;
}) {
  const router = useRouter();

  function handlePrev() {
    if (url) {
      router.push(url);
    } else {
      router.back();
    }
  }

  return (
    <div className="flex gap-2 items-center">
      <button onClick={handlePrev} className="hover:cursor-pointer">
        <IconChevronLeft />
      </button>

      <h1 className="text-lg font-semibold">{title}</h1>
    </div>
  );
}
