import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  Link2,
  Package,
  GitBranch,
  Check,
  Clock3,
} from "lucide-react";
import { getCurrentUser } from "@/lib/current-user";
import { PageHeading } from "@/components/dashboard/page-heading";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
export const metadata = { title: "Dashboard" };
const metrics = [
  {
    label: "Active connections",
    value: "3",
    note: "All connections operational",
    icon: Link2,
  },
  {
    label: "Catalog products",
    value: "1,284",
    note: "Across your connected catalog",
    icon: Package,
  },
  {
    label: "Successful sessions",
    value: "99.8%",
    note: "Over the last 30 days",
    icon: Activity,
  },
];
export default async function DashboardPage() {
  const user = await getCurrentUser();
  return (
    <>
      <PageHeading
        eyebrow="Your workspace at a glance"
        title={`Good to see you, ${user.firstName}.`}
        description="Here’s what’s happening across your punchout workspace."
      />
      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <Card key={label} className="gap-0 py-0 shadow-none">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
                {label}
                <Icon className="size-3.5" />
              </div>
              <p className="mt-4 text-3xl font-semibold tracking-tight">
                {value}
              </p>
              <p className="mt-2 text-sm leading-4 text-muted-foreground">
                {note}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
      <section className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-primary/15 bg-accent/60 p-5">
        <div className="flex gap-3">
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary">
            <GitBranch className="size-5" />
          </span>
          <div>
            <h2 className="text-sm font-semibold">
              Make your catalog speak their language.
            </h2>
            <p className="mt-1 max-w-sm text-sm leading-5 text-muted-foreground">
              Map your product fields to your customers’ procurement systems.
            </p>
          </div>
        </div>
        <Button
          nativeButton={false}
          render={<Link href="/dashboard/field-mapping" />}
        >
          Manage mappings
          <ArrowRight />
        </Button>
      </section>
      <section className="mb-7">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Connections</h2>
          <span className="text-sm text-muted-foreground">
            3 connected systems
          </span>
        </div>
        <div className="overflow-hidden rounded-xl border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="pl-4 text-sm">Customer</TableHead>
                <TableHead className="text-sm">Protocol</TableHead>
                <TableHead className="text-sm">Status</TableHead>
                <TableHead className="pr-4 text-right text-sm">
                  Last activity
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {[
                {
                  name: "SAP Ariba",
                  initial: "SA",
                  protocol: "cXML",
                  time: "2 minutes ago",
                },
                {
                  name: "Coupa",
                  initial: "CO",
                  protocol: "cXML",
                  time: "18 minutes ago",
                },
                {
                  name: "SAP SRM",
                  initial: "SS",
                  protocol: "OCI",
                  time: "1 hour ago",
                },
              ].map((row) => (
                <TableRow key={row.name}>
                  <TableCell className="py-3 pl-4">
                    <div className="flex items-center gap-3">
                      <span className="flex size-8 items-center justify-center rounded-md border bg-background text-sm font-medium">
                        {row.initial}
                      </span>
                      <span className="text-sm font-medium">{row.name}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.protocol}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="gap-1 text-sm">
                      <Check className="size-3" />
                      Connected
                    </Badge>
                  </TableCell>
                  <TableCell className="pr-4 text-right text-sm text-muted-foreground">
                    {row.time}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Recent activity</h2>
          <Clock3 className="size-3.5 text-muted-foreground" />
        </div>
        <div className="divide-y rounded-xl border bg-white px-4">
          {[
            {
              title: "Punchout session completed",
              sub: "SAP Ariba · 4 items transferred",
              time: "2m ago",
              icon: ArrowUpRight,
            },
            {
              title: "Catalog synchronized",
              sub: "1,284 products up to date",
              time: "35m ago",
              icon: Package,
            },
            {
              title: "Field mapping updated",
              sub: "Default mapping · 8 fields configured",
              time: "1h ago",
              icon: GitBranch,
            },
          ].map(({ title, sub, time, icon: Icon }) => (
            <div key={title} className="flex items-center gap-3 py-3.5">
              <span className="rounded-lg bg-background p-2">
                <Icon className="size-4 text-muted-foreground" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-medium">{title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{sub}</p>
              </div>
              <span className="text-sm text-muted-foreground">{time}</span>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
