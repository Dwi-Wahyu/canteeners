import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function DashboardPelanggan() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const canteens = await prisma.canteen.findMany();

  return (
    <div>
      <h1 className="text-xl font-semibold">
        Selamat Datang,{" "}
        <span className="text-primary">{session.user.name}</span>
      </h1>

      <h1 className="text-muted-foreground">Mau Belanja Dimana Hari Ini?</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
        {canteens.map((canteen, idx) => (
          <Link
            href={"/kantin/" + canteen.id}
            className="group relative block"
            key={idx}
          >
            <div className="w-full overflow-hidden relative z-10 left-0 top-0 h-full rounded-xl">
              <img
                src={"/uploads/canteens/" + canteen.image_url}
                alt=""
                className="rounded-xl group-hover:scale-105 transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="w-full h-full rounded-xl absolute z-20 left-0 flex justify-center items-center top-0 bg-black/50">
              <h1 className="font-semibold text-center text-white">
                {canteen.name}
              </h1>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
