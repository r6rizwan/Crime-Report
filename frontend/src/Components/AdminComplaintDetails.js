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

            <div style={styles.backRow} onClick={() => navigate(-1)}>
                ← Back
            </div>

            <h2 style={styles.heading}>Complaint Details</h2>

            {message && <div style={styles.alert}>{message}</div>}

            <div style={styles.layout}>

                {/* LEFT — Complaint Info */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Complaint Information</h3>

                    <InfoRow label="Complaint ID" value={complaint.complaintId} />
                    <InfoRow label="Type" value={complaint.complaintType} />

                    <div style={styles.row}>
                        <span style={styles.key}>Status</span>
                        <span style={styles.badge}>{complaint.status}</span>
                    </div>

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
                                href={`http://localhost:7000/${complaint.file}`}
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
                                    ? `${assignedInvestigator.name} (Badge #${assignedInvestigator.badgeNumber})`
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
                                        {i.name} — Badge #{i.badgeNumber}
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
    page: { padding: 35, background: "#F3F5FA", minHeight: "100vh" },
    backRow: { cursor: "pointer", color: "#304FFE", fontWeight: 600 },
    heading: { fontSize: 28, fontWeight: 700, marginBottom: 20 },
    alert: { background: "#D1F5DA", padding: 14, borderRadius: 10 },
    layout: { display: "flex", gap: 25 },
    card: {
        background: "#fff",
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
        flex: 1,
    },
    cardTitle: { fontSize: 20, fontWeight: 700, marginBottom: 18 },
    row: { display: "flex", justifyContent: "space-between", marginBottom: 12 },
    key: { fontWeight: 600, color: "#555" },
    value: { color: "#111" },
    badge: {
        background: "#304FFE",
        color: "#fff",
        padding: "4px 12px",
        borderRadius: 8,
        fontWeight: 600,
    },
    desc: { marginTop: 6, lineHeight: 1.6 },
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginBottom: 15,
    },
    primaryBtn: {
        width: "100%",
        padding: 12,
        background: "#304FFE",
        color: "#fff",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
    dangerBtn: {
        width: "100%",
        padding: 12,
        background: "#D32F2F",
        color: "#fff",
        borderRadius: 10,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },
    secondaryBtn: {
        padding: 12,
        background: "#E0E7FF",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },
    readOnlyBox: {
        background: "#F3F4FF",
        padding: 14,
        borderRadius: 10,
        border: "1px solid #E0E7FF",
    },
    fileLink: {
        display: "block",
        marginTop: 6,
        color: "#304FFE",
        fontWeight: 600,
    },

    /* Timeline */
    timelineRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "10px 0",
        borderBottom: "1px solid #EEE",
    },
    timelineLabel: {
        fontWeight: 600,
        color: "#444",
    },
    timelineValue: {
        color: "#111",
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
