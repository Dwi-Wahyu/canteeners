"use client";

import { useOtpCooldown } from "@/hooks/use-otp-cooldown";
import { useState } from "react";
import { SendOTPCode, SignUpCustomer } from "./actions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { SignUpSchemaType } from "@/validations/schemas/auth";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { generateSecureOTP } from "@/helper/otp-helper";
import { useRouter } from "nextjs-toploader/app";

export default function OtpForm({
  customerData,
}: {
  customerData: SignUpSchemaType | null;
}) {
  const { canSend, cooldownTimeLeft, startCooldown } = useOtpCooldown();
  const [otpGenerated, setOtpGenerated] = useState<number | null>(null);
  const [otpInput, setOtpInput] = useState<string>("");

  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  async function handleSendOTP() {
    if (!canSend) {
      return;
    }

    setIsLoading(true);
    setOtpGenerated(null);

    const otpGenerated = generateSecureOTP();

    const result = await SendOTPCode(otpGenerated);

    if (result.success) {
      toast.success(result.message);
      setOtpGenerated(otpGenerated);
    } else {
      toast.error(result.error.message);
    }

    setIsLoading(false);
    startCooldown();
  }

  async function checkOTPCode() {
    if (!customerData) {
      toast.error(
        "Data customer belum disimpan, silakan isi kembali form pendaftaran"
      );
      router.refresh();

      return;
    }

    if (!otpGenerated) {
      toast.error("Kode OTP belum dikirim");

      return;
    }

    if (!otpInput.trim()) {
      toast.error("Masukkan kode OTP");

      return;
    }

    if (otpGenerated.toString() !== otpInput) {
      toast.error("Kode OTP tidak valid atau telah expired");

      return;
    }

    const result = await SignUpCustomer(customerData);

    if (result.success) {
      toast.success(result.message);
      setTimeout(() => {
        router.push("/auth/signin");
      }, 1000);
    } else {
      toast.error(result.error.message);
    }
  }

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Kode OTP Berhasil Dikirim</CardTitle>
        <CardDescription>Cek Inbox Email Anda</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <InputOTP
          maxLength={4}
          value={otpInput}
          onChange={(value) => setOtpInput(value)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
        </InputOTP>

        <Button className="mt-4" onClick={checkOTPCode}>
          Submit
        </Button>

        <Button
          className="mt-1"
          disabled={!canSend || isLoading}
          variant={"link"}
          onClick={handleSendOTP}
        >
          {canSend
            ? "Kirim Ulang Kode OTP"
            : `Kirim Ulang dalam ${cooldownTimeLeft} detik`}
        </Button>
      </CardContent>
    </Card>
  );
}
