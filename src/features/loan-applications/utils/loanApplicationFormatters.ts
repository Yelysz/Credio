export const formatCurrency = (value: number | null | undefined) => {
  const safeValue = Number(value ?? 0);

  return new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 0,
  }).format(safeValue);
};

export const formatNumber = (value: number | null | undefined) => {
  const safeValue = Number(value ?? 0);

  return new Intl.NumberFormat("es-DO", {
    maximumFractionDigits: 0,
  }).format(safeValue);
};