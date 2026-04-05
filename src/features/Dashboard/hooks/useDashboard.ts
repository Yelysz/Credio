import { useCallback, useEffect, useState } from "react";
import { dashboardService } from "../services/dashboard.service";
import type { DashboardViewModel } from "../types/dashboard.types";

const initialState: DashboardViewModel = {
  carteraTotal: 0,
  liquidezDisponible: 0,
  moraTotal: 0,
  prestamosActivos: 0,
  upcomingInstallments: [],
};

export const useDashboard = () => {
  const [data, setData] = useState<DashboardViewModel>(initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await dashboardService.getDashboardData();
      setData(result);
    } catch (err) {
      console.error("Error cargando dashboard:", err);
      setError("No se pudo cargar la información del dashboard.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchDashboard();
  }, [fetchDashboard]);

  return {
    data,
    isLoading,
    error,
    refetch: fetchDashboard,
  };
};