import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useRegisterEmployee } from "../hooks/useRegisterEmployee";

export default function EmployeeFormPage() {
  const navigate = useNavigate();
  const { registerEmployee, isSubmitting, error } = useRegisterEmployee();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    documentNumber: "",
    role: "",
    password: "",
  });

  const [file, setFile] = useState<File | null>(null);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await registerEmployee({
      ...form,
      file,
    });

    navigate("/employees");
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nuevo empleado</h1>
        <p className="text-sm text-slate-500">Completa la información del empleado.</p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-2xl border bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Field
            label="Nombre"
            value={form.firstName}
            onChange={(value) => handleChange("firstName", value)}
          />
          <Field
            label="Apellido"
            value={form.lastName}
            onChange={(value) => handleChange("lastName", value)}
          />
          <Field
            label="Correo"
            type="email"
            value={form.email}
            onChange={(value) => handleChange("email", value)}
          />
          <Field
            label="Teléfono"
            value={form.phone}
            onChange={(value) => handleChange("phone", value)}
          />
          <Field
            label="Documento"
            value={form.documentNumber}
            onChange={(value) => handleChange("documentNumber", value)}
          />
          <Field
            label="Rol"
            value={form.role}
            onChange={(value) => handleChange("role", value)}
          />
          <Field
            label="Contraseña"
            type="password"
            value={form.password}
            onChange={(value) => handleChange("password", value)}
          />

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700">Imagen</label>
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] ?? null)}
              className="rounded-xl border px-3 py-2"
            />
          </div>
        </div>

        {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {isSubmitting ? "Guardando..." : "Registrar empleado"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/employees")}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}

interface FieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}

function Field({ label, value, onChange, type = "text" }: FieldProps) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-slate-700">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border px-3 py-2 outline-none"
      />
    </div>
  );
}