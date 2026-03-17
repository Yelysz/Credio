import { useState } from "react";
import { useLocation } from "react-router-dom";
import { AppRouter } from "@/app/router";
import "./styles/App.css";
import { Sidebar } from "../features/layout/components/Sidebar";
import { Topbar } from "../features/layout/components/Topbar";
import type { Role } from "../features/layout/constants/role";
import  { ROLES } from "../features/layout/constants/role";
import { authService } from "@/features/auth/services/auth.service";
import { getUserFromToken } from "@/shared/utils/auth";
import { useNavigate } from "react-router-dom";

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
        activeNav="dashboard"
        onNav={(id) => console.log("Navegar a:", id)}
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
