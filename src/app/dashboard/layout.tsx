import { getCurrentUser } from "@/lib/current-user";
import { WorkspaceShell } from "@/components/dashboard/workspace-shell";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  return <WorkspaceShell user={user}>{children}</WorkspaceShell>;
}
