import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";

export default function InvestigatorCaseFiles() {
    const { complaintId } = useParams();
    const navigate = useNavigate();
    const investigatorEmail = localStorage.getItem("email");

    const [caseFile, setCaseFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [files, setFiles] = useState([]);
    const [publicStatus, setPublicStatus] = useState("");
    const [publicUpdate, setPublicUpdate] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCaseFiles();
        // eslint-disable-next-line
    }, []);

    const fetchCaseFiles = async () => {
        try {
            const [caseFileRes, complaintRes] = await Promise.allSettled([
                api.get(`/api/case-files/${complaintId}`),
                api.get(`/api/complaint/${complaintId}`),
            ]);

            if (caseFileRes.status === "fulfilled") {
                setCaseFile(caseFileRes.value.data);
                setNotes(caseFileRes.value.data.notes || "");
            }

            if (complaintRes.status === "fulfilled") {
                const update = complaintRes.value.data?.investigationUpdate || {};
                setPublicStatus(update.status || "");
                setPublicUpdate(update.note || "");
            }
        } catch {
            // No case file yet — valid case
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (saving) return;
        if (!notes.trim() && files.length === 0 && !publicStatus.trim() && !publicUpdate.trim()) {
            setError("Add admin notes, public progress, or upload files before saving");
            setTimeout(() => setError(""), 2600);
            return;
        }

        setSaving(true);
        setMessage("");
        setError("");

        const formData = new FormData();
        formData.append("notes", notes);
        formData.append("investigatorEmail", investigatorEmail);
        formData.append("publicStatus", publicStatus);
        formData.append("publicUpdate", publicUpdate);

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const res = await api.post(
                `/api/case-files/${complaintId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setCaseFile(res.data.caseFile);
            setFiles([]);
            setMessage("Case files saved successfully");
            setError("");

            // auto-hide success message
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to save case files");
            setTimeout(() => setError(""), 2600);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.header}>
                <div>
                    <button
                        type="button"
                        onClick={() => navigate(`/investigator/update-status/${complaintId}`)}
                        style={styles.backBtn}
                    >
                        ← Back to Case
                    </button>
                    <p style={styles.eyebrow}>Investigation Workspace</p>
                    <h2 style={styles.heading}>Manage Progress, Notes, and Evidence</h2>
                    <p style={styles.helper}>
                        Keep public progress separate from internal notes so the case stays clear for everyone involved.
                    </p>
                </div>
            </div>

            {message && <div style={styles.success}>{message}</div>}
            {error && <div style={styles.error}>{error}</div>}

            {caseFile && (
                <div style={styles.card}>
                    <p style={styles.sectionEyebrow}>Internal Workspace</p>
                    <h3 style={styles.sectionTitle}>Current Admin-Only Notes & Evidence</h3>
                    <p style={styles.sectionText}>
                        These notes and files are for internal case handling. They are visible to investigators and admin only.
                    </p>

                    <div style={styles.notesBlock}>
                        <h4 style={styles.subheading}>Internal Notes</h4>
                        <div style={styles.notesBox}>
                            {caseFile.notes || "No internal notes added yet."}
                        </div>
                    </div>

                    <div style={styles.notesBlock}>
                        <h4 style={styles.subheading}>Evidence Files</h4>

                        {caseFile.files?.length === 0 ? (
                            <p style={{ color: "var(--ink-600)" }}>No evidence files uploaded yet.</p>
                        ) : (
                            caseFile.files.map((f, i) => (
                                <a
                                    key={i}
                                    href={`${API_BASE_URL}/uploads/${String(f.filename).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={styles.fileLink}
                                >
                                    {f.filename}
                                </a>
                            ))
                        )}
                    </div>

                    <p style={styles.meta}>
                        Last internal update:{" "}
                        {new Date(caseFile.updatedAt).toLocaleString()}
                    </p>
                </div>
            )}

            <div style={styles.card}>
                <p style={styles.sectionEyebrow}>Update Workspace</p>
                <h3 style={styles.sectionTitle}>Public Progress + Internal Evidence</h3>
                <p style={styles.sectionText}>
                    Use the public section to update the complainant and admin. Use the internal section for detailed notes and evidence.
                </p>

                <div style={styles.publicCard}>
                    <p style={styles.publicEyebrow}>Visible to User, Admin, and Investigator</p>
                    <h4 style={styles.publicTitle}>Public Investigation Progress</h4>
                    <p style={styles.publicText}>
                        Share a simple progress update like “Reviewing evidence” or
                        “Contacted the complainant” so the case status feels active and transparent.
                    </p>

                    <input
                        type="text"
                        value={publicStatus}
                        onChange={(e) => setPublicStatus(e.target.value)}
                        placeholder="Progress status (e.g. Reviewing evidence)"
                        style={styles.input}
                    />

                    <textarea
                        rows="3"
                        value={publicUpdate}
                        onChange={(e) => setPublicUpdate(e.target.value)}
                        placeholder="Short public update visible to the complainant and admin"
                        style={styles.textarea}
                    />
                </div>

                <div style={styles.internalCard}>
                    <p style={styles.internalEyebrow}>Visible to Admin and Investigator</p>
                    <h4 style={styles.internalTitle}>Internal Notes & Evidence</h4>
                    <p style={styles.internalText}>
                        Add detailed investigation notes, findings, and upload evidence or supporting records here.
                    </p>

                    <textarea
                        rows="4"
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Write internal investigation notes here..."
                        style={styles.textarea}
                    />

                    <input
                        type="file"
                        multiple
                        onChange={(e) => setFiles(Array.from(e.target.files))}
                        style={styles.fileInput}
                    />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={styles.btn}
                >
                    {saving ? "Saving..." : "Save Workspace Update"}
                </button>
            </div>

            <div style={{ height: 40 }} />
        </div>
    );
}

/* Styles (temporary – we’ll refactor later) */
const styles = {
    page: {
        maxWidth: 900,
        margin: "0 auto",
        paddingBottom: 40,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-end",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 16,
    },
    backBtn: {
        background: "transparent",
        border: "none",
        color: "var(--mint-600)",
        fontWeight: 700,
        cursor: "pointer",
        marginBottom: 10,
        padding: 0,
        fontSize: 14,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 8,
    },
    heading: {
        fontSize: 26,
        fontWeight: 700,
        margin: 0,
    },
    helper: {
        color: "var(--ink-600)",
        marginTop: 8,
        fontSize: 14,
        maxWidth: 700,
    },
    sectionEyebrow: {
        margin: 0,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: "var(--mint-600)",
        fontWeight: 700,
    },
    sectionTitle: {
        margin: "8px 0 6px",
        fontSize: 22,
        fontWeight: 700,
    },
    sectionText: {
        margin: "0 0 16px",
        color: "var(--ink-600)",
        lineHeight: 1.6,
        fontSize: 14,
    },
    publicCard: {
        marginBottom: 18,
        padding: 18,
        borderRadius: 16,
        background: "linear-gradient(180deg, #f8fcfb 0%, #f3f7ff 100%)",
        border: "1px solid rgba(26,167,155,0.18)",
    },
    internalCard: {
        marginBottom: 18,
        padding: 18,
        borderRadius: 16,
        background: "rgba(15,23,42,0.03)",
        border: "1px solid rgba(15,23,42,0.08)",
    },
    publicEyebrow: {
        margin: 0,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: "var(--mint-600)",
        fontWeight: 700,
    },
    publicTitle: {
        margin: "8px 0 6px",
        fontSize: 18,
        fontWeight: 700,
    },
    publicText: {
        margin: "0 0 14px",
        color: "var(--ink-600)",
        fontSize: 14,
        lineHeight: 1.6,
    },
    internalEyebrow: {
        margin: 0,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.22em",
        color: "var(--ink-600)",
        fontWeight: 700,
    },
    internalTitle: {
        margin: "8px 0 6px",
        fontSize: 18,
        fontWeight: 700,
    },
    internalText: {
        margin: "0 0 14px",
        color: "var(--ink-600)",
        fontSize: 14,
        lineHeight: 1.6,
    },
    card: {
        background: "#fff",
        padding: 25,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
        marginBottom: 25,
    },
    input: {
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginBottom: 12,
        background: "rgba(255,255,255,0.92)",
    },
    textarea: {
        width: "100%",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginBottom: 15,
        resize: "vertical",
    },
    fileInput: {
        marginBottom: 15,
    },
    btn: {
        background: "var(--mint-500)",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
    },
    notesBox: {
        background: "rgba(15,23,42,0.04)",
        padding: 12,
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.08)",
        marginBottom: 10,
    },
    notesBlock: {
        marginTop: 18,
    },
    subheading: {
        margin: "0 0 8px",
        fontSize: 16,
        fontWeight: 700,
    },
    fileLink: {
        display: "block",
        marginTop: 8,
        color: "var(--mint-600)",
        fontWeight: 600,
        textDecoration: "none",
    },
    meta: {
        marginTop: 12,
        fontSize: 13,
        color: "var(--ink-600)",
    },
    success: {
        background: "rgba(34,197,94,0.12)",
        padding: 12,
        borderRadius: 12,
        color: "#15803d",
        fontWeight: 600,
        marginBottom: 20,
    },
    error: {
        background: "rgba(248,113,113,0.15)",
        padding: 12,
        borderRadius: 12,
        color: "#b91c1c",
        fontWeight: 600,
        marginBottom: 20,
    },
};
