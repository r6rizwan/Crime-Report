import React, { useState } from "react";
import axios from "axios";

export default function FileComplaint() {
    const [form, setForm] = useState({
        complaintType: "",
        description: "",
        file: null,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({
            ...prev,
            file: e.target.files[0],
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setMessage("");

        const email = localStorage.getItem("email"); // email saved at login

        if (!email) {
            setError("User email not found. Login again.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append("complaintType", form.complaintType);
            formData.append("description", form.description);
            formData.append("email", email);

            if (form.file) {
                formData.append("file", form.file);
            }

            const res = await axios.post("http://localhost:7000/api/complaint", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Complaint submitted successfully!", res);
            setForm({ complaintType: "", description: "", file: null });

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            <div style={styles.container}>
                <div style={styles.sidePanel}>
                    <p style={styles.eyebrow}>Report Intake</p>
                    <h2 style={styles.sideTitle}>File a complaint in minutes.</h2>
                    <p style={styles.sideText}>
                        Provide a clear description and any supporting evidence. The
                        more detail you share, the faster we can assign the right team.
                    </p>
                    <div style={styles.tipCard}>
                        Include locations, dates, and names if available. Uploads are
                        confidential and encrypted.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>File a Complaint</h2>
                    <p style={styles.subtitle}>Provide details about your complaint</p>

                    {message && <p style={styles.success}>{message}</p>}
                    {error && <p style={styles.error}>{error}</p>}

                    <form onSubmit={handleSubmit} style={styles.form}>
                        <div style={styles.field}>
                            <label style={styles.label}>Complaint Type</label>
                            <select
                                name="complaintType"
                                value={form.complaintType}
                                onChange={handleChange}
                                style={styles.input}
                                required
                            >
                                <option value="">Select Complaint Type</option>
                                <option value="Cyber Crime">Cyber Crime</option>
                                <option value="Harassment">Harassment</option>
                                <option value="Fraud">Fraud</option>
                                <option value="Theft">Theft</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Description</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Describe the issue"
                                style={{ ...styles.input, minHeight: 140 }}
                                required
                            />
                        </div>

                        <div style={styles.field}>
                            <label style={styles.label}>Upload Evidence (optional)</label>
                            <input
                                type="file"
                                style={styles.input}
                                onChange={handleFileChange}
                                accept="image/*,.pdf"
                            />
                            <p style={styles.helper}>
                                JPG, PNG, or PDF up to 5 files per complaint.
                            </p>
                        </div>

                        <button type="submit" style={styles.button}>
                            Submit Complaint
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
        padding: "40px 20px",
        display: "flex",
        justifyContent: "center",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
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
        right: -80,
    },
    container: {
        width: "100%",
        maxWidth: 1100,
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        zIndex: 1,
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
    tipCard: {
        marginTop: 20,
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
    },

    title: {
        fontSize: 24,
        fontWeight: 700,
    },

    subtitle: {
        fontSize: 14,
        marginBottom: 22,
        color: "var(--ink-600)",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    field: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
    },
    label: {
        fontWeight: 600,
        fontSize: 13,
        color: "var(--ink-700)",
    },
    input: {
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        fontSize: 15,
        background: "rgba(250, 250, 250, 0.9)",
    },

    button: {
        padding: "14px",
        background: "var(--mint-500)",
        color: "white",
        border: "none",
        borderRadius: 12,
        fontSize: 16,
        fontWeight: 600,
        cursor: "pointer",
    },
    helper: {
        margin: 0,
        color: "var(--ink-600)",
        fontSize: 12,
    },

    success: {
        color: "#22c55e",
        fontWeight: 600,
    },

    error: {
        color: "#ef4444",
        fontWeight: 600,
    },
};
