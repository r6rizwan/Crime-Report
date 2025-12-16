// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Link, useParams, useNavigate } from "react-router-dom";

// export default function InvestigatorUpdateStatus() {
//     const { id } = useParams();
//     const navigate = useNavigate();

//     const [complaint, setComplaint] = useState(null);
//     const [solution, setSolution] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [saving, setSaving] = useState(false);
//     const [error, setError] = useState("");

//     useEffect(() => {
//         const fetchComplaint = async () => {
//             try {
//                 const res = await axios.get(
//                     `http://localhost:7000/api/complaint/${id}`
//                 );
//                 setComplaint(res.data);
//                 setSolution(res.data.solution || "");
//             } catch {
//                 setError("Failed to load complaint details.");
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchComplaint();
//     }, [id]);

//     /* ---------------- ACTIONS ---------------- */

//     const openCase = async () => {
//         setSaving(true);
//         try {
//             await axios.put(
//                 `http://localhost:7000/api/complaint/${id}/open`
//             );
//             navigate("/investigator/assigned");
//         } catch {
//             alert("Failed to open case");
//         } finally {
//             setSaving(false);
//         }
//     };

//     const resolveCase = async () => {
//         if (!solution.trim()) {
//             alert("Solution is required to resolve the case");
//             return;
//         }

//         setSaving(true);
//         try {
//             await axios.put(
//                 `http://localhost:7000/api/complaint/${id}/resolve`,
//                 { solution }
//             );
//             navigate("/investigator/assigned");
//         } catch {
//             alert("Failed to resolve case");
//         } finally {
//             setSaving(false);
//         }
//     };

//     /* ---------------- UI ---------------- */

//     if (loading) return <p style={styles.center}>Loading…</p>;
//     if (error) return <p style={styles.error}>{error}</p>;

//     return (
//         <div style={styles.page}>
//             <h2 style={styles.heading}>Complaint Details</h2>

//             {/* SUMMARY */}
//             <div style={styles.card}>
//                 <div style={styles.header}>
//                     <div>
//                         <h3>{complaint.complaintType}</h3>
//                         <p style={styles.id}>ID: {complaint.complaintId}</p>
//                     </div>

//                     <div style={styles.headerActions}>
//                         <Link
//                             to={`/investigator/case-files/${complaint._id}`}
//                             style={styles.caseFilesBtn}
//                         >
//                             📁 Case Files & Notes
//                         </Link>

//                         <span
//                             style={{
//                                 ...styles.badge,
//                                 background: getStatusColor(complaint.status),
//                             }}
//                         >
//                             {complaint.status}
//                         </span>
//                     </div>
//                 </div>

//                 <p style={styles.label}>Description</p>
//                 <div style={styles.box}>{complaint.description}</div>

//                 <p style={styles.meta}>
//                     Filed on: {new Date(complaint.createdAt).toLocaleString()}
//                 </p>

//                 {complaint.file && (
//                     <a
//                         href={`http://localhost:7000/${complaint.file}`}
//                         target="_blank"
//                         rel="noreferrer"
//                         style={styles.link}
//                     >
//                         📎 View Attached Evidence
//                     </a>
//                 )}
//             </div>

//             {/* ACTIONS */}
//             <div style={styles.card}>
//                 {complaint.status === "Assigned" && (
//                     <button
//                         onClick={openCase}
//                         disabled={saving}
//                         style={styles.primaryBtn}
//                     >
//                         {saving ? "Opening…" : "Open Case"}
//                     </button>
//                 )}

//                 {complaint.status === "Open" && (
//                     <>
//                         <p style={styles.label}>Solution / Final Remarks</p>
//                         <textarea
//                             rows={4}
//                             value={solution}
//                             onChange={(e) => setSolution(e.target.value)}
//                             style={styles.textarea}
//                             placeholder="Enter investigation findings and solution"
//                         />

//                         <button
//                             onClick={resolveCase}
//                             disabled={saving}
//                             style={styles.primaryBtn}
//                         >
//                             {saving ? "Resolving…" : "Resolve Case"}
//                         </button>
//                     </>
//                 )}

//                 {(complaint.status === "Resolved" ||
//                     complaint.status === "Closed") && (
//                         <p style={styles.readOnly}>
//                             This case is already {complaint.status}. No further action
//                             allowed.
//                         </p>
//                     )}
//             </div>
//         </div>
//     );
// }

// /* ---------------- HELPERS ---------------- */

// const getStatusColor = (status) => {
//     switch (status) {
//         case "Assigned":
//             return "#3F51B5";
//         case "Open":
//             return "#0288D1";
//         case "Resolved":
//             return "#2E7D32";
//         case "Closed":
//             return "#616161";
//         default:
//             return "#777";
//     }
// };

// /* ---------------- STYLES ---------------- */

// const styles = {
//     page: { maxWidth: 900, margin: "0 auto" },
//     heading: { fontSize: 26, fontWeight: 700, marginBottom: 20 },

//     card: {
//         background: "#fff",
//         padding: 25,
//         borderRadius: 16,
//         boxShadow: "0 4px 18px rgba(0,0,0,0.08)",
//         marginBottom: 25,
//     },

//     header: {
//         display: "flex",
//         justifyContent: "space-between",
//         alignItems: "center",
//         marginBottom: 16,
//     },

//     headerActions: {
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//     },

//     caseFilesBtn: {
//         background: "#1C2F57",
//         color: "#fff",
//         padding: "6px 12px",
//         borderRadius: 8,
//         fontSize: 14,
//         fontWeight: 600,
//         textDecoration: "none",
//     },

//     id: { color: "#666", marginTop: 4 },

//     badge: {
//         color: "#fff",
//         padding: "6px 14px",
//         borderRadius: 10,
//         fontWeight: 600,
//     },

//     label: { fontWeight: 600, marginBottom: 6 },

//     box: {
//         background: "#F3F4FF",
//         padding: 12,
//         borderRadius: 10,
//         border: "1px solid #E0E7FF",
//         marginBottom: 14,
//     },

//     meta: { color: "#666", fontSize: 14, marginTop: 10 },

//     link: {
//         display: "inline-block",
//         marginTop: 12,
//         color: "#304FFE",
//         fontWeight: 600,
//         textDecoration: "none",
//     },

//     textarea: {
//         width: "100%",
//         padding: 12,
//         borderRadius: 10,
//         border: "1px solid #D1D5E2",
//         marginBottom: 20,
//         resize: "vertical",
//     },

//     primaryBtn: {
//         background: "#304FFE",
//         color: "#fff",
//         border: "none",
//         padding: "12px 20px",
//         borderRadius: 10,
//         fontWeight: 700,
//         cursor: "pointer",
//         width: "100%",
//     },

//     readOnly: {
//         color: "#555",
//         fontWeight: 600,
//         textAlign: "center",
//     },

//     center: { textAlign: "center", marginTop: 40, fontWeight: 600 },
//     error: { textAlign: "center", marginTop: 40, color: "#D32F2F" },
// };


import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useParams, useNavigate } from "react-router-dom";

export default function InvestigatorUpdateStatus() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [solution, setSolution] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchComplaint = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/complaint/${id}`
                );
                setComplaint(res.data);
                setSolution(res.data.solution || "");
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
        setSaving(true);
        try {
            await axios.put(
                `http://localhost:7000/api/complaint/${id}/open`
            );
            navigate("/investigator/assigned");
        } catch {
            alert("Failed to open case");
        } finally {
            setSaving(false);
        }
    };

    const resolveCase = async () => {
        if (!solution.trim()) {
            alert("Solution is required to resolve the case");
            return;
        }

        setSaving(true);
        try {
            await axios.put(
                `http://localhost:7000/api/complaint/${id}/resolve`,
                { solution }
            );
            navigate("/investigator/assigned");
        } catch {
            alert("Failed to resolve case");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p style={styles.center}>Loading…</p>;
    if (error) return <p style={styles.error}>{error}</p>;

    return (
        <div style={styles.page}>
            {/* Back */}
            <div
                style={styles.backRow}
                onClick={() => navigate("/investigator/assigned")}
            >
                ← Back to Complaints
            </div>

            <div style={styles.container}>

                <h2 style={styles.heading}>Complaint Details</h2>

                {/* ================= Complaint Details ================= */}
                <div style={styles.card}>

                    {/* Header */}
                    <div style={styles.header}>
                        <div>
                            <h3>{complaint.complaintType}</h3>
                            <p style={styles.id}>Complaint ID: {complaint.complaintId}</p>
                        </div>

                        <div style={styles.headerActions}>
                            <Link
                                to={`/investigator/case-files/${complaint._id}`}
                                style={styles.caseFilesBtn}
                            >
                                📁 Case Files & Notes
                            </Link>

                            <span
                                style={{
                                    ...styles.badge,
                                    background: getStatusColor(complaint.status),
                                }}
                            >
                                {complaint.status}
                            </span>
                        </div>
                    </div>

                    {/* Complainant Info */}
                    <Section title="Complainant Information">
                        <Info label="Email" value={complaint.email} />
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
                                href={`http://localhost:7000/${complaint.file}`}
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
            return "#3F51B5";
        case "Open":
            return "#0288D1";
        case "Resolved":
            return "#2E7D32";
        case "Closed":
            return "#616161";
        default:
            return "#777";
    }
};

/* ---------------- Styles ---------------- */

const styles = {
    page: {
        background: "#F3F5FA",
        minHeight: "100vh",
        padding: "40px 20px",
    },

    container: {
        maxWidth: 1000,
        margin: "0 auto",
    },

    heading: {
        fontSize: 28,
        fontWeight: 700,
        marginBottom: 24,
    },

    card: {
        background: "#fff",
        padding: 28,
        borderRadius: 18,
        boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
        marginBottom: 28,
    },

    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 20,
    },

    headerActions: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },

    caseFilesBtn: {
        background: "#1C2F57",
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 8,
        fontSize: 14,
        fontWeight: 600,
        textDecoration: "none",
    },

    id: {
        color: "#666",
        marginTop: 4,
    },

    badge: {
        color: "#fff",
        padding: "6px 14px",
        borderRadius: 10,
        fontWeight: 600,
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
    },

    description: {
        background: "#F3F4FF",
        padding: 14,
        borderRadius: 10,
        border: "1px solid #E0E7FF",
        lineHeight: 1.6,
    },

    infoRow: {
        marginBottom: 6,
        color: "#333",
    },

    link: {
        color: "#304FFE",
        fontWeight: 600,
        textDecoration: "none",
    },

    textarea: {
        width: "100%",
        padding: 14,
        borderRadius: 10,
        border: "1px solid #D1D5E2",
        marginBottom: 20,
        resize: "vertical",
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        border: "none",
        padding: "12px 20px",
        borderRadius: 10,
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
    },

    readOnly: {
        background: "#F3F4FF",
        padding: 14,
        borderRadius: 10,
        textAlign: "center",
        fontWeight: 600,
        color: "#555",
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
