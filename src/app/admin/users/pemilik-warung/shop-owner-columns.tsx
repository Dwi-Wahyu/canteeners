"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useState } from "react";
import { UsersTableDataType } from "../type";

export const ShopOwnerColumns: ColumnDef<UsersTableDataType>[] = [
  {
    accessorKey: "avatar",
    header: "Pasfoto",
    cell({ row }) {
      const { avatar, name } = row.original;

      return (
        <img
          className="rounded-lg"
          src={avatar ?? "/uploads/avatar/default-avatar.jpg"}
          alt={name}
          width={100}
          height={100}
        />
      );
    },
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "username",
    header: "Username",
  },
  {
    header: "Nama Warung",
    cell: function Cell({ row }) {
      return row.original.shop_owned?.name;
    },
  },
  {
    id: "actions",
    cell: function Cell({ row }) {
      const employee = row.original;
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDeleteEmployee = async () => {
        setIsDeleting(true);
        setIsConfirmDialogOpen(false);

        // try {
        //   const result = await deleteUser(employee.id);
        //   if (result.success) {
        //     toast.success(result.message || "Karyawan berhasil dihapus!");
        //   } else {
        //     toast.error(result.error?.message || "Gagal menghapus employee.");
        //   }
        // } catch (error) {
        //   console.error("Error deleting employee:", error);
        //   toast.error("Terjadi kesalahan tak terduga saat menghapus employee.");
        // } finally {
        //   setIsDeleting(false);
        // }

        setIsDeleting(false);
      };

      return (
        <div className="flex gap-1">
          <Button variant={"outline"} asChild>
            <Link href={`/admin/karyawan/edit/${employee.id}`}>
              <SquarePen className="mb-[1px] h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={`/admin/karyawan/${employee.id}`}>
              <Eye className="mb-[1px] h-4 w-4" /> Detail
            </Link>
          </Button>
          <Button
            variant={"outline"}
            onClick={() => setIsConfirmDialogOpen(true)}
          >
            <Trash className="mb-[1px] h-4 w-4" /> Hapus
          </Button>

          <ConfirmationDialog
            isOpen={isConfirmDialogOpen}
            onClose={() => setIsConfirmDialogOpen(false)}
            onConfirm={handleDeleteEmployee}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus karyawan "${employee.name}" ? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
            cancelButtonText="Batal"
            isLoading={isDeleting}
            confirmButtonVariant="destructive"
          />
        </div>
      );
    },
    size: 5,
  },
];
