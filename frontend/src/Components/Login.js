import React, { useState } from "react";
import axios from "axios";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:7000/api/login", {
                email,
                password,
            });

            setSuccess("Login Successful! Redirecting...", res);

            setTimeout(() => {
                window.location.href = "/dashboard";
            }, 900);

        } catch (err) {
            setError(err.response?.data?.error || "Invalid Credentials");
        }
    };

    return (
        <div style={styles.page}>
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
                    <a href="/register" style={styles.link}>Register</a>
                </p>
            </div>
        </div>
    );
}

/* Premium UI Styles */
const styles = {
    page: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #e0eaff, #f6f9ff)",
        padding: 20,
    },

    card: {
        width: "400px",
        background: "#fff",
        padding: "35px 32px",
        borderRadius: "18px",
        boxShadow: "0 12px 30px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: "26px",
        fontWeight: "700",
        textAlign: "center",
        marginBottom: "6px",
    },

    subtitle: {
        textAlign: "center",
        fontSize: "14px",
        color: "#555",
        marginBottom: "24px",
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
    },

    button: {
        marginTop: "10px",
        padding: "14px",
        background: "#4B6FFF",
        borderRadius: "10px",
        border: "none",
        color: "white",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },

    footer: {
        marginTop: "16px",
        textAlign: "center",
        fontSize: "14px",
        color: "#444",
    },

    link: {
        color: "#4B6FFF",
        fontWeight: "600",
        textDecoration: "none",
    },

    error: {
        color: "#e63946",
        textAlign: "center",
        fontWeight: "600",
    },

    success: {
        color: "#2ea44f",
        textAlign: "center",
        fontWeight: "600",
    },
};
