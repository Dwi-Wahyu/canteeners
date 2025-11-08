import TopbarWithBackButton from "@/components/layouts/topbar-with-backbutton";

import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { auth } from "@/config/auth";
import {
  IconExclamationCircle,
  IconReceipt,
  IconUserCheck,
  IconUserExclamation,
} from "@tabler/icons-react";
import { redirect } from "next/navigation";
import { getCustomerViolation } from "./queries";

import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemHeader,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import {
  customerViolationDescriptionMapping,
  customerViolationIconMapping,
  customerViolationTitleMapping,
} from "@/constant/customer-violation-mapping";
import { formatDateToYYYYMMDD } from "@/helper/date-helper";
import { formatToHour } from "@/helper/hour-helper";
import NotFoundResource from "@/app/_components/not-found-resource";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function CustomerViolationsPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  const customerData = await getCustomerViolation(session.user.id);

  if (!customerData) {
    return <NotFoundResource title="Data Kustomer Tidak Ditemukan" />;
  }

  return (
    <div>
      <TopbarWithBackButton
        title="Pelanggaran"
        backUrl="/dashboard-pelanggan/pengaturan"
      />

      {customerData.customer_violations.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconUserCheck />
            </EmptyMedia>
            <EmptyTitle>Kamu belum punya pelanggaran</EmptyTitle>
            <EmptyDescription>
              Transaksi aman, ulasan jujur, dan kepatuhanmu membantu menjaga
              pasar yang adil untuk semua pengguna. Tetap belanja dengan tenang!
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="flex flex-col gap-4">
          <div className="flex gap-2 flex-col p-4 rounded-lg shadow justify-center bg-destructive text-destructive-foreground">
            <div className="flex gap-1 items-center">
              <IconUserExclamation className="w-5 h-5" />

              <h1 className="font-semibold">Anda Sedang Di Suspend</h1>
            </div>
            <h1 className="text-sm">
              Dengan alasan{" "}
              <span className="font-semibold">
                {customerData.customer_profile?.suspend_reason}
              </span>{" "}
              anda dapat membuat pesanan lagi pada{" "}
              {formatDateToYYYYMMDD(
                customerData.customer_profile?.suspend_until
              )}{" "}
              {formatToHour(customerData.customer_profile?.suspend_until)}
            </h1>
          </div>

          {customerData.customer_violations.map((violation, idx) => (
            <Item key={idx} variant={"outline"}>
              <ItemHeader>
                <h1 className="text-muted-foreground">
                  {formatDateToYYYYMMDD(violation.timestamp)}{" "}
                  {formatToHour(violation.timestamp)}
                </h1>
              </ItemHeader>
              <ItemMedia variant={"icon"}>
                {customerViolationIconMapping[violation.type]}
              </ItemMedia>
              <ItemContent>
                <ItemTitle>
                  {customerViolationTitleMapping[violation.type]}
                </ItemTitle>
                <ItemDescription>
                  {customerViolationDescriptionMapping[violation.type]}
                </ItemDescription>
              </ItemContent>
              <ItemActions>
                {violation.type === "ORDER_CANCEL_WITHOUT_PAY" && (
                  <Button size={"icon"} variant={"outline"} asChild>
                    <Link
                      href={"/dashboard-pelanggan/order/" + violation.order_id}
                    >
                      <IconReceipt />
                    </Link>
                  </Button>
                )}
              </ItemActions>
            </Item>
          ))}
        </div>
      )}
    </div>
  );
}
