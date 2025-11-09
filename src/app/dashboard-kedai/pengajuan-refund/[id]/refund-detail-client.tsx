"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { getRefund } from "../queries";
import {
  refundDisbursementModeMapping,
  refundReasonMapping,
  refundStatusMapping,
} from "@/constant/refund-mapping";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Image from "next/image";
import { NavigationButton } from "@/app/_components/navigation-button";
import { IconMessageCircle, IconReceipt } from "@tabler/icons-react";
import { formatToHour } from "@/helper/hour-helper";
import { formatDateWithoutYear } from "@/helper/date-helper";
import TolakRefundDialog from "./tolak-refund-dialog";
import CustomBadge from "@/components/custom-badge";
import { RefundStatus } from "@/app/generated/prisma";
import ConfirmRefundDialog from "./confirm-refund-dialog";
import SendDisbursementDialog from "./send-disbursement-dialog";
import Link from "next/link";

export default function RefundDetailClient({
  refund,
}: {
  refund: NonNullable<Awaited<ReturnType<typeof getRefund>>>;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-2">
        <div className="flex justify-between items-center mb-2">
          <div className="flex gap-2 items-center">
            <Avatar className="size-10">
              <AvatarImage
                src={"/uploads/avatar/" + refund.order.customer.avatar}
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>

            <div>
              <CardTitle className="mb-1">
                {refund.order.customer.name}
              </CardTitle>
              <CardDescription>
                {formatDateWithoutYear(refund.requested_at)}{" "}
                {formatToHour(refund.requested_at)}
              </CardDescription>
            </div>
          </div>

          <div className="flex gap-2">
            <NavigationButton url={"/order/" + refund.order.id}>
              <IconReceipt />
            </NavigationButton>

            <NavigationButton
              url={"/dashboard-kedai/chat/" + refund.order.conversation_id}
            >
              <IconMessageCircle />
            </NavigationButton>
          </div>
        </div>

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
          <h1 className="font-semibold">Status</h1>

          <CustomBadge
            value={refund.status}
            successValues={[RefundStatus.APPROVED, RefundStatus.PROCESSED]}
            outlineValues={[RefundStatus.PENDING]}
            destructiveValues={[RefundStatus.REJECTED]}
          >
            {refundStatusMapping[refund.status]}
          </CustomBadge>
        </div>

        <div>
          <h1 className="font-semibold">Mode Pengembalian Dana</h1>

          <h1 className="text-muted-foreground">
            {refundDisbursementModeMapping[refund.disbursement_mode]}
          </h1>
        </div>

        {refund.status === "REJECTED" && (
          <div>
            <h1 className="font-semibold">Alasan Ditolak</h1>

            <h1 className="text-muted-foreground break-words">
              {refund.rejected_reason}
            </h1>
          </div>
        )}

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
            <div className="text-muted-foreground">
              Tidak ada bukti komplain
            </div>
          )}
        </div>

        {refund.order.payment_method !== "CASH" &&
          refund.status === "APPROVED" && (
            <div className="mt-2">
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
                    alt="bukti pengembalian ana"
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

        <div className="flex flex-col gap-4 mt-2">
          {refund.status === "PENDING" && <TolakRefundDialog id={refund.id} />}

          {refund.order.payment_method !== "CASH" &&
            refund.status === "APPROVED" &&
            !refund.disbursement_proof_url && (
              <SendDisbursementDialog refund_id={refund.id} />
            )}

          {refund.status === "PENDING" && (
            <ConfirmRefundDialog
              id={refund.id}
              order_payment_method={refund.order.payment_method}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
}
