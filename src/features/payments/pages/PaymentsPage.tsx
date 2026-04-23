import { useEffect, useMemo, useState } from "react";
import { usePayments } from "../hooks/usePayments";

const cardStyle: React.CSSProperties = {
  background: "#FFFFFF",
  border: "1px solid #E2E8F0",
  borderRadius: 20,
  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.06)",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  borderRadius: 12,
  border: "1px solid #CBD5E1",
  outline: "none",
  fontSize: 14,
  background: "#fff",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: 13,
  fontWeight: 700,
  color: "#334155",
  marginBottom: 8,
};

const mutedText: React.CSSProperties = {
  color: "#64748B",
  fontSize: 13,
};

const money = (value?: number | null) =>
  new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    maximumFractionDigits: 2,
  }).format(Number(value ?? 0));

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("es-DO");
};

export default function PaymentsPage() {
  const {
    installments,
    selectedLoan,
    isLoading,
    isScheduleLoading,
    isRegistering,
    error,
    paymentResult,
    fetchLoanSchedule,
    registerPayment,
  } = usePayments();

  const [search, setSearch] = useState("");
  const [loanId, setLoanId] = useState("");
  const [amountPaid, setAmountPaid] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");

  const filteredInstallments = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return installments;

    return installments.filter((item) => {
      const text = [
        item.clientName,
        item.documentNumber,
        item.loanCode,
        item.loanId,
        item.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(term);
    });
  }, [installments, search]);

  useEffect(() => {
    if (!selectedLoan?.loanId) return;
    setLoanId(selectedLoan.loanId);
  }, [selectedLoan]);

  const handleSelectLoan = async (selectedLoanId: string) => {
    await fetchLoanSchedule(selectedLoanId);
  };

  const handleRegisterPayment = async () => {
    const parsedAmount = Number(amountPaid);
    const parsedLatitude = latitude.trim() ? Number(latitude) : undefined;
    const parsedLongitude = longitude.trim() ? Number(longitude) : undefined;

    if (!loanId.trim()) {
      alert("Debes seleccionar o indicar un préstamo.");
      return;
    }

    if (!parsedAmount || parsedAmount <= 0) {
      alert("Debes indicar un monto válido.");
      return;
    }

    if (parsedLatitude != null && (parsedLatitude < -90 || parsedLatitude > 90)) {
      alert("La latitud debe estar entre -90 y 90.");
      return;
    }

    if (parsedLongitude != null && (parsedLongitude < -180 || parsedLongitude > 180)) {
      alert("La longitud debe estar entre -180 y 180.");
      return;
    }

    try {
      await registerPayment({
        loanId: loanId.trim(),
        amountPaid: parsedAmount,
        paymentMethod,
        latitude: parsedLatitude,
        longitude: parsedLongitude,
      });

      setAmountPaid("");
      setLatitude("");
      setLongitude("");

      alert("Pago registrado correctamente.");
    } catch {
      alert("No se pudo registrar el pago.");
    }
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr", gap: 24 }}>
      <section style={{ ...cardStyle, padding: 24 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            marginBottom: 20,
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: 26,
                fontWeight: 800,
                color: "#0F172A",
              }}
            >
              Pagos
            </h1>
            <p style={{ ...mutedText, marginTop: 8, marginBottom: 0 }}>
              Consulta cuotas próximas y registra pagos realizados por clientes.
            </p>
          </div>

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por cliente, cédula o préstamo"
            style={{ ...inputStyle, width: 290 }}
          />
        </div>

        {isLoading ? (
          <p style={mutedText}>Cargando cuotas...</p>
        ) : filteredInstallments.length === 0 ? (
          <p style={mutedText}>No hay cuotas próximas disponibles.</p>
        ) : (
          <div style={{ display: "grid", gap: 14 }}>
            {filteredInstallments.map((item, index) => (
              <button
                key={`${item.loanId}-${item.installmentNumber ?? index}`}
                type="button"
                onClick={() => item.loanId && void handleSelectLoan(item.loanId)}
                style={{
                  textAlign: "left",
                  borderRadius: 16,
                  border: selectedLoan?.loanId === item.loanId
                    ? "1px solid #0F766E"
                    : "1px solid #E2E8F0",
                  background: selectedLoan?.loanId === item.loanId
                    ? "#F0FDFA"
                    : "#FFFFFF",
                  padding: 18,
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    gap: 16,
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontWeight: 800,
                        color: "#0F172A",
                        fontSize: 16,
                        marginBottom: 6,
                      }}
                    >
                      {item.clientName || "Cliente sin nombre"}
                    </div>

                    <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                      Préstamo: <strong>{item.loanCode || item.loanId || "—"}</strong>
                    </div>

                    <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                      Cuota #{item.installmentNumber ?? "—"} · vence {formatDate(item.dueDate)}
                    </div>

                    <div style={{ fontSize: 14, color: "#334155" }}>
                      Monto: <strong>{money(item.amount)}</strong>
                    </div>
                  </div>

                  <span
                    style={{
                      padding: "8px 10px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 700,
                      background: "#F1F5F9",
                      color: "#334155",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.status || "Pendiente"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </section>

      <section style={{ ...cardStyle, padding: 24 }}>
        <h2 style={{ marginTop: 0, marginBottom: 16, color: "#0F172A" }}>
          Registrar pago
        </h2>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Préstamo</label>
          <input
            value={loanId}
            onChange={(e) => setLoanId(e.target.value)}
            style={inputStyle}
            placeholder="ID del préstamo"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Monto pagado</label>
          <input
            type="number"
            step="0.01"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            style={inputStyle}
            placeholder="Ej: 3500"
          />
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Método de pago</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            style={inputStyle}
          >
            <option value="Cash">Efectivo</option>
            <option value="Transfer">Transferencia</option>
            <option value="Card">Tarjeta</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
          <div>
            <label style={labelStyle}>Latitud (opcional)</label>
            <input
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              style={inputStyle}
              placeholder="18.4861"
            />
          </div>

          <div>
            <label style={labelStyle}>Longitud (opcional)</label>
            <input
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              style={inputStyle}
              placeholder="-69.9312"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={() => void handleRegisterPayment()}
          disabled={isRegistering}
          style={{
            width: "100%",
            padding: "14px 18px",
            borderRadius: 14,
            border: "none",
            background: isRegistering ? "#94A3B8" : "#0F766E",
            color: "#fff",
            fontWeight: 800,
            fontSize: 15,
            cursor: isRegistering ? "not-allowed" : "pointer",
          }}
        >
          {isRegistering ? "Registrando pago..." : "Registrar pago"}
        </button>

        {paymentResult && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              color: "#065F46",
            }}
          >
            <strong>Pago registrado correctamente.</strong>
            <div style={{ marginTop: 6, fontSize: 14 }}>
              ID: {paymentResult.id || "No retornado"}
            </div>
            <div style={{ marginTop: 4, fontSize: 14 }}>
              Recibo: {paymentResult.receiptNumber || "No retornado"}
            </div>
            <div style={{ marginTop: 4, fontSize: 14 }}>
              Mensaje: {paymentResult.message || "Operación completada"}
            </div>
          </div>
        )}

        {error && (
          <div
            style={{
              marginTop: 18,
              padding: 14,
              borderRadius: 14,
              background: "#FEF2F2",
              border: "1px solid #FECACA",
              color: "#991B1B",
            }}
          >
            {error}
          </div>
        )}

        <div style={{ marginTop: 28 }}>
          <h3 style={{ color: "#0F172A", marginBottom: 12 }}>Calendario del préstamo</h3>

          {!selectedLoan ? (
            <p style={mutedText}>Selecciona una cuota de la lista para ver el calendario.</p>
          ) : isScheduleLoading ? (
            <p style={mutedText}>Cargando calendario...</p>
          ) : (
            <div style={{ display: "grid", gap: 12, maxHeight: 360, overflowY: "auto" }}>
              {(selectedLoan.installments ?? []).map((item, index) => (
                <div
                  key={`${item.installmentNumber ?? index}-${item.dueDate ?? index}`}
                  style={{
                    border: "1px solid #E2E8F0",
                    borderRadius: 14,
                    padding: 14,
                    background: "#FFFFFF",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      gap: 16,
                      marginBottom: 10,
                    }}
                  >
                    <strong style={{ color: "#0F172A" }}>
                      Cuota #{item.installmentNumber ?? "—"}
                    </strong>
                    <span style={mutedText}>{item.status || "Pendiente"}</span>
                  </div>

                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                    Vence: <strong>{formatDate(item.dueDate)}</strong>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                    Pago: <strong>{formatDate(item.paymentDate)}</strong>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                    Capital: <strong>{money(item.principal)}</strong>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                    Interés: <strong>{money(item.interest)}</strong>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155", marginBottom: 4 }}>
                    Cuota: <strong>{money(item.installmentAmount)}</strong>
                  </div>
                  <div style={{ fontSize: 14, color: "#334155" }}>
                    Balance: <strong>{money(item.balance)}</strong>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}