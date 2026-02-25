import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function OtpScreen() {
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const email = localStorage.getItem("resetEmail") || "";

  const handleVerify = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/verifyotp", { email, otp });
      localStorage.setItem("resetToken", res.data.resetToken);
      navigate("/reset-password");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.logo} onClick={() => navigate("/")}>Crime Reporting Portal</span>
          <span style={styles.navTag}>Account Recovery</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
          <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>
          <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
        </div>
      </nav>

      <div style={styles.container}>
        <div style={styles.sideCard}>
          <p style={styles.eyebrow}>Verify Code</p>
          <h2 style={styles.sideTitle}>Enter the OTP sent to your email.</h2>
          <p style={styles.sideText}>
            This verification step protects your account from unauthorized password reset attempts.
          </p>
          <div style={styles.sideNote}>If you did not request this, do not continue and change your password later.</div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Verify OTP</h2>
          <p style={styles.subtitle}>Enter the OTP sent to your email</p>

          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleVerify} style={styles.form}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
    paddingBottom: 40,
    position: "relative",
    overflow: "hidden",
  },
  glowA: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
    top: -120,
    left: -80,
  },
  glowB: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
    bottom: -120,
    right: -60,
  },
  navbar: {
    height: 72,
    background: "rgba(255,255,255,0.9)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  navLeft: { display: "flex", alignItems: "center", gap: 14 },
  logo: { fontSize: 20, fontWeight: 700, color: "var(--ink-900)", cursor: "pointer" },
  navTag: {
    fontSize: 12,
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.16em",
    color: "var(--mint-600)",
  },
  navRight: { display: "flex", alignItems: "center", gap: 22 },
  navLink: { fontWeight: 600, color: "var(--ink-600)", cursor: "pointer" },
  container: {
    width: "100%",
    maxWidth: 1100,
    margin: "40px auto 0",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: 24,
    padding: "0 28px",
    position: "relative",
    zIndex: 1,
  },
  sideCard: {
    background: "#0f172a",
    color: "#fff",
    padding: "32px",
    borderRadius: 22,
    boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.24em",
    color: "rgba(255,255,255,0.7)",
    fontWeight: 700,
    marginBottom: 12,
  },
  sideTitle: { fontFamily: '"DM Serif Display", serif', fontSize: 30, margin: 0 },
  sideText: { marginTop: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 },
  sideNote: {
    marginTop: 22,
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    fontSize: 13,
  },
  card: {
    width: "100%",
    background: "#fff",
    padding: "32px",
    borderRadius: 22,
    boxShadow: "var(--card-shadow)",
  },
  title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
  subtitle: { color: "var(--ink-600)", marginBottom: 18 },
  form: { display: "flex", flexDirection: "column", gap: 12 },
  input: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "1px solid rgba(15,23,42,0.15)",
    background: "rgba(250, 250, 250, 0.9)",
  },
  button: {
    padding: "12px 14px",
    borderRadius: 12,
    border: "none",
    background: "var(--mint-500)",
    color: "#fff",
    fontWeight: 700,
    cursor: "pointer",
  },
  error: {
    background: "rgba(248,113,113,0.15)",
    color: "#b91c1c",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: 600,
  },
};
