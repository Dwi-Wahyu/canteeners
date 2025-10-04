// src/context/BreadcrumbContext.tsx
"use client"; // Ini adalah Client Component

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// 1. Definisikan Tipe untuk Breadcrumb Item
export interface BreadcrumbItem {
  label: string; // Teks yang ditampilkan pada breadcrumb
  href: string; // Link (URL) untuk breadcrumb tersebut
}

// 2. Definisikan Tipe untuk Context Value
interface BreadcrumbContextType {
  // Fungsi untuk menambahkan item breadcrumb (digunakan di halaman/komponen)
  addBreadcrumb: (
    item: Omit<BreadcrumbItem, "href"> & { href?: string }
  ) => void;
  // Fungsi untuk menghapus item breadcrumb (misalnya saat komponen di-unmount)
  removeBreadcrumb: (label: string) => void;
  // Fungsi untuk mengatur ulang semua breadcrumb (misalnya saat navigasi ke root)
  setBreadcrumbs: (items: BreadcrumbItem[]) => void;
  // State breadcrumbs yang akan diakses oleh komponen Breadcrumbs.tsx
  breadcrumbs: BreadcrumbItem[];
}

// 3. Buat Context
const BreadcrumbContext = createContext<BreadcrumbContextType | undefined>(
  undefined
);

// 4. Buat Custom Hook untuk Mengakses Context
// Ini akan digunakan di dalam komponen provider
export function useBreadcrumbContext() {
  const context = useContext(BreadcrumbContext);
  if (context === undefined) {
    throw new Error(
      "useBreadcrumbContext must be used within a BreadcrumbProvider"
    );
  }
  return context;
}

// 5. Buat Breadcrumb Provider Component
export function BreadcrumbProvider({ children }: { children: ReactNode }) {
  const [breadcrumbs, setBreadcrumbsState] = useState<BreadcrumbItem[]>([]);

  // Fungsi untuk menambahkan breadcrumb
  const addBreadcrumb = useCallback(
    (item: Omit<BreadcrumbItem, "href"> & { href?: string }) => {
      setBreadcrumbsState((prev) => {
        // Pastikan item unik berdasarkan label/href untuk menghindari duplikasi
        const existing = prev.find(
          (b) => b.label === item.label && b.href === (item.href || "#")
        );
        if (existing) return prev;

        // Buat href default jika tidak disediakan
        const newItem: BreadcrumbItem = { ...item, href: item.href || "#" };

        // Tambahkan item baru ke breadcrumbs.
        // Anda mungkin ingin logika yang lebih kompleks di sini,
        // misalnya, mengganti item terakhir jika merupakan child dari yang baru,
        // atau hanya menambahkan jika itu jalur baru.
        // Untuk kesederhanaan, kita hanya menambahkan.
        return [...prev, newItem];
      });
    },
    []
  );

  // Fungsi untuk menghapus breadcrumb
  const removeBreadcrumb = useCallback((label: string) => {
    setBreadcrumbsState((prev) => prev.filter((b) => b.label !== label));
  }, []);

  // Fungsi untuk mengatur ulang semua breadcrumb
  const setBreadcrumbs = useCallback((items: BreadcrumbItem[]) => {
    setBreadcrumbsState(items);
  }, []);

  const contextValue = React.useMemo(
    () => ({
      breadcrumbs,
      addBreadcrumb,
      removeBreadcrumb,
      setBreadcrumbs,
    }),
    [breadcrumbs, addBreadcrumb, removeBreadcrumb, setBreadcrumbs]
  );

  return (
    <BreadcrumbContext.Provider value={contextValue}>
      {children}
    </BreadcrumbContext.Provider>
  );
}
