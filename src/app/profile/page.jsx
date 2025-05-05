import ProtectedLayout from "@/components/layouts/protected-layout";
import ProfileClient from "./profile-client";

export default async function ProfilePage() {
  return (
    <ProtectedLayout>
      {(user) => <ProfileClient user={user} />}
    </ProtectedLayout>
  )
}
