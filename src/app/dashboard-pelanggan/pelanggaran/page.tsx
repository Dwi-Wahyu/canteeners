"use client";

import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";
import { Button } from "@/components/ui/button";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { IconUserCheck } from "@tabler/icons-react";

export default function CustomerViolationsPage() {
  return (
    <div>
      <TopbarWithBackButton title="Pelanggaran" />

      <Empty className="border">
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

      <Button
        className="mt-4"
        onClick={() => {
          notificationDialog.success({
            title: "Sukses",
            message: "sukses bos",
          });
        }}
      >
        Tampilkan
      </Button>
    </div>
  );
}
