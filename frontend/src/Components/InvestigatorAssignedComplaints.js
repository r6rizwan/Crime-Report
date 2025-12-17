import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function InvestigatorAssignedComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const email = localStorage.getItem("email");

    useEffect(() => {
        const fetchAssignedComplaints = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/assigned/${email}`
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
    const assigned = complaints.filter(c => c.status === "Assigned");
    const open = complaints.filter(c => c.status === "Open");
    const resolved = complaints.filter(c => c.status === "Resolved");
    const closed = complaints.filter(c => c.status === "Closed");

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>My Assigned Complaints</h2>
            <p style={styles.subheading}>
                Manage and update complaints assigned to you
            </p>

            <Section
                title="🆕 Newly Assigned"
                items={assigned}
                emptyText="No new assigned complaints."
                actionLabel="Open Case"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />

            <Section
                title="🔵 Active Investigations"
                items={open}
                emptyText="No open investigations."
                actionLabel="Continue"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
            />

            <Section
                title="🟢 Resolved"
                items={resolved}
                emptyText="No resolved complaints yet."
                actionLabel="View"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
                // readOnly
            />

            <Section
                title="✅ Closed"
                items={closed}
                emptyText="No complaints Closed yet."
                actionLabel="View"
                onAction={(id) => navigate(`/investigator/update-status/${id}`)}
                // readOnly
            />
        </div>
    );
}

/* ---------------- Section Component ---------------- */

const Section = ({ title, items, emptyText, actionLabel, onAction, readOnly }) => (
    <div style={styles.section}>
        <h3 style={styles.sectionTitle}>{title}</h3>

        {items.length === 0 ? (
            <div style={styles.emptyBox}>{emptyText}</div>
        ) : (
            items.map((item) => (
                <div key={item._id} style={styles.card}>
                    <div>
                        <strong>{item.complaintType}</strong>
                        <p style={styles.meta}>
                            ID: {item.complaintId} • Filed on{" "}
                            {new Date(item.createdAt).toLocaleDateString()}
                        </p>
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
            return "#3F51B5";
        case "Open":
            return "#0288D1";
        case "Resolved":
            return "#2E7D32";
        default:
            return "#777";
    }
};

/* ---------------- Styles ---------------- */

const styles = {
    page: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "30px 20px",
    },

    heading: {
        fontSize: 26,
        fontWeight: 700,
        marginBottom: 6,
    },

    subheading: {
        color: "#555",
        marginBottom: 30,
    },

    section: {
        marginBottom: 35,
    },

    sectionTitle: {
        fontSize: 20,
        fontWeight: 700,
        marginBottom: 14,
    },

    emptyBox: {
        background: "#fff",
        padding: 20,
        borderRadius: 12,
        color: "#777",
        boxShadow: "0 4px 14px rgba(0,0,0,0.06)",
    },

    card: {
        background: "#fff",
        padding: 18,
        borderRadius: 14,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 14,
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    },

    meta: {
        color: "#666",
        fontSize: 13,
        marginTop: 4,
    },

    cardRight: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    status: {
        color: "#fff",
        padding: "6px 12px",
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 600,
    },

    actionBtn: {
        border: "none",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 8,
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
