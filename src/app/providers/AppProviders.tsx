import { AuthProvider } from "../../features/auth/providers/AuthProvider";
import { ToastProvider } from "../../shared/components/common/ToastProvider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <ToastProvider />
      {children}
    </AuthProvider>
  );
}
