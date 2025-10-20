import {
  IconBriefcase,
  IconBuildingCommunity,
  IconMessageUser,
  IconReceiptDollar,
  IconTruckLoading,
  IconUserCog,
} from "@tabler/icons-react";

import { LayoutDashboard, Settings, Store, Tags } from "lucide-react";

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
      icon: IconBuildingCommunity,
    },
    {
      title: "Kedai",
      url: "/admin/kedai",
      icon: Store,
    },
    {
      title: "Kategori",
      url: "/admin/kategori",
      icon: Tags,
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
