import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

export default function ComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadComplaint = async () => {
            try {
                const res = await api.get(
                    `/api/complaint/${id}`
                );
                setComplaint(res.data);
            } catch (error) {
                console.error("Error loading complaint:", error);
            } finally {
                setLoading(false);
            }
        };

        loadComplaint();
    }, [id]);

    if (loading) {
        return <p style={styles.loading}>Loading complaint details…</p>;
    }

    if (!complaint) {
        return <p style={styles.error}>Complaint not found.</p>;
    }

    const statusColor = {
        Pending: "#ff9800",
        Assigned: "#1565c0",
        Resolved: "#2e7d32",
        Closed: "#c62828",
        Open: "#0277bd",
    };

    // Build a safe public URL for the saved filename (stored as filename by server)
    const fileUrl = complaint && complaint.file
        ? `${API_BASE_URL}/uploads/${String(complaint.file).replace(/\\/g, "/").replace(/^\/+/, "")}`
        : null;

    // Encode URL to handle spaces and other unsafe characters
    const fileUrlEncoded = fileUrl ? encodeURI(fileUrl) : null;

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.header}>
                    <div>
                        <button
                            type="button"
                            onClick={() => navigate("/my-complaints")}
                            style={styles.backBtn}
                        >
                            ← Back to My Cases
                        </button>
                        <p style={styles.eyebrow}>Complaint Details</p>
                        <h2 style={styles.title}>{complaint.complaintType}</h2>
                        <p style={styles.subtitle}>ID: {complaint.complaintId}</p>
                    </div>
                    <span
                        style={{
                            ...styles.statusBadge,
                            background: statusColor[complaint.status] || "#64748b",
                        }}
                    >
                        {complaint.status}
                    </span>
                </div>

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Report Summary</h3>
                        <div style={styles.row}>
                            <span style={styles.label}>Filed On</span>
                            <span style={styles.value}>
                                {new Date(complaint.createdAt).toLocaleString()}
                            </span>
                        </div>
                        <div style={styles.row}>
                            <span style={styles.label}>Assigned Officer</span>
                            <span style={styles.value}>
                                {complaint.assignedTo || "Not Assigned"}
                            </span>
                        </div>
                        <div style={styles.row}>
                            <span style={styles.label}>Attachment</span>
                            {complaint.file ? (
                                <a
                                    href={fileUrlEncoded}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={styles.fileLink}
                                >
                                    View File
                                </a>
                            ) : (
                                <span style={styles.value}>No file uploaded</span>
                            )}
                        </div>
                    </div>

                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Description</h3>
                        <div style={styles.description}>{complaint.description}</div>
                    </div>
                </div>

                <div style={styles.card}>
                    <h3 style={styles.sectionTitle}>Solution / Remarks</h3>
                    <div style={styles.solution}>
                        {complaint.solution || "No solution provided yet."}
                    </div>
                </div>

                {complaint.investigationUpdate?.status && (
                    <div style={styles.card}>
                        <h3 style={styles.sectionTitle}>Investigation Progress</h3>
                        <div style={styles.progressHeader}>
                            <span style={styles.progressPill}>
                                {complaint.investigationUpdate.status}
                            </span>
                            {complaint.investigationUpdate.updatedAt && (
                                <span style={styles.progressMeta}>
                                    Updated {new Date(complaint.investigationUpdate.updatedAt).toLocaleString()}
                                </span>
                            )}
                        </div>
                        <div style={styles.progressNote}>
                            {complaint.investigationUpdate.note || "No additional update shared yet."}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

/* ====================== STYLES ====================== */

const styles = {
    page: {
        minHeight: "100vh",
        padding: "32px",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
    },
    container: {
        width: "100%",
        maxWidth: 1000,
        display: "flex",
        flexDirection: "column",
        gap: 18,
    },

    loading: {
        textAlign: "center",
        marginTop: "50px",
        color: "#555",
        fontSize: "18px",
    },

    error: {
        textAlign: "center",
        marginTop: "50px",
        color: "#c62828",
        fontSize: "18px",
        fontWeight: 600,
    },

    card: {
        width: "100%",
        background: "#fff",
        padding: 24,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },

    title: {
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
        color: "var(--ink-900)",
    },
    subtitle: {
        marginTop: 6,
        color: "var(--ink-600)",
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 10,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 16,
        flexWrap: "wrap",
        padding: "20px 24px",
        borderRadius: 18,
        background: "#fff",
        boxShadow: "var(--card-shadow)",
    },
    backBtn: {
        background: "transparent",
        border: "none",
        color: "var(--mint-600)",
        fontWeight: 700,
        cursor: "pointer",
        marginBottom: 10,
        padding: 0,
        fontSize: 14,
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18,
    },
    sectionTitle: {
        margin: 0,
        fontSize: 16,
        fontWeight: 700,
    },

    row: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },

    label: {
        fontWeight: 600,
        color: "var(--ink-600)",
    },

    value: {
        fontWeight: 600,
        color: "var(--ink-900)",
    },

    description: {
        marginTop: 12,
        lineHeight: 1.6,
        color: "var(--ink-700)",
        background: "rgba(15,23,42,0.03)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
    },

    solution: {
        marginTop: 12,
        background: "rgba(26, 167, 155, 0.08)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(26, 167, 155, 0.2)",
        color: "var(--ink-900)",
    },
    progressHeader: {
        marginTop: 12,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 12,
        flexWrap: "wrap",
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
    progressNote: {
        marginTop: 14,
        background: "rgba(15,23,42,0.04)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
        lineHeight: 1.6,
        color: "var(--ink-700)",
    },

    fileLink: {
        color: "var(--mint-600)",
        fontWeight: 600,
        textDecoration: "none",
    },

    statusBadge: {
        padding: "8px 16px",
        borderRadius: 999,
        fontWeight: 700,
        color: "white",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: 12,
    },
};
