
export const T = {
  green900: "#1E2D14", green800: "#2C3A20", green700: "#3D5C28",
  green600: "#4E7A30", green500: "#5B7E3F", green400: "#7AAF52",
  green100: "#EFF3EB", green50: "#F7FAF4",
  blue700: "#1D4ED8", blue500: "#2563EB", blue100: "#EFF6FF",
  orange700: "#C2410C", orange500: "#EA580C", orange100: "#FFF7ED",
  indigo700: "#4338CA", indigo500: "#4F46E5", indigo100: "#EEF2FF",
  gray50: "#F9FAFB", gray100: "#F3F4F6", gray200: "#E5E7EB",
  gray400: "#9CA3AF", gray600: "#4B5563", gray800: "#1F2937",
  red: "#EF4444", white: "#FFFFFF",
};

export const ROLES = {
  admin: {
    label: "Administrador",
    accent: T.green600,
    light: T.green100,
    badge: T.green400,
    icon: "⚙️",
    nav: [
      { id: "dashboard", icon: "▣", label: "Dashboard de Liquidez" },
      { id: "clientes", icon: "👥", label: "Gestión de Clientes" },
      { id: "reportes", icon: "📊", label: "Reportes de Cartera" },
      { id: "config", icon: "⚙️", label: "Configuración" }
    ],
    greeting: (n: string) => `Bienvenido, ${n}`
  },

  oficial: {
    label: "Oficial de Crédito",
    accent: T.blue500,
    light: T.blue100,
    badge: "#3B82F6",
    icon: "🪪",
    nav: [
      { id: "clientes", icon: "👥", label: "Gestión de Clientes" },
      { id: "solicitudes", icon: "📋", label: "Solicitudes de Crédito" },
      { id: "aprobacion", icon: "✅", label: "Bandeja de Aprobación" }
    ],
    greeting: (n: string) => `Hola, ${n}`
  },

  cobrador: {
    label: "Cobrador",
    accent: T.orange500,
    light: T.orange100,
    badge: T.orange700,
    icon: "💼",
    nav: [
      { id: "cartera", icon: "💼", label: "Mi Cartera" },
      { id: "historial", icon: "🧾", label: "Historial de Recibos" }
    ],
    greeting: (n: string) => `Buenos días, ${n}`
  },

  cliente: {
    label: "Cliente",
    accent: T.indigo500,
    light: T.indigo100,
    badge: "#6366F1",
    icon: "👤",
    nav: [
      { id: "prestamos", icon: "💳", label: "Mis Préstamos" },
      { id: "facturas", icon: "🧾", label: "Facturas y Pagos" },
      { id: "contactar", icon: "💬", label: "Contactar Oficial" }
    ],
    greeting: (n: string) => `¡Hola, ${n}!`
  }
} as const;

export type Role = keyof typeof ROLES;
