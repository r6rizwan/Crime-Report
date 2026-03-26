import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const navigate = useNavigate();
  const resetToken = localStorage.getItem("resetToken") || "";
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    if (loading) return;
    setError("");
    setSuccess("");

    if (!resetToken) {
      setError("Missing reset token. Start from Forgot Password.");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await api.post("/api/resetpassword", { resetToken, newPassword });
      localStorage.removeItem("resetEmail");
      localStorage.removeItem("resetToken");
      setSuccess("Password reset successful.");
      setTimeout(() => navigate("/login"), 800);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to reset password");
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
          <span style={styles.logo} onClick={() => navigate("/")}>CivilEye</span>
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
          <p style={styles.eyebrow}>Set New Password</p>
          <h2 style={styles.sideTitle}>Create a strong password.</h2>
          <p style={styles.sideText}>
            Use at least 8 characters with a mix of letters, numbers, and symbols to improve account security.
          </p>
          <div style={styles.sideNote}>Do not reuse old passwords or share your credentials with anyone.</div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>Set your new password</p>

          {error && <div style={styles.error}>{error}</div>}
          {success && <div style={styles.success}>{success}</div>}

          <form onSubmit={handleReset} style={styles.form}>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New Password"
              style={styles.input}
              required
            />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              style={styles.input}
              required
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Saving..." : "Reset Password"}
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
  success: {
    background: "rgba(34,197,94,0.15)",
    color: "#166534",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
    fontWeight: 600,
  },
};
