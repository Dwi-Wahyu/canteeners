import { useState, useEffect, useCallback } from "react";
import { isAfter, addSeconds } from "date-fns";
import { useLocalStorage } from "./use-local-storage";

const COOLDOWN_SECONDS = 60;

interface OtpCooldownResult {
  canSend: boolean;
  cooldownTimeLeft: number;
  startCooldown: () => void;
}

/**
 * Hook untuk melacak status cooldown pengiriman OTP.
 * Menyimpan waktu terakhir kirim (sebagai string ISO) di localStorage.
 * @returns {OtpCooldownResult} Status dan kontrol cooldown.
 */
export function useOtpCooldown(): OtpCooldownResult {
  // lastSendTimestamp akan bertipe string (ISO Date) atau null
  const [lastSendTimestamp, setLastSendTimestamp] = useLocalStorage<
    string | null
  >("last-send-otp", null);

  const [cooldownTimeLeft, setCooldownTimeLeft] = useState<number>(0);

  const canSend: boolean = cooldownTimeLeft === 0;

  // Fungsi untuk memulai cooldown. Menggunakan useCallback untuk stabilitas.
  const startCooldown = useCallback(() => {
    const now = new Date();
    // Simpan Date object sebagai string ISO 8601
    setLastSendTimestamp(now.toISOString());
    setCooldownTimeLeft(COOLDOWN_SECONDS);
  }, [setLastSendTimestamp]);

  // Efek untuk memantau dan memperbarui sisa waktu cooldown
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;

    if (lastSendTimestamp) {
      const lastSendDate: Date = new Date(lastSendTimestamp);

      // Hitung waktu kedaluwarsa
      const expiryTime: Date = addSeconds(lastSendDate, COOLDOWN_SECONDS);

      // Cek apakah waktu kedaluwarsa sudah terlewati
      const isCooldownOver: boolean = isAfter(new Date(), expiryTime);

      if (isCooldownOver) {
        setCooldownTimeLeft(0);
        setLastSendTimestamp(null); // Reset
      } else {
        // Hitung sisa waktu dalam detik (pembulatan ke atas)
        const timeDifferenceMs = expiryTime.getTime() - new Date().getTime();
        const secondsLeft = Math.ceil(timeDifferenceMs / 1000);
        setCooldownTimeLeft(secondsLeft > 0 ? secondsLeft : 0);

        // Atur timer untuk hitungan mundur setiap detik
        timer = setInterval(() => {
          setCooldownTimeLeft((prevTime) => {
            if (prevTime <= 1) {
              if (timer) clearInterval(timer);
              setLastSendTimestamp(null);
              return 0;
            }
            return prevTime - 1;
          });
        }, 1000);
      }
    }

    // Cleanup function untuk menghapus interval
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [lastSendTimestamp, setLastSendTimestamp]);

  return { canSend, cooldownTimeLeft, startCooldown };
}
