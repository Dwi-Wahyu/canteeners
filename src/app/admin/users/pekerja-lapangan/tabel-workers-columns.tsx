"use client";

import { ColumnDef } from "@tanstack/react-table";
import { WorkersColumnType } from "./tabel-workers";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Eye, SquarePen, Trash } from "lucide-react";
import { ConfirmationDialog } from "@/components/confirmation-dialog";
import { useState } from "react";
import { toast } from "sonner";
import { deleteUser } from "../actions";

export const TabelWorkersColumns: ColumnDef<WorkersColumnType>[] = [
  {
    accessorKey: "avatar",
    header: "Pasfoto",
    cell({ row }) {
      const { avatar, name } = row.original;
      const ADMIN_URL = process.env.NEXT_PUBLIC_ADMIN_URL!;

      return (
        <img
          className="rounded"
          src={ADMIN_URL + avatar}
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
    id: "actions",
    cell: function Cell({ row }) {
      const user = row.original;
      const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
      const [isDeleting, setIsDeleting] = useState(false);

      const handleDeleteWorkers = async () => {
        setIsDeleting(true);
        setIsConfirmDialogOpen(false);

        try {
          const result = await deleteUser(user.id);
          if (result.success) {
            toast.success(result.message || "User berhasil dihapus!");
          } else {
            toast.error(result.error?.message || "Gagal menghapus user.");
          }
        } catch (error) {
          console.error("Error deleting user:", error);
          toast.error("Terjadi kesalahan tak terduga saat menghapus user.");
        } finally {
          setIsDeleting(false);
        }
      };

      return (
        <div className="flex gap-1">
          <Button variant={"outline"} asChild>
            <Link href={`/admin/users/pekerja-lapangan/edit/${user.id}`}>
              <SquarePen className="mb-[1px] h-4 w-4" /> Edit
            </Link>
          </Button>
          <Button variant={"outline"} asChild>
            <Link href={`/admin/users/${user.id}`}>
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
            onConfirm={handleDeleteWorkers}
            title="Konfirmasi Penghapusan"
            message={`Apakah Anda yakin ingin menghapus  user "${user.name}" ? Tindakan ini tidak dapat dibatalkan.`}
            confirmButtonText={isDeleting ? "Menghapus..." : "Hapus"}
            cancelButtonText="Batal"
            isLoading={isDeleting}
          />
        </div>
      );
    },
    size: 5,
  },
];
