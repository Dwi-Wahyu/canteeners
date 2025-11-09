import {
  Item,
  ItemActions,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
import { getCustomerShopCart } from "../server-queries";
import { IconCash, IconCreditCard, IconQrcode } from "@tabler/icons-react";
import { PaymentMethod } from "@/app/generated/prisma";
import { paymentMethodMapping } from "@/constant/payment-method";
import { toast } from "sonner";

export default function ShopCartPaymentMethod({
  shopPayments,
  paymentMethod,
  setPaymentMethod,
  disabled,
}: {
  shopPayments: NonNullable<
    Awaited<ReturnType<typeof getCustomerShopCart>>
  >["shop"]["payments"];
  paymentMethod: PaymentMethod;
  setPaymentMethod: (method: PaymentMethod) => void;
  disabled: boolean;
}) {
  function getPaymentMethodIcon(method: PaymentMethod) {
    switch (method) {
      case "CASH":
        return <IconCash />;
      case "BANK_TRANSFER":
        return <IconCreditCard />;
      case "QRIS":
        return <IconQrcode />;
      default:
        return <IconCash />;
    }
  }

  return (
    <div>
      <h1 className="font-semibold mb-2">Pilih Metode Pembayaran</h1>

      <div className="flex flex-col gap-3">
        {shopPayments.map((payment, idx) => (
          <Item
            onClick={() => {
              if (disabled) {
                toast.info("Keranjang telah dicheckout");
              } else {
                setPaymentMethod(payment.method);
              }
            }}
            key={idx}
            variant={"outline"}
            className={`cursor-pointer ${
              payment.method === paymentMethod
                ? "bg-primary text-primary-foreground"
                : ""
            }`}
          >
            <ItemMedia>{getPaymentMethodIcon(payment.method)}</ItemMedia>
            <ItemContent>
              <ItemTitle>{paymentMethodMapping[payment.method]}</ItemTitle>
            </ItemContent>
          </Item>
        ))}
      </div>
    </div>
  );
}
