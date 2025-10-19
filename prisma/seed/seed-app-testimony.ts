import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function seedAppTestimony() {
  console.log("Memulai seeding app testimony...");
  try {
    await prisma.appTestimony.createMany({
      data: [
        {
          message:
            "Dulu selalu stres kalau kantin lagi ramai, harus teriak-teriak pesan. Sekarang tinggal scan, pesan, dan tunggu di meja. Waktu istirahat jadi lebih tenang dan efektif. Canteeners benar-benar Kantin Naik Level!",
          from: "Risa Adelia",
          role: "Mahasiswi Teknik, Pengunjung Kantin",
        },
        {
          message:
            "Awalnya ragu, tapi ternyata sistem Canteeners sangat membantu. Pesanan masuk lebih terorganisir, tidak ada lagi salah catat. Penjualan saya bahkan sedikit meningkat karena pelanggan tidak takut lagi dengan antrian panjang.",
          from: "Ibu Siti",
          role: "Pemilik Warung Nasi Goreng",
        },
      ],
    });
  } catch (error) {
    console.error("Gagal melakukan seeding app testimony:", error);
  }
}
