"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { generateBreadcrumbs } from "@/helper/generate-breadcrumbs";
import { Fragment } from "react";
import { usePathname } from "next/navigation";
import { ActivitySquare, Home, University, Utensils } from "lucide-react";
import {
  IconClipboardText,
  IconDashboard,
  IconMilitaryAward,
  IconTreadmill,
  IconUserScreen,
} from "@tabler/icons-react";
import { IconType } from "@/types/icon";
import IconPistol from "./icons/pistol";
import IconSenapan from "./icons/senapan";
import Link from "next/link";

type IconMapping = {
  label: string;
  icon: IconType;
}[];

const iconMapping: IconMapping = [{ label: "Produk", icon: Utensils }];

export function BreadCrumbs() {
  const pathname = usePathname();
  const breadcrumbs = generateBreadcrumbs(pathname);

  function getIconForLabel(label: string): IconType | undefined {
    return iconMapping.find((each) => each.label === label)?.icon;
  }

  return (
    <Breadcrumb>
      <BreadcrumbList className="gap-2">
        {breadcrumbs.map((item, index) => {
          const IconComponent = getIconForLabel(item.label);

          return (
            <Fragment key={index}>
              <BreadcrumbItem>
                <BreadcrumbPage
                  className={`flex items-center gap-1 ${
                    index === breadcrumbs.length - 1 ? "font-semibold" : ""
                  }`}
                >
                  <Link href={item.href}>
                    {IconComponent && (
                      <IconComponent className="h-[15px] w-[15px] mb-[2px] mr-[2px]" />
                    )}
                    {item.label}
                  </Link>
                </BreadcrumbPage>
              </BreadcrumbItem>

              {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
