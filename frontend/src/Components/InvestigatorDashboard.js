import React, { useEffect, useState } from "react";
import axios from "axios";

export default function InvestigatorDashboard() {
    const [investigator, setInvestigator] = useState(null);
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState(null);

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const loadInvestigator = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/investigators/by-email/${email}`
                );
                setInvestigator(res.data);
            } catch (err) {
                console.error("Error fetching investigator:", err);
            }
        };

        const loadStats = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/investigator/${email}/stats`
                );
                setStats(res.data);
            } catch (err) {
                console.error("Error loading stats:", err);
            }
        };

        const loadComplaints = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/assigned/${email}`
                );
                setComplaints(res.data);
            } catch (err) {
                console.error("Error loading complaints:", err);
            }
        };

        loadInvestigator();
        loadStats();
        loadComplaints();
    }, [email]);

    if (!investigator || !stats) {
        return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
    }

    const priorities = complaints.slice(0, 3);

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.hero}>
                    <div>
                        <p style={styles.eyebrow}>Investigator Workspace</p>
                        <h2 style={styles.headerTitle}>Welcome, {investigator.name}</h2>
                        <p style={styles.headerSub}>
                            {investigator.department} • {investigator.investigatorId || investigator.email}
                        </p>
                        <div style={styles.actionsBar}>
                            <a href="/investigator/assigned" style={styles.primaryBtn}>
                                View Complaints
                            </a>
                            <a href="/investigator/profile" style={styles.outlineBtn}>
                                Profile
                            </a>
                        </div>
                    </div>
                    <div style={styles.heroCard}>
                        <p style={styles.heroCardLabel}>Active Queue</p>
                        <h3 style={styles.heroCardTitle}>
                            {stats.assigned + stats.open} cases in progress
                        </h3>
                        <p style={styles.heroCardText}>
                            Prioritize assigned cases and resolve open investigations quickly.
                        </p>
                    </div>
                </div>

                <div style={styles.statsGrid}>
                    {renderStat("Total Cases", stats.total, "#1aa79b")}
                    {renderStat("New", stats.assigned, "#f59e0b")}
                    {renderStat("Open", stats.open, "#3aa3ff")}
                    {renderStat("Resolved", stats.resolved, "#22c55e")}
                    {renderStat("Closed", stats.closed, "#64748b")}
                </div>

                <div style={styles.contentGrid}>
                    <div style={styles.block}>
                        <h3 style={styles.blockTitle}>Priority Complaints</h3>

                        {priorities.length === 0 ? (
                            <p style={styles.noData}>No assigned complaints yet.</p>
                        ) : (
                            priorities.map((item) => (
                                <div key={item._id} style={styles.priorityItem}>
                                    <div>
                                        <strong style={{ fontSize: 16 }}>
                                            {item.complaintType}
                                        </strong>
                                        <p style={styles.dateText}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        style={{
                                            ...styles.badge,
                                            background:
                                                item.status === "Assigned"
                                                    ? "rgba(245, 158, 11, 0.2)"
                                                    : item.status === "Open"
                                                    ? "rgba(58, 163, 255, 0.2)"
                                                    : item.status === "Resolved"
                                                    ? "rgba(34, 197, 94, 0.2)"
                                                    : "rgba(100, 116, 139, 0.2)",
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.block}>
                        <h3 style={styles.blockTitle}>Recent Activity</h3>

                        <div style={styles.activityBox}>
                            <p style={styles.activityItem}>Dashboard loaded successfully.</p>
                            <p style={styles.activityEmpty}>
                                Activity timeline coming soon…
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ---------------- Helpers ---------------- */

const renderStat = (label, value, color) => (
    <div style={styles.statCard}>
        <div style={{ ...styles.statAccent, background: color }} />
        <h3 style={styles.statNumber}>{value}</h3>
        <p style={styles.statLabel}>{label}</p>
    </div>
);

/* ---------------- Styles (UNCHANGED) ---------------- */

const styles = {
    page: {
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        padding: "28px",
        display: "flex",
        justifyContent: "center",
    },
    container: { width: "100%", maxWidth: "1100px" },

    hero: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
        padding: 28,
        borderRadius: 22,
        background: "#0f172a",
        color: "#fff",
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
        marginBottom: 32,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 700,
        marginBottom: 10,
    },
    headerTitle: { fontSize: "28px", fontWeight: "700" },
    headerSub: { opacity: 0.85, marginTop: 4 },
    heroCard: {
        background: "rgba(255,255,255,0.08)",
        padding: 20,
        borderRadius: 18,
        alignSelf: "center",
    },
    heroCardLabel: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.7)",
    },
    heroCardTitle: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: 700,
    },
    heroCardText: {
        marginTop: 8,
        color: "rgba(255,255,255,0.72)",
        lineHeight: 1.6,
    },

    statsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: "18px",
        marginBottom: "32px",
    },
    statCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "var(--card-shadow)",
    },
    statAccent: {
        width: 34,
        height: 6,
        borderRadius: 999,
        marginBottom: 10,
    },
    statNumber: { fontSize: "28px", fontWeight: "700", color: "var(--ink-900)" },
    statLabel: {
        marginTop: 8,
        color: "var(--ink-600)",
        fontWeight: 600,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
    },

    actionsBar: { display: "flex", gap: "12px", marginTop: 18 },
    primaryBtn: {
        background: "var(--mint-500)",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: "12px",
        textDecoration: "none",
        fontWeight: "600",
    },
    outlineBtn: {
        border: "1px solid rgba(255,255,255,0.3)",
        padding: "12px 22px",
        borderRadius: "12px",
        color: "#fff",
        textDecoration: "none",
        fontWeight: "600",
        background: "rgba(255,255,255,0.06)",
    },

    contentGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 18,
    },
    block: {
        background: "#fff",
        padding: "24px",
        borderRadius: "18px",
        boxShadow: "var(--card-shadow)",
    },
    blockTitle: { fontSize: "20px", fontWeight: "700", marginBottom: "18px" },

    priorityItem: {
        display: "flex",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        padding: "12px 0",
    },
    dateText: { margin: 0, color: "var(--ink-600)", fontSize: 13 },
    badge: {
        padding: "6px 12px",
        borderRadius: 999,
        fontWeight: "600",
        color: "var(--ink-900)",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    noData: { color: "var(--ink-600)", textAlign: "center" },

    activityBox: { paddingLeft: 6 },
    activityItem: { margin: "8px 0", color: "var(--ink-700)", fontSize: 14 },
    activityEmpty: {
        marginTop: 8,
        color: "var(--ink-600)",
        fontStyle: "italic",
    },
};
