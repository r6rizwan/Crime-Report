import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function Register() {
    const navigate = useNavigate();
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
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "mobileNo") {
            const digits = value.replace(/\D/g, "").slice(0, 10);
            setForm({
                ...form,
                mobileNo: digits,
            });
            return;
        }
        if (name === "pincode") {
            const digits = value.replace(/\D/g, "").slice(0, 6);
            setForm({
                ...form,
                pincode: digits,
            });
            return;
        }
        setForm({
            ...form,
            [name]: value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        setSuccess("");

        if (!/^[0-9]{10}$/.test(form.mobileNo)) {
            setError("Mobile number must be exactly 10 digits.");
            return;
        }

        if (!/^[0-9]{6}$/.test(form.pincode)) {
            setError("Pincode must be exactly 6 digits.");
            return;
        }

        try {
            setSubmitting(true);
            await api.post("/api/register", form);

            setSuccess("Registration successful! OTP sent to email.");

            setTimeout(() => {
                window.location.href = "/otp";
            }, 900);

        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                    <span style={styles.navTag}>Citizen Registration</span>
                </div>
                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>
                    <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
                </div>
            </nav>

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
                                inputMode="numeric"
                                maxLength={6}
                                required
                            />
                            <input
                                style={styles.input}
                                placeholder="Mobile Number"
                                name="mobileNo"
                                value={form.mobileNo}
                                onChange={handleChange}
                                inputMode="numeric"
                                maxLength={10}
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

                        <button type="submit" style={styles.button} disabled={submitting}>
                            {submitting ? "Sending..." : "Register & Send OTP"}
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
        padding: "0 20px 40px",
        position: "relative",
        overflow: "hidden",
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
        margin: "0 -20px",
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
        margin: "40px auto 0",
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
