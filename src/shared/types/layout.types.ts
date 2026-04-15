import type { LucideIcon } from "lucide-react";

export type Role = "Administrator" | "Officer" | "Collector" | "Client";

export interface NavItem {
  id: string;
  path: string;
  label: string;
  icon: LucideIcon;
  section?: string;
}

export interface RoleConfig {
  label: string;
  accent: string;
  light: string;
  badge: string;
  icon: LucideIcon;
  nav: readonly NavItem[];
  greeting: (name: string) => string;
}

export type RolesConfig = Record<Role, RoleConfig>;