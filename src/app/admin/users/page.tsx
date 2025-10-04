import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Users2 } from "lucide-react";

export default function UsersPage() {
  return (
    <div className="flex flex-col items-center min-h-[calc(100vh-64px)] p-4 sm:p-6 md:p-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href={"/admin/users/admin"}>
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-center">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
              <ShieldCheck className="h-10 w-10 text-primary" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Admin</h3>
                <p className="text-sm text-muted-foreground">
                  Akses penuh ke sistem.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>

        <Link href={"/admin/users/pekerja-lapangan"}>
          <Card className="hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200 text-center">
            <CardContent className="flex flex-col items-center justify-center gap-4 py-8">
              <Users2 className="h-10 w-10 text-primary" />
              <div className="space-y-1">
                <h3 className="text-xl font-bold">Pekerja Lapangan</h3>
                <p className="text-sm text-muted-foreground">
                  Akses terbatas ke task dan proyek.
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}
