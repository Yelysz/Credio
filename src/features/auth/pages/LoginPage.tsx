import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Button, Input, Checkbox } from "@/shared/components";
import { LockKeyhole } from "lucide-react";

export function LoginPage() {
  const { login } = useAuth();
  const nav = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("admin@credio.com");
  const [password, setPassword] = useState("123456");
  const [loading, setLoading] = useState(false);

  const from = location.state?.from ?? "/";

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ userName: email, password });
      toast.success("Sesión iniciada");
      nav(from, { replace: true });
    } catch {
      toast.error("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8faf8] px-4">
      
      <article className="w-full max-w-105 rounded-4xl border border-slate-100 bg-white p-10 shadow-[0_20px_50px_rgba(85,107,47,0.08)]">
        

        <header className="mb-10 text-center">
          <div 
            className="mb-8 mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#556b2f] text-white shadow-lg shadow-[#556b2f]/20"
            aria-hidden="true"
          >
            <LockKeyhole size={30} />
          </div>
          
          <h1 className="text-2xl font-bold tracking-tight text-[#2d3a1a]">
            Sistema de Préstamos
          </h1>
          <p className="mt-1 text-sm text-slate-500 font-medium">
            Ingresa tus credenciales para continuar
          </p>
        </header>

        <form className="flex flex-col gap-6" onSubmit={onSubmit}>
          <section className="space-y-6">
            <Input 
              label="Correo Electrónico" 
              type="text"
              autoComplete="email"
              required
              placeholder="admin@credio.com"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className="h-12 border-slate-200 focus:ring-[#556b2f]/20 focus:border-[#556b2f]"
            />

            <div className="relative flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-slate-700">Contraseña</label>
                <button 
                  type="button" 
                  className="text-xs font-bold text-[#556b2f] hover:underline transition-all"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <Input
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 border-slate-200 focus:ring-[#556b2f]/20 focus:border-[#556b2f]"
              />
            </div>
          </section>

          <section className="py-1">
            <Checkbox 
              label="Recordarme" 
              id="rem"
            />
          </section>

          <Button 
            variant="oliva" 
            isLoading={loading} 
            type="submit" 
            className="w-full h-12 rounded-xl text-base font-bold shadow-md shadow-[#556b2f]/10 transition-transform active:scale-[0.98]"
          >
            Iniciar Sesión
          </Button>
        </form>

        <footer className="mt-12 text-center">
          <p className="text-[10px] font-bold uppercase tracking-[2px] text-slate-300">
            © 2026 Credio Dominicano
          </p>
        </footer>
      </article>
    </main>
  );
}