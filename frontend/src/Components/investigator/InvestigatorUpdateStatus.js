import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../utils/api";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function InvestigatorUpdateStatus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [reporter, setReporter] = useState(null);
    const [solution, setSolution] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [toast, setToast] = useState("");

    const showToast = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(""), 2600);
    };

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const [complaintRes, reporterRes] = await Promise.all([
                    api.get(`/api/complaint/${id}`),
                    api.get(`/api/complaint/${id}/reporter`),
                ]);

                setComplaint(complaintRes.data);
                setSolution(complaintRes.data.solution || "");
                setReporter(reporterRes.data);
            } catch {
                setError("Failed to load complaint details.");
            } finally {
                setLoading(false);
            }
        };

        fetchComplaint();
    }, [id]);

    /* ---------------- Actions ---------------- */

    const openCase = async () => {
        if (saving) return;
        setSaving(true);
        try {
            await api.put(
                `/api/complaint/${id}/open`
            );
            setComplaint((prev) => ({ ...prev, status: "Open" }));
        } catch {
            showToast("Failed to open case");
        } finally {
            setSaving(false);
        }
    };

    const resolveCase = async () => {
        if (saving) return;
        if (!solution.trim()) {
            showToast("Solution is required to resolve the case");
            return;
        }

        setSaving(true);
        try {
            await api.put(
                `/api/complaint/${id}/resolve`,
                { solution }
            );
            navigate("/investigator/assigned");
        } catch {
            showToast("Failed to resolve case");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={styles.center}>Loading…</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <button
                    style={styles.backRow}
                    onClick={() => navigate("/investigator/assigned")}
                >
                    ← Back to Complaints
                </button>
                <div>
                    <p style={styles.eyebrow}>Case Actions</p>
                    <h2 style={styles.heading}>Complaint Details</h2>
                </div>
                <span
                    style={{
                        ...styles.badge,
                        background: getStatusColor(complaint.status),
                    }}
                >
                    {complaint.status}
                </span>
            </div>

            <div style={styles.container}>
                {toast && <div style={styles.toastError}>{toast}</div>}

                {/* ================= Complaint Details ================= */}
                <div style={styles.card}>

                    {/* Header */}
                    <div style={styles.cardHeader}>
                        <div>
                            <h3>{complaint.complaintType}</h3>
                            <p style={styles.id}>Complaint ID: {complaint.complaintId}</p>
                        </div>

                        <div style={styles.headerActions}>
                            <Link
                                to={`/investigator/case-files/${complaint._id}`}
                                style={styles.caseFilesBtn}
                            >
                                Case Files & Notes
                            </Link>
                        </div>
                    </div>

                    {/* Complainant Info */}
                    <Section title="Complainant Information">
                        <Info label="Name" value={reporter?.fullName || "Not available"} />
                        <Info label="Email" value={reporter?.email || complaint.email} />
                        <Info label="Mobile" value={reporter?.mobileNo || "Not available"} />
                        <Info label="City" value={reporter?.city || "Not available"} />
                    </Section>

                    {/* Incident Info */}
                    <Section title="Incident Details">
                        <Info
                            label="Filed On"
                            value={new Date(complaint.createdAt).toLocaleString()}
                        />

                        <div style={{ marginTop: 8 }}>
                            <div style={styles.label}>Description</div>
                            <div style={styles.description}>
                                {complaint.description || "No description provided."}
                            </div>
                        </div>
                    </Section>

                    {/* Evidence */}
                    {complaint.file && (
                        <Section title="Attached Evidence">
                            <a
                                href={`${API_BASE_URL}/uploads/${String(complaint.file).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.link}
                            >
                                📎 View Uploaded File
                            </a>
                        </Section>
                    )}
                </div>

                {/* ================= Investigator Actions ================= */}
                <div style={styles.card}>
                    <h3 style={{ marginBottom: 16 }}>Investigator Actions</h3>

                    {complaint.status === "Assigned" && (
                        <button
                            onClick={openCase}
                            disabled={saving}
                            style={styles.primaryBtn}
                        >
                            {saving ? "Opening…" : "Open Case"}
                        </button>
                    )}

                    {complaint.status === "Open" && (
                        <>
                            <label style={styles.label}>Final Solution / Remarks</label>

                            <textarea
                                rows={4}
                                value={solution}
                                onChange={(e) => setSolution(e.target.value)}
                                style={styles.textarea}
                                placeholder="Enter investigation findings and final solution"
                            />

                            <button
                                onClick={resolveCase}
                                disabled={saving}
                                style={styles.primaryBtn}
                            >
                                {saving ? "Resolving…" : "Resolve Case"}
                            </button>
                        </>
                    )}

                    {(complaint.status === "Resolved" ||
                        complaint.status === "Closed") && (
                            <div style={styles.readOnly}>
                                This case is already <strong>{complaint.status}</strong>.
                                No further action allowed.
                            </div>
                        )}
                </div>

            </div>
        </div>
    );
}

/* ---------------- Small Components ---------------- */

const Section = ({ title, children }) => (
    <div style={{ marginBottom: 20 }}>
        <h4 style={styles.sectionTitle}>{title}</h4>
        {children}
    </div>
);

const Info = ({ label, value }) => (
    <p style={styles.infoRow}>
        <strong>{label}:</strong> {value}
    </p>
);

/* ---------------- Helpers ---------------- */

const getStatusColor = (status) => {
    switch (status) {
        case "Assigned":
            return "rgba(245, 158, 11, 0.2)";
        case "Open":
            return "rgba(58, 163, 255, 0.2)";
        case "Resolved":
            return "rgba(34, 197, 94, 0.2)";
        case "Closed":
            return "rgba(100, 116, 139, 0.2)";
        default:
            return "rgba(100, 116, 139, 0.2)";
    }
};

/* ---------------- Styles ---------------- */

const styles = {
    page: {
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        padding: "40px 20px",
    },

    backRow: {
        cursor: "pointer",
        color: "var(--mint-600)",
        fontWeight: 600,
        background: "transparent",
        border: "none",
        padding: 0,
        fontSize: 14,
    },

    container: {
        maxWidth: 1000,
        margin: "0 auto",
    },

    heading: {
        fontSize: 28,
        fontWeight: 700,
        margin: 0,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 6,
    },
    header: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
        flexWrap: "wrap",
        marginBottom: 24,
    },

    card: {
        background: "#fff",
        padding: 28,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
        marginBottom: 28,
    },

    cardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
        flexWrap: "wrap",
        gap: 12,
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    caseFilesBtn: {
        background: "var(--ink-900)",
        color: "#fff",
        padding: "8px 14px",
        borderRadius: 10,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
    },

    id: {
        color: "var(--ink-600)",
        marginTop: 4,
    },

    badge: {
        color: "var(--ink-900)",
        padding: "6px 14px",
        borderRadius: 999,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontSize: 12,
    },

    sectionTitle: {
        fontSize: 16,
        fontWeight: 700,
        marginBottom: 8,
    },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
        color: "var(--ink-700)",
    },

    description: {
        background: "rgba(15,23,42,0.04)",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
        lineHeight: 1.6,
    },

    infoRow: {
        marginBottom: 6,
        color: "var(--ink-700)",
    },

    link: {
        color: "var(--mint-600)",
        fontWeight: 600,
        textDecoration: "none",
    },

    textarea: {
        width: "100%",
        padding: 14,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginBottom: 20,
        resize: "vertical",
    },

    primaryBtn: {
        background: "var(--mint-500)",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
    },

    readOnly: {
        background: "rgba(15,23,42,0.04)",
        padding: 14,
        borderRadius: 12,
        textAlign: "center",
        fontWeight: 600,
        color: "var(--ink-600)",
    },

    center: {
        textAlign: "center",
        marginTop: 40,
        fontWeight: 600,
    },

    error: {
        textAlign: "center",
        marginTop: 40,
        color: "#D32F2F",
        fontWeight: 600,
    },
    toastError: {
        marginBottom: 14,
        background: "rgba(248,113,113,0.15)",
        color: "#b91c1c",
        padding: 12,
        borderRadius: 12,
        fontWeight: 600,
    },
};
