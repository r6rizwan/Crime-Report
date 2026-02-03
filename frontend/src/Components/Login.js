import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const [showLoginMenu, setShowLoginMenu] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* 🔹 Close dropdown when clicking outside */
    useEffect(() => {
        const closeMenu = () => setShowLoginMenu(false);
        window.addEventListener("click", closeMenu);

        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:7000/api/login", {
                email,
                password,
            });

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("role", res.data.role);
            localStorage.setItem("email", email);

            setSuccess("Login Successful! Redirecting...");

            setTimeout(() => {
                if (res.data.role === "Admin") {
                    window.location.href = "/admin/dashboard";
                } else if (res.data.role === "Investigator") {
                    window.location.href = "/investigator/dashboard";
                } else {
                    window.location.href = "/user/dashboard";
                }
            }, 800);

        } catch (err) {
            setError(err.response?.data?.error || "Invalid Credentials");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                    <span style={styles.navTag}>Citizen Access</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>
                        Home
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>
                        About
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>
                        Contact
                    </span>

                    <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                        <span
                            style={styles.navLink}
                            onClick={() => setShowLoginMenu((prev) => !prev)}
                        >
                            Login ▾
                        </span>

                        {showLoginMenu && (
                            <div style={styles.dropdownMenu}>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={() => navigate("/login")}
                                >
                                    Citizen Login
                                </div>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={() => navigate("/investigator/login")}
                                >
                                    Investigator Login
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.sideCard}>
                    <p style={styles.eyebrow}>Welcome Back</p>
                    <h2 style={styles.sideTitle}>Continue your report safely.</h2>
                    <p style={styles.sideText}>
                        Access complaint status, evidence uploads, and investigator
                        updates with a secure login.
                    </p>
                    <div style={styles.sideNote}>
                        Need to file a new report? Register to get started.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Sign In</h2>
                    <p style={styles.subtitle}>Login to continue</p>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <form onSubmit={handleLogin} style={styles.form}>
                        <input
                            type="email"
                            style={styles.input}
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <input
                            type="password"
                            style={styles.input}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />

                        <button type="submit" style={styles.button}>
                            Login
                        </button>
                    </form>

                    <p style={styles.footer}>
                        Don’t have an account?{" "}
                        <span style={styles.link} onClick={() => navigate("/register")}>
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
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

    logo: {
        fontSize: 20,
        fontWeight: 700,
        color: "var(--ink-900)",
        cursor: "pointer",
    },
    navTag: {
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--mint-600)",
    },

    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 22,
    },

    navLink: {
        fontWeight: 600,
        color: "var(--ink-600)",
        cursor: "pointer",
    },

    dropdown: { position: "relative" },

    dropdownMenu: {
        position: "absolute",
        top: 34,
        right: 0,
        background: "#fff",
        borderRadius: 12,
        boxShadow: "0 12px 28px rgba(11,18,32,0.18)",
        minWidth: 190,
        overflow: "hidden",
        zIndex: 2000,
    },

    dropdownItem: {
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 600,
        color: "var(--ink-700)",
        borderBottom: "1px solid #f1f1f1",
    },

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
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },

    title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
    subtitle: { fontSize: 14, color: "var(--ink-600)", marginBottom: 24 },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },

    input: {
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        background: "rgba(250, 250, 250, 0.9)",
    },

    button: {
        padding: 14,
        background: "var(--mint-500)",
        borderRadius: 12,
        border: "none",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
    },

    footer: { marginTop: 16, fontSize: 14, color: "var(--ink-600)" },
    link: { color: "var(--mint-600)", fontWeight: 600, cursor: "pointer" },

    error: { color: "#e63946", fontWeight: 600 },
    success: { color: "#2ea44f", fontWeight: 600 },
};
