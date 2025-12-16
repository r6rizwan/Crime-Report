import React, { useEffect, useState } from "react";
import axios from "axios";

export default function UserProfile() {
    const email = localStorage.getItem("email");

    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        address: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:7000/api/profile/${email}`
                );

                setProfile(res.data);
                setForm({
                    fullName: res.data.fullName || "",
                    phone: res.data.phone || "",
                    address: res.data.address || "",
                });
            } catch (err) {
                console.error(err);
            }
        };

        fetchProfile();
    }, [email]);

    const handleSave = async () => {
        setSaving(true);
        setMessage("");

        try {
            await axios.put(
                `http://localhost:7000/api/profile/${email}`,
                form
            );

            setMessage("Profile updated successfully");
            setEditMode(false);
        } catch {
            setMessage("Failed to update profile");
        } finally {
            setSaving(false);
        }
    };

    useEffect(() => {
        if (!message) return;

        const timer = setTimeout(() => {
            setMessage("");
        }, 3000); //  3 seconds

        return () => clearTimeout(timer);
    }, [message]);

    if (!profile) return <p style={styles.center}>Loading profile…</p>;

    return (
        <div style={styles.page}>
            <h2 style={styles.heading}>My Profile</h2>

            {message && <div style={styles.alert}>{message}</div>}

            <div style={styles.grid}>

                {/* LEFT COLUMN */}
                <div style={styles.card}>
                    <Section title="Basic Information">

                        <Field label="Full Name">
                            <input
                                value={form.fullName}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setForm({ ...form, fullName: e.target.value })
                                }
                                style={styles.input(editMode)}
                            />
                        </Field>

                        <Field label="Email">
                            <input
                                value={profile.email}
                                disabled
                                style={styles.input(false)}
                            />
                        </Field>

                        <Field label="Phone">
                            <input
                                value={form.phone}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setForm({ ...form, phone: e.target.value })
                                }
                                style={styles.input(editMode)}
                            />
                        </Field>

                        <Field label="Address">
                            <textarea
                                rows={2}
                                value={form.address}
                                disabled={!editMode}
                                onChange={(e) =>
                                    setForm({ ...form, address: e.target.value })
                                }
                                style={styles.textarea(editMode)}
                            />
                        </Field>
                    </Section>
                </div>

                {/* RIGHT COLUMN */}
                <div style={styles.card}>
                    <Section title="Personal Information">
                        <ReadOnly label="Gender" value="Not provided" />
                        <ReadOnly label="Education" value="Not provided" />
                    </Section>

                    <Divider />

                    <Section title="Account Information">
                        <Info label="Account Type" value={profile.utype} />
                        <Info
                            label="Registered On"
                            value={new Date(profile.createdAt).toLocaleDateString()}
                        />
                        <Info
                            label="Last Updated"
                            value={new Date(profile.updatedAt).toLocaleDateString()}
                        />
                    </Section>
                </div>
            </div>

            {/* ACTIONS */}
            <div style={styles.actions}>
                {!editMode ? (
                    <button
                        style={styles.primaryBtn}
                        onClick={() => setEditMode(true)}
                    >
                        Edit Profile
                    </button>
                ) : (
                    <>
                        <button
                            style={styles.primaryBtn}
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving ? "Saving…" : "Save Changes"}
                        </button>
                        <button
                            style={styles.secondaryBtn}
                            onClick={() => setEditMode(false)}
                        >
                            Cancel
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

/* ---------- Small Components ---------- */

const Section = ({ title, children }) => (
    <>
        <h3 style={styles.section}>{title}</h3>
        {children}
    </>
);

const Field = ({ label, children }) => (
    <div style={{ marginBottom: 16 }}>
        <label style={styles.label}>{label}</label>
        {children}
    </div>
);

const ReadOnly = ({ label, value }) => (
    <div style={{ marginBottom: 14 }}>
        <label style={styles.label}>{label}</label>
        <div style={styles.readOnly}>{value}</div>
    </div>
);

const Info = ({ label, value }) => (
    <p style={styles.info}>
        <strong>{label}:</strong> {value}
    </p>
);

const Divider = () => (
    <div style={styles.divider} />
);

/* ---------- Styles ---------- */

const styles = {
    page: {
        maxWidth: 1100,
        margin: "0 auto",
        paddingBottom: 60,
    },

    heading: { fontSize: 28, fontWeight: 700, marginBottom: 20 },

    grid: {
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 24,
    },

    card: {
        background: "#fff",
        padding: 28,
        borderRadius: 18,
        boxShadow: "0 6px 22px rgba(0,0,0,0.08)",
    },

    section: {
        fontSize: 18,
        fontWeight: 700,
        marginBottom: 14,
    },

    label: {
        fontWeight: 600,
        marginBottom: 6,
        display: "block",
    },

    input: (editable) => ({
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #D1D5E2",
        background: editable ? "#fff" : "#f3f3f3",
    }),

    textarea: (editable) => ({
        width: "100%",
        padding: 12,
        borderRadius: 10,
        border: "1px solid #D1D5E2",
        background: editable ? "#fff" : "#f3f3f3",
        resize: "none",
    }),

    readOnly: {
        padding: 12,
        borderRadius: 10,
        background: "#f3f3f3",
        color: "#666",
        fontSize: 14,
    },

    info: {
        marginBottom: 8,
        color: "#333",
    },

    divider: {
        height: 1,
        background: "#E5E7EB",
        margin: "22px 0",
    },

    actions: {
        marginTop: 25,
        display: "flex",
        gap: 12,
    },

    primaryBtn: {
        background: "#304FFE",
        color: "#fff",
        padding: "12px 20px",
        borderRadius: 10,
        border: "none",
        fontWeight: 700,
        cursor: "pointer",
    },

    secondaryBtn: {
        background: "#E0E7FF",
        padding: "12px 20px",
        borderRadius: 10,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },

    alert: {
        background: "#E8F5E9",
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        color: "#2E7D32",
        fontWeight: 600,
    },

    center: {
        textAlign: "center",
        marginTop: 40,
        fontWeight: 600,
    },
};
