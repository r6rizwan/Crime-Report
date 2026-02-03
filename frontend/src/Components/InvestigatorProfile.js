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

                <div style={styles.hero}>
                    <div>
                        <p style={styles.eyebrow}>Investigator Profile</p>
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

                <div style={styles.grid}>
                    <div style={styles.card}>
                        <h3 style={styles.cardTitle}>Official Information</h3>

                        <Info label="Email" value={investigator.email} />
                        <Info label="Status" value={investigator.status} />
                        <Info
                            label="Date Joined"
                            value={new Date(investigator.dateJoined).toLocaleDateString()}
                        />
                    </div>

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
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        padding: 30,
    },
    container: {
        maxWidth: 1000,
        margin: "0 auto",
    },

    hero: {
        background: "#0f172a",
        padding: 26,
        borderRadius: 22,
        color: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 30,
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
        flexWrap: "wrap",
        gap: 16,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 700,
        marginBottom: 10,
    },
    name: { fontSize: 26, fontWeight: 700 },
    sub: { opacity: 0.8 },

    idBox: {
        background: "rgba(255,255,255,0.08)",
        padding: "10px 16px",
        borderRadius: 12,
        textAlign: "center",
    },
    idLabel: { fontSize: 12, opacity: 0.85 },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
    },

    card: {
        background: "#fff",
        padding: 24,
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
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
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },
    infoLabel: { color: "var(--ink-600)", fontWeight: 600 },
    infoValue: { fontWeight: 600, color: "var(--ink-900)" },

    field: {
        display: "flex",
        flexDirection: "column",
        marginBottom: 14,
    },

    input: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginTop: 6,
    },

    textarea: {
        padding: "12px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15,23,42,0.15)",
        marginTop: 6,
        resize: "vertical",
    },

    message: {
        marginTop: 10,
        fontWeight: 600,
        color: "#15803d",
    },

    primaryBtn: {
        marginTop: 14,
        background: "var(--mint-500)",
        color: "#fff",
        padding: "12px",
        borderRadius: 12,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
        width: "100%",
    },
};
