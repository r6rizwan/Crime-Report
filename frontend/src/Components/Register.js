import React, { useState } from "react";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        gender: "",
        dob: "",
        city: "",
        address: "",
        pincode: "",
        email: "",
        mobileNo: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:7000/api/register", form);

            setSuccess("Registration successful! Verify OTP.");
            alert(`OTP for testing: ${res.data.otp}`);

            setTimeout(() => {
                window.location.href = "/otp";
            }, 900);

        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            <div style={styles.container}>
                <div style={styles.brandPanel}>
                    <p style={styles.eyebrow}>Citizen Registration</p>
                    <h2 style={styles.brandTitle}>Create a secure reporting profile.</h2>
                    <p style={styles.brandText}>
                        Your information is protected end-to-end and used only to
                        verify and follow up on your report.
                    </p>
                    <div style={styles.brandList}>
                        <div style={styles.brandItem}>Verified case updates</div>
                        <div style={styles.brandItem}>Encrypted evidence uploads</div>
                        <div style={styles.brandItem}>Faster investigator assignment</div>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Create Your Account</h2>
                    <p style={styles.subtitle}>Join the Crime Report Portal</p>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    <form onSubmit={handleRegister} style={styles.form}>
                        <div style={styles.row}>
                            <input
                                style={styles.input}
                                placeholder="Full Name"
                                name="fullName"
                                value={form.fullName}
                                onChange={handleChange}
                                required
                            />
                            <select
                                style={styles.input}
                                name="gender"
                                value={form.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Gender</option>
                                <option>Male</option>
                                <option>Female</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div style={styles.row}>
                            <input
                                type="date"
                                style={styles.input}
                                name="dob"
                                value={form.dob}
                                onChange={handleChange}
                                required
                            />
                            <input
                                style={styles.input}
                                placeholder="City"
                                name="city"
                                value={form.city}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <textarea
                            style={{ ...styles.input, height: 90 }}
                            placeholder="Full Address"
                            name="address"
                            value={form.address}
                            onChange={handleChange}
                            required
                        />

                        <div style={styles.row}>
                            <input
                                style={styles.input}
                                placeholder="Pincode"
                                name="pincode"
                                value={form.pincode}
                                onChange={handleChange}
                                required
                            />
                            <input
                                style={styles.input}
                                placeholder="Mobile Number"
                                name="mobileNo"
                                value={form.mobileNo}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <input
                            style={styles.input}
                            placeholder="Email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                        />

                        <button type="submit" style={styles.button}>
                            Register & Send OTP
                        </button>
                    </form>

                    <p style={styles.footer}>
                        Already have an account?{" "}
                        <a href="/login" style={styles.link}>Login</a>
                    </p>
                </div>
            </div>
        </div>
    );
}

/* Improved Styling */
const styles = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
    },

    glowA: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
        top: -120,
        left: -100,
    },
    glowB: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
        bottom: -120,
        right: -80,
    },

    container: {
        width: "100%",
        maxWidth: 1100,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        alignItems: "stretch",
        zIndex: 1,
    },

    brandPanel: {
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
        marginBottom: 14,
    },
    brandTitle: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: 32,
        margin: 0,
    },
    brandText: {
        marginTop: 16,
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.6,
    },
    brandList: {
        marginTop: 24,
        display: "grid",
        gap: 10,
        fontSize: 14,
    },
    brandItem: {
        padding: "10px 14px",
        background: "rgba(255,255,255,0.08)",
        borderRadius: 12,
    },

    card: {
        width: "100%",
        background: "#fff",
        padding: "32px",
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },

    title: {
        fontSize: 26,
        fontWeight: "700",
        marginBottom: 6,
    },

    subtitle: {
        fontSize: 14,
        color: "var(--ink-600)",
        marginBottom: 24,
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    row: {
        display: "flex",
        gap: "16px",
        flexWrap: "wrap",
    },

    input: {
        flex: 1,
        minWidth: 200,
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        background: "rgba(250, 250, 250, 0.9)",
        fontSize: 15,
        outline: "none",
    },

    button: {
        marginTop: 6,
        width: "100%",
        padding: "14px",
        background: "var(--mint-500)",
        borderRadius: 12,
        border: "none",
        color: "#fff",
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
    },

    footer: {
        marginTop: 16,
        fontSize: 14,
        color: "var(--ink-600)",
    },

    link: {
        color: "var(--mint-600)",
        textDecoration: "none",
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
