import React, { useState } from "react";
import api from "../../utils/api";

export default function FileComplaint() {
    const complaintTypes = [
        "Theft",
        "Assault",
        "Fraud",
        "Vandalism",
        "Harassment",
        "Cybercrime",
        "Missing Person",
        "Other",
    ];

    const [form, setForm] = useState({
        complaintType: "",
        description: "",
        file: null,
    });

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [triageLoading, setTriageLoading] = useState(false);
    const [triageError, setTriageError] = useState("");
    const [aiSuggestion, setAiSuggestion] = useState(null);
    const [aiFeedback, setAiFeedback] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (name === "description") {
            setAiSuggestion(null);
            setAiFeedback(null);
            setTriageError("");
        }
    };

    const handleFileChange = (e) => {
        setForm((prev) => ({
            ...prev,
            file: e.target.files[0],
        }));
    };

    const handleGetAITriage = async () => {
        if (triageLoading) return;

        const description = form.description.trim();
        if (description.length < 10) {
            setTriageError("Please enter at least 10 characters to get an AI suggestion.");
            return;
        }

        try {
            setTriageLoading(true);
            setTriageError("");
            setAiFeedback(null);

            const res = await api.post("/api/complaint/triage", { description });
            setAiSuggestion(res.data);
        } catch (err) {
            setAiSuggestion(null);
            setTriageError(err.response?.data?.error || "Unable to fetch AI suggestion right now.");
        } finally {
            setTriageLoading(false);
        }
    };

    const handleAcceptSuggestion = () => {
        if (!aiSuggestion) return;

        setForm((prev) => ({
            ...prev,
            complaintType: aiSuggestion.suggestedCategory,
        }));
        setAiFeedback(true);
    };

    const handleRejectSuggestion = () => {
        setAiFeedback(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (submitting) return;
        setError("");
        setMessage("");

        const email = localStorage.getItem("email"); // email saved at login

        if (!email) {
            setError("User email not found. Login again.");
            return;
        }

        try {
            setSubmitting(true);
            const formData = new FormData();
            formData.append("complaintType", form.complaintType);
            formData.append("description", form.description);
            formData.append("email", email);
            if (aiFeedback !== null) {
                formData.append("aiUserAccepted", String(aiFeedback));
            }

            if (form.file) {
                formData.append("file", form.file);
            }

            const res = await api.post("/api/complaint", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setMessage("Complaint submitted successfully!", res);
            setForm({ complaintType: "", description: "", file: null });
            setAiSuggestion(null);
            setAiFeedback(null);
            setTriageError("");

        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setSubmitting(false);
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
                                {complaintTypes.map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
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
                            <div style={styles.aiActionRow}>
                                <button
                                    type="button"
                                    style={styles.aiBtn}
                                    onClick={handleGetAITriage}
                                    disabled={triageLoading || form.description.trim().length < 10}
                                >
                                    {triageLoading ? "Analyzing..." : "Get AI Suggestion"}
                                </button>
                                <span style={styles.aiHelper}>
                                    CivilEye can suggest a likely category and urgency based on your description.
                                </span>
                            </div>
                            {triageError && <p style={styles.aiError}>{triageError}</p>}
                            {aiSuggestion && (
                                <div style={styles.aiCard}>
                                    <div style={styles.aiHeader}>
                                        <div>
                                            <p style={styles.aiEyebrow}>AI Suggestion</p>
                                            <h3 style={styles.aiTitle}>Review this guidance before submitting</h3>
                                        </div>
                                        <span style={styles.aiBadge}>AI Assisted</span>
                                    </div>

                                    <p style={styles.aiIntro}>
                                        This is a recommendation to help you choose the right category and urgency.
                                        It is not a final decision, and you can keep your own selection if it feels
                                        more accurate.
                                    </p>

                                    <div style={styles.aiGrid}>
                                        <div style={styles.aiItem}>
                                            <span style={styles.aiLabel}>Suggested Category</span>
                                            <strong style={styles.aiValue}>
                                                {aiSuggestion.suggestedCategory}
                                            </strong>
                                        </div>
                                        <div style={styles.aiItem}>
                                            <span style={styles.aiLabel}>Suggested Priority</span>
                                            <strong style={styles.aiValue}>
                                                {aiSuggestion.suggestedPriority}
                                            </strong>
                                        </div>
                                    </div>

                                    <p style={styles.aiReasoning}>{aiSuggestion.reasoning}</p>

                                    <div style={styles.aiDecisionRow}>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.aiDecisionBtn,
                                                ...(aiFeedback === true ? styles.aiDecisionBtnActive : {}),
                                            }}
                                            onClick={handleAcceptSuggestion}
                                        >
                                            Use Suggestion
                                        </button>
                                        <button
                                            type="button"
                                            style={{
                                                ...styles.aiDecisionBtn,
                                                ...(aiFeedback === false ? styles.aiDecisionBtnActiveMuted : {}),
                                            }}
                                            onClick={handleRejectSuggestion}
                                        >
                                            Keep My Selection
                                        </button>
                                    </div>

                                    {aiFeedback === true && (
                                        <p style={styles.aiStatus}>
                                            Suggested category applied. You can still change it before submitting.
                                        </p>
                                    )}
                                    {aiFeedback === false && (
                                        <p style={styles.aiStatusMuted}>
                                            Your own complaint type selection will be used instead of the suggestion.
                                        </p>
                                    )}
                                </div>
                            )}
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

                        <button type="submit" style={styles.button} disabled={submitting}>
                            {submitting ? "Submitting..." : "Submit Complaint"}
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
    aiActionRow: {
        display: "flex",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
        marginTop: 4,
    },
    aiBtn: {
        padding: "10px 14px",
        background: "#0f172a",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
    },
    aiHelper: {
        color: "var(--ink-600)",
        fontSize: 12,
    },
    aiError: {
        margin: 0,
        color: "#dc2626",
        fontSize: 13,
        fontWeight: 600,
    },
    aiCard: {
        marginTop: 10,
        padding: 18,
        borderRadius: 18,
        background: "linear-gradient(180deg, #f8fcfb 0%, #f2f7ff 100%)",
        border: "1px solid rgba(26,167,155,0.18)",
        boxShadow: "0 14px 30px rgba(15,23,42,0.06)",
    },
    aiHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
    },
    aiEyebrow: {
        margin: 0,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
    },
    aiTitle: {
        margin: "8px 0 0",
        fontSize: 20,
        fontWeight: 700,
        color: "var(--ink-900)",
    },
    aiBadge: {
        padding: "8px 10px",
        borderRadius: 999,
        background: "rgba(26,167,155,0.12)",
        color: "var(--mint-700)",
        fontSize: 12,
        fontWeight: 700,
    },
    aiIntro: {
        margin: "14px 0 0",
        color: "var(--ink-600)",
        lineHeight: 1.6,
        fontSize: 13,
    },
    aiGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 12,
        marginTop: 16,
    },
    aiItem: {
        padding: "12px 14px",
        borderRadius: 14,
        background: "rgba(255,255,255,0.82)",
        border: "1px solid rgba(15,23,42,0.08)",
    },
    aiLabel: {
        display: "block",
        fontSize: 12,
        color: "var(--ink-600)",
        marginBottom: 6,
    },
    aiValue: {
        color: "var(--ink-900)",
        fontSize: 15,
    },
    aiReasoning: {
        margin: "14px 0 0",
        color: "var(--ink-700)",
        lineHeight: 1.6,
        fontSize: 14,
    },
    aiDecisionRow: {
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        marginTop: 16,
    },
    aiDecisionBtn: {
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid rgba(15,23,42,0.12)",
        background: "#fff",
        color: "var(--ink-900)",
        fontWeight: 600,
        cursor: "pointer",
    },
    aiDecisionBtnActive: {
        background: "rgba(26,167,155,0.14)",
        border: "1px solid rgba(26,167,155,0.32)",
        color: "var(--mint-700)",
    },
    aiDecisionBtnActiveMuted: {
        background: "rgba(15,23,42,0.08)",
        border: "1px solid rgba(15,23,42,0.18)",
        color: "var(--ink-900)",
    },
    aiStatus: {
        margin: "12px 0 0",
        color: "var(--mint-700)",
        fontSize: 13,
        fontWeight: 600,
    },
    aiStatusMuted: {
        margin: "12px 0 0",
        color: "var(--ink-600)",
        fontSize: 13,
        fontWeight: 600,
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
