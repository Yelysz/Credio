import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";

import { LoginPage } from "@/features/auth/pages/LoginPage";
import { DashboardPage } from "@/features/Dashboard/types";
import type { Role } from "@/features/auth/types/auth.types";
import { Employees } from "@/features/auth/pages/employees/employeesList";
import { ROLES } from "@/features/layout/constants/role";


const dashboardStats = {
  carteraTotal: "$2,850,000",
  liquidez: "$425,000",
  mora: "$185,000",
  activos: 127
};

function AccessDeniedPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">Acceso denegado</h1>
      <p className="mt-2 text-slate-600">No tienes permisos para ver esta página.</p>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold">404</h1>
      <p className="mt-2 text-slate-600">Página no encontrada.</p>
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  
  {
    path: "/employees",
    element: <Employees />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <DashboardPage 
        cfg={ROLES.admin} 
        stats={dashboardStats} 
       />
      </ProtectedRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <ProtectedRoute>
        <RoleGuard allowed={['Administrator'] as Role[]}>
          <div className="p-6">Panel Admin</div>
        </RoleGuard>
      </ProtectedRoute>
    ),
  },
  {
    path: "/access-denied",
    element: <AccessDeniedPage />,
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
