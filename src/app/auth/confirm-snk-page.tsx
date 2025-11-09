"use client";

import { SignUpSchemaType } from "@/validations/schemas/auth";
import { SignUpCustomer } from "./actions";
import { notificationDialog } from "@/hooks/use-notification-dialog";
import { useRouter } from "nextjs-toploader/app";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function ConfirmSNKPage({
  customerData,
}: {
  customerData: SignUpSchemaType | null;
}) {
  const router = useRouter();
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleConfirm() {
    if (!customerData) {
      notificationDialog.error({
        title: "Data Tidak Ditemukan",
        message: "Silakan isi kembali form pendaftaran.",
      });
      router.refresh();
      return;
    }

    setIsSubmitting(true);
    const result = await SignUpCustomer(customerData);

    if (result.success) {
      notificationDialog.success({
        title: "Registrasi Berhasil",
        message: "Akun Anda telah berhasil dibuat. Silakan login.",
      });
      setTimeout(() => {
        router.push("/dashboard-pelanggan");
      }, 1000);
    } else {
      notificationDialog.error({
        title: "Registrasi Gagal",
        message: result.error.message,
      });
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-bold">
          Syarat & Ketentuan Pengguna Layanan Kantiners
        </h1>

        <p className="text-sm">
          Selamat datang di Kantiners. Dengan mendaftar dan menggunakan platform
          kami, Anda Pengguna dianggap telah membaca, memahami, dan menyetujui
          seluruh isi Syarat dan Ketentuan S&K ini.
        </p>
      </div>

      <div className="space-y-4 text-sm">
        <section className="space-y-2">
          <h3 className="font-semibold text-base">1. Akun Pengguna </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Pendaftaran: Layanan Kantiners terbuka untuk umum. Pengguna wajib
              memberikan data yang benar dan akurat saat pendaftaran.{" "}
            </li>
            <li>
              Tanggung Jawab: Pengguna bertanggung jawab penuh atas semua
              aktivitas yang terjadi di dalam akunnya, termasuk menjaga
              kerahasiaan kata sandi.{" "}
            </li>
            <li>
              Data Tidak Akurat: Jika ditemukan Pengguna memberikan data yang
              tidak benar atau palsu, Tim Kantiners berhak melakukan evaluasi
              dan memberikan sanksi penangguhan (suspend) akun.
            </li>
            <li>
              Penutupan Akun: Pengguna yang ingin menghapus akunnya secara
              permanen dapat mengajukan permohonan kepada tim kami melalui
              kontak Customer Service (CS).
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            2. Proses Pemesanan & Pembayaran
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Mekanisme: Pembayaran pesanan dilakukan secara langsung oleh
              Pengguna ke rekening milik Kedai (Mitra).
            </li>
            <li>
              Bukti Pembayaran: Pengguna wajib mengunggah bukti pembayaran
              (misalnya, tangkapan layar/screenshot) yang jelas dan sah untuk
              setiap transaksi.
            </li>
            <li>
              Pesanan Ditinggal: Kedai hanya berkewajiban mengantarkan pesanan
              ke meja yang diinput sebanyak satu kali. Jika Pengguna tidak
              berada di meja tersebut, menjadi tanggung jawab Pengguna untuk
              mengonfirmasi ulang (melalui fitur chat) atau mengambil pesanannya
              langsung ke Kedai.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            3. Sanksi Pembatalan oleh Pengguna
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Definisi Pembatalan: Sanksi ini berlaku untuk Pengguna yang telah
              menekan tombol "Pesan" namun tidak menyelesaikan proses pembayaran
              hingga batas waktu habis ("cancel sebelum bayar").
            </li>
            <li>
              Aturan Sanksi: Pengguna yang melakukan pembatalan seperti definisi
              di atas sebanyak 3 (tiga) kali dalam satu hari yang sama, akan
              dinonaktifkan sementara.
            </li>
            <li>
              Konsekuensi Sanksi: Akun yang dinonaktifkan sementara tidak dapat
              melakukan pemesanan kembali selama sisa hari tersebut dan baru
              dapat memesan lagi di hari berikutnya.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            4. Pembatalan oleh Kedai & Proses Refund
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Hak Refund Pelanggan: Pengguna berhak mendapatkan pengembalian
              dana (refund) jika Kedai membatalkan pesanan setelah pembayaran
              dilakukan (misalnya, karena stok ternyata habis) atau jika Kedai
              terlambat mengantar pesanan melebihi estimasi waktu. 26]
            </li>
            <li>
              Mekanisme Refund: Pihak Kedai memiliki fitur untuk mengajukan
              refund dan berkewajiban untuk mentransfer dana pengembalian secara
              langsung ke Pengguna.
            </li>
            <li>
              Peran Advokasi CS: Jika terjadi perselisihan atau keterlambatan
              dalam proses refund dari Kedai, Pengguna dapat menghubungi CS. Tim
              Kantiners akan bertindak sebagai mediator dan mengadvokasi
              Pengguna untuk memastikan pengembalian dana diselesaikan oleh
              Kedai.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            5. Penanganan Gangguan Sistem & Sengketa
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Sistem Error (Down): Jika terjadi gangguan pada aplikasi Kantiners
              (server down, error massal), Pengguna diizinkan melakukan
              pemesanan secara manual langsung ke Kedai.
            </li>
            <li>
              Proses Manual: Dalam proses manual tersebut, Pengguna wajib
              menunjukkan bukti pembayaran (yang mungkin sudah dilakukan saat
              aplikasi error) kepada Kedai untuk verifikasi. [cite: 32]
            </li>
            <li>
              Peran CS saat Error: Meskipun aplikasi error, layanan CS kami
              (melalui WhatsApp) akan tetap aktif untuk menjadi penengah dan
              membantu mediasi antara Pengguna dan Kedai.
            </li>
            <li>
              Sengketa Pembayaran: Untuk sengketa pembayaran (misal: "sudah
              bayar" vs "belum masuk"), CS Kantiners akan bertindak sebagai
              mediator aktif dan menghubungi pihak Kedai secara langsung untuk
              menyelesaikan masalah.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            6. Aturan Ulasan (Review) Pengguna
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Konten Dilarang: Pengguna dilarang menulis ulasan yang mengandung
              kata-kata kasar (vulgar), unsur SARA, fitnah, spam, atau promosi
              pribadi.
            </li>
            <li>
              Sanksi Ulasan: Pengguna yang melanggar aturan konten ulasan akan
              mendapatkan peringatan dari tim kami. Jika pelanggaran berlanjut,
              tim Kantiners berhak untuk mencabut fitur review dari akun atau
              banned Pengguna tersebut. [cite: 38]
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">
            7. Larangan Umum & Perlindungan Aset
          </h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Larangan Keras: Pengguna dilarang keras melakukan upaya peretasan
              (hacking), reverse engineering, atau tindakan teknis lainnya yang
              bertujuan mengganggu atau merusak sistem Kantiners. Sanksi untuk
              pelanggaran ini adalah pemblokiran (ban) permanen secara langsung
              atau bahkan penyelesain melalui jalur hukum.
            </li>
            <li>
              Properti Intelektual: Pengguna dilarang menggunakan nama, logo,
              poster, atau aset merek ("Kantiners") lainnya untuk kepentingan
              komersial atau pribadi tanpa izin tertulis dari tim Kantiners.
            </li>
          </ul>
        </section>

        <section className="space-y-2">
          <h3 className="font-semibold text-base">8. Ketentuan Penutup</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Layanan Pelanggan (CS): Dukungan penuh, mediasi, dan advokasi
              disediakan melalui saluran Customer Service resmi kami via
              WhatsApp Bisnis.
            </li>
            <li>
              Perubahan S&K: Kantiners berhak mengubah S&K ini sewaktu-waktu.
              Perubahan akan dianggap berlaku efektif setelah diposting di
              platform kami.
            </li>
            <li>
              Kaitan dengan Kebijakan Privasi: Dengan menyetujui Syarat &
              Ketentuan ini, Pengguna juga menyatakan telah membaca dan
              menyetujui Kebijakan Privasi Kantiners.
            </li>
          </ul>
        </section>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="snk-confirm"
          checked={isConfirmed}
          onCheckedChange={(e) => setIsConfirmed(e as boolean)}
          className="w-4 h-4"
        />
        <label
          htmlFor="snk-confirm"
          className="text-sm font-medium leading-none"
        >
          Saya telah membaca dan menyetujui Syarat & Ketentuan
        </label>
      </div>

      <Button
        onClick={handleConfirm}
        disabled={!isConfirmed || isSubmitting}
        size={"lg"}
      >
        {isSubmitting ? "Memproses..." : "Daftar dan Lanjutkan"}
      </Button>
    </div>
  );
}
