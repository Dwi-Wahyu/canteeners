import { NavigationButton } from "@/app/_components/navigation-button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconShoppingCartQuestion } from "@tabler/icons-react";

export default function EmptyCart() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconShoppingCartQuestion />
        </EmptyMedia>
        <EmptyTitle>Keranjang masih kosong nih</EmptyTitle>
        <EmptyDescription>Yuk masukin produk</EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <NavigationButton variant="outline" url="/dashboard-pelanggan">
          Cari Produk
        </NavigationButton>
      </EmptyContent>
    </Empty>
  );
}
