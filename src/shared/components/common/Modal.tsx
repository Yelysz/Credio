import { useEffect } from "react";
import { cn } from "../../utils/cn";
import { Button } from "./Button";
import { X } from "lucide-react"; // Usaremos un icono para un look más limpio

type ModalSize = "sm" | "md" | "lg" | "xl" | "full";

type Props = {
  open: boolean;
  title?: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  className?: string;
  closeOnOverlayClick?: boolean;
  size?: ModalSize;
  maxHeight?: string;
};

const sizeClasses: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-7xl",
};

export function Modal({ open, title, onClose, children, footer, className, closeOnOverlayClick = true, size, maxHeight }: Props) {
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    // Bloquear el scroll del body cuando el modal está abierto
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="absolute inset-0 bg-slate-900/40 transition-opacity"
        onClick={closeOnOverlayClick ? onClose : undefined}
        aria-hidden="true"
      />

      <article
        className={cn(
          "relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl",
          "border border-slate-100 animate-in zoom-in-95 duration-200",
          sizeClasses[size ?? "md"],
          maxHeight ?? "max-h-[85vh]",
          "flex flex-col",
          className
        )}
      >
        <header className="flex items-center justify-between border-b border-slate-50 px-6 py-4">
          <h2
            id="modal-title"
            className="text-lg font-bold tracking-tight text-[#2d3a1a]"
          >
            {title ?? "Información"}
          </h2>
          <Button
            variant="ghost"
            onClick={onClose}
            className="h-8 w-8 rounded-full p-0 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Cerrar modal"
          >
            <X size={18} />
          </Button>
        </header>

        <section className="px-6 py-6 text-sm text-slate-600 leading-relaxed overflow-y-auto">
          {children}
        </section>

        {footer && (
          <footer className="flex justify-end gap-3 border-t border-slate-50 bg-slate-50/50 px-6 py-4">
            {footer}
          </footer>
        )}
      </article>
    </div>
  );
}