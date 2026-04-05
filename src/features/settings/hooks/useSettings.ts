import { useCallback, useEffect, useState } from "react";
import { settingsService } from "../services/settings.service";
import type {
  SystemSetting,
  UpdateSystemSettingPayload,
} from "../types/settings.types";

export const useSettings = () => {
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSavingId, setIsSavingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const data = await settingsService.getAll();
      setSettings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las configuraciones.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchSettings();
  }, [fetchSettings]);

  const updateLocalValue = (index: number, value: string) => {
    setSettings((prev) =>
      prev.map((item, i) => (i === index ? { ...item, value } : item))
    );
  };

  const saveSetting = async (setting: SystemSetting) => {
    const identifier =
      String(setting.id ?? setting.key ?? setting.code ?? "");

    try {
      setIsSavingId(identifier);
      setError(null);
      setSuccess(null);

      const payload: UpdateSystemSettingPayload = {
        id: setting.id,
        key: setting.key,
        code: setting.code,
        value: setting.value ?? "",
      };

      await settingsService.update(payload);
      setSuccess("Configuración actualizada correctamente.");
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la configuración.");
    } finally {
      setIsSavingId(null);
    }
  };

  return {
    settings,
    isLoading,
    isSavingId,
    error,
    success,
    refetch: fetchSettings,
    updateLocalValue,
    saveSetting,
  };
};