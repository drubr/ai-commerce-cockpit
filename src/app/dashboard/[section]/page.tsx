import { notFound } from "next/navigation";
import {
  workspaceNavigation,
  resourceNavigation,
} from "@/lib/workspace-navigation";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card, CardContent } from "@/components/ui/card";

export default async function WorkspaceSectionPage({
  params,
}: {
  params: Promise<{ section: string }>;
}) {
  const { section } = await params;
  const item = [...workspaceNavigation, ...resourceNavigation].find(
    (item) => item.href === `/dashboard/${section}`,
  );
  if (!item) notFound();
  const Icon = item.icon;
  return (
    <>
      <PageHeading
        eyebrow="Workspace"
        title={item.label}
        description="Dieser Bereich ist für den weiteren Ausbau vorbereitet."
      />
      <Card className="shadow-none">
        <CardContent className="flex items-start gap-4 py-6">
          <span className="rounded-xl bg-accent p-3 text-primary">
            <Icon className="size-6" />
          </span>
          <div>
            <h2 className="font-semibold">Noch keine Inhalte</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Die Funktionen für {item.label} sind in dieser Demo noch nicht
              verfügbar.
            </p>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
