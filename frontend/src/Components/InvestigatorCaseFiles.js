import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function InvestigatorCaseFiles() {
    const { complaintId } = useParams();
    const investigatorEmail = localStorage.getItem("email");

    const [caseFile, setCaseFile] = useState(null);
    const [notes, setNotes] = useState("");
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchCaseFiles();
        // eslint-disable-next-line
    }, []);

    const fetchCaseFiles = async () => {
        try {
            const res = await axios.get(
                `http://localhost:7000/api/case-files/${complaintId}`
            );
            setCaseFile(res.data);
            setNotes(res.data.notes || "");
        } catch {
            // No case file yet — valid case
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        if (!notes.trim() && files.length === 0) {
            alert("Please add notes or upload files");
            return;
        }

        setSaving(true);
        setMessage("");

        const formData = new FormData();
        formData.append("notes", notes);
        formData.append("investigatorEmail", investigatorEmail);

        files.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const res = await axios.post(
                `http://localhost:7000/api/case-files/${complaintId}`,
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );

            setCaseFile(res.data.caseFile);
            setFiles([]);
            setMessage("Case files saved successfully");

            // auto-hide success message
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            alert(err.response?.data?.error || "Failed to save case files");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p style={{ textAlign: "center", marginTop: 40 }}>Loading...</p>;
    }

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>📁 Case Files & Investigation Notes</h2>

            <p style={styles.helper}>
                Visible to <strong>Admin</strong> only. Not visible to users.
            </p>

            {message && <div style={styles.success}>{message}</div>}

            {/* Existing Case File */}
            {caseFile && (
                <div style={styles.card}>
                    <h3>Existing Notes</h3>

                    <div style={styles.notesBox}>
                        {caseFile.notes || "No notes added yet"}
                    </div>

                    <h4 style={{ marginTop: 20 }}>Uploaded Files</h4>

                    {caseFile.files?.length === 0 ? (
                        <p style={{ color: "#777" }}>No files uploaded</p>
                    ) : (
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
                        ))
                    )}

                    <p style={styles.meta}>
                        Last updated:{" "}
                        {new Date(caseFile.updatedAt).toLocaleString()}
                    </p>
                </div>
            )}

            {/* Add / Update Section */}
            <div style={styles.card}>
                <h3>Add / Update Case Notes</h3>

                <textarea
                    rows="4"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write investigation notes here..."
                    style={styles.textarea}
                />

                <input
                    type="file"
                    multiple
                    onChange={(e) => setFiles(Array.from(e.target.files))}
                    style={styles.fileInput}
                />

                <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={styles.btn}
                >
                    {saving ? "Saving..." : "Save Case Files"}
                </button>
            </div>

            {/* bottom spacing */}
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
    heading: {
        fontSize: 26,
        fontWeight: 700,
        marginBottom: 6,
    },
    helper: {
        color: "#555",
        marginBottom: 20,
        fontSize: 14,
    },
    card: {
        background: "#fff",
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
        marginBottom: 25,
    },
    textarea: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginBottom: 15,
        resize: "vertical",
    },
    fileInput: {
        marginBottom: 15,
    },
    btn: {
        background: "#304FFE",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 700,
        cursor: "pointer",
    },
    notesBox: {
        background: "#F3F4FF",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #E0E7FF",
        marginBottom: 10,
    },
    fileLink: {
        display: "block",
        marginTop: 8,
        color: "#304FFE",
        fontWeight: 600,
        textDecoration: "none",
    },
    meta: {
        marginTop: 12,
        fontSize: 13,
        color: "#666",
    },
    success: {
        background: "#D1F5DA",
        padding: 12,
        borderRadius: 10,
        color: "#145A32",
        fontWeight: 600,
        marginBottom: 20,
    },
};
