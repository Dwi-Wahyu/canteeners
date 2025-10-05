import {
  IconBuildingWarehouse,
  IconChartDots3,
  IconHeartHandshake,
  IconMessageUser,
  IconReceiptDollar,
  IconUserCog,
  IconUserShield,
} from "@tabler/icons-react";

import { LayoutDashboard, Settings, Store } from "lucide-react";

export const adminMenu = {
  navMain: [
    {
      title: "Dashboard",
      url: "/admin",
      icon: LayoutDashboard,
    },
    {
      title: "Kantin",
      url: "/admin/kantin",
      icon: Store,
    },
    {
      title: "Riwayat Transaksi",
      url: "/admin/transaksi",
      icon: IconReceiptDollar,
    },
    {
      title: "Support",
      url: "/admin/support",
      icon: IconMessageUser,
    },
  ],
  navProject: [],
  navUser: [
    {
      title: "Admin",
      url: "/admin/users/admin",
      icon: IconUserShield,
    },
    {
      title: "Pemilik Warung",
      url: "/admin/users/shop-owner",
      icon: IconUserShield,
    },
    {
      title: "Pelanggan",
      url: "/admin/users/customer",
      icon: IconUserCog,
    },
  ],
  navSetting: [
    {
      title: "Pengaturan Aplikasi",
      url: "/admin/pengaturan-aplikasi",
      icon: Settings,
    },
  ],
};
