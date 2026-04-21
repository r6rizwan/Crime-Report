import React, { useState } from "react";
import api, { API_BASE_URL } from "../../utils/api";

const TIMELINE_STEPS = [
    { key: "createdAt", label: "Filed" },
    { key: "assignedAt", label: "Assigned" },
    { key: "openedAt", label: "Opened" },
    { key: "resolvedAt", label: "Resolved" },
    { key: "closedAt", label: "Closed" },
];

const COLORS = {
    Filed: "#FFA726",
    Assigned: "#5C6BC0",
    Opened: "#0288D1",
    Resolved: "#2E7D32",
    Closed: "#616161",
};

export default function ComplaintTracking() {
    const [queryId, setQueryId] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [result, setResult] = useState(null);

    const handleSearch = async () => {
        if (!queryId.trim()) {
            setError("Please enter a complaint ID");
            return;
        }

        setError("");
        setLoading(true);
        setResult(null);

        const email = localStorage.getItem("email");

        try {
            const res = await api.get(
                `/api/complaint/complaint-tracking/${queryId}/${email}`
            );
            setResult(res.data);
        } catch (err) {
            setError(err.response?.data?.error || "Unable to fetch complaint");
        } finally {
            setLoading(false);
        }
    };

    const isStepCompleted = (stepKey) =>
        result && Boolean(result[stepKey]);

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.headerTop}>
                    <div>
                        <p style={styles.eyebrow}>Tracking</p>
                        <h2 style={styles.heading}>Track Complaint</h2>
                        <p style={styles.subtitle}>
                            Enter your complaint ID to see live progress and updates.
                        </p>
                    </div>
                </div>

                <div style={styles.searchCard}>
                    <input
                        value={queryId}
                        placeholder="Enter Complaint ID"
                        onChange={(e) => setQueryId(e.target.value)}
                        style={styles.input}
                    />
                    <button
                        style={styles.btn}
                        disabled={loading}
                        onClick={handleSearch}
                    >
                        {loading ? "Searching…" : "Track"}
                    </button>
                </div>

                {error && <p style={styles.error}>{error}</p>}

                {!result && !loading && !error && (
                    <p style={styles.placeholder}>
                        Enter your complaint ID to view its progress.
                    </p>
                )}

                {result && (
                    <div style={styles.card}>
                        <div style={styles.headerRow}>
                            <div>
                                <h3 style={styles.type}>{result.complaintType}</h3>
                                <p style={styles.id}>ID: {result.complaintId}</p>
                            </div>
                            <span
                                style={{
                                    ...styles.status,
                                    background:
                                        COLORS[result.status === "Open" ? "Opened" : result.status],
                                }}
                            >
                                {result.status}
                            </span>
                        </div>

                        <div style={styles.infoBox}>
                            <p>
                                <strong>Filed On:</strong>{" "}
                                {new Date(result.createdAt).toLocaleString()}
                            </p>
                            <p>
                                <strong>Assigned Investigator:</strong>{" "}
                                {result.assignedTo || "Not Assigned"}
                            </p>
                            <p>
                                <strong>Solution:</strong>{" "}
                                {result.solution || "Not available yet"}
                            </p>
                        </div>

                        {result.investigationUpdate?.status && (
                            <div style={styles.progressCard}>
                                <div style={styles.progressHeader}>
                                    <div>
                                        <p style={styles.progressEyebrow}>Investigation Update</p>
                                        <span style={styles.progressPill}>
                                            {result.investigationUpdate.status}
                                        </span>
                                    </div>
                                    {result.investigationUpdate.updatedAt && (
                                        <span style={styles.progressMeta}>
                                            {new Date(result.investigationUpdate.updatedAt).toLocaleString()}
                                        </span>
                                    )}
                                </div>
                                <p style={styles.progressText}>
                                    {result.investigationUpdate.note || "No additional public update shared yet."}
                                </p>
                            </div>
                        )}

                        <div style={styles.timelineSection}>
                            <p style={styles.timelineHeading}>Complaint Progress</p>

                            <div style={styles.timeline}>
                                {TIMELINE_STEPS.map((step, index) => {
                                    const completed = isStepCompleted(step.key);
                                    const labelColor = completed
                                        ? COLORS[step.label]
                                        : "#BDBDBD";

                                    return (
                                        <div key={step.key} style={styles.timelineStep}>
                                            <div
                                                style={{
                                                    ...styles.dot,
                                                    background: labelColor,
                                                    boxShadow: completed
                                                        ? `0 0 0 6px ${labelColor}33`
                                                        : "none",
                                                }}
                                            />

                                            <span
                                                style={{
                                                    ...styles.timelineLabel,
                                                    color: labelColor,
                                                    fontWeight: completed ? 700 : 500,
                                                }}
                                            >
                                                {step.label}
                                            </span>

                                            {completed && (
                                                <div style={styles.time}>
                                                    {new Date(result[step.key]).toLocaleString()}
                                                </div>
                                            )}

                                            {index < TIMELINE_STEPS.length - 1 && (
                                                <div
                                                    style={{
                                                        ...styles.line,
                                                        background: labelColor,
                                                    }}
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div style={{ marginTop: 30 }}>
                            <p style={styles.label}>Description</p>
                            <div style={styles.desc}>{result.description}</div>
                        </div>

                        {result.file && (
                            <div style={{ marginTop: 20 }}>
                                <a
                                    href={`${API_BASE_URL}/uploads/${String(result.file).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={styles.link}
                                >
                                    📎 View Attachment
                                </a>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ----------------------------------------------------
   STYLES
---------------------------------------------------- */

const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 20px",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
    },
    container: {
        width: "100%",
        maxWidth: "900px",
    },
    headerTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 18,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 8,
    },
    heading: {
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
    },
    subtitle: {
        marginTop: 8,
        color: "var(--ink-600)",
    },
    searchCard: {
        background: "#fff",
        padding: 18,
        borderRadius: 16,
        boxShadow: "var(--card-shadow)",
        display: "flex",
        gap: 12,
        alignItems: "center",
    },
    searchRow: {
        display: "flex",
        gap: 12,
    },
    input: {
        flex: 1,
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        fontSize: 15,
        background: "rgba(250, 250, 250, 0.9)",
    },
    btn: {
        padding: "12px 20px",
        borderRadius: 12,
        border: "none",
        background: "var(--mint-500)",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },
    error: {
        color: "#D32F2F",
        marginTop: 10,
        fontWeight: 600,
    },
    placeholder: {
        color: "var(--ink-600)",
        marginTop: 15,
    },
    card: {
        background: "#fff",
        padding: 25,
        marginTop: 20,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
    },
    type: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
    },
    id: {
        marginTop: 4,
        color: "var(--ink-600)",
    },
    status: {
        padding: "8px 14px",
        borderRadius: 999,
        color: "white",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: 12,
    },
    infoBox: {
        marginTop: 20,
        lineHeight: 1.7,
        background: "rgba(15,23,42,0.04)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
    },
    progressCard: {
        marginTop: 18,
        padding: 18,
        borderRadius: 16,
        background: "linear-gradient(180deg, #f8fcfb 0%, #f3f7ff 100%)",
        border: "1px solid rgba(26,167,155,0.18)",
    },
    progressHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        gap: 12,
        flexWrap: "wrap",
    },
    progressEyebrow: {
        margin: "0 0 8px",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
    },
    progressPill: {
        display: "inline-flex",
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(26,167,155,0.12)",
        color: "var(--mint-700)",
        fontWeight: 700,
    },
    progressMeta: {
        color: "var(--ink-600)",
        fontSize: 13,
    },
    progressText: {
        margin: "14px 0 0",
        color: "var(--ink-700)",
        lineHeight: 1.6,
    },
    timelineSection: {
        marginTop: 30,
    },
    timelineHeading: {
        fontWeight: 700,
        marginBottom: 14,
    },
    timeline: {
        display: "flex",
        alignItems: "flex-start",
    },
    timelineStep: {
        flex: 1,
        textAlign: "center",
        position: "relative",
    },
    dot: {
        width: 18,
        height: 18,
        borderRadius: "50%",
        margin: "0 auto",
    },
    timelineLabel: {
        marginTop: 6,
        fontSize: 13,
        display: "block",
    },
    time: {
        marginTop: 4,
        fontSize: 11,
        color: "#555",
    },
    line: {
        height: 3,
        width: "100%",
        position: "absolute",
        left: "50%",
        top: 8,
        zIndex: -1,
        opacity: 0.8,
    },
    label: {
        fontWeight: 600,
        marginBottom: 8,
    },
    desc: {
        background: "rgba(15,23,42,0.04)",
        padding: 12,
        borderRadius: 10,
        border: "1px solid rgba(15,23,42,0.08)",
    },
    link: {
        color: "var(--mint-600)",
        fontWeight: 600,
        textDecoration: "none",
    },
};
