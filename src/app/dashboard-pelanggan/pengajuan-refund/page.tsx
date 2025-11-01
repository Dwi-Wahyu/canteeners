import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function CustomerRefundPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <div>
      <h1>Ini pengajuan refund customer</h1>
    </div>
  );
}
