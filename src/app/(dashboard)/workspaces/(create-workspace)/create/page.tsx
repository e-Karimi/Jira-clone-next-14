import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/actions";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-workspace-form";

export default async function WorkspaceCreatePage() {
  const user = await getCurrentUser();
  if (!user) redirect("sign-in");

  return (
    <div className="w-full lg: max-w-xl ">
      <CreateWorkspaceForm />
    </div>
  );
}
