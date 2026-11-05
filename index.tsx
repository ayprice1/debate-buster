import React, { useState } from "react";

export default function DebateBuster() {
  const [argument, setArgument] = useState("");
  const [rebuttal, setRebuttal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!argument.trim()) return;
    setLoading(true);
    setError("");
    setRebuttal("");

    try {
      const response = await fetch("/api/bust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ argument }),
      });
      const data = await response.json();
      if (data.ok) {
        setRebuttal(data.text);
      } else {
        setError(data.error || "An error occurred while processing.");
      }
    } catch (err) {
      setError("Failed to connect to the backend system.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif", backgroundColor: "#111", color: "#fff", borderRadius: "8px" }}>
      <h1 style={{ color: "#f59e0b", borderBottom: "2px solid #333", paddingBottom: "10px" }}>Sieve Debate Buster</h1>
      
      <form onSubmit={handleBust} style={{ marginTop: "20px" }}>
        <label style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}>YOUR ARGUMENT</label>
        <textarea
          value={argument}
          onChange={(e) => setArgument(e.target.value)}
          placeholder="Paste weak argument or secular narrative here..."
          style={{ width: "100%", height: "150px", padding: "12px", backgroundColor: "#222", color: "#fff", border: "1px solid #444", borderRadius: "4px", fontSize: "16px", boxSizing: "border-box" }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{ marginTop: "12px", padding: "12px 24px", backgroundColor: "#f59e0b", color: "#000", border: "none", borderRadius: "4px", fontWeight: "bold", cursor: "pointer", fontSize: "16px" }}
        >
          {loading ? "BUSTING ARGUMENT..." : "DEBATE BUSTER SIEVE"}
        </button>
      </form>

      {error && <div style={{ color: "#ef4444", marginTop: "20px", padding: "10px", backgroundColor: "#311", borderRadius: "4px" }}>{error}</div>}

      {rebuttal && (
        <div style={{ marginTop: "30px", padding: "20px", backgroundColor: "#1e1e1e", borderLeft: "4px solid #f59e0b", borderRadius: "4px" }}>
          <h2 style={{ color: "#f59e0b", marginTop: "0" }}>REBUTTAL</h2>
          <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{rebuttal}</div>
        </div>
      )}
    </div>
  );
}
