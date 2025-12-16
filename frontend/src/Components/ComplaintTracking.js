import React, { useState } from "react";
import axios from "axios";

/* ----------------------------------------------------
   Timeline definition (ORDER MATTERS)
---------------------------------------------------- */
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
            const res = await axios.get(
                `http://localhost:7000/api/complaint/complaint-tracking/${queryId}/${email}`
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
                <h2 style={styles.heading}>Track Complaint</h2>

                {/* Search */}
                <div style={styles.searchRow}>
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

                {/* RESULT */}
                {result && (
                    <div style={styles.card}>

                        {/* HEADER */}
                        <div style={styles.header}>
                            <div>
                                <h3 style={styles.type}>
                                    {result.complaintType}
                                </h3>
                                <p style={styles.id}>
                                    ID: {result.complaintId}
                                </p>
                            </div>

                            <span
                                style={{
                                    ...styles.status,
                                    background:
                                        COLORS[
                                        result.status === "Open"
                                            ? "Opened"
                                            : result.status
                                        ],
                                }}
                            >
                                {result.status}
                            </span>
                        </div>

                        {/* BASIC INFO */}
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

                        {/* TIMELINE */}
                        <div style={styles.timelineSection}>
                            <p style={styles.timelineHeading}>
                                Complaint Progress
                            </p>

                            <div style={styles.timeline}>
                                {TIMELINE_STEPS.map((step, index) => {
                                    const completed = isStepCompleted(step.key);
                                    const labelColor = completed
                                        ? COLORS[step.label]
                                        : "#BDBDBD";

                                    return (
                                        <div
                                            key={step.key}
                                            style={styles.timelineStep}
                                        >
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
                                                    fontWeight: completed
                                                        ? 700
                                                        : 500,
                                                }}
                                            >
                                                {step.label}
                                            </span>

                                            {completed && (
                                                <div style={styles.time}>
                                                    {new Date(
                                                        result[step.key]
                                                    ).toLocaleString()}
                                                </div>
                                            )}

                                            {index <
                                                TIMELINE_STEPS.length - 1 && (
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

                        {/* DESCRIPTION */}
                        <div style={{ marginTop: 30 }}>
                            <p style={styles.label}>Description</p>
                            <div style={styles.desc}>
                                {result.description}
                            </div>
                        </div>

                        {/* ATTACHMENT */}
                        {result.file && (
                            <div style={{ marginTop: 20 }}>
                                <a
                                    href={`http://localhost:7000/uploads/${result.file}`}
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
        background: "#F4F6FF",
        display: "flex",
        justifyContent: "center",
    },
    container: {
        width: "100%",
        maxWidth: "900px",
    },
    heading: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 20,
    },
    searchRow: {
        display: "flex",
        gap: 12,
    },
    input: {
        flex: 1,
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CDD2E6",
        fontSize: 15,
    },
    btn: {
        padding: "12px 20px",
        borderRadius: 10,
        border: "none",
        background: "#304FFE",
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
        color: "#777",
        marginTop: 15,
    },
    card: {
        background: "#fff",
        padding: 25,
        marginTop: 20,
        borderRadius: 18,
        boxShadow: "0 10px 26px rgba(0,0,0,0.1)",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    type: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
    },
    id: {
        marginTop: 4,
        color: "#666",
    },
    status: {
        padding: "8px 14px",
        borderRadius: 10,
        color: "white",
        fontWeight: 600,
    },
    infoBox: {
        marginTop: 20,
        lineHeight: 1.7,
        background: "#F8F9FF",
        padding: 14,
        borderRadius: 12,
        border: "1px solid #E0E3F1",
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
        background: "#F2F4FF",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #E0E7FF",
    },
    link: {
        color: "#304FFE",
        fontWeight: 600,
        textDecoration: "none",
    },
};
