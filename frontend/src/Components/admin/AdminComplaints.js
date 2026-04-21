import React, { useEffect, useMemo, useState } from "react";
import api from "../../utils/api";

const ITEMS_PER_PAGE = 10;
const PRIORITY_ORDER = {
    Critical: 4,
    High: 3,
    Medium: 2,
    Low: 1,
};

export default function AdminComplaints() {
    const [complaints, setComplaints] = useState([]);
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("All");
    const [sortOrder, setSortOrder] = useState("newest"); // newest | oldest
    const [page, setPage] = useState(1);

    useEffect(() => {
        loadComplaints();
    }, []);

    const loadComplaints = async () => {
        try {
            const res = await api.get("/api/complaint/all");
            setComplaints(res.data);
        } catch (err) {
            console.error("Fetch error:", err);
        }
    };

    /* ---------------- FILTER + SORT + PIN ---------------- */

    const processedComplaints = useMemo(() => {
        const text = search.toLowerCase();

        const filtered = complaints.filter((c) => {
            const matches =
                c.complaintId.toLowerCase().includes(text) ||
                c.email.toLowerCase().includes(text) ||
                c.complaintType.toLowerCase().includes(text);

            const matchStatus = filter === "All" || c.status === filter;
            return matches && matchStatus;
        });

        const sorter = (a, b) =>
            sortOrder === "newest"
                ? new Date(b.createdAt) - new Date(a.createdAt)
                : new Date(a.createdAt) - new Date(b.createdAt);

        const priorityAwareSorter = (a, b) => {
            const priorityDiff =
                (PRIORITY_ORDER[b.aiSuggestion?.suggestedPriority] || 0) -
                (PRIORITY_ORDER[a.aiSuggestion?.suggestedPriority] || 0);

            if (priorityDiff !== 0) return priorityDiff;
            return sorter(a, b);
        };

        const pending = filtered
            .filter((c) => c.status === "Pending")
            .sort(priorityAwareSorter);

        const others = filtered
            .filter((c) => c.status !== "Pending")
            .sort(priorityAwareSorter);

        return [...pending, ...others];
    }, [complaints, search, filter, sortOrder]);

    /* ---------------- PAGINATION ---------------- */

    const totalPages = Math.ceil(processedComplaints.length / ITEMS_PER_PAGE);

    const paginatedComplaints = processedComplaints.slice(
        (page - 1) * ITEMS_PER_PAGE,
        page * ITEMS_PER_PAGE
    );

    // Reset page when filters change
    useEffect(() => {
        setPage(1);
    }, [search, filter, sortOrder]);

    return (
        <div style={styles.page}>
            <div style={styles.headerRow}>
                <div>
                    <p style={styles.eyebrow}>Operations</p>
                    <h2 style={styles.title}>All Complaints</h2>
                    <p style={styles.subtitle}>
                        Pending cases stay at the top, and AI-priority cases are surfaced first within each group
                    </p>
                </div>
            </div>

            <div style={styles.controls}>
                <div style={styles.searchBox}>
                    <span style={styles.searchIcon}>🔍</span>
                    <input
                        type="text"
                        placeholder="Search by ID, email or type"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={styles.searchInput}
                    />
                </div>

                <select
                    style={styles.filter}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Assigned">Assigned</option>
                    <option value="Open">Open</option>
                    <option value="Resolved">Resolved</option>
                    <option value="Closed">Closed</option>
                </select>

                <button
                    style={styles.sortBtn}
                    onClick={() =>
                        setSortOrder(sortOrder === "newest" ? "oldest" : "newest")
                    }
                >
                    {sortOrder === "newest" ? "Newest ↓" : "Oldest ↑"}
                </button>
            </div>

            {/* TABLE */}
            <div style={styles.card}>
                <table style={styles.table}>
                    <thead>
                        <tr style={styles.theadRow}>
                            <th style={styles.th}>Complaint ID</th>
                            <th style={styles.th}>Type</th>
                            <th style={styles.th}>User Email</th>
                            <th style={styles.th}>Status</th>
                            <th style={styles.th}>Assigned To</th>
                            <th style={styles.th}>Date</th>
                            <th style={{ ...styles.th, textAlign: "right" }}>
                                Action
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedComplaints.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={styles.empty}>
                                    No complaints found.
                                </td>
                            </tr>
                        ) : (
                            paginatedComplaints.map((c) => (
                                <tr key={c._id}>
                                    <td style={styles.td}>{c.complaintId}</td>
                                    <td style={styles.td}>
                                        <div style={styles.typeCell}>
                                            <span>{c.complaintType}</span>
                                            {c.aiSuggestion?.suggestedPriority && (
                                                <span
                                                    style={{
                                                        ...styles.priorityChip,
                                                        ...getPriorityStyles(c.aiSuggestion.suggestedPriority),
                                                    }}
                                                >
                                                    {c.aiSuggestion.suggestedPriority}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{c.email}</td>
                                    <td style={styles.td}>
                                        <div style={styles.statusCell}>
                                            <span
                                                style={{
                                                    ...styles.badge,
                                                    background:
                                                        c.status === "Pending"
                                                            ? "rgba(245, 158, 11, 0.2)"
                                                            : c.status === "Assigned" || c.status === "Open"
                                                            ? "rgba(58, 163, 255, 0.2)"
                                                            : c.status === "Resolved"
                                                            ? "rgba(34, 197, 94, 0.2)"
                                                            : "rgba(100, 116, 139, 0.2)",
                                                }}
                                            >
                                                {c.status}
                                            </span>
                                            {c.aiSuggestion?.usedAI && (
                                                <span style={styles.aiTag}>AI Assisted</span>
                                            )}
                                        </div>
                                    </td>
                                    <td style={styles.td}>{c.assignedTo || "—"}</td>
                                    <td style={styles.td}>
                                        {new Date(c.createdAt).toLocaleDateString("en-IN")}
                                    </td>
                                    <td style={{ ...styles.td, textAlign: "right" }}>
                                        <button
                                            style={styles.viewBtn}
                                            onClick={() =>
                                                (window.location.href = `/admin/complaints/${c._id}`)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* PAGINATION */}
                {totalPages > 1 && (
                    <div style={styles.pagination}>
                        <button
                            disabled={page === 1}
                            onClick={() => setPage((p) => p - 1)}
                        >
                            Prev
                        </button>

                        <span>
                            Page {page} of {totalPages}
                        </span>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage((p) => p + 1)}
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

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

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        padding: 30,
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
    },
    headerRow: { marginBottom: 18 },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 8,
    },
    title: { fontSize: 28, fontWeight: 700 },
    subtitle: { color: "var(--ink-600)", marginTop: 4 },

    controls: {
        display: "flex",
        gap: 14,
        alignItems: "center",
        marginBottom: 22,
    },

    searchBox: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        background: "#fff",
        padding: "12px 16px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.12)",
        boxShadow: "var(--card-shadow)",
    },
    searchIcon: { marginRight: 10, opacity: 0.6 },
    searchInput: {
        width: "100%",
        border: "none",
        outline: "none",
        fontSize: 15,
    },

    filter: {
        width: 180,
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.12)",
        background: "#fff",
    },

    sortBtn: {
        padding: "12px 18px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.12)",
        background: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },

    card: {
        background: "#fff",
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
        overflow: "hidden",
    },

    table: { width: "100%", borderCollapse: "collapse" },
    theadRow: { background: "rgba(15,23,42,0.04)" },

    th: {
        padding: "16px 22px",
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        color: "var(--ink-600)",
    },

    td: {
        padding: "16px 22px",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        fontSize: 14,
    },
    typeCell: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },

    badge: {
        padding: "6px 14px",
        borderRadius: 999,
        color: "var(--ink-900)",
        fontWeight: 600,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    statusCell: {
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
    },
    aiTag: {
        padding: "5px 10px",
        borderRadius: 999,
        background: "rgba(26,167,155,0.12)",
        color: "var(--mint-700)",
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
    },
    priorityChip: {
        padding: "5px 10px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 11,
        letterSpacing: "0.06em",
        textTransform: "uppercase",
    },

    viewBtn: {
        background: "var(--ink-900)",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: 50,
        color: "var(--ink-600)",
        fontWeight: 600,
    },

    pagination: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        gap: 14,
        padding: 16,
    },
};
