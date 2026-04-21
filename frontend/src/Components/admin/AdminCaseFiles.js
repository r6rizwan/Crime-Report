import React, { useEffect, useState } from "react";
import api, { API_BASE_URL } from "../../utils/api";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminCaseFiles() {
    const { complaintId } = useParams();
    const navigate = useNavigate();

    const [caseFile, setCaseFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchCaseFiles();
        // eslint-disable-next-line
    }, []);

    const fetchCaseFiles = async () => {
        try {
            const res = await api.get(
                `/api/case-files/${complaintId}`
            );
            setCaseFile(res.data);
        } catch (err) {
            setError("No case files available for this complaint.");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <p style={styles.center}>Loading case files...</p>;
    }

    if (error) {
        return <p style={styles.error}>{error}</p>;
    }

    return (
        <div style={styles.page}>
            {/* Back */}
            <button onClick={() => navigate(-1)} style={styles.backBtn}>
                ← Back
            </button>

            <p style={styles.eyebrow}>Investigation Workspace</p>
            <h2 style={styles.heading}>Internal Notes & Evidence</h2>
            <p style={styles.helper}>
                This section is for admin review of the investigator’s internal notes and uploaded evidence.
                Public progress updates are shown on the complaint details screen.
            </p>

            <div style={styles.card}>
                <p style={styles.meta}>
                    <strong>Investigator:</strong> {caseFile.investigatorEmail}
                </p>

                <p style={styles.meta}>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(caseFile.updatedAt).toLocaleString()}
                </p>

                <h3 style={styles.subTitle}>Internal Notes</h3>
                <div style={styles.notesBox}>
                    {caseFile.notes || "No notes added"}
                </div>

                <h3 style={{ ...styles.subTitle, marginTop: 20 }}>
                    Evidence Files
                </h3>

                {caseFile.files.length === 0 ? (
                    <p>No files uploaded</p>
                ) : (
                    caseFile.files.map((file, index) => (
                        <a
                            key={index}
                            href={`${API_BASE_URL}/uploads/${String(file.filename).replace(/\\/g, "/").replace(/^\/+/, "")}`}
                            target="_blank"
                            rel="noreferrer"
                            style={styles.fileLink}
                        >
                            📎 {file.filename}
                        </a>
                    ))
                )}
            </div>
        </div>
    );
}

/* Styles (temporary) */
const styles = {
    page: {
        maxWidth: 900,
        margin: "0 auto",
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
        marginBottom: 8,
    },
    helper: {
        color: "var(--ink-600)",
        marginBottom: 20,
        lineHeight: 1.6,
    },
    subTitle: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 8,
    },
    card: {
        background: "#fff",
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
    },
    notesBox: {
        background: "#F3F4FF",
        padding: 14,
        borderRadius: 10,
        border: "1px solid #E0E7FF",
        lineHeight: 1.6,
    },
    fileLink: {
        display: "block",
        marginTop: 8,
        color: "#304FFE",
        fontWeight: 600,
        textDecoration: "none",
    },
    meta: {
        color: "#555",
        marginBottom: 6,
    },
    backBtn: {
        background: "transparent",
        border: "none",
        color: "#304FFE",
        fontWeight: 600,
        cursor: "pointer",
        marginBottom: 15,
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
};
