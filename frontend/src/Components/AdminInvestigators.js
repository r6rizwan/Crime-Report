import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminInvestigators() {
    const navigate = useNavigate();
    const [investigators, setInvestigators] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInvestigators = async () => {
        try {
            const res = await axios.get("http://localhost:7000/api/investigators");
            setInvestigators(res.data);
        } catch (err) {
            console.error("Failed to load investigators", err);
        } finally {
            setLoading(false);
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
        try {
            await axios.put(`http://localhost:7000/api/investigators/${id}`, {
                status: newStatus,
            });
            loadInvestigators();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    useEffect(() => {
        loadInvestigators();
    }, []);

    if (loading) {
        return <p style={styles.center}>Loading investigators…</p>;
    }

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.headerRow}>
                <div>
                    <p style={styles.eyebrow}>Operations</p>
                    <h2 style={styles.title}>Investigators</h2>
                    <p style={styles.subtitle}>
                        Manage investigators and their availability
                    </p>
                </div>

                <button
                    style={styles.primaryBtn}
                    onClick={() => navigate("/admin/add-investigator")}
                >
                    + Add Investigator
                </button>
            </div>

            {/* TABLE CARD */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Name</th>
                            <th style={styles.th}>Email</th>
                            <th style={styles.th}>Phone</th>
                            <th style={styles.th}>Department</th>
                            <th style={styles.th}>Status</th>
                            <th style={{ ...styles.th, textAlign: "right" }}>
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {investigators.length === 0 ? (
                            <tr>
                                <td colSpan="6" style={styles.empty}>
                                    No investigators found.
                                </td>
                            </tr>
                        ) : (
                            investigators.map((inv) => (
                                <tr key={inv._id} style={styles.row}>
                                    <td style={styles.td}>{inv.name}</td>
                                    <td style={styles.td}>{inv.email}</td>
                                    <td style={styles.td}>{inv.phone}</td>
                                    <td style={styles.td}>{inv.department}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background:
                                                    inv.status === "Active"
                                                        ? "rgba(34, 197, 94, 0.2)"
                                                        : "rgba(100, 116, 139, 0.2)",
                                            }}
                                        >
                                            {inv.status}
                                        </span>
                                    </td>
                                    <td style={{ ...styles.td, textAlign: "right" }}>
                                        <button
                                            style={
                                                inv.status === "Active"
                                                    ? styles.disableBtn
                                                    : styles.enableBtn
                                            }
                                            onClick={() =>
                                                toggleStatus(inv._id, inv.status)
                                            }
                                        >
                                            {inv.status === "Active"
                                                ? "Disable"
                                                : "Enable"}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        padding: 30,
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
        flexWrap: "wrap",
        gap: 16,
    },

    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 8,
    },
    title: {
        fontSize: 28,
        fontWeight: 700,
    },

    subtitle: {
        color: "var(--ink-600)",
        marginTop: 4,
    },

    primaryBtn: {
        background: "var(--ink-900)",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 10px 24px rgba(11,18,32,0.2)",
    },

    card: {
        background: "#fff",
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
        padding: "12px 0", // 🔑 side spacing fix
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    theadRow: {
        background: "rgba(15,23,42,0.04)",
    },

    th: {
        padding: "16px 22px",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        color: "var(--ink-600)",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },

    td: {
        padding: "16px 22px",
        fontSize: 14,
        color: "var(--ink-700)",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        verticalAlign: "middle",
    },

    row: {
        transition: "background 0.2s ease",
    },

    badge: {
        color: "var(--ink-900)",
        padding: "6px 14px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: 12,
        display: "inline-block",
        minWidth: 90,
        textAlign: "center",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },

    enableBtn: {
        background: "rgba(34, 197, 94, 0.16)",
        color: "#15803d",
        border: "1px solid rgba(34, 197, 94, 0.28)",
        padding: "8px 16px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
    },

    disableBtn: {
        background: "rgba(248, 113, 113, 0.16)",
        color: "#b91c1c",
        border: "1px solid rgba(248, 113, 113, 0.3)",
        padding: "8px 16px",
        borderRadius: 10,
        fontWeight: 600,
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: 50,
        color: "var(--ink-600)",
        fontWeight: 600,
    },

    center: {
        textAlign: "center",
        marginTop: 60,
        fontWeight: 600,
    },
};
