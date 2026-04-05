import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { AppRouter } from "@/app/router";
import "./styles/App.css";
import { Sidebar } from "../features/layout/components/Sidebar";
import { Topbar } from "../features/layout/components/Topbar";
import type { Role } from "../features/layout/constants/role";
import { ROLES } from "../features/layout/constants/role";
import { authService } from "@/features/auth/services/auth.service";
import { getUserFromToken } from "@/shared/utils/auth";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await authService.logout();
    navigate("/login");
  };

  const currentUser: {
    name: string;
    email: string;
    role: Role;
  } = getUserFromToken() ?? {
    name: "Invitado",
    email: "",
    role: "cliente",
  };

  const isLoginPage = location.pathname === "/login";

  const activeNav = useMemo(() => {
    const path = location.pathname;

    if (path === "/" || path.startsWith("/dashboard")) return "dashboard";
    if (path.startsWith("/employees")) return "employees";
    if (path.startsWith("/clients")) return "clients";
    if (path.startsWith("/loan-applications")) return "loan-applications";
    if (path.startsWith("/loans")) return "loans";
    if (path.startsWith("/reports")) return "reports";
    if (path.startsWith("/settings")) return "settings";

    return "dashboard";
  }, [location.pathname]);

  const handleSidebarNavigation = (id: string) => {
    const routeMap: Record<string, string> = {
      dashboard: "/",
      employees: "/employees",
      clients: "/clients",
      "loan-applications": "/loan-applications",
      loans: "/loans/preview",
      reports: "/reports/portfolio",
      settings: "/settings",
    };

    const targetRoute = routeMap[id];
    if (targetRoute) {
      navigate(targetRoute);
    }
  };

  if (isLoginPage) {
    return (
      <main style={{ minHeight: "100vh", background: "#F4F6F2" }}>
        <AppRouter />
      </main>
    );
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F2" }}>
      <Sidebar
        role={currentUser.role}
        user={currentUser}
        activeNav={activeNav}
        onNav={handleSidebarNavigation}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
        rolesConfig={ROLES}
      />

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minWidth: 0,
        }}
      >
        <Topbar
          role={currentUser.role}
          user={currentUser}
          rolesConfig={ROLES}
          onLogout={handleLogout}
        />

        <main style={{ flex: 1, padding: "26px 30px", overflowY: "auto" }}>
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;