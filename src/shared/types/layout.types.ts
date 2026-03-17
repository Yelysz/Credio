import React from "react";

export type Role = "admin" | "oficial" | "cobrador" | "cliente";

export interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export interface RoleConfig {
  greeting: (name: string) => string;
  accent: string;
  badge: string;
  light: string;
  icon: React.ReactNode;
  label: string;
  nav: readonly NavItem[];
}

export type RolesConfig = Record<Role, RoleConfig>;