import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const ITEMS_PER_PAGE = 10;

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
            const res = await axios.get("http://localhost:7000/api/complaint/all");
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

        const pending = filtered
            .filter((c) => c.status === "Pending")
            .sort(sorter);

        const others = filtered
            .filter((c) => c.status !== "Pending")
            .sort(sorter);

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

    const statusColors = {
        Pending: "#FB8C00",
        Assigned: "#5E35B1",
        Open: "#1E88E5",
        Resolved: "#2E7D32",
        Closed: "#616161",
    };

    return (
        <div style={styles.page}>
            {/* HEADER */}
            <div style={styles.headerRow}>
                <div>
                    <h2 style={styles.title}>All Complaints</h2>
                    <p style={styles.subtitle}>
                        Pending cases are always shown at the top
                    </p>
                </div>
            </div>

            {/* CONTROLS */}
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
                                    <td style={styles.td}>{c.complaintType}</td>
                                    <td style={styles.td}>{c.email}</td>
                                    <td style={styles.td}>
                                        <span
                                            style={{
                                                ...styles.badge,
                                                background: statusColors[c.status],
                                            }}
                                        >
                                            {c.status}
                                        </span>
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

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        padding: 30,
        background: "#F4F6FF",
        minHeight: "100vh",
    },
    headerRow: { marginBottom: 18 },
    title: { fontSize: 28, fontWeight: 700 },
    subtitle: { color: "#666", marginTop: 4 },

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
        border: "1px solid #DDE2FF",
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
        border: "1px solid #DDE2FF",
    },

    sortBtn: {
        padding: "12px 18px",
        borderRadius: 12,
        border: "1px solid #DDE2FF",
        background: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },

    card: {
        background: "#fff",
        borderRadius: 18,
        boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
        overflow: "hidden",
    },

    table: { width: "100%", borderCollapse: "collapse" },
    theadRow: { background: "#F5F7FF" },

    th: {
        padding: "16px 22px",
        fontSize: 13,
        fontWeight: 700,
        textTransform: "uppercase",
        color: "#555",
    },

    td: {
        padding: "16px 22px",
        borderBottom: "1px solid #F0F0F0",
        fontSize: 14,
    },

    badge: {
        padding: "6px 14px",
        borderRadius: 999,
        color: "#fff",
        fontWeight: 600,
        fontSize: 13,
    },

    viewBtn: {
        background: "#304FFE",
        color: "#fff",
        padding: "8px 16px",
        borderRadius: 8,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },

    empty: {
        textAlign: "center",
        padding: 50,
        color: "#777",
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
