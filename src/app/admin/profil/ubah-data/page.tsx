import UnauthorizedPage from "@/app/_components/unauthorized-page";
import { auth } from "@/config/auth";
import { ProfileEditForm } from "./profile-edit-form";
import NotFoundResource from "@/app/_components/not-found-resource";
import { getUserById } from "../../users/queries";

export default async function ChangeProfilePage() {
  const session = await auth();

  if (!session) {
    return <UnauthorizedPage />;
  }

  const initialData = await getUserById(session.user.id);

  if (!initialData) {
    return <NotFoundResource />;
  }

  return (
    <div className="container">
      <ProfileEditForm initialData={initialData} />;
    </div>
  );
}
