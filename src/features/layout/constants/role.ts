import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  UserRound,
  FileText,
  HandCoins,
  BarChart3,
  Settings,
  BadgeDollarSign,
  Wallet,
  ShieldCheck,
  Banknote  
} from "lucide-react";

export const T = {
  forest900: "#1A3326",
  forest800: "#22422F",
  forest700: "#2D5A3D",
  forest600: "#3A6E4A",
  forest500: "#4A8A5A",
  forest300: "#7CB98A",
  forest100: "#D6EBD8",
  forest50: "#EFF7F0",

  cream: "#FAF8F5",
  sand100: "#F0EDE8",
  sand200: "#DDD9D2",
  sand400: "#9E9A92",
  sand600: "#5E5A54",
  sand800: "#2A2724",
  sand900: "#1A1814",

  blue700: "#365C91",
  blue500: "#4C78A8",
  blue100: "#EAF2FB",

  amber700: "#9A5B18",
  amber500: "#C9822B",
  amber100: "#F9EFE2",

  plum700: "#5E4B73",
  plum500: "#7B6594",
  plum100: "#F1ECF7",

  red: "#C65A5A",
  white: "#FFFFFF",
};

export const ROLES = {
  Administrator: {
    label: "Administrador",
    accent: T.forest600,
    light: T.forest50,
    badge: T.forest300,
    icon: ShieldCheck,
    nav: [
      { id: "dashboard", icon: LayoutDashboard, label: "Panel General", path: "/", section: "Resumen" },
      { id: "employees", icon: Users, label: "Empleados", path: "/employees", section: "Gestión" },
      { id: "clients", icon: UserRound, label: "Clientes", path: "/clients", section: "Gestión" },
      { id: "loan-applications", icon: FileText, label: "Generar Solicitud", path: "/loan-applications", section: "Créditos" },
      { id: "loans", icon: HandCoins, label: "Solicitudes Pendientes", path: "/acceptance", section: "Créditos" },
      {id: "payments",icon: Banknote , label: "Préstamos", path: "/loan-management",section: "Créditos" },
      {id: "payments",icon: Banknote , label: "Pagos", path: "/payments",section: "Créditos" },
      { id: "reports", icon: BarChart3, label: "Reportes de Cartera", path: "/reports/portfolio", section: "Análisis" },
      { id: "settings", icon: Settings, label: "Configuración", path: "/settings", section: "Sistema" },
    ],
    greeting: (n: string) => `Bienvenido, ${n}`,
  },

  Officer: {
    label: "Oficial de Crédito",
    accent: T.blue500,
    light: T.blue100,
    badge: T.blue700,
    icon: BadgeDollarSign,
    nav: [
      { id: "dashboard", icon: LayoutDashboard, label: "Panel General", path: "/", section: "Resumen" },
      { id: "clients", icon: UserRound, label: "Clientes", path: "/clients", section: "Gestión" },
      { id: "loan-applications", icon: FileText, label: "Solicitudes", path: "/loan-applications", section: "Créditos" },
    //  { id: "loans", icon: HandCoins, label: "Préstamos", path: "/loan-applications/acceptance", section: "Créditos" },
            {
        id: "payments",
        icon: Banknote ,
        label: "Pagos",
        path: "/payments",
        section: "Créditos" 
      },
      { id: "reports", icon: BarChart3, label: "Reportes", path: "/reports/portfolio", section: "Análisis" },
    ],
    greeting: (n: string) => `Hola, ${n}`,
  },

  Collector: {
    label: "Cobrador",
    accent: T.amber500,
    light: T.amber100,
    badge: T.amber700,
    icon: Wallet,
    nav: [
      { id: "dashboard", icon: LayoutDashboard, label: "Panel General", path: "/", section: "Resumen" },
      { id: "clients", icon: UserRound, label: "Clientes", path: "/clients", section: "Gestión" },
      { id: "loans", icon: HandCoins, label: "Desembolsos", path: "/loans/disburse", section: "Operaciones" },
      {
        id: "payments",
        icon: Banknote ,
        label: "Pagos",
        path: "/payments",
        section: "Créditos" 
      },
    ],
    greeting: (n: string) => `Buenos días, ${n}`,
  },

  Client: {
    label: "Cliente",
    accent: T.plum500,
    light: T.plum100,
    badge: T.plum700,
    icon: UserRound,
    nav: [],
    greeting: (n: string) => `¡Hola, ${n}!`,
  },
} as const;

export type Role = keyof typeof ROLES;
export type RoleConfig = (typeof ROLES)[Role];

export type NavItem = {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  section?: string;
};

export type RolesConfig = typeof ROLES;