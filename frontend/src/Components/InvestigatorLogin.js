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
            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span
                        style={styles.logo}
                        onClick={() => navigate("/")}
                    >
                        Crime Reporting Portal
                    </span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>
                        Home
                    </span>
                    <span style={styles.navLink}>About</span>
                    <span style={styles.navLink}>Contact</span>

                    <div
                        style={styles.dropdown}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span
                            style={styles.navLink}
                            onClick={() => setShowLoginMenu(prev => !prev)}
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

            {/* LOGIN CARD */}
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
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background: "#F4F6FF",
        minHeight: "100vh",
    },

    /* NAVBAR */
    navbar: {
        height: 64,
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    navLeft: { display: "flex", alignItems: "center" },
    logo: {
        fontSize: 20,
        fontWeight: 800,
        color: "#304FFE",
        cursor: "pointer",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 22,
    },
    navLink: {
        fontWeight: 600,
        color: "#333",
        cursor: "pointer",
    },
    dropdown: { position: "relative" },
    dropdownMenu: {
        position: "absolute",
        top: 34,
        right: 0,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        minWidth: 180,
        overflow: "hidden",
        zIndex: 2000,
    },
    dropdownItem: {
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 600,
        borderBottom: "1px solid #f1f1f1",
    },

    /* CARD */
    card: {
        background: "#fff",
        width: 420,
        margin: "80px auto",
        padding: 30,
        borderRadius: 18,
        boxShadow: "0 10px 28px rgba(0,0,0,0.12)",
    },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
    subtitle: { color: "#666", marginBottom: 20 },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
    },

    error: {
        background: "#FDECEA",
        color: "#C62828",
        padding: 10,
        borderRadius: 8,
        marginBottom: 14,
        fontWeight: 600,
    },

    input: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginBottom: 16,
        boxSizing: "border-box", // ✅ prevents touching edges
    },

    actions: {
        display: "flex",
        gap: 10,
    },

    primaryBtn: {
        flex: 1,
        background: "#304FFE",
        color: "#fff",
        padding: "12px",
        borderRadius: 10,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },

    secondaryBtn: {
        background: "#E0E7FF",
        padding: "12px",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
};
