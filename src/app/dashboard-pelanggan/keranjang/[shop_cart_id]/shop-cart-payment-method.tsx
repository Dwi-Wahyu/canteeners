import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getCustomerShopCart } from "../server-queries";
import { IconCash, IconQrcode, IconTransferOut } from "@tabler/icons-react";
import { PaymentMethod } from "@/app/generated/prisma";
import { paymentMethodMapping } from "@/constant/payment-method";
import { Checkbox } from "@/components/ui/checkbox";

export default function ShopCartPaymentMethod({
  shopPayments,
  paymentMethod,
  setPaymentMethod,
}: {
  shopPayments: NonNullable<
    Awaited<ReturnType<typeof getCustomerShopCart>>
  >["shop"]["payments"];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
}) {
  function getPaymentMethodIcon(method: PaymentMethod) {
    switch (method) {
      case "CASH":
        return <IconCash />;
      case "BANK_TRANSFER":
        return <IconTransferOut />;
      case "QRIS":
        return <IconQrcode />;
      default:
        return <IconCash />;
    }
  }

  return (
    <div className="mb-5">
      <h1 className="font-semibold mb-2">Pilih Metode Pembayaran</h1>

      <div className="flex flex-col gap-3">
        {shopPayments.map((payment, idx) => (
          <Item
            onClick={() => setPaymentMethod(payment.method)}
            key={idx}
            variant={"outline"}
          >
            <ItemMedia>{getPaymentMethodIcon(payment.method)}</ItemMedia>
            <ItemContent>
              <ItemTitle>{paymentMethodMapping[payment.method]}</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Checkbox checked={payment.method === paymentMethod} />
            </ItemActions>
          </Item>
        ))}
      </div>
    </div>
  );
}
