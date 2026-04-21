import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

const PRIORITY_ORDER = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
};

export default function InvestigatorAssignedComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const res = await api.get(
                    `/api/complaint/assigned/${email}`
                );
                setComplaints(res.data);
            } catch {
                setError("Failed to load assigned complaints.");
            } finally {
                setLoading(false);
            }
        };

        fetchAssignedComplaints();
    }, [email]);

    if (loading) {
        return <p style={styles.center}>Loading assigned complaints…</p>;
    }

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    // Group complaints
    const sortByPriorityThenDate = (items) =>
        [...items].sort((a, b) => {
            const priorityDiff =
                (PRIORITY_ORDER[b.aiSuggestion?.suggestedPriority] || 0) -
                (PRIORITY_ORDER[a.aiSuggestion?.suggestedPriority] || 0);

            if (priorityDiff !== 0) return priorityDiff;
            return new Date(b.createdAt) - new Date(a.createdAt);
        });

    const assigned = sortByPriorityThenDate(complaints.filter(c => c.status === "Assigned"));
    const open = sortByPriorityThenDate(complaints.filter(c => c.status === "Open"));
    const resolved = sortByPriorityThenDate(complaints.filter(c => c.status === "Resolved"));
    const closed = sortByPriorityThenDate(complaints.filter(c => c.status === "Closed"));

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <p style={styles.eyebrow}>Assigned Queue</p>
                    <h2 style={styles.heading}>My Assigned Complaints</h2>
                    <p style={styles.subheading}>
                        Manage and update complaints assigned to you
                    </p>
                </div>
            </div>

            <Section
                title="Newly Assigned"
                items={assigned}
                emptyText="No new assigned complaints."
                actionLabel="Open Case"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />

            <Section
                title="Active Investigations"
                items={open}
                emptyText="No open investigations."
                actionLabel="Continue"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />

            <Section
                title="Resolved"
                items={resolved}
                emptyText="No resolved complaints yet."
                actionLabel="View"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />

            <Section
                title="Closed"
                items={closed}
                emptyText="No complaints Closed yet."
                actionLabel="View"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />
        </div>
    );
}

/* ---------------- Section Component ---------------- */

const Section = ({ title, items, emptyText, actionLabel, onAction, readOnly }) => (
    <div style={styles.section}>
        <div style={styles.sectionHeader}>
            <h3 style={styles.sectionTitle}>{title}</h3>
            <span style={styles.sectionMeta}>{items.length} cases</span>
        </div>

        {items.length === 0 ? (
            <div style={styles.emptyBox}>{emptyText}</div>
        ) : (
            items.map((item) => (
                <div key={item._id} style={styles.card}>
                    <div>
                        <div style={styles.titleRow}>
                            <strong>{item.complaintType}</strong>
                            {item.aiSuggestion?.suggestedPriority && (
                                <span
                                    style={{
                                        ...styles.priorityChip,
                                        ...getPriorityStyles(item.aiSuggestion.suggestedPriority),
                                    }}
                                >
                                    {item.aiSuggestion.suggestedPriority}
                                </span>
                            )}
                        </div>
                        <p style={styles.meta}>
                            ID: {item.complaintId} • Filed on{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
                        {item.aiSuggestion?.usedAI && (
                            <span style={styles.aiTag}>AI Assisted</span>
                        )}
                    </div>

                    <div style={styles.cardRight}>
                        <span
                            style={{
                                ...styles.status,
                                background: getStatusColor(item.status),
                            }}
                        >
                            {item.status}
                        </span>

                        <button
                            style={{
                                ...styles.actionBtn,
                                background: readOnly ? "#9E9E9E" : "#304FFE",
                                cursor: readOnly ? "default" : "pointer",
                            }}
                            onClick={() => !readOnly && onAction(item._id)}
                        >
                            {actionLabel}
                        </button>
                    </div>
                </div>
            ))
        )}
    </div>
);

/* ---------------- Helpers ---------------- */

const getStatusColor = (status) => {
    switch (status) {
        case "Assigned":
            return "rgba(245, 158, 11, 0.2)";
        case "Open":
            return "rgba(58, 163, 255, 0.2)";
        case "Resolved":
            return "rgba(34, 197, 94, 0.2)";
        default:
            return "rgba(100, 116, 139, 0.2)";
    }
};

const getPriorityStyles = (priority) => {
    switch (priority) {
        case "Low":
            return {
                background: "rgba(34,197,94,0.15)",
                color: "#15803d",
            };
        case "Medium":
            return {
                background: "rgba(245,158,11,0.16)",
                color: "#b45309",
            };
        case "High":
            return {
                background: "rgba(249,115,22,0.18)",
                color: "#c2410c",
            };
        case "Critical":
            return {
                background: "rgba(239,68,68,0.16)",
                color: "#b91c1c",
            };
        default:
            return {
                background: "rgba(15,23,42,0.08)",
                color: "var(--ink-700)",
            };
    }
};

/* ---------------- Styles ---------------- */

const styles = {
    page: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "30px 20px",
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
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
        fontSize: 26,
        fontWeight: 700,
        margin: 0,
    },

    subheading: {
        color: "var(--ink-600)",
        marginTop: 8,
    },

    section: {
        marginBottom: 28,
    },

    sectionTitle: {
        fontSize: 18,
        fontWeight: 700,
        margin: 0,
    },
    sectionHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
    },
    sectionMeta: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--ink-600)",
        fontWeight: 600,
    },

    emptyBox: {
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        color: "var(--ink-600)",
        boxShadow: "var(--card-shadow)",
    },

    card: {
        background: "#fff",
        padding: 18,
        borderRadius: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        boxShadow: "var(--card-shadow)",
    },
    titleRow: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },

    meta: {
        color: "var(--ink-600)",
        fontSize: 13,
        marginTop: 4,
    },
    aiTag: {
        display: "inline-flex",
        marginTop: 10,
        padding: "5px 10px",
        borderRadius: 999,
        background: "rgba(26,167,155,0.12)",
        color: "var(--mint-700)",
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
    },
    priorityChip: {
        display: "inline-flex",
        padding: "5px 10px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
    },

    cardRight: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    status: {
        color: "var(--ink-900)",
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },

    actionBtn: {
        border: "none",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 10,
        fontWeight: 600,
    },

    center: {
        textAlign: "center",
        marginTop: 40,
        fontWeight: 600,
    },

    error: {
        color: "#D32F2F",
        textAlign: "center",
        marginTop: 40,
        fontWeight: 600,
    },
};
