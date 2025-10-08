import {
  IconBriefcase,
  IconMessageUser,
  IconReceiptDollar,
  IconTruckLoading,
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
      title: "Kurir",
      url: "/admin/users/kurir",
      icon: IconTruckLoading,
    },
    {
      title: "Pemilik Warung",
      url: "/admin/users/pemilik-warung",
      icon: IconBriefcase,
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
