import { auth } from "@/config/auth";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { CreateUserForm } from "../../user-create-form";

export default async function InputUserPage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  if (session.user.role !== "admin") {
    return <UnauthorizedPage />;
  }

  return (
    <CreateUserForm
      backUrl="/admin/users/pekerja-lapangan"
      role="workers"
      roleLabel="Pekerja Lapangan"
    />
  );
}
