"use client";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { LogOut } from "lucide-react";
import {
  resourceNavigation,
  workspaceNavigation,
} from "@/lib/workspace-navigation";
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
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

function Navigation({
  links,
  label,
}: {
  links: typeof workspaceNavigation;
  label: string;
}) {
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();
  return (
    <nav aria-label={label}>
      <SidebarMenu className="gap-2.5">
        {links.map(({ href, label, icon: Icon }) => (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              className="h-11 gap-4 rounded-md px-3 text-sm [&>svg]:size-5"
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
    </nav>
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
        style={{ "--sidebar-width": "13rem" } as React.CSSProperties}
      >
        <a
          href="#main-content"
          className="sr-only z-50 rounded bg-white p-3 focus:not-sr-only focus:absolute"
        >
          Skip to content
        </a>
        <Sidebar>
          <SidebarHeader className="px-5 pt-6 pb-7">
            <Brand className="h-auto w-full brightness-0 invert" />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup className="px-3">
              <Navigation links={workspaceNavigation} label="Hauptnavigation" />
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="gap-5 px-3 pb-4">
            <div className="mx-2 border-t border-sidebar-border pt-4">
              <Navigation
                links={resourceNavigation}
                label="Hilfe und Ressourcen"
              />
            </div>
            <div className="flex items-center gap-2.5 border-t border-sidebar-border pt-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-foreground text-sm font-medium text-white">
                {user.initials}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{user.name}</p>
                <p
                  className="mt-1 truncate text-sm text-sidebar-foreground/70"
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
            <div className="px-2 pt-2">
              <p className="mt-2 text-sm leading-tight text-sidebar-foreground">
                Commerce.
                <br />
                Simplified.
              </p>
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
                {[...workspaceNavigation, ...resourceNavigation].find(
                  (item) => item.href === pathname,
                )?.label ?? "Workspace"}
              </span>
            </div>
            <span className="rounded-full border px-2.5 py-1 text-sm font-medium tracking-wide uppercase">
              Demo environment
            </span>
          </header>
          <main
            id="main-content"
            className="mx-auto w-full max-w-7xl px-5 py-9 sm:px-8"
          >
            {children}
          </main>
          <footer className="mx-auto mt-auto flex w-full max-w-7xl flex-wrap justify-between gap-3 px-5 py-6 text-sm text-muted-foreground sm:px-8">
            <span>Trodat Punchout</span>
            <span>Workspace overview · Demo data</span>
          </footer>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}
