"use server";

import { config } from "dotenv";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { SignUpSchemaType } from "@/validations/schemas/auth";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";

config();

export async function SignUpCustomer(
  payload: SignUpSchemaType
): Promise<ServerActionReturn<void>> {
  try {
    const { password, ...data } = payload;

    const hashedPassword = await bcrypt.hash(password, 10);

    const created = await prisma.user.create({
      data: {
        ...data,
        password: hashedPassword,
        role: "CUSTOMER",
        customer_cart: {
          create: {
            status: "ACTIVE",
          },
        },
      },
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
  otpCode: number,
  email: string
): Promise<ServerActionReturn<void>> {
  try {
    const mailerUser = process.env.MAILER_USERNAME;
    const mailerPass = process.env.MAILER_PASSWORD;

    const transporter = nodemailer.createTransport({
      host: "smtp.mailersend.net",
      port: "2525",
      auth: {
        user: mailerUser,
        pass: mailerPass,
      },
    });

    const mailOptions = {
      from: mailerUser,
      to: email,
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
