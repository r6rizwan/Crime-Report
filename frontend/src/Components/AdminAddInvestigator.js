import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminAddInvestigator() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.email || !form.phone) {
            return setError("Full name, email, and mobile number are required.");
        }

        setSaving(true);
        setError("");

        try {
            await axios.post("http://localhost:7000/api/investigators", {
                name: form.name,
                email: form.email,
                phone: form.phone,
                address: form.address,
            });

            alert("Investigator added successfully");
            navigate("/admin/investigators");
        } catch (err) {
            setError(
                err.response?.data?.error || "Failed to add investigator"
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.sidePanel}>
                    <p style={styles.eyebrow}>Admin Setup</p>
                    <h2 style={styles.sideTitle}>Create investigator profiles.</h2>
                    <p style={styles.sideText}>
                        New investigators receive OTP-based access and are assigned
                        to incoming cases once activated.
                    </p>
                    <div style={styles.infoBox}>
                        <p><strong>Status:</strong> Active (default)</p>
                        <p>
                            <strong>Investigator ID:</strong> Auto-generated
                            (e.g. <code>INV-01</code>)
                        </p>
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Add Investigator</h2>
                    <p style={styles.subtitle}>
                        Create a basic investigator account. Authentication will be
                        handled using OTP during login.
                    </p>

                    {error && <div style={styles.error}>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div style={styles.field}>
                            <label>Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Investigator full name"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Official Email ID</label>
                            <input
                                type="email"
                                name="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="official email address"
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                placeholder="10-digit mobile number"
                                style={styles.input}
                            />
                            <small style={styles.helper}>
                                This number will be used for OTP-based login.
                            </small>
                        </div>

                        <div style={styles.field}>
                            <label>Posting / Location (optional)</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="City / station / jurisdiction"
                                style={styles.textarea}
                            />
                        </div>

                        <div style={styles.actions}>
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                style={styles.secondaryBtn}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                disabled={saving}
                                style={styles.primaryBtn}
                            >
                                {saving ? "Saving…" : "Add Investigator"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        paddingTop: 50,
    },
    container: {
        width: "100%",
        maxWidth: 1100,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
        padding: "0 20px",
    },
    sidePanel: {
        background: "#0f172a",
        color: "#fff",
        padding: 30,
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
        alignSelf: "start",
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

    card: {
        background: "#fff",
        width: "100%",
        padding: 30,
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
    },

    title: {
        fontSize: 26,
        fontWeight: 700,
        marginBottom: 6,
    },

    subtitle: {
        color: "var(--ink-600)",
        marginBottom: 16,
    },

    infoBox: {
        background: "rgba(255,255,255,0.08)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: 12,
        padding: 14,
        marginTop: 20,
        fontSize: 14,
    },

    error: {
        background: "#FDECEA",
        color: "#C62828",
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        fontWeight: 600,
    },

    field: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 16,
    },

    input: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginTop: 6,
    },

    textarea: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginTop: 6,
        resize: "vertical",
    },

    helper: {
        marginTop: 6,
        fontSize: 13,
        color: "#666",
    },

    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 12,
        marginTop: 24,
    },

    primaryBtn: {
        background: "var(--ink-900)",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 12,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },

    secondaryBtn: {
        background: "rgba(15,23,42,0.08)",
        padding: "12px 22px",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
};
