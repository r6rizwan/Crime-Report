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
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>

                    {/* LOGIN DROPDOWN */}
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
                                    onClick={() =>
                                        navigate("/investigator/login")
                                    }
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
                <h2 style={styles.title}>Welcome Back</h2>
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
                    <span
                        style={styles.link}
                        onClick={() => navigate("/register")}
                    >
                        Register
                    </span>
                </p>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background: "linear-gradient(135deg, #e5eeff, #f8faff)",
        minHeight: "100vh",
        paddingBottom: 40,
    },

    navbar: {
        height: 64,
        background: "#ffffff",
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
        color: "#333",
        borderBottom: "1px solid #f1f1f1",
    },

    card: {
        margin: "80px auto 0",
        width: 400,
        background: "#fff",
        padding: "35px 32px",
        borderRadius: 18,
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
        textAlign: "center",
    },

    title: { fontSize: 26, fontWeight: 700, marginBottom: 6 },
    subtitle: { fontSize: 14, color: "#555", marginBottom: 24 },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },

    input: {
        padding: 14,
        borderRadius: 10,
        border: "1px solid #d2dae6",
        background: "#fafafa",
    },

    button: {
        padding: 14,
        background: "#4B6FFF",
        borderRadius: 10,
        border: "none",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
    },

    footer: { marginTop: 16, fontSize: 14 },
    link: { color: "#4B6FFF", fontWeight: 600, cursor: "pointer" },

    error: { color: "#e63946", fontWeight: 600 },
    success: { color: "#2ea44f", fontWeight: 600 },
};
