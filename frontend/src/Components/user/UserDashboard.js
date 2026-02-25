import React, { useEffect, useState } from "react";
import api from "../../utils/api";

export default function UserDashboard() {
    const [userName, setUserName] = useState("");
    const [complaints, setComplaints] = useState([]);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        assigned: 0,
        resolved: 0,
    });

    const email = localStorage.getItem("email");

    useEffect(() => {
        if (!email) return;

        const loadData = async () => {
            try {
                // Fetch user name
                const userRes = await api.get(
                    `/api/profile/${email}`
                );
                setUserName(userRes.data?.fullName || "User");
            } catch {
                setUserName("User");
            }

            try {
                // Fetch complaints
                const compRes = await api.get(
                    `/api/complaint/user/${email}`
                );
                const list = compRes.data;

                setComplaints(list);

                setStats({
                    total: list.length,
                    pending: list.filter(c => c.status === "Pending").length,
                    assigned: list.filter(c => c.status === "Assigned").length,
                    resolved: list.filter(c => c.status === "Resolved").length,
                });
            } catch (err) {
                console.error("Error loading complaints:", err);
            }
        };

        loadData();
    }, [email]);

    const recent = complaints.slice(-3).reverse();

    return (
        <div style={styles.page}>
            <div style={styles.container}>
                <div style={styles.hero}>
                    <div>
                        <p style={styles.eyebrow}>Citizen Dashboard</p>
                        <h2 style={styles.welcomeText}>Welcome back, {userName}</h2>
                        <p style={styles.welcomeSub}>
                            Track every case, review updates, and file new complaints.
                        </p>
                        <div style={styles.heroActions}>
                            <a href="/file-complaint" style={styles.primaryBtn}>
                                File a Complaint
                            </a>
                            <a href="/complaint-tracking" style={styles.secondaryBtn}>
                                Track a Case
                            </a>
                        </div>
                    </div>
                    <div style={styles.heroCard}>
                        <p style={styles.heroCardLabel}>Security Status</p>
                        <h3 style={styles.heroCardTitle}>Account Verified</h3>
                        <p style={styles.heroCardText}>
                            You will receive email notifications for any updates.
                        </p>
                    </div>
                </div>

                <div style={styles.statsRow}>
                    {[
                        { label: "Total Complaints", value: stats.total, accent: "#1aa79b" },
                        { label: "Pending", value: stats.pending, accent: "#f59e0b" },
                        { label: "Assigned", value: stats.assigned, accent: "#3aa3ff" },
                        { label: "Resolved", value: stats.resolved, accent: "#22c55e" },
                    ].map((item) => (
                        <div key={item.label} style={styles.statCard}>
                            <div style={{ ...styles.statAccent, background: item.accent }} />
                            <h3 style={styles.statNumber}>{item.value}</h3>
                            <p style={styles.statLabel}>{item.label}</p>
                        </div>
                    ))}
                </div>

                <div style={styles.contentGrid}>
                    <div style={styles.recentCard}>
                        <div style={styles.cardHeader}>
                            <h3 style={styles.recentTitle}>Recent Complaints</h3>
                            <a href="/my-complaints" style={styles.linkBtn}>
                                View All
                            </a>
                        </div>

                        {recent.length === 0 ? (
                            <p style={styles.noData}>No recent complaints found.</p>
                        ) : (
                            recent.map((item) => (
                                <div key={item._id} style={styles.recentItem}>
                                    <div>
                                        <strong>{item.complaintType}</strong>
                                        <p style={styles.metaText}>
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                    <span
                                        style={{
                                            ...styles.badge,
                                            background:
                                                item.status === "Pending"
                                                    ? "#f59e0b"
                                                    : item.status === "Assigned"
                                                    ? "#3aa3ff"
                                                    : item.status === "Resolved"
                                                    ? "#22c55e"
                                                    : "#64748b",
                                        }}
                                    >
                                        {item.status}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>

                    <div style={styles.ctaCard}>
                        <h3 style={styles.ctaTitle}>Need to report a new issue?</h3>
                        <p style={styles.ctaSub}>
                            Provide the complaint details and attach evidence to speed up review.
                        </p>
                        <a href="/file-complaint" style={styles.ctaBtn}>
                            Start a New Report
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* ------------------- STYLES ------------------- */

const styles = {
    page: {
        minHeight: "100vh",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        padding: "32px",
        display: "flex",
        justifyContent: "center",
    },

    container: {
        width: "100%",
        maxWidth: "1000px",
    },

    hero: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 24,
        padding: 28,
        background: "#0f172a",
        borderRadius: 24,
        color: "#fff",
        boxShadow: "0 18px 42px rgba(11,18,32,0.28)",
        marginBottom: 32,
        animation: "fadeUp 0.7s ease both",
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 700,
        marginBottom: 12,
    },
    welcomeText: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 6,
    },

    welcomeSub: {
        opacity: 0.8,
        fontSize: 15,
        lineHeight: 1.6,
    },
    heroActions: {
        marginTop: 18,
        display: "flex",
        gap: 12,
        flexWrap: "wrap",
    },
    primaryBtn: {
        padding: "12px 20px",
        background: "var(--mint-500)",
        color: "#fff",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 600,
    },
    secondaryBtn: {
        padding: "12px 20px",
        background: "rgba(255,255,255,0.1)",
        color: "#fff",
        borderRadius: 12,
        textDecoration: "none",
        fontWeight: 600,
        border: "1px solid rgba(255,255,255,0.2)",
    },
    heroCard: {
        background: "rgba(255,255,255,0.08)",
        borderRadius: 18,
        padding: 20,
        alignSelf: "center",
    },
    heroCardLabel: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "rgba(255,255,255,0.7)",
    },
    heroCardTitle: { margin: "10px 0 6px", fontSize: 18, fontWeight: 700 },
    heroCardText: { color: "rgba(255,255,255,0.75)", lineHeight: 1.5 },

    /* Stats Section */
    statsRow: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 18,
        marginBottom: 32,
    },

    statCard: {
        background: "#fff",
        padding: 20,
        borderRadius: 16,
        boxShadow: "var(--card-shadow)",
        position: "relative",
    },

    statAccent: {
        width: 34,
        height: 6,
        borderRadius: 999,
        marginBottom: 12,
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 700,
        color: "var(--ink-900)",
    },

    statLabel: {
        color: "var(--ink-600)",
        marginTop: 6,
        fontSize: 13,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
    },

    contentGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 18,
    },
    recentCard: {
        background: "#fff",
        padding: 24,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
    },
    recentTitle: {
        fontSize: 20,
        fontWeight: 700,
        margin: 0,
    },
    linkBtn: {
        textDecoration: "none",
        fontWeight: 600,
        color: "var(--mint-600)",
        fontSize: 13,
    },

    recentItem: {
        display: "flex",
        justifyContent: "space-between",
        padding: "12px 0",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        alignItems: "center",
    },

    badge: {
        padding: "6px 12px",
        borderRadius: 999,
        color: "white",
        fontWeight: 600,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },

    noData: {
        color: "var(--ink-600)",
    },

    metaText: {
        margin: 0,
        color: "var(--ink-600)",
        fontSize: 13,
    },

    ctaCard: {
        background: "linear-gradient(135deg, #ffffff, #f9fbff)",
        padding: 24,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        justifyContent: "space-between",
    },
    ctaTitle: { fontSize: 20, fontWeight: 700, margin: 0 },
    ctaSub: { color: "var(--ink-600)", lineHeight: 1.5 },
    ctaBtn: {
        marginTop: 6,
        alignSelf: "flex-start",
        background: "var(--ink-900)",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 600,
        textDecoration: "none",
        fontSize: 14,
    },
};
