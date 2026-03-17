import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "../../features/auth/providers/AuthProvider";
import { ToastProvider } from "../../shared/components/common/ToastProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider />
        {children}
      </AuthProvider>
    </BrowserRouter>
  );
}