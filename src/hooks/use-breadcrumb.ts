// src/hooks/useBreadcrumbs.ts
"use client"; // Ini adalah Client Component

import { useEffect } from "react";
import {
  useBreadcrumbContext,
  BreadcrumbItem,
} from "@/context/breadcrumb-context"; // Sesuaikan path

/**
 * Hook untuk menambahkan item breadcrumb ke context secara dinamis.
 * @param item BreadcrumbItem untuk ditambahkan.
 */
export function useBreadcrumbs(
  item: Omit<BreadcrumbItem, "href"> & { href?: string }
) {
  const { addBreadcrumb, removeBreadcrumb } = useBreadcrumbContext();

  useEffect(() => {
    // Tambahkan breadcrumb saat komponen dimount
    addBreadcrumb(item);

    // Hapus breadcrumb saat komponen di-unmount
    return () => {
      removeBreadcrumb(item.label);
    };
  }, [item.label, item.href, addBreadcrumb, removeBreadcrumb]); // Dependency array
}
