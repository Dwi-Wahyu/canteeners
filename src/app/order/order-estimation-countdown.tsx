"use client";

import { formatToHour } from "@/helper/hour-helper";
import { useEffect, useState } from "react";

const calculateTimeRemaining = (targetTimeMs: number) => {
  const nowMs = new Date().getTime();
  const differenceMs = targetTimeMs - nowMs;

  if (differenceMs <= 0) {
    return "Selesai";
  }

  const totalSeconds = Math.floor(differenceMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export default function OrderEstimationCountDown({
  estimation,
  processed_at,
}: {
  processed_at: Date | null;
  estimation: number;
}) {
  const [countdown, setCountdown] = useState<string>("Menghitung...");

  // Hitung waktu selesai target (hanya jika processed_at ada)
  const targetTimeMs = processed_at
    ? new Date(processed_at).getTime() + estimation * 60 * 1000
    : 0; // 0 jika belum diproses

  // Gunakan useEffect untuk membuat interval timer
  useEffect(() => {
    // Hanya jalankan timer jika pesanan sudah diproses
    if (!processed_at) {
      setCountdown("Belum Diproses");
      return;
    }

    // Fungsi yang akan dijalankan setiap detik
    const updateCountdown = () => {
      const remaining = calculateTimeRemaining(targetTimeMs);
      setCountdown(remaining);
    };

    // Panggil sekali segera setelah komponen dimuat
    updateCountdown();

    // Set interval untuk mengupdate setiap 1 detik (1000 ms)
    const timer = setInterval(updateCountdown, 1000);

    // Fungsi cleanup untuk membersihkan interval saat komponen dilepas atau dependency berubah
    return () => clearInterval(timer);
  }, [processed_at, estimation, targetTimeMs]); // Jalankan ulang jika processed_at atau estimation berubah

  // --- Tampilan di bagian bawah ---
  const finishTime = processed_at
    ? formatToHour(new Date(targetTimeMs)) // Gunakan waktu selesai target
    : "N/A";

  return (
    <>
      <div>
        <h1 className="font-semibold">Diproses Pada</h1>
        <h1>{formatToHour(processed_at)}</h1>
      </div>

      <div>
        <h1 className="font-semibold">Estimasi Selesai Pada</h1>
        <h1>{finishTime}</h1>
      </div>

      <div>
        <h1 className="font-semibold">Sisa Waktu</h1>
        <h1>{countdown}</h1>
      </div>
    </>
  );
}
