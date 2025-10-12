import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@/config/auth";
import { prisma } from "@/lib/prisma";
import { UtensilsCrossed } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

const TestimonialCard = ({
  name,
  role,
  quote,
}: {
  name: string;
  role: string;
  quote: string;
}) => (
  <Card className="rounded-xl shadow-lg transition duration-300 hover:shadow-xl flex flex-col h-full">
    <CardContent className="flex flex-col justify-between">
      <p className="text-xl italic mb-4 flex-grow">"{quote}"</p>
      <div className="pt-4">
        <p className="font-semibold">{name}</p>
        <p className="text-sm text-primary font-medium">{role}</p>
      </div>
    </CardContent>
  </Card>
);

export default async function LandingPage() {
  const canteens = await prisma.canteen.findMany({
    select: {
      id: true,
      name: true,
      image_url: true,
    },
  });

  const session = await auth();

  if (session && session.user.role === "CUSTOMER") {
    redirect("/dashboard-pelanggan");
  }

  if (session && session.user.role === "SHOP_OWNER") {
    redirect("/dashboard-kedai");
  }

  return (
    <div>
      <header className="py-4 px-4 sm:px-8 bg-secondary shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex gap-2 items-center">
            <UtensilsCrossed className="w-6 h-6" />
            <h1 className="text-2xl font-bold">Canteeners</h1>
          </div>
          <div className="hidden md:flex space-x-6 text-foreground">
            <a href="#hero" className="hover:text-primary transition">
              Beranda
            </a>
            <a href="#about" className="hover:text-primary transition">
              Tentang Kami
            </a>
            <a href="#testimonials" className="hover:text-primary transition">
              Testimoni
            </a>
            <a href="/auth/signin" className="hover:text-primary transition">
              Login / Mendaftar
            </a>
          </div>
        </div>
      </header>

      <main>
        <section
          id="hero"
          className="py-20 min-h-screen md:py-32 text-center border-b"
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-4 leading-tight">
              <span className="text-primary">Kantin Naik Level</span>
            </h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto">
              Solusi cerdas untuk keramaian kantin. Pesan makanan tanpa antri,
              langsung dari meja Anda, dan terhubung instan dengan pemilik
              warung.
            </p>
            <div className="flex flex-col md:flex-row gap-3 justify-center items-center w-full">
              <Button asChild size={"lg"} variant={"default"} className="w-fit">
                <Link href={"/#kantin"}>Temukan Kantin Anda</Link>
              </Button>

              <Button asChild size={"lg"} variant={"outline"} className="w-fit">
                <Link href={"/auth/signup"}>Mendaftar Ke Canteeners</Link>
              </Button>
            </div>
          </div>
        </section>

        <section id="about" className="py-16 md:py-24 bg-secondary shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-primary">
                Mengatasi Keramaian Kantin
              </h3>
              <p className="mt-3 text-xl max-w-3xl mx-auto">
                Canteeners lahir dari keresahan akan kantin yang luas dan
                antrian yang panjang.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card>
                <CardContent className="flex flex-col items-center text-center ">
                  <div className="text-3xl text-primary mb-3 font-bold rounded-full flex items-center justify-center">
                    1
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Scan QR di Meja
                  </h4>
                  <p className="text-muted-foreground">
                    Akses Canteeners secara instan dengan memindai kode QR unik
                    yang ada di setiap meja kantin.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center ">
                  <div className="text-3xl text-primary mb-3 font-bold rounded-full flex items-center justify-center">
                    2
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Pilih Warung & Produk
                  </h4>
                  <p className="text-muted-foreground">
                    Pilih kantin dan warung tujuan Anda, jelajahi menu lengkap,
                    dan tambahkan pesanan ke keranjang.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center ">
                  <div className="text-3xl text-primary mb-3 font-bold rounded-full flex items-center justify-center">
                    3
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Konfirmasi Pesanan
                  </h4>
                  <p className="text-muted-foreground">
                    Lakukan konfirmasi pesanan Anda. Sistem akan mengarahkan
                    Anda ke langkah berikutnya.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="flex flex-col items-center text-center ">
                  <div className="text-3xl text-primary mb-3 font-bold rounded-full flex items-center justify-center">
                    4
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    Chat Warung Instan
                  </h4>
                  <p className="text-muted-foreground">
                    Sistem akan membuka chat langsung dengan pemilik warung
                    untuk detail konfirmasi dan pembayaran.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <section id="kantin" className="py-16 md:py-24 shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-primary">
                Belanja Sekarang
              </h3>
              <p className="mt-3 text-xl">
                Kantin Yang Terdaftar Di Canteeners
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {canteens.map((canteen, idx) => (
                <Link
                  href={"/kantin/" + canteen.id}
                  className="group relative block h-60"
                  key={idx}
                >
                  <div className="w-full overflow-hidden absolute z-10 left-0 top-0 h-full rounded-xl">
                    <img
                      src={"/uploads/canteen/" + canteen.image_url}
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
        </section>

        <section id="testimonials" className="py-16 md:py-24 bg-secondary">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-primary">
                Apa Kata Mereka?
              </h3>
              <p className="mt-3 text-xl">
                Pengalaman pengguna dan pemilik warung di Canteeners.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <TestimonialCard
                name="Risa Adelia"
                role="Mahasiswi Teknik, Pengunjung Kantin"
                quote="Dulu selalu stres kalau kantin lagi ramai, harus teriak-teriak pesan. Sekarang tinggal scan, pesan, dan tunggu di meja. Waktu istirahat jadi lebih tenang dan efektif. Canteeners benar-benar Kantin Naik Level!"
              />

              <TestimonialCard
                name="Ibu Siti"
                role="Pemilik Warung Nasi Goreng"
                quote="Awalnya ragu, tapi ternyata sistem Canteeners sangat membantu. Pesanan masuk lebih terorganisir, tidak ada lagi salah catat. Penjualan saya bahkan sedikit meningkat karena pelanggan tidak takut lagi dengan antrian panjang."
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-secondary py-10 border-background border-t">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-2xl font-bold mb-2">Canteeners</h4>
              <p className="text-muted-foreground text-sm">Kantin Naik Level</p>
            </div>

            <div>
              <h5 className="font-semibold mb-3">Tautan</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#hero" className="hover:font-semibold transition">
                    Beranda
                  </a>
                </li>
                <li>
                  <a href="#about" className="hover:font-semibold transition">
                    Mekanisme
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:font-semibold transition">
                    Daftar Kantin
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:font-semibold transition">
                    Hubungi Kami
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 3: Dukungan */}
            <div>
              <h5 className="font-semibold mb-3">Dukungan</h5>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>
                  <a href="#" className="hover:font-semibold transition">
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:font-semibold transition">
                    Kebijakan Privasi
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:font-semibold transition">
                    Syarat & Ketentuan
                  </a>
                </li>
              </ul>
            </div>

            {/* Kolom 4: Kontak */}
            <div>
              <h5 className="font-semibold mb-3">Kontak</h5>
              <p className="text-sm text-muted-foreground">
                Jl. Kampus Impian No. 123
              </p>
              <p className="text-sm text-muted-foreground">
                Universitas Sejahtera
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                support@canteeners.id
              </p>
            </div>
          </div>

          <Separator className="my-6" />

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Canteeners. Hak Cipta
              Dilindungi.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
