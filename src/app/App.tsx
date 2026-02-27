import { AppRouter } from "@/app/router";
import "./styles/App.css";
import { Sidebar } from "../features/layout/components/Sidebar";
import { Topbar } from "../features/layout/components/Topbar";
import { ROLES } from "../features/layout/constants/role";
import { useState } from "react";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  
  const currentUser = {
    name: "Carlos Administrador",
    email: "admin@credio.com",
    role: "admin" as const 
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F4F6F2" }}>
      {/* 1. Menú Lateral */}
      <Sidebar 
        role={currentUser.role} 
        user={currentUser} 
        activeNav="dashboard" // Esto debería ser dinámico según la ruta
        onNav={(id) => console.log("Navegar a:", id)}
        collapsed={collapsed} 
        onToggle={() => setCollapsed(!collapsed)}
        rolesConfig={ROLES}
      />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* 2. EL NAVBAR (Aquí es donde se activa para que sea visible arriba) */}
        <Topbar 
          role={currentUser.role} 
          user={currentUser} 
          rolesConfig={ROLES}
          onLogout={() => console.log("Cerrar sesión")}
        />

        {/* 3. Contenido Dinámico de las Rutas */}
        <main style={{ flex: 1, padding: "26px 30px", overflowY: "auto" }}>
          <AppRouter />
        </main>
      </div>
    </div>
  );
}

export default App;