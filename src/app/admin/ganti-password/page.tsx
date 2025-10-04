import { auth } from "@/config/auth";
import { ChangePasswordForm } from "./change-password-form";
import UnauthorizedPage from "../../_components/unauthorized-page";

export default async function ChangePasswordPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  return (
    <div className="container">
      <ChangePasswordForm />
    </div>
  );
}
