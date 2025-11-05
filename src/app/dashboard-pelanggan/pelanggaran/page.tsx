"use client";

import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconUserCheck } from "@tabler/icons-react";

export default function CustomerViolationsPage() {
  return (
    <div>
      <TopbarWithBackButton
        title="Pelanggaran"
        backUrl="/dashboard-pelanggan/pengaturan"
      />

      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconUserCheck />
          </EmptyMedia>
          <EmptyTitle>Kamu belum punya pelanggaran</EmptyTitle>
          <EmptyDescription>
            Transaksi aman, ulasan jujur, dan kepatuhanmu membantu menjaga pasar
            yang adil untuk semua pengguna. Tetap belanja dengan tenang!
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}
