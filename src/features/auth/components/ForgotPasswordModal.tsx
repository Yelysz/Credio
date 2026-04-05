import { useState } from "react";
import toast from "react-hot-toast";
import { authService } from "../services/auth.service";
import { Button, Input } from "@/shared/components";
import { getApiErrorMessage } from "@/shared/utils/getApiErrorMessage";

interface Props {
  open: boolean;
  onClose: () => void;
}

type Step = "request" | "confirm" | "change";

export function ForgotPasswordModal({ open, onClose }: Props) {
  const [step, setStep] = useState<Step>("request");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.resetPassword({ email });
      toast.success("Código enviado correctamente");
      setStep("confirm");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo enviar el código"));
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.confirmCode({ email, code });
      toast.success("Código confirmado");
      setStep("change");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Código inválido"));
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await authService.changePassword({ newPassword });
      toast.success("Contraseña actualizada");
      handleClose();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "No se pudo cambiar la contraseña"));
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep("request");
    setEmail("");
    setCode("");
    setNewPassword("");
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-800">
            Recuperar contraseña
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            {step === "request" && "Ingresa tu correo para recibir el código"}
            {step === "confirm" && "Ingresa el código enviado a tu correo"}
            {step === "change" && "Define tu nueva contraseña"}
          </p>
        </div>

        {step === "request" && (
          <form className="space-y-4" onSubmit={handleRequestReset}>
            <Input
              label="Correo electrónico"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="oliva" isLoading={loading}>
                Enviar código
              </Button>
            </div>
          </form>
        )}

        {step === "confirm" && (
          <form className="space-y-4" onSubmit={handleConfirmCode}>
            <Input
              label="Código"
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="oliva" isLoading={loading}>
                Confirmar código
              </Button>
            </div>
          </form>
        )}

        {step === "change" && (
          <form className="space-y-4" onSubmit={handleChangePassword}>
            <Input
              label="Nueva contraseña"
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <Button type="button" variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" variant="oliva" isLoading={loading}>
                Cambiar contraseña
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}