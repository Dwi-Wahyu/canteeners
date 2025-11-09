"use server";

import { config } from "dotenv";
import { errorResponse, successResponse } from "@/helper/action-helpers";
import { prisma } from "@/lib/prisma";
import { ServerActionReturn } from "@/types/server-action";
import { SignUpSchemaType } from "@/validations/schemas/auth";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import { join } from "path";
import { readFile } from "fs/promises";

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
        customer_profile: {
          create: {},
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
    const mailerUser = process.env.CANTEENERS_DOMAIN_MAIL_USERNAME;
    const mailerPass = process.env.CANTEENERS_DOMAIN_MAIL_PASSWORD;

    let transporter = nodemailer.createTransport({
      host: "smtp.hostinger.com",
      port: 465,
      auth: {
        user: mailerUser,
        pass: mailerPass,
      },
    });

    const mailOptions = {
      from: "no-reply@canteeners.com",
      to: email,
      subject: "Kode OTP Sekali Pakai",
      text: "Ini adalah kode otp anda jangan berikan ke siapapun, " + otpCode,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);

    return successResponse(undefined, "Sukses mengirim kode otp");
  } catch (error) {
    console.error(error);

    return errorResponse("Terjadi kesalahan saat mengirim kode otp");
  }
}

export async function checkUsernameUsed(username: string) {
  return await prisma.user.findFirst({
    where: {
      username,
    },
  });
}
