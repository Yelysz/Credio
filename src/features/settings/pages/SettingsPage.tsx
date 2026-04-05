import { useMemo, useState } from "react";
import { useSettings } from "../hooks/useSettings";
import type { SystemSetting } from "../types/settings.types";

export default function SettingsPage() {
  const {
    settings,
    isLoading,
    isSavingId,
    error,
    success,
    refetch,
    updateLocalValue,
    saveSetting,
  } = useSettings();

  const [searchInput, setSearchInput] = useState("");

  const filteredSettings = useMemo(() => {
    if (!searchInput.trim()) return settings;

    const q = searchInput.toLowerCase();

    return settings.filter((setting) => {
      return (
        String(setting.name ?? "").toLowerCase().includes(q) ||
        String(setting.key ?? "").toLowerCase().includes(q) ||
        String(setting.code ?? "").toLowerCase().includes(q) ||
        String(setting.description ?? "").toLowerCase().includes(q) ||
        String(setting.category ?? "").toLowerCase().includes(q)
      );
    });
  }, [settings, searchInput]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Configuración</h1>
        <p className="text-sm text-slate-500">
          Administra los parámetros generales del sistema
        </p>
      </div>

      <div className="rounded-2xl border bg-white p-4">
        <div className="mb-4 flex gap-3">
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Buscar por nombre, clave o categoría"
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />

          <button
            onClick={refetch}
            className="rounded-xl border px-4 py-2 text-sm"
          >
            Refrescar
          </button>
        </div>

        {isLoading && <p className="text-sm text-slate-500">Cargando configuraciones...</p>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-emerald-600">{success}</p>}

        {!isLoading && !error && filteredSettings.length === 0 && (
          <p className="text-sm text-slate-500">
            No hay configuraciones disponibles.
          </p>
        )}

        {!isLoading && !error && filteredSettings.length > 0 && (
          <div className="space-y-4">
            {filteredSettings.map((setting, index) => {
              const rowId = String(setting.id ?? setting.key ?? setting.code ?? index);
              const label =
                setting.name ?? setting.key ?? setting.code ?? "Configuración";

              return (
                <SettingCard
                  key={rowId}
                  setting={setting}
                  isSaving={isSavingId === rowId}
                  onChange={(value) => {
                    const originalIndex = settings.findIndex(
                      (item) =>
                        String(item.id ?? item.key ?? item.code ?? "") ===
                        String(setting.id ?? setting.key ?? setting.code ?? "")
                    );

                    if (originalIndex >= 0) {
                      updateLocalValue(originalIndex, value);
                    }
                  }}
                  onSave={() => saveSetting(setting)}
                  label={label}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SettingCard({
  setting,
  isSaving,
  onChange,
  onSave,
  label,
}: {
  setting: SystemSetting;
  isSaving: boolean;
  onChange: (value: string) => void;
  onSave: () => void;
  label: string;
}) {
  return (
    <div className="rounded-2xl border p-4">
      <div className="mb-3 flex flex-col gap-1">
        <h2 className="text-base font-semibold text-slate-900">{label}</h2>
        {setting.description && (
          <p className="text-sm text-slate-500">{String(setting.description)}</p>
        )}
        <div className="flex flex-wrap gap-2 text-xs text-slate-400">
          {setting.category && <span>Categoría: {String(setting.category)}</span>}
          {setting.type && <span>Tipo: {String(setting.type)}</span>}
          {setting.key && <span>Key: {String(setting.key)}</span>}
          {setting.code && <span>Código: {String(setting.code)}</span>}
        </div>
      </div>

      <div className="flex flex-col gap-3 md:flex-row md:items-end">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium text-slate-700">
            Valor
          </label>
          <input
            value={String(setting.value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className="w-full rounded-xl border px-3 py-2 outline-none"
          />
        </div>

        <button
          onClick={onSave}
          disabled={isSaving}
          className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          {isSaving ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </div>
  );
}