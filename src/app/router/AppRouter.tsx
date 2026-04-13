import { Navigate, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { RoleGuard } from "./RoleGuard";
import { LoginPage } from "@/features/auth/pages/LoginPage";
import type { Role } from "@/features/auth/types/auth.types";

import DashboardPage from "@/features/Dashboard/pages/DashboardPage";
import EmployeesPage from "@/features/employee/pages/EmployeesPage";
import EmployeeFormPage from "@/features/employee/pages/EmployeeFormPage";
import EmployeeDetailPage from "@/features/employee/pages/EmployeeDetailPage";

import ClientsPage from "@/features/clients/pages/ClientsPage";
import ClientFormPage from "@/features/clients/pages/ClientFormPage";
import ClientDetailPage from "@/features/clients/pages/ClientDetailPage";

import LoanApplicationsPage from "@/features/loan-applications/pages/LoanApplicationsPage";
import LoanApplicationDetailPage from "@/features/loan-applications/pages/LoanApplicationDetailPage";
import LoanApplicationSimulationPage from "@/features/loan-applications/pages/LoanApplicationSimulationPage";

import LoanPreviewPage from "@/features/loans/pages/LoanPreviewPage";
import LoanCreatePage from "@/features/loans/pages/LoanCreatePage";
import LoanDisbursementPage from "@/features/loans/pages/LoanDisbursementPage";
import LoanSchedulePage from "@/features/loans/pages/LoanSchedulePage";

import PortfolioReportPage from "@/features/reports/pages/PortfolioReportPage";
import SettingsPage from "@/features/settings/pages/SettingsPage";
import LoanApplicationCreatePage from "@/features/loan-applications/pages/LoanApplicationCreatePage";

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
    <div className="p-20 flex justify-center items-center flex-col">
      <h1 className="text-xl font-semibold">404</h1>
      <p className="mt-2 text-slate-600">Página no encontrada.</p>
    </div>
  );
}

function allow(roles: Role[], element: React.ReactNode) {
  return (
    <ProtectedRoute>
      <RoleGuard allowed={roles}>{element}</RoleGuard>
    </ProtectedRoute>
  );
}

export function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/dashboard"
        element={<Navigate to="/" replace />}
      />

      <Route
        path="/employees"
        element={allow(["Administrator"], <EmployeesPage />)}
      />
      <Route
        path="/employees/new"
        element={allow(["Administrator"], <EmployeeFormPage />)}
      />
      <Route
        path="/employees/:id"
        element={allow(["Administrator"], <EmployeeDetailPage />)}
      />

      <Route
        path="/clients"
        element={allow(["Administrator", "Officer", "Collector"], <ClientsPage />)}
      />
      <Route
        path="/clients/new"
        element={allow(["Administrator", "Officer"], <ClientFormPage />)}
      />
      <Route
        path="/clients/:id"
        element={allow(["Administrator", "Officer", "Collector"], <ClientDetailPage />)}
      />
      <Route
        path="/clients/:id/edit"
        element={allow(["Administrator", "Officer"], <ClientFormPage />)}
      />

      <Route
        path="/loan-applications"
        element={allow(["Administrator", "Officer"], <LoanApplicationsPage />)}
      />
      <Route
        path="/loan-applications/:id"
        element={allow(["Administrator", "Officer"], <LoanApplicationDetailPage />)}
      />
      <Route
        path="/loan-applications/simulate"
        element={allow(["Administrator", "Officer"], <LoanApplicationSimulationPage />)}
      />

      <Route
        path="/loans/preview"
        element={allow(["Administrator", "Officer"], <LoanPreviewPage />)}
      />
      <Route
        path="/loans/create"
        element={allow(["Administrator", "Officer"], <LoanCreatePage />)}
      />
      <Route
        path="/loans/disburse"
        element={allow(["Administrator", "Officer", "Collector"], <LoanDisbursementPage />)}
      />
      <Route
        path="/loans/:id/schedule"
        element={allow(["Administrator", "Officer"], <LoanSchedulePage />)}
      />

      <Route
        path="/reports/portfolio"
        element={allow(["Administrator", "Officer"], <PortfolioReportPage />)}
      />

      <Route
        path="/settings"
        element={allow(["Administrator"], <SettingsPage />)}
      />

      <Route path="/loan-applications/create" element={<LoanApplicationCreatePage />} />

      <Route path="/access-denied" element={<AccessDeniedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}