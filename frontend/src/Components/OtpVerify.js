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
        window.location.href = "/login";
      }, 1000);

    } catch (err) {
      setError(err.response?.data?.error || "Invalid OTP");
    }
  };

  return (
    <div style={styles.page}>
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
  );
}

/* Premium Styles */
const styles = {
  page: {
    minHeight: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #e2eaff, #f6f9ff)",
    padding: 20,
  },

  card: {
    width: "400px",
    padding: "35px 30px",
    background: "#ffffff",
    borderRadius: "18px",
    boxShadow: "0 12px 32px rgba(0,0,0,0.10)",
  },

  title: {
    fontSize: "26px",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "8px",
    color: "#222",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#555",
    marginBottom: "25px",
  },

  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },

  input: {
    padding: "14px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #d2dae6",
    background: "#fafafa",
    outline: "none",
    transition: "0.2s",
  },

  button: {
    marginTop: "10px",
    padding: "14px",
    borderRadius: "10px",
    border: "none",
    background: "#4B6FFF",
    color: "white",
    fontWeight: "600",
    fontSize: "16px",
    cursor: "pointer",
  },

  footer: {
    marginTop: "18px",
    textAlign: "center",
    fontSize: "14px",
    color: "#444",
  },

  resend: {
    color: "#4B6FFF",
    cursor: "pointer",
    fontWeight: "600",
  },

  error: {
    color: "#e63946",
    textAlign: "center",
    fontWeight: 600,
  },

  success: {
    color: "#2ea44f",
    textAlign: "center",
    fontWeight: 600,
  },
};
