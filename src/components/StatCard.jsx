export default function StatCard({ label, value, sub, accent }) {
  return (
    <div
      className="card-lift"
      style={{
        background: accent
          ? "linear-gradient(135deg, var(--slate) 0%, var(--slate-light) 100%)"
          : "white",
        border: `1px solid ${accent ? "transparent" : "var(--cream-dark)"}`,
        borderRadius: "12px",
        padding: "22px 24px",
        boxShadow: accent
          ? "0 4px 20px rgba(28,36,32,0.15)"
          : "0 1px 4px rgba(28,36,32,0.04)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {accent && (
        <div
          style={{
            position: "absolute",
            top: "-20px",
            right: "-20px",
            width: "100px",
            height: "100px",
            borderRadius: "50%",
            background: "var(--sage)",
            opacity: 0.08,
            pointerEvents: "none",
          }}
        />
      )}
      <div
        style={{
          fontSize: "10px",
          color: accent ? "var(--sage)" : "var(--ink-light)",
          letterSpacing: "1px",
          marginBottom: "10px",
          fontFamily: "DM Mono, monospace",
          fontWeight: "300",
        }}
      >
        {label.toUpperCase()}
      </div>
      <div
        style={{
          fontSize: "28px",
          fontWeight: "300",
          color: accent ? "white" : "var(--ink)",
          letterSpacing: "-0.5px",
          fontFamily: "DM Mono, monospace",
          lineHeight: 1,
          marginBottom: sub ? "8px" : 0,
        }}
      >
        {value}
      </div>
      {sub && (
        <div
          style={{
            fontSize: "12px",
            color: accent ? "var(--sage-light)" : "var(--ink-light)",
          }}
        >
          {sub}
        </div>
      )}
    </div>
  );
}
