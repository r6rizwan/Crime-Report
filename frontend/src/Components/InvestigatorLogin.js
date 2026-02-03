import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InvestigatorLogin() {
    const navigate = useNavigate();

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    /* Close dropdown on outside click */
    useEffect(() => {
        const closeMenu = () => setShowLoginMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    const sendOtp = async () => {
        if (!phone) return setError("Enter registered mobile number");

        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:7000/api/investigators/send-otp",
                { phone }
            );

            // DEV MODE ONLY
            alert(`OTP: ${res.data.otp}`);

            setStep(2);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const verifyOtp = async () => {
        if (!otp) return setError("Enter OTP");

        setLoading(true);
        setError("");

        try {
            const res = await axios.post(
                "http://localhost:7000/api/investigators/verify-otp",
                { phone, otp }
            );

            localStorage.setItem("token", res.data.token);
            localStorage.setItem("email", res.data.investigator.email);
            localStorage.setItem("name", res.data.investigator.name);
            localStorage.setItem("role", "Investigator");

            navigate("/investigator/dashboard");
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

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                    <span style={styles.navTag}>Investigator Access</span>
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
                    <p style={styles.eyebrow}>Authorized Personnel</p>
                    <h2 style={styles.sideTitle}>Secure OTP authentication.</h2>
                    <p style={styles.sideText}>
                        Receive a one-time code to access your assigned cases and
                        investigation tools.
                    </p>
                    <div style={styles.sideNote}>
                        Keep your device handy for verification.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Investigator Login</h2>
                    <p style={styles.subtitle}>
                        Secure OTP-based access for authorized investigators
                    </p>

                    {error && <div style={styles.error}>{error}</div>}

                    {step === 1 && (
                        <>
                            <label style={styles.label}>Registered Mobile Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="Enter registered number"
                                style={styles.input}
                            />

                            <button
                                onClick={sendOtp}
                                disabled={loading}
                                style={styles.primaryBtn}
                            >
                                {loading ? "Sending…" : "Send OTP"}
                            </button>
                        </>
                    )}

                    {step === 2 && (
                        <>
                            <label style={styles.label}>Enter OTP</label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="6-digit OTP"
                                style={styles.input}
                            />

                            <div style={styles.actions}>
                                <button
                                    onClick={() => setStep(1)}
                                    style={styles.secondaryBtn}
                                >
                                    Change Number
                                </button>

                                <button
                                    onClick={verifyOtp}
                                    disabled={loading}
                                    style={styles.primaryBtn}
                                >
                                    {loading ? "Verifying…" : "Verify & Login"}
                                </button>
                            </div>
                        </>
                    )}
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

    /* NAVBAR */
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

    /* CARD */
    card: {
        background: "#fff",
        width: "100%",
        padding: 32,
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "var(--ink-600)", marginBottom: 20 },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
        color: "var(--ink-700)",
    },

    error: {
        background: "#FDECEA",
        color: "#C62828",
        padding: 12,
        borderRadius: 10,
        marginBottom: 14,
        fontWeight: 600,
    },

    input: {
        width: "100%",
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        marginBottom: 16,
        boxSizing: "border-box",
        background: "rgba(250, 250, 250, 0.9)",
    },

    actions: {
        display: "flex",
        gap: 10,
    },

    primaryBtn: {
        flex: 1,
        background: "var(--mint-500)",
        color: "#fff",
        padding: "12px",
        borderRadius: 12,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },

    secondaryBtn: {
        background: "rgba(15, 23, 42, 0.08)",
        padding: "12px",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
};
