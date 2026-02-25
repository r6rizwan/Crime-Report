import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";

export default function AdminInvestigators() {
    const navigate = useNavigate();
    const [investigators, setInvestigators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleteTarget, setDeleteTarget] = useState(null);
    const [confirmName, setConfirmName] = useState("");
    const [deleteError, setDeleteError] = useState("");
    const [deleting, setDeleting] = useState(false);
    const [transferTarget, setTransferTarget] = useState(null); // { investigator, action, pendingCount }
    const [transferToId, setTransferToId] = useState("");
    const [transferError, setTransferError] = useState("");
    const [transferring, setTransferring] = useState(false);
    const [statusUpdatingId, setStatusUpdatingId] = useState("");

    const loadInvestigators = async () => {
        try {
            const res = await api.get("/api/investigators");
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
            await api.put(`/api/investigators/${id}`, {
                status: newStatus,
            });
            await loadInvestigators();
        } catch (err) {
            console.error("Failed to update status", err);
        }
    };

    const getPendingCaseCount = async (email) => {
        const res = await api.get(`/api/complaint/assigned/${email}`);
        const cases = Array.isArray(res.data) ? res.data : [];
        return cases.filter((c) => c.status !== "Closed").length;
    };

    const openTransferDialog = (investigator, action, pendingCount) => {
        setTransferTarget({ investigator, action, pendingCount });
        setTransferToId("");
        setTransferError("");
    };

    const closeTransferDialog = () => {
        setTransferTarget(null);
        setTransferToId("");
        setTransferError("");
        setTransferring(false);
    };

    const handleStatusAction = async (inv) => {
        if (statusUpdatingId) return;
        setStatusUpdatingId(inv._id);

        if (inv.status === "Inactive") {
            try {
                await toggleStatus(inv._id, inv.status); // Enable
            } finally {
                setStatusUpdatingId("");
            }
            return;
        }

        try {
            const pendingCount = await getPendingCaseCount(inv.email);
            if (pendingCount > 0) {
                openTransferDialog(inv, "disable", pendingCount);
                return;
            }
            await toggleStatus(inv._id, inv.status); // Disable directly
        } catch (err) {
            console.error("Failed to check pending cases", err);
            alert("Failed to check pending cases");
        } finally {
            setStatusUpdatingId("");
        }
    };

    const openDeleteDialog = (inv) => {
        setDeleteTarget(inv);
        setConfirmName("");
        setDeleteError("");
    };

    const closeDeleteDialog = () => {
        setDeleteTarget(null);
        setConfirmName("");
        setDeleteError("");
        setDeleting(false);
    };

    const deleteInvestigator = async (id, name, status) => {
        if (status === "Active") {
            alert("Disable investigator before deleting.");
            return;
        }

        if (confirmName !== name) {
            setDeleteError("Name does not match. Please type exact name.");
            return;
        }

        try {
            setDeleting(true);
            await api.delete(`/api/investigators/${id}`);
            loadInvestigators();
            closeDeleteDialog();
        } catch (err) {
            console.error("Failed to delete investigator", err);
            setDeleteError(err.response?.data?.error || "Failed to delete investigator");
            setDeleting(false);
        }
    };

    const handleDeleteAction = async (inv) => {
        if (inv.status === "Active") {
            alert("Disable investigator before deleting.");
            return;
        }

        try {
            const pendingCount = await getPendingCaseCount(inv.email);
            if (pendingCount > 0) {
                return openTransferDialog(inv, "delete", pendingCount);
            }
            return openDeleteDialog(inv);
        } catch (err) {
            console.error("Failed to check pending cases", err);
            alert("Failed to check pending cases");
        }
    };

    const handleTransferAndContinue = async () => {
        if (!transferTarget) return;
        if (!transferToId) {
            setTransferError("Select an investigator to transfer pending cases.");
            return;
        }

        try {
            setTransferring(true);
            setTransferError("");
            await api.post(`/api/investigators/${transferTarget.investigator._id}/transfer-cases`, {
                toInvestigatorId: transferToId,
                action: transferTarget.action,
            });
            await loadInvestigators();
            closeTransferDialog();
        } catch (err) {
            setTransferError(err.response?.data?.error || "Failed to transfer cases");
            setTransferring(false);
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
                            <th style={styles.th}>Investigator ID</th>
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
                                <td colSpan="7" style={styles.empty}>
                                    No investigators found.
                                </td>
                            </tr>
                        ) : (
                            investigators.map((inv) => (
                                <tr key={inv._id} style={styles.row}>
                                    <td style={styles.td}>{inv.investigatorId || "—"}</td>
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
                                        <div style={styles.actionRow}>
                                            <button
                                                style={
                                                    inv.status === "Active"
                                                        ? styles.disableBtn
                                                        : styles.enableBtn
                                                }
                                                onClick={() => handleStatusAction(inv)}
                                                disabled={statusUpdatingId === inv._id}
                                            >
                                                {statusUpdatingId === inv._id
                                                    ? "Processing..."
                                                    : inv.status === "Active"
                                                        ? "Disable"
                                                        : "Enable"}
                                            </button>
                                            {inv.status !== "Active" && (
                                                <button
                                                    style={styles.deleteBtn}
                                                    onClick={() => handleDeleteAction(inv)}
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {deleteTarget && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Delete Investigator</h3>
                        <p style={styles.modalText}>
                            This action cannot be undone. Type
                            {" "}
                            <strong>{deleteTarget.name}</strong>
                            {" "}
                            to confirm.
                        </p>
                        <input
                            style={styles.modalInput}
                            value={confirmName}
                            onChange={(e) => setConfirmName(e.target.value)}
                            placeholder="Type investigator name"
                        />
                        {deleteError && <p style={styles.modalError}>{deleteError}</p>}
                        <div style={styles.modalActions}>
                            <button style={styles.modalCancelBtn} onClick={closeDeleteDialog} disabled={deleting}>
                                Cancel
                            </button>
                            <button
                                style={styles.modalDeleteBtn}
                                onClick={() =>
                                    deleteInvestigator(
                                        deleteTarget._id,
                                        deleteTarget.name,
                                        deleteTarget.status
                                    )
                                }
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {transferTarget && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>
                            Transfer Cases Before {transferTarget.action === "delete" ? "Delete" : "Disable"}
                        </h3>
                        <p style={styles.modalText}>
                            {transferTarget.investigator.name} has {transferTarget.pendingCount} pending case(s).
                            Transfer them to another investigator to continue.
                        </p>
                        <select
                            style={styles.modalInput}
                            value={transferToId}
                            onChange={(e) => setTransferToId(e.target.value)}
                        >
                            <option value="">Select replacement investigator</option>
                            {investigators
                                .filter(
                                    (i) =>
                                        i._id !== transferTarget.investigator._id &&
                                        i.status === "Active"
                                )
                                .map((i) => (
                                    <option key={i._id} value={i._id}>
                                        {i.name} ({i.email})
                                    </option>
                                ))}
                        </select>
                        {transferError && <p style={styles.modalError}>{transferError}</p>}
                        <div style={styles.modalActions}>
                            <button
                                style={styles.modalCancelBtn}
                                onClick={closeTransferDialog}
                                disabled={transferring}
                            >
                                Cancel
                            </button>
                            <button
                                style={styles.modalDeleteBtn}
                                onClick={handleTransferAndContinue}
                                disabled={transferring}
                            >
                                {transferring ? "Processing..." : "Transfer and Continue"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
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

    deleteBtn: {
        background: "transparent",
        color: "#991b1b",
        border: "none",
        padding: "8px 8px",
        fontWeight: 600,
        cursor: "pointer",
        textDecoration: "underline",
    },

    actionRow: {
        display: "inline-flex",
        gap: 8,
        alignItems: "center",
    },

    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(2, 6, 23, 0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: 20,
    },
    modal: {
        width: "100%",
        maxWidth: 460,
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 20px 45px rgba(2,6,23,0.25)",
        padding: 22,
    },
    modalTitle: {
        margin: 0,
        fontSize: 22,
        fontWeight: 700,
        color: "var(--ink-900)",
    },
    modalText: {
        marginTop: 10,
        color: "var(--ink-600)",
        lineHeight: 1.5,
    },
    modalInput: {
        width: "100%",
        marginTop: 10,
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(15,23,42,0.18)",
        fontSize: 14,
    },
    modalError: {
        marginTop: 10,
        marginBottom: 0,
        color: "#b91c1c",
        fontWeight: 600,
        fontSize: 13,
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 16,
    },
    modalCancelBtn: {
        border: "1px solid rgba(15,23,42,0.14)",
        background: "#fff",
        color: "var(--ink-700)",
        borderRadius: 10,
        padding: "10px 16px",
        fontWeight: 600,
        cursor: "pointer",
    },
    modalDeleteBtn: {
        border: "none",
        background: "#b91c1c",
        color: "#fff",
        borderRadius: 10,
        padding: "10px 16px",
        fontWeight: 700,
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
