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
                                                        ? "#2E7D32"
                                                        : "#9E9E9E",
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
        background: "#F4F6FF",
        minHeight: "100vh",
    },

    headerRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 25,
    },

    title: {
        fontSize: 28,
        fontWeight: 700,
    },

    subtitle: {
        color: "#666",
        marginTop: 4,
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        padding: "12px 22px",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 6px 14px rgba(48,79,254,0.3)",
    },

    card: {
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        padding: "12px 0", // 🔑 side spacing fix
    },

    table: {
        width: "100%",
        borderCollapse: "collapse",
    },

    theadRow: {
        background: "#F5F7FF",
    },

    th: {
        padding: "16px 22px",
        textAlign: "left",
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        color: "#555",
        borderBottom: "1px solid #E0E4FF",
    },

    td: {
        padding: "16px 22px",
        fontSize: 14,
        color: "#333",
        borderBottom: "1px solid #F0F0F0",
        verticalAlign: "middle",
    },

    row: {
        transition: "background 0.2s ease",
    },

    badge: {
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 999,
        fontWeight: 600,
        fontSize: 13,
        display: "inline-block",
        minWidth: 90,
        textAlign: "center",
    },

    enableBtn: {
        background: "#E8F5E9",
        color: "#2E7D32",
        border: "1px solid #C8E6C9",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    disableBtn: {
        background: "#FCE4EC",
        color: "#C2185B",
        border: "1px solid #F8BBD0",
        padding: "8px 16px",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: 50,
        color: "#777",
        fontWeight: 600,
    },

    center: {
        textAlign: "center",
        marginTop: 60,
        fontWeight: 600,
    },
};
