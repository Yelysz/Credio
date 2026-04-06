export type Role = "Administrator" | "Officer" | "Collector" | "Client";

export interface NavItem {
  id: string;
  icon: string;
  label: string;
  path: string;
}

export interface RoleConfig {
  label: string;
  accent: string;
  light: string;
  badge: string;
  icon: string;
  nav: readonly NavItem[];
  greeting: (name: string) => string;
}

export type RolesConfig = Record<Role, RoleConfig>;