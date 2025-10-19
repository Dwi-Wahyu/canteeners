"use server";

import { errorResponse, successResponse } from "@/helper/action-helpers";
import { generateSecureOTP } from "@/helper/otp-helper";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { SignUpSchemaType } from "@/validations/schemas/auth";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

export async function SignUpCustomer(
  payload: SignUpSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: { ...data, password: hashedPassword, role: "CUSTOMER" },
    });

    console.log(created);

    return successResponse(
      undefined,
      "Berhasil melakukan pendaftaran, silakan login"
    );
  } catch (error) {
    console.log(error);

    return errorResponse("Terjadi kesalahan");
  }
}

export async function SendOTPCode(
  otpCode: number
): Promise<ServerActionReturn<void>> {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net",
      port: "2525",
      auth: {
        user: "MS_UFwaxW@test-yxj6lj95dnq4do2r.mlsender.net",
        pass: "mssp.NKIMNDq.351ndgwp0nrlzqx8.1hcuYD5",
      },
    });

    const mailOptions = {
      from: "MS_UFwaxW@test-yxj6lj95dnq4do2r.mlsender.net",
      to: "dwiwahyuilahi123@gmail.com",
      subject: "Kode OTP Sekali Pakai",
      text: "Ini adalah kode otp anda jangan berikan ke siapapun, " + otpCode,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error:", error);
        return errorResponse("Terjadi kesalahan saat mengirim kode otp");
      } else {
        console.log("Email sent:", info.response);
      }
    });

    return successResponse(undefined, "Sukses mengirim kode otp");
  } catch (error) {
    console.error(error);

    return errorResponse("Terjadi kesalahan saat mengirim kode otp");
  }
}
