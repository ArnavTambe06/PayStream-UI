const typeConfig = {
  DEPOSIT: { label: "Deposit", color: "var(--green)", sign: "+" },
  WITHDRAWAL: { label: "Withdraw", color: "var(--red)", sign: "−" },
  TRANSFER_OUT: { label: "Sent", color: "var(--ink-mid)", sign: "−" },
  TRANSFER_IN: { label: "Received", color: "var(--green)", sign: "+" },
};

const statusConfig = {
  SUCCESS: { label: "Success", bg: "#EBF5EE", color: "#2E6B42" },
  FAILED: { label: "Failed", bg: "#FBEAEA", color: "#8B2B2B" },
  PENDING: { label: "Pending", bg: "#FDF5E6", color: "#7A5210" },
  REVERSED: { label: "Reversed", bg: "#F0EFED", color: "#5A5550" },
};

export default function TransactionTable({ transactions }) {
  if (!transactions?.length) {
    return (
      <div
        style={{
          textAlign: "center",
          padding: "48px 0",
          color: "var(--ink-light)",
          fontSize: "14px",
          border: "1px solid var(--cream-dark)",
          borderRadius: "10px",
          background: "white",
        }}
      >
        No transactions yet
      </div>
    );
  }

  return (
    <div
      style={{
        border: "1px solid var(--cream-dark)",
        borderRadius: "10px",
        background: "white",
        overflow: "hidden",
      }}
    >
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ borderBottom: "1px solid var(--cream-dark)" }}>
            {["Reference", "Type", "Amount", "Status", "Date"].map((h) => (
              <th
                key={h}
                style={{
                  padding: "12px 16px",
                  textAlign: "left",
                  fontSize: "11px",
                  fontWeight: "400",
                  color: "var(--ink-light)",
                  letterSpacing: "0.6px",
                  fontFamily: "DM Mono, monospace",
                  background: "var(--cream)",
                }}
              >
                {h.toUpperCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, i) => {
            const type = typeConfig[txn.type] || {
              label: txn.type,
              color: "var(--ink)",
              sign: "",
            };
            const status = statusConfig[txn.status] || {
              label: txn.status,
              bg: "#eee",
              color: "#333",
            };
            return (
              <tr
                key={txn.id}
                style={{
                  borderBottom:
                    i < transactions.length - 1
                      ? "1px solid var(--cream-mid)"
                      : "none",
                  transition: "background 0.1s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--cream)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "white")
                }
              >
                <td
                  style={{
                    padding: "14px 16px",
                    fontFamily: "DM Mono, monospace",
                    fontSize: "12px",
                    fontWeight: "300",
                    color: "var(--ink-mid)",
                  }}
                >
                  {txn.referenceId}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "13px",
                    color: type.color,
                    fontWeight: "400",
                  }}
                >
                  {type.label}
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontFamily: "DM Mono, monospace",
                    fontSize: "13px",
                    fontWeight: "400",
                    color: type.color,
                  }}
                >
                  {type.sign}₹
                  {Number(txn.amount).toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </td>
                <td style={{ padding: "14px 16px" }}>
                  <span
                    style={{
                      fontSize: "11px",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      background: status.bg,
                      color: status.color,
                      fontFamily: "DM Mono, monospace",
                      fontWeight: "400",
                      letterSpacing: "0.3px",
                    }}
                  >
                    {status.label}
                  </span>
                </td>
                <td
                  style={{
                    padding: "14px 16px",
                    fontSize: "12px",
                    color: "var(--ink-light)",
                    fontFamily: "DM Mono, monospace",
                    fontWeight: "300",
                  }}
                >
                  {new Date(txn.createdAt).toLocaleDateString("en-IN", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
