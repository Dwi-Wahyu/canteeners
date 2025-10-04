import NotFoundResource from "@/app/_components/not-found-resource";
import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { getUserById } from "../../../queries";
import { auth } from "@/config/auth";
import { EditUserForm } from "../../../user-edit-form";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  if (session.user.role !== "admin") {
    return <UnauthorizedPage />;
  }

  const user = await getUserById(id);

  if (!user) {
    return <NotFoundResource />;
  }

  return (
    <EditUserForm
      initialData={user}
      backUrl="/admin/users/admin"
      roleLabel="Admin"
    />
  );
}
