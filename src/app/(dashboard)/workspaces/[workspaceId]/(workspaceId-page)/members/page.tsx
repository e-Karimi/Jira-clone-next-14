import { getCurrentUser } from "@/features/auth/queries";
import { MembersList } from "@/features/members/components/members-list";
import { redirect } from "next/navigation";

export default async function WorkspaceIdMembersPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return (
    <div className="w-ful lg:max-w-lg">
      <MembersList />
    </div>
  );
}
