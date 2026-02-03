import React, { useState } from "react";
import axios from "axios";

export default function OtpVerify() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await axios.post("http://localhost:7000/api/verify-otp", {
        email,
        otp,
      });

      setSuccess("OTP Verified Successfully! Redirecting...", res);

      setTimeout(() => {
        window.location.href = "/set-password?email=" + email;
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.glowA} />
      <div style={styles.glowB} />

      <div style={styles.container}>
        <div style={styles.sideCard}>
          <p style={styles.eyebrow}>Verification</p>
          <h2 style={styles.sideTitle}>Confirm your identity.</h2>
          <p style={styles.sideText}>
            Enter the OTP sent to your email or phone to secure your account.
          </p>
          <div style={styles.sideNote}>
            Tip: If you registered with multiple emails, use the same one here.
          </div>
        </div>

        <div style={styles.card}>
          <h2 style={styles.title}>Verify OTP</h2>
          <p style={styles.subtitle}>Check your SMS/Email for the OTP</p>

          {error && <p style={styles.error}>{error}</p>}
          {success && <p style={styles.success}>{success}</p>}

          <form onSubmit={handleVerify} style={styles.form}>
            <input
              style={styles.input}
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <input
              style={styles.input}
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button style={styles.button} type="submit">
              Verify OTP
            </button>
          </form>

          <p style={styles.footer}>
            Didn’t receive OTP?{" "}
            <span style={styles.resend}>Resend</span>
          </p>
        </div>
      </div>
    </div>
  );
}

/* Premium Styles */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background:
      "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
    padding: 20,
    position: "relative",
    overflow: "hidden",
  },
  glowA: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
    top: -90,
    left: -80,
  },
  glowB: {
    position: "absolute",
    width: 200,
    height: 200,
    borderRadius: "50%",
    background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
    bottom: -80,
    right: -60,
  },
  container: {
    width: "100%",
    maxWidth: 960,
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: 24,
    zIndex: 1,
  },
  sideCard: {
    background: "#0f172a",
    color: "#fff",
    padding: "30px",
    borderRadius: 20,
    boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
    animation: "fadeUp 0.8s ease both",
  },
  eyebrow: {
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.24em",
    color: "rgba(255,255,255,0.7)",
    fontWeight: 700,
    marginBottom: 12,
  },
  sideTitle: {
    fontFamily: '"DM Serif Display", serif',
    fontSize: 30,
    margin: 0,
  },
  sideText: {
    marginTop: 14,
    color: "rgba(255,255,255,0.72)",
    lineHeight: 1.6,
  },
  sideNote: {
    marginTop: 22,
    padding: "12px 14px",
    borderRadius: 12,
    background: "rgba(255,255,255,0.08)",
    fontSize: 13,
  },
  card: {
    width: "100%",
    padding: "32px",
    background: "#ffffff",
    borderRadius: 20,
    boxShadow: "var(--card-shadow)",
    animation: "fadeUp 0.9s ease both",
  },

  title: {
    fontSize: 24,
    fontWeight: 700,
    marginBottom: 6,
    color: "var(--ink-900)",
  },
  subtitle: {
    fontSize: 14,
    color: "var(--ink-600)",
    marginBottom: 22,
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    padding: "13px 14px",
    fontSize: 15,
    borderRadius: 12,
    border: "1px solid rgba(15, 23, 42, 0.15)",
    background: "rgba(250, 250, 250, 0.9)",
    outline: "none",
  },

  button: {
    marginTop: 6,
    padding: "14px",
    borderRadius: 12,
    border: "none",
    background: "var(--mint-500)",
    color: "white",
    fontWeight: 600,
    fontSize: 16,
    cursor: "pointer",
  },

  footer: {
    marginTop: 18,
    fontSize: 14,
    color: "var(--ink-600)",
  },

  resend: {
    color: "var(--mint-600)",
    cursor: "pointer",
    fontWeight: 600,
  },

  error: {
    color: "#e63946",
    fontWeight: 600,
  },
  success: {
    color: "#2ea44f",
    fontWeight: 600,
  },
};
