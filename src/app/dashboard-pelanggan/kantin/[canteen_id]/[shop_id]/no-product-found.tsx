"use client";

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconTrash } from "@tabler/icons-react";
import React from "react";

export default function NoProductFound({
  clearFilterButton,
}: {
  clearFilterButton?: React.ReactNode;
}) {
  return (
    <Empty className="border mt-4">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconTrash />
        </EmptyMedia>
        <EmptyTitle>Produk Tidak Ditemukan</EmptyTitle>
        <EmptyDescription>
          Hmm... sepertinya belum ada produk yang cocok. Coba ubah filter atau
          lihat kategori lainnya, ya!
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>{clearFilterButton}</EmptyContent>
    </Empty>
  );
}
