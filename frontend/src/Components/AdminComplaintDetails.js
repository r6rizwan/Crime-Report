import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function AdminComplaintDetails() {
    const { id } = useParams();

    const [complaint, setComplaint] = useState(null);
    const [investigators, setInvestigators] = useState([]);
    const [selectedOfficer, setSelectedOfficer] = useState("");
    const [solution, setSolution] = useState("");
    const [message, setMessage] = useState("");

    const fetchComplaint = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:7000/api/complaint/${id}`
            );
            setComplaint(res.data);
        } catch (err) {
            console.error("Failed to load complaint:", err);
        }
    }, [id]);

    const fetchInvestigators = useCallback(async () => {
        try {
            const res = await axios.get(
                "http://localhost:7000/api/investigators"
            );
            setInvestigators(res.data);
        } catch (err) {
            console.error("Failed to load investigators:", err);
        }
    }, []);

    useEffect(() => {
        fetchComplaint();
        fetchInvestigators();
    }, [fetchComplaint, fetchInvestigators]);

    const assignOfficer = async () => {
        if (!selectedOfficer) return alert("Select an investigator");

        try {
            await axios.put(
                `http://localhost:7000/api/complaint/${id}/assign`,
                { assignedTo: selectedOfficer }
            );

            setMessage("Officer assigned successfully!");
            fetchComplaint();
        } catch (err) {
            console.error(err);
        }
    };

    const addSolutionHandler = async () => {
        if (!solution.trim()) return alert("Enter the solution");

        try {
            await axios.put(
                `http://localhost:7000/api/complaint/${id}/solution`,
                { solution }
            );

            setMessage("Solution added. Complaint marked resolved.");
            fetchComplaint();
        } catch (err) {
            console.error(err);
        }
    };

    if (!complaint) {
        return (
            <div style={styles.loadingWrap}>
                <div style={styles.loader}></div>
                <p style={{ marginTop: 10 }}>Loading Complaint…</p>
            </div>
        );
    }

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>Complaint Details</h2>

            {message && <div style={styles.alert}>{message}</div>}

            <div style={styles.layout}>

                {/* LEFT CARD */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Complaint Information</h3>

                    <div style={styles.infoGroup}>
                        <label>Complaint ID</label>
                        <p>{complaint.complaintId}</p>
                    </div>

                    <div style={styles.infoGroup}>
                        <label>Type</label>
                        <p>{complaint.complaintType}</p>
                    </div>

                    <div style={styles.infoGroup}>
                        <label>Status</label>
                        <span
                            style={{
                                ...styles.badge,
                                background: "#304FFE",
                            }}
                        >
                            {complaint.status}
                        </span>
                    </div>

                    <div style={styles.infoGroup}>
                        <label>Date Filed</label>
                        <p>{new Date(complaint.createdAt).toLocaleDateString()}</p>
                    </div>

                    <div style={styles.infoGroup}>
                        <label>Description</label>
                        <p style={styles.desc}>{complaint.description}</p>
                    </div>

                    {complaint.file && (
                        <div style={styles.infoGroup}>
                            <label>Attachment</label>
                            <a
                                href={`http://localhost:7000/uploads/${complaint.file}`}
                                target="_blank"
                                rel="noreferrer"
                                style={styles.fileLink}
                            >
                                View File
                            </a>
                        </div>
                    )}
                </div>

                {/* RIGHT CARD */}
                <div style={styles.card}>
                    <h3 style={styles.cardTitle}>Assign Investigator</h3>

                    <select
                        style={styles.input}
                        value={selectedOfficer}
                        onChange={(e) => setSelectedOfficer(e.target.value)}
                    >
                        <option value="">Select Investigator</option>
                        {investigators.map((i) => (
                            <option key={i._id} value={i.email}>
                                {i.name} — {i.department}
                            </option>
                        ))}
                    </select>

                    <button style={styles.primaryBtn} onClick={assignOfficer}>
                        Assign Officer
                    </button>

                    <h3 style={{ ...styles.cardTitle, marginTop: 25 }}>
                        Add Solution
                    </h3>

                    <textarea
                        style={styles.textArea}
                        rows="4"
                        placeholder="Enter solution or remarks"
                        value={solution}
                        onChange={(e) => setSolution(e.target.value)}
                    />

                    <button style={styles.successBtn} onClick={addSolutionHandler}>
                        Submit Solution
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    page: {
        padding: "35px",
        background: "#F3F5FA",
        minHeight: "100vh",
        fontFamily: "Inter, sans-serif",
    },
    heading: {
        fontSize: 28,
        fontWeight: "700",
        marginBottom: 20,
    },
    alert: {
        background: "#D1F5DA",
        padding: 15,
        borderRadius: 10,
        color: "#145A32",
        fontWeight: "600",
        marginBottom: 25,
    },
    layout: {
        display: "flex",
        gap: 25,
    },
    card: {
        flex: 1,
        background: "#fff",
        padding: 25,
        borderRadius: 16,
        boxShadow: "0 8px 25px rgba(0,0,0,0.07)",
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 18,
    },
    infoGroup: {
        marginBottom: 14,
    },
    desc: {
        marginTop: 6,
        lineHeight: 1.6,
    },
    badge: {
        display: "inline-block",
        padding: "6px 14px",
        borderRadius: 8,
        color: "#fff",
        fontWeight: "600",
    },
    input: {
        width: "100%",
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid #CCC",
        marginBottom: 15,
        fontSize: 15,
    },
    textArea: {
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginBottom: 12,
        resize: "none",
    },
    primaryBtn: {
        width: "100%",
        padding: 12,
        background: "#304FFE",
        borderRadius: 10,
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
        border: "none",
        cursor: "pointer",
    },
    successBtn: {
        width: "100%",
        padding: 12,
        background: "#00A86B",
        borderRadius: 10,
        color: "#fff",
        fontWeight: "600",
        fontSize: 15,
        border: "none",
        cursor: "pointer",
    },

    /* Loader */
    loadingWrap: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        paddingTop: 100,
    },
    loader: {
        width: 40,
        height: 40,
        border: "5px solid #CCC",
        borderTop: "5px solid #304FFE",
        borderRadius: "50%",
        animation: "spin 1s linear infinite",
    },
};
