import { auth } from "@/config/auth";
import { redirect } from "next/navigation";

export default async function OwnerRefundPage() {
  const session = await auth();

  if (!session) {
    redirect("/auth/signin");
  }

  return <div></div>;
}
