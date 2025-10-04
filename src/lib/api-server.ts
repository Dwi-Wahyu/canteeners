// utils/api-server.ts atau lib/api.ts (untuk Server Components)
import axios from "axios";
import { cookies } from "next/headers"; // Khusus Next.js untuk membaca cookies di Server Components
// import { decode } from "next-auth/jwt"; // <--- INI TIDAK ADA

const apiServer = axios.create({
  baseURL: process.env.BACKEND_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor untuk menyertakan token dari cookies
apiServer.interceptors.request.use(
  async (config) => {
    const nextCookies = await cookies();
    // Dapatkan cookie sesi NextAuth.js. Namanya bisa bervariasi.
    // Untuk produksi, biasanya __Secure-next-auth.session-token.
    // Untuk pengembangan, mungkin next-auth.session-token.
    const sessionTokenCookie =
      nextCookies.get("__Secure-authjs.session-token") ||
      nextCookies.get("authjs.session-token"); // <-- Menggunakan nama yang benar

    console.log(
      "Server Component: Session Cookie found?",
      !!sessionTokenCookie
    );

    if (sessionTokenCookie && sessionTokenCookie.value) {
      try {
        // MASALAH KRITIS: Anda mencoba mengirim *objek cookie* atau *nilai cookie mentah* sebagai token
        // config.headers["Authorization"] = `Bearer ${sessionTokenCookie}`; // <-- INI SALAH!
        // Anda harus mendekode token terlebih dahulu dan mengambil accessToken dari sana.
      } catch (error) {
        console.error("Failed to decode NextAuth.js session token:", error);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiServer;
