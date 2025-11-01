import { auth } from "@/config/auth";
import UnauthorizedPage from "../_components/unauthorized-page";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CustomerTopbar from "./customer-topbar";

export default async function DashboardPelanggan() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const canteens = await prisma.canteen.findMany();

  return (
    <div className="">
      <CustomerTopbar subscribed={false} connected={false} />

      <h1 className="text-xl font-semibold">
        Selamat Datang,{" "}
        <span className="text-primary">{session.user.name}</span>
      </h1>

      <h1 className="text-muted-foreground">Mau Belanja Dimana Hari Ini?</h1>

      {canteens.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <Link
            href={"/dashboard-pelanggan/kantin/" + canteens[0].id}
            className="group relative block"
          >
            <div className="w-full overflow-hidden relative z-10 left-0 top-0 h-full rounded-xl">
              <img
                src={"/uploads/canteen/" + canteens[0].image_url}
                alt=""
                className="rounded-xl group-hover:scale-105 transition-all duration-300 ease-in-out"
              />
            </div>
            <div className="w-full h-full rounded-xl absolute z-20 left-0 flex justify-center items-center top-0 bg-black/50">
              <h1 className="font-semibold text-center text-white">
                {canteens[0].name}
              </h1>
            </div>
          </Link>

          {canteens.slice(1).map((canteen, idx) => (
            <div className="group relative block" key={idx}>
              <div className="w-full overflow-hidden relative z-10 left-0 top-0 h-full rounded-xl">
                <img
                  src={"/uploads/canteen/" + canteen.image_url}
                  alt=""
                  className="rounded-xl group-hover:scale-105 transition-all duration-300 ease-in-out"
                />
              </div>
              <div className="w-full h-full flex-col rounded-xl absolute z-20 left-0 flex justify-center items-center top-0 bg-black/50">
                <h1 className="font-semibold text-lg text-center text-white">
                  {canteen.name}
                </h1>
                <h1 className="text-background">Coming Soon</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
