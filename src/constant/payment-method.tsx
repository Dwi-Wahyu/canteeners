import { IconCash, IconCreditCard, IconQrcode } from "@tabler/icons-react";

export const paymentMethodMapping = {
  QRIS: "QRIS",
  BANK_TRANSFER: "Transfer Bank",
  CASH: "Tunai",
};

export const paymentMethodIconMapping = {
  CASH: <IconCash />,
  QRIS: <IconQrcode />,
  BANK_TRANSFER: <IconCreditCard />,
};
