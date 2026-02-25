import React, { useState } from "react";
import api from "../../utils/api";

export default function SetPassword() {

    const query = new URLSearchParams(window.location.search);
    const emailFromOtp = (query.get("email") || "").trim().toLowerCase();

    const [email] = useState(emailFromOtp);  // email locked
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (saving) return;
        setError("");
        setSuccess("");

        if (password !== confirmPassword) {
            setError("Passwords do not match!");
            return;
        }
        if (!email) {
            setError("Missing email context. Please verify OTP again.");
            return;
        }

        try {
            setSaving(true);
            await api.post("/api/create-password", {
                email,
                password
            });

            setSuccess("Password created successfully! Redirecting to login...");

            setTimeout(() => {
                window.location.href = "/login";
            }, 1000);

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            <div style={styles.container}>
                <div style={styles.sideCard}>
                    <p style={styles.eyebrow}>Secure Access</p>
                    <h2 style={styles.sideTitle}>Set a strong password.</h2>
                    <p style={styles.sideText}>
                        Use at least 8 characters with a mix of letters, numbers,
                        and symbols for the best protection.
                    </p>
                    <div style={styles.sideNote}>Account: {email || "Unverified email"}</div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Set Your Password</h2>
                    <p style={styles.subtitle}>For: {email}</p>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <input
                            type="password"
                            style={styles.input}
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            style={styles.input}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />

                        <button style={styles.button} type="submit" disabled={saving}>
                            {saving ? "Saving..." : "Save Password"}
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
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        padding: 20,
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
        background: "#fff",
        padding: "32px",
        borderRadius: 20,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },
    title: {
        fontSize: 24,
        fontWeight: 700,
    },
    subtitle: {
        marginTop: 6,
        color: "var(--ink-600)",
        marginBottom: 20,
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    input: {
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        background: "rgba(250, 250, 250, 0.9)",
        fontSize: 15,
    },
    button: {
        padding: "14px",
        border: "none",
        borderRadius: 12,
        background: "var(--mint-500)",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
        marginTop: 6,
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
