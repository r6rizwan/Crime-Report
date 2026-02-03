import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminComplaintDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [investigators, setInvestigators] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [changingOfficer, setChangingOfficer] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCloseConfirm, setShowCloseConfirm] = useState(false);
    const [message, setMessage] = useState("");

    const [caseFile, setCaseFile] = useState(null);
    const [caseFileLoading, setCaseFileLoading] = useState(true);

    /* ---------------- Fetchers ---------------- */

    const fetchComplaint = useCallback(async () => {
        const res = await axios.get(
            `http://localhost:7000/api/complaint/${id}`
        );
        setComplaint(res.data);
    }, [id]);

    const fetchInvestigators = useCallback(async () => {
        const res = await axios.get(
            "http://localhost:7000/api/investigators"
        );
        setInvestigators(res.data);
    }, []);

    const fetchCaseFiles = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:7000/api/case-files/${id}`
            );
            setCaseFile(res.data);
        } catch {
            setCaseFile(null);
        } finally {
            setCaseFileLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchComplaint();
        fetchInvestigators();
        fetchCaseFiles();
    }, [fetchComplaint, fetchInvestigators, fetchCaseFiles]);

    /* ---------------- Helpers ---------------- */

    const assignedInvestigator = investigators.find(
        (i) => i.email === complaint?.assignedTo
    );

    /* ---------------- Actions ---------------- */

    const assignOfficer = async () => {
        if (!selectedOfficer) return alert("Select an investigator");

        await axios.put(
            `http://localhost:7000/api/complaint/${id}/assign`,
            { assignedTo: selectedOfficer }
        );

        setMessage("Investigator assigned successfully");
        setChangingOfficer(false);
        setSelectedOfficer("");
        fetchComplaint();
        setTimeout(() => setMessage(""), 3000);
    };

    const closeComplaint = async () => {
        await axios.put(
            `http://localhost:7000/api/complaint/${id}/close`
        );

        setMessage("Complaint closed successfully");
        setShowCloseConfirm(false);
        fetchComplaint();
        setTimeout(() => setMessage(""), 3000);
    };

    if (!complaint) {
        return <p style={{ textAlign: "center", marginTop: 50 }}>Loading…</p>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button style={styles.backRow} onClick={() => navigate(-1)}>
                    ← Back
                </button>
                <div>
                    <p style={styles.eyebrow}>Complaint Management</p>
                    <h2 style={styles.heading}>Complaint Details</h2>
                </div>
                <span
                    style={{
                        ...styles.badge,
                        background:
                            complaint.status === "Pending"
                                ? "rgba(245, 158, 11, 0.2)"
                                : complaint.status === "Assigned" || complaint.status === "Open"
                                ? "rgba(58, 163, 255, 0.2)"
                                : complaint.status === "Resolved"
                                ? "rgba(34, 197, 94, 0.2)"
                                : "rgba(100, 116, 139, 0.2)",
                    }}
                >
                    {complaint.status}
                </span>
            </div>

            {message && <div style={styles.alert}>{message}</div>}

            <div style={styles.layout}>

                {/* LEFT — Complaint Info */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Complaint Information</h3>

                    <InfoRow label="Complaint ID" value={complaint.complaintId} />
                    <InfoRow label="Type" value={complaint.complaintType} />

                    <InfoRow
                        label="Date Filed"
                        value={new Date(complaint.createdAt).toLocaleString()}
                    />

                    <div style={{ marginTop: 12 }}>
                        <div style={styles.key}>Description</div>
                        <div style={styles.desc}>{complaint.description}</div>
                    </div>

                    {complaint.file && (
                        <div style={{ marginTop: 12 }}>
                            <div style={styles.key}>Attachment</div>
                            <a
                                href={`http://localhost:7000/uploads/${String(complaint.file).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.fileLink}
                            >
                                View File
                            </a>
                        </div>
                    )}
                </div>

                {/* RIGHT — Investigator Assignment */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Investigator Assignment</h3>

                    {complaint.assignedTo && !changingOfficer && (
                        <>
                            <div style={styles.readOnlyBox}>
                                {assignedInvestigator
                                    ? `${assignedInvestigator.name} (${assignedInvestigator.investigatorId || assignedInvestigator.email})`
                                    : complaint.assignedTo}
                            </div>

                            {complaint.assignedAt && (
                                <p style={styles.meta}>
                                    Assigned on{" "}
                                    {new Date(complaint.assignedAt).toLocaleString()}
                                </p>
                            )}

                            {complaint.status !== "Closed" && (
                                <button
                                    style={{ ...styles.primaryBtn, marginTop: 14 }}
                                    onClick={() => setShowConfirm(true)}
                                >
                                    Change Investigator
                                </button>
                            )}
                        </>
                    )}

                    {(!complaint.assignedTo || changingOfficer) && (
                        <>
                            <select
                                style={styles.input}
                                value={selectedOfficer}
                                onChange={(e) => setSelectedOfficer(e.target.value)}
                            >
                                <option value="">Select Investigator</option>
                                {investigators.map((i) => (
                                    <option key={i._id} value={i.email}>
                                        {i.name} — {i.investigatorId || i.email}
                                    </option>
                                ))}
                            </select>

                            <button style={styles.primaryBtn} onClick={assignOfficer}>
                                {complaint.assignedTo
                                    ? "Reassign Investigator"
                                    : "Assign Investigator"}
                            </button>
                        </>
                    )}

                    {complaint.status === "Resolved" && (
                        <button
                            style={{ ...styles.dangerBtn, marginTop: 30 }}
                            onClick={() => setShowCloseConfirm(true)}
                        >
                            Close Case
                        </button>
                    )}
                </div>
            </div>

            {/* CASE FILES */}
                <div style={{ ...styles.card, marginTop: 30 }}>
                <h3 style={styles.cardTitle}>Case Files</h3>

                {caseFileLoading ? (
                    <p>Loading case files…</p>
                ) : !caseFile ? (
                    <p>No case files uploaded yet.</p>
                ) : (
                    <>
                        <InfoRow label="Investigator" value={caseFile.investigatorEmail} />

                        <div style={{ marginTop: 12 }}>
                            <div style={styles.key}>Notes</div>
                            <div style={styles.readOnlyBox}>
                                {caseFile.notes || "No notes provided."}
                            </div>
                        </div>

                        <div style={{ marginTop: 12 }}>
                            <div style={styles.key}>Files</div>
                            {caseFile.files.length > 0 ?
                                caseFile.files.map((f, i) => (
                                    <a
                                        key={i}
                                        href={`http://localhost:7000/uploads/${String(f.filename).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                                        target="_blank"
                                        rel="noreferrer"
                                        style={styles.fileLink}
                                    >
                                        📎 {f.filename}
                                    </a>
                                )) : <p>No case files uploaded yet.</p>
                            }
                        </div>
                    </>
                )}
            </div>

            {/* 🆕 LIFECYCLE / AUDIT TIMELINE */}
            <div style={{ ...styles.card, marginTop: 30 }}>
                <h3 style={styles.cardTitle}>Complaint Timeline</h3>

                <TimelineItem label="Complaint Filed" date={complaint.createdAt} />
                <TimelineItem label="Assigned to Investigator" date={complaint.assignedAt} />
                <TimelineItem label="Investigation Started" date={complaint.openedAt} />
                <TimelineItem label="Resolved by Investigator" date={complaint.resolvedAt} />
                <TimelineItem label="Closed by Admin" date={complaint.closedAt} />
            </div>

            {/* CONFIRM MODALS */}
            {showConfirm && (
                <ConfirmModal
                    title="Change Investigator?"
                    text="This will replace the currently assigned investigator."
                    onCancel={() => setShowConfirm(false)}
                    onConfirm={() => {
                        setChangingOfficer(true);
                        setShowConfirm(false);
                    }}
                />
            )}

            {showCloseConfirm && (
                <ConfirmModal
                    title="Close Complaint?"
                    text="This action is final and cannot be undone."
                    onCancel={() => setShowCloseConfirm(false)}
                    onConfirm={closeComplaint}
                />
            )}
        </div>
    );
}

/* ---------------- Components ---------------- */

const InfoRow = ({ label, value }) => (
    <div style={styles.row}>
        <span style={styles.key}>{label}</span>
        <span style={styles.value}>{value}</span>
    </div>
);

const TimelineItem = ({ label, date }) => (
    <div style={styles.timelineRow}>
        <span style={styles.timelineLabel}>{label}</span>
        <span style={styles.timelineValue}>
            {date ? new Date(date).toLocaleString() : "—"}
        </span>
    </div>
);

const ConfirmModal = ({ title, text, onCancel, onConfirm }) => (
    <div style={styles.modalOverlay}>
        <div style={styles.modal}>
            <h3>{title}</h3>
            <p>{text}</p>

            <div style={styles.modalActions}>
                <button style={styles.secondaryBtn} onClick={onCancel}>
                    Cancel
                </button>
                <button style={styles.primaryBtn} onClick={onConfirm}>
                    Confirm
                </button>
            </div>
        </div>
    </div>
);

/* ---------------- Styles ---------------- */

const styles = {
    page: {
        padding: 35,
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 20,
    },
    backRow: {
        cursor: "pointer",
        color: "var(--mint-600)",
        fontWeight: 600,
        background: "transparent",
        border: "none",
        fontSize: 14,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 6,
    },
    heading: { fontSize: 28, fontWeight: 700, margin: 0 },
    alert: {
        background: "rgba(34,197,94,0.12)",
        padding: 14,
        borderRadius: 12,
        color: "#15803d",
        fontWeight: 600,
    },
    layout: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 22,
    },
    card: {
        background: "#fff",
        padding: 25,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 18 },
    row: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
    key: { fontWeight: 600, color: "var(--ink-600)" },
    value: { color: "var(--ink-900)", fontWeight: 600 },
    badge: {
        background: "rgba(15,23,42,0.08)",
        color: "var(--ink-900)",
        padding: "6px 12px",
        borderRadius: 999,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: 12,
    },
    desc: {
        marginTop: 6,
        lineHeight: 1.6,
        background: "rgba(15,23,42,0.04)",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginBottom: 15,
    },
    primaryBtn: {
        width: "100%",
        padding: 12,
        background: "var(--mint-500)",
        color: "#fff",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
    dangerBtn: {
        width: "100%",
        padding: 12,
        background: "#ef4444",
        color: "#fff",
        borderRadius: 12,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },
    secondaryBtn: {
        padding: 12,
        background: "rgba(15,23,42,0.08)",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
    readOnlyBox: {
        background: "rgba(15,23,42,0.04)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
    },
    fileLink: {
        display: "block",
        marginTop: 6,
        color: "var(--mint-600)",
        fontWeight: 600,
    },

    /* Timeline */
    timelineRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },
    timelineLabel: {
        fontWeight: 600,
        color: "var(--ink-600)",
    },
    timelineValue: {
        color: "var(--ink-900)",
    },

    /* Modal */
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
    },
    modal: {
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        width: 420,
        textAlign: "center",
    },
    modalActions: {
        display: "flex",
        gap: 12,
        marginTop: 20,
    },
};
