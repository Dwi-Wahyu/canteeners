"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  refundDisbursementModeMapping,
  refundReasonMapping,
  refundStatusMapping,
} from "@/constant/refund-mapping";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { NavigationButton } from "@/app/_components/navigation-button";
import { IconCheck, IconMessageCircle, IconReceipt } from "@tabler/icons-react";
import { formatToHour } from "@/helper/hour-helper";
import { formatDateWithoutYear } from "@/helper/date-helper";
import CustomBadge from "@/components/custom-badge";
import { RefundStatus } from "@/app/generated/prisma";
import { Button } from "@/components/ui/button";
import { getCustomerRefund } from "../queries";
import Link from "next/link";
import ConfirmDisbursementDialog from "./confirm-disbursement-dialog";

export default function RefundDetailClient({
  refund,
}: {
  refund: NonNullable<Awaited<ReturnType<typeof getCustomerRefund>>>;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <Avatar className="size-10">
              <AvatarImage
                src={"/uploads/avatar/" + refund.order.shop.owner.avatar}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="mb-1">
                {refund.order.shop.owner.name}
              </CardTitle>
              <CardDescription>{refund.order.shop.name}</CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <NavigationButton size="sm" url={"/order/" + refund.order.id}>
              <IconReceipt />
            </NavigationButton>

            <NavigationButton
              size="sm"
              url={"/dashboard-kedai/chat/" + refund.order.conversation_id}
            >
              <IconMessageCircle />
            </NavigationButton>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div>
            <h1 className="font-semibold">Jumlah</h1>
            <h1 className="text-muted-foreground">Rp {refund.amount}</h1>
          </div>

          <div>
            <h1 className="font-semibold">Alasan</h1>
            <h1 className="text-muted-foreground">
              {refundReasonMapping[refund.reason]}
            </h1>
          </div>

          {refund.description && (
            <div>
              <h1 className="font-semibold">Keterangan</h1>
              <h1 className="text-muted-foreground break-words">
                {refund.description}
              </h1>
            </div>
          )}

          <div>
            <h1 className="font-semibold">Mode Pengembalian Dana</h1>
            <h1 className="text-muted-foreground break-words">
              {refundDisbursementModeMapping[refund.disbursement_mode]}
            </h1>
          </div>

          <div>
            <h1 className="font-semibold">Diajukan Pada</h1>
            <h1 className="text-muted-foreground break-words">
              {formatDateWithoutYear(refund.requested_at)}{" "}
              {formatToHour(refund.requested_at)}
            </h1>
          </div>

          <div>
            <h1 className="font-semibold">Status</h1>

            <CustomBadge
              value={refund.status}
              successValues={[RefundStatus.APPROVED]}
              outlineValues={[RefundStatus.PENDING]}
              destructiveValues={[RefundStatus.REJECTED]}
            >
              {refundStatusMapping[refund.status]}
            </CustomBadge>
          </div>

          {refund.status === "REJECTED" && (
            <div>
              <h1 className="font-semibold">Alasan Ditolak</h1>

              <h1 className="text-muted-foreground break-words">
                {refund.rejected_reason}
              </h1>
            </div>
          )}
        </div>

        <div>
          <h1 className="font-semibold mb-1">Bukti Komplain</h1>
          {refund.complaint_proof_url ? (
            <Link
              href={"/uploads/complaint-proof/" + refund.complaint_proof_url}
            >
              <Image
                src={"/uploads/complaint-proof/" + refund.complaint_proof_url}
                alt="bukti refund"
                className="rounded-lg"
                width={400}
                height={300}
              />
            </Link>
          ) : (
            <div className="text-muted-foreground">Tidak ada bukti refund</div>
          )}
        </div>

        {refund.disbursement_mode !== "CASH" &&
          (refund.status === "APPROVED" || refund.status === "PROCESSED") && (
            <div>
              <h1 className="font-semibold mb-1">Bukti Pengembalian Dana</h1>

              {refund.disbursement_proof_url ? (
                <Link
                  href={
                    "/uploads/disbursement-proof/" +
                    refund.disbursement_proof_url
                  }
                >
                  <Image
                    src={
                      "/uploads/disbursement-proof/" +
                      refund.disbursement_proof_url
                    }
                    alt="bukti pengembalian Dana"
                    className="rounded-lg"
                    width={400}
                    height={300}
                  />
                </Link>
              ) : (
                <div className="text-muted-foreground">
                  Belum mengirim bukti
                </div>
              )}
            </div>
          )}

        {refund.order.payment_method === "CASH" &&
          refund.status === "APPROVED" && (
            <Alert variant="success">
              <AlertTitle>Dana Refund Anda Telah Disetujui !</AlertTitle>
              <AlertDescription>
                Pengajuan refund Anda telah disetujui dan dana telah disiapkan.
                Anda dipersilakan untuk mengambil dana refund di kedai kami pada
                jam operasional. Setelah dana diterima, mohon klik tombol "Saya
                Sudah Menerima Dana" untuk menyelesaikan proses ini.
              </AlertDescription>
            </Alert>
          )}

        {refund.order.payment_method === "CASH" &&
          refund.status === "PROCESSED" && (
            <Alert variant="success">
              <AlertTitle>Pengembalian Dana Telah Direkam</AlertTitle>
              <AlertDescription>
                Kami telah mencatat pengembalian dana Anda. Jika Anda belum
                menerima dana tersebut, silakan hubungi customer service untuk
                tindakan lebih lanjut.
              </AlertDescription>
            </Alert>
          )}

        {refund.status !== "PROCESSED" && (
          <div className="flex flex-col gap-4">
            {refund.status === "PENDING" && (
              <Button size={"lg"} variant={"outline"}>
                Edit Pengajuan
              </Button>
            )}

            {refund.status === "PENDING" && (
              <Button size={"lg"} variant={"destructive"}>
                Hapus Pengajuan
              </Button>
            )}

            {refund.status === "APPROVED" && (
              <ConfirmDisbursementDialog refund_id={refund.id} />
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
