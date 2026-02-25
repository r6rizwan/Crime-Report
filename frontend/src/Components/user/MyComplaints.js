import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function MyComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const fetchComplaints = async () => {
            try {
                const res = await api.get(
                    `/api/complaint/user/${email}`
                );
                setComplaints(res.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching complaints:", error);
                setLoading(false);
            }
        };

        fetchComplaints();
    }, [email]);

    const statusColor = {
        Pending: "#F59E0B",
        Assigned: "#1E88E5",
        Open: "#7E57C2",
        Resolved: "#2E7D32",
        Closed: "#D32F2F",
    };

    if (loading) {
        return (
            <p style={{ textAlign: "center", marginTop: "60px", fontSize: "18px" }}>
                Loading your complaints…
            </p>
        );
    }

    return (
        <div style={styles.page}>
            <div style={styles.wrapper}>
                <div style={styles.header}>
                    <div>
                        <p style={styles.eyebrow}>Citizen Records</p>
                        <h2 style={styles.title}>My Complaints</h2>
                        <p style={styles.subtitle}>
                            Review your reports, assignments, and latest status updates.
                        </p>
                    </div>
                    <a href="/file-complaint" style={styles.primaryBtn}>
                        File New Complaint
                    </a>
                </div>

                {complaints.length === 0 ? (
                    <p style={styles.noData}>No complaints filed yet.</p>
                ) : (
                    <div style={styles.grid}>
                        {complaints.map((c) => (
                            <div key={c._id} style={styles.card}>
                                <div style={styles.headerRow}>
                                    <span style={styles.complaintId}>{c.complaintId}</span>
                                    <span
                                        style={{
                                            ...styles.statusBadge,
                                            background: statusColor[c.status] || "#64748b",
                                        }}
                                    >
                                        {c.status}
                                    </span>
                                </div>

                                <p style={styles.type}>{c.complaintType}</p>

                                <div style={styles.metaRow}>
                                    <div>
                                        <p style={styles.metaLabel}>Filed</p>
                                        <p style={styles.metaValue}>
                                            {new Date(c.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <p style={styles.metaLabel}>Assigned To</p>
                                        <p style={styles.metaValue}>
                                            {c.assignedTo || "Not Assigned"}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    style={styles.viewBtn}
                                    onClick={() =>
                                        (window.location.href = `/complaint/${c._id}`)
                                    }
                                >
                                    View Details
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ------------------- STYLES -------------------- */
const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px 20px",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        display: "flex",
        justifyContent: "center",
    },

    wrapper: {
        width: "100%",
        maxWidth: "1100px",
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 16,
        marginBottom: 24,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 10,
    },
    title: {
        fontSize: 30,
        fontWeight: 700,
        margin: 0,
        color: "var(--ink-900)",
    },
    subtitle: {
        marginTop: 8,
        color: "var(--ink-600)",
        maxWidth: 520,
    },
    primaryBtn: {
        background: "var(--ink-900)",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 600,
    },

    noData: {
        textAlign: "center",
        fontSize: 16,
        color: "var(--ink-600)",
        marginTop: 20,
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
    },

    card: {
        background: "#ffffff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "var(--card-shadow)",
        border: "1px solid rgba(15,23,42,0.06)",
        display: "flex",
        flexDirection: "column",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
    },

    complaintId: {
        fontWeight: 700,
        fontSize: 14,
        color: "var(--ink-600)",
    },

    statusBadge: {
        padding: "6px 12px",
        borderRadius: 999,
        fontSize: 12,
        fontWeight: 600,
        color: "white",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },

    type: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 14,
    },
    metaRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
        gap: 12,
        marginBottom: 16,
    },
    metaLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.1em",
        color: "var(--ink-600)",
        margin: 0,
    },
    metaValue: {
        margin: "6px 0 0",
        color: "var(--ink-900)",
        fontWeight: 600,
        fontSize: 13,
    },

    viewBtn: {
        marginTop: "15px",
        padding: "10px",
        background: "var(--mint-500)",
        color: "white",
        border: "none",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 14,
    },
};
