"use client";

import { IconShoppingCart } from "@tabler/icons-react";
import { Home, MessageCircle, Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function CustomerBottombar() {
  const pathname = usePathname();

  function isActive(menuPathname: string) {
    if (menuPathname === "/dashboard-pelanggan") {
      return pathname === menuPathname;
    }

    const isExact = pathname === menuPathname;
    const isSubPath = pathname.startsWith(menuPathname + "/");

    return isExact || isSubPath;
  }

  const menuItems = [
    {
      href: "/dashboard-pelanggan",
      Icon: Home,
      label: "Home",
    },
    {
      href: "/dashboard-pelanggan/keranjang",
      Icon: IconShoppingCart,
      label: "Keranjang",
    },
    {
      href: "/dashboard-pelanggan/chat",
      Icon: MessageCircle,
      label: "Chat",
    },
    {
      href: "/dashboard-pelanggan/pengaturan",
      Icon: Settings,
      label: "Pengaturan",
    },
  ];

  return (
    <div className="w-full bg-primary text-primary-foreground p-4 fixed h-[62px] bottom-0 left-0 z-50 flex justify-evenly items-start">
      {menuItems.map((item, index) => {
        const active = isActive(item.href);
        const IconComponent = item.Icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className="relative flex justify-center h-full w-1/4" // Sesuaikan lebar agar terdistribusi merata
          >
            {/*
              1. Tampilkan SVG hanya jika menu aktif.
              2. Posisikan SVG agar melengkung ke bawah.
              3. Gunakan nilai width/height yang lebih besar agar lengkungan menutupi div
            */}
            {active && (
              <Image
                src={"/bottom-bar-substract.svg"}
                width={100} // Lebih besar agar menutupi area yang melengkung
                height={56} // Sesuaikan dengan tinggi bottom bar
                alt="bottom bar substract"
                priority
                className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-0 pointer-events-none"
              />
            )}

            <div
              className={`
                relative z-10 // Pastikan ikon di atas SVG
                ${
                  active
                    ? "flex items-center justify-center -translate-y-10 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg"
                    : "transition-colors pt-1"
                }
              `}
            >
              <IconComponent size={active ? 24 : 28} />
            </div>
          </Link>
        );
      })}
    </div>
  );
}
