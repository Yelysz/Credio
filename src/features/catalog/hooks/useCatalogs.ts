import { useEffect, useState } from "react";
import { catalogService, type CatalogOption } from "../services/catalog.service";

export function useCatalogs() {
  const [documentTypes, setDocumentTypes] = useState<CatalogOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadCatalogs = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const documentTypesResponse = await catalogService.getDocumentTypes();
        setDocumentTypes(documentTypesResponse);
      } catch (err) {
        console.error("Error loading catalogs:", err);
        setError("No se pudieron cargar los tipos de documento.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadCatalogs();
  }, []);

  return {
    documentTypes,
    isLoading,
    error,
  };
}