import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

export default function InvestigatorProfile() {
    const email = localStorage.getItem("email");

    const [investigator, setInvestigator] = useState(null);
    const [form, setForm] = useState({
        phone: "",
        address: "",
    });
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const loadProfile = useCallback(async () => {
        try {
            const res = await axios.get(
                `http://localhost:7000/api/investigators/by-email/${email}`
            );

            setInvestigator(res.data);
            setForm({
                phone: res.data.phone || "",
                address: res.data.address || "",
            });
        } catch (err) {
            console.error("Failed to load profile", err);
        }
    }, [email]);

    useEffect(() => {
        loadProfile();
    }, [loadProfile]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        if (!investigator) return;

        setSaving(true);
        setMessage("");

        try {
            await axios.put(
                `http://localhost:7000/api/investigators/${investigator._id}`,
                {
                    phone: form.phone,
                    address: form.address,
                }
            );

            setMessage("Profile updated successfully");
            loadProfile();
        } catch (err) {
            setMessage("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    if (!investigator) {
        return <p style={{ textAlign: "center", marginTop: 40 }}>Loading profile…</p>;
    }

    return (
        <div style={styles.page}>
            <div style={styles.container}>

                {/* HEADER */}
                <div style={styles.headerCard}>
                    <div>
                        <h2 style={styles.name}>{investigator.name}</h2>
                        <p style={styles.sub}>
                            {investigator.department} • {investigator.designation}
                        </p>
                    </div>

                    <div style={styles.idBox}>
                        <span style={styles.idLabel}>Investigator ID</span>
                        <strong>{investigator.investigatorId}</strong>
                    </div>
                </div>

                {/* DETAILS GRID */}
                <div style={styles.grid}>

                    {/* READ-ONLY INFO */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Official Information</h3>

                        <Info label="Email" value={investigator.email} />
                        <Info label="Status" value={investigator.status} />
                        <Info
                            label="Date Joined"
                            value={new Date(investigator.dateJoined).toLocaleDateString()}
                        />
                    </div>

                    {/* EDITABLE INFO */}
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Personal Details</h3>

                        <div style={styles.field}>
                            <label>Mobile Number</label>
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                style={styles.input}
                            />
                        </div>

                        <div style={styles.field}>
                            <label>Address / Location</label>
                            <textarea
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                style={styles.textarea}
                            />
                        </div>

                        {message && <p style={styles.message}>{message}</p>}

                        <button
                            onClick={handleSave}
                            disabled={saving}
                            style={styles.primaryBtn}
                        >
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

/* ---------------- Small Component ---------------- */

const Info = ({ label, value }) => (
    <div style={styles.infoRow}>
        <span style={styles.infoLabel}>{label}</span>
        <span style={styles.infoValue}>{value}</span>
    </div>
);

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background: "#F4F6FF",
        minHeight: "100vh",
        padding: 30,
    },
    container: {
        maxWidth: 1000,
        margin: "0 auto",
    },

    headerCard: {
        background: "linear-gradient(135deg, #4A6EFF, #304FFE)",
        padding: 26,
        borderRadius: 18,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
    },

    name: { fontSize: 26, fontWeight: 700 },
    sub: { opacity: 0.9 },

    idBox: {
        background: "rgba(255,255,255,0.2)",
        padding: "10px 16px",
        borderRadius: 12,
        textAlign: "center",
    },
    idLabel: { fontSize: 12, opacity: 0.85 },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
    },

    card: {
        background: "#fff",
        padding: 24,
        borderRadius: 16,
        boxShadow: "0 6px 20px rgba(0,0,0,0.08)",
    },

    cardTitle: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 16,
    },

    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        padding: "8px 0",
        borderBottom: "1px solid #eee",
    },
    infoLabel: { color: "#666", fontWeight: 600 },
    infoValue: { fontWeight: 600 },

    field: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 14,
    },

    input: {
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginTop: 6,
    },

    textarea: {
        padding: 12,
        borderRadius: 10,
        border: "1px solid #CCC",
        marginTop: 6,
        resize: "vertical",
    },

    message: {
        marginTop: 10,
        fontWeight: 600,
        color: "#2E7D32",
    },

    primaryBtn: {
        marginTop: 14,
        background: "#304FFE",
        color: "#fff",
        padding: "12px",
        borderRadius: 10,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
    },
};
