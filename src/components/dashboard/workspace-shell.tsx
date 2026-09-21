"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { GitBranch, LayoutDashboard, LogOut } from "lucide-react";
import { Brand } from "@/components/brand";
import type { CurrentUser } from "@/lib/current-user";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { TooltipProvider } from "@/components/ui/tooltip";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const links = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/field-mapping", label: "Field Mapping", icon: GitBranch },
];
function Navigation() {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <SidebarMenu>
      {links.map(({ href, label, icon: Icon }) => (
        <SidebarMenuItem key={href}>
          <SidebarMenuButton
            className="mb-1 h-10 gap-3 px-3"
            isActive={pathname === href}
            render={
              <Link
                href={href}
                aria-current={pathname === href ? "page" : undefined}
                onClick={() => setOpenMobile(false)}
              />
            }
          >
            <Icon className="size-4" />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
export function WorkspaceShell({
  children,
  user,
  background = "solid",
}: {
  children: React.ReactNode;
  user: CurrentUser;
  background?: "solid" | "gradient";
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  async function signOut() {
    setPending(true);
    setError("");
    try {
      const result = await authClient.signOut();
      if (result.error) throw new Error();
      {
        router.replace("/login");
        router.refresh();
      }
    } catch {
      setError("Could not sign out. Try again.");
      setPending(false);
    }
  }
  return (
    <TooltipProvider>
      <SidebarProvider
        style={{ "--sidebar-width": "15rem" } as React.CSSProperties}
      >
        <a
          href="#main-content"
          className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:absolute"
        >
          Skip to content
        </a>
        <Sidebar>
          <SidebarHeader className="p-6">
            <Brand />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-4">
              <SidebarGroupLabel className="mb-2 px-3 text-sm tracking-widest uppercase">
                Workspace
              </SidebarGroupLabel>
              <Navigation />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="gap-5 p-4">
            <div className="flex items-center gap-2.5 border-t pt-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-white">
                {user.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p
                  className="mt-1 truncate text-sm text-muted-foreground"
                  title={user.email}
                >
                  {user.email}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Sign out"
                onClick={signOut}
                disabled={pending}
              >
                <LogOut className="size-4" />
              </Button>
            </div>
            {error && (
              <p role="alert" className="text-sm text-destructive">
                {error}
              </p>
            )}
          </SidebarFooter>
        </Sidebar>
        <SidebarInset
          className={
            background === "gradient"
              ? "min-w-0 bg-background bg-page-gradient"
              : "min-w-0 bg-background"
          }
        >
          <header className="flex min-h-16 shrink-0 flex-wrap items-center justify-between gap-3 border-b px-5 py-3 sm:px-8">
            <div className="flex items-center gap-3 text-sm">
              <SidebarTrigger />
              <span className="text-muted-foreground">Workspace</span>
              <span className="text-muted-foreground">/</span>
              <span>
                {pathname === "/dashboard" ? "Dashboard" : "Field Mapping"}
              </span>
            </div>
            <span className="rounded-full border px-2.5 py-1 text-sm font-medium tracking-wide uppercase">
              Demo environment
            </span>
          </header>
          <main
            id="main-content"
            className="mx-auto w-full max-w-3xl px-5 py-9 sm:px-8"
          >
            {children}
          </main>
          <footer className="mx-auto mt-auto flex w-full max-w-3xl flex-wrap justify-between gap-3 px-5 py-6 text-sm text-muted-foreground sm:px-8">
            <span>Trodat Punchout</span>
            <span>Workspace overview · Demo data</span>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
