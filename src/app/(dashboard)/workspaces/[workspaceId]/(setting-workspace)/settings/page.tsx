import { redirect } from "next/navigation";

import { getCurrentUser } from "@/features/auth/queries";
import { WorkspaceIdSettingsClientPage } from "./client";

export default async function WorkspaceIdSettingsPage({ params }: { params: { workspaceId: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect("/sign-in");

  return <WorkspaceIdSettingsClientPage workspaceId={params.workspaceId} />;
}
