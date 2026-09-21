import {
  House,
  Users,
  ClipboardList,
  Database,
  Network,
  ChartNoAxesCombined,
  BadgeCheck,
  ChartNoAxesColumnIncreasing,
  ShieldCheck,
  Settings,
  Files,
  CircleHelp,
} from "lucide-react";

export const workspaceNavigation = [
  { href: "/dashboard", label: "Home", icon: House },
  { href: "/dashboard/agents", label: "Agents", icon: Users },
  { href: "/dashboard/aufgaben", label: "Aufgaben", icon: ClipboardList },
  { href: "/dashboard/daten", label: "Daten", icon: Database },
  { href: "/dashboard/field-mapping", label: "Integrationen", icon: Network },
  {
    href: "/dashboard/monitoring",
    label: "Monitoring",
    icon: ChartNoAxesCombined,
  },
  { href: "/dashboard/finops", label: "FinOps", icon: BadgeCheck },
  {
    href: "/dashboard/analytics",
    label: "Analytics",
    icon: ChartNoAxesColumnIncreasing,
  },
  { href: "/dashboard/governance", label: "Governance", icon: ShieldCheck },
  { href: "/dashboard/einstellungen", label: "Einstellungen", icon: Settings },
];

export const resourceNavigation = [
  { href: "/dashboard/documentation", label: "Documentation", icon: Files },
  { href: "/dashboard/support", label: "Support", icon: CircleHelp },
];
