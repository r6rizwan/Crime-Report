import React, { useState } from "react";
import axios from "axios";

export default function Register() {
    const [form, setForm] = useState({
        fullName: "",
        gender: "",
        dob: "",
        city: "",
        address: "",
        pincode: "",
        email: "",
        mobileNo: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const res = await axios.post("http://localhost:7000/api/register", form);

            setSuccess("Registration successful! Verify OTP.");
            alert(`OTP for testing: ${res.data.otp}`);

            setTimeout(() => {
                window.location.href = "/otp";
            }, 900);

        } catch (err) {
            setError(err.response?.data?.error || "Registration failed");
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create Your Account</h2>
                <p style={styles.subtitle}>Join the Crime Report Portal</p>

                {/* alerts */}
                {error && <p style={styles.error}>{error}</p>}
                {success && <p style={styles.success}>{success}</p>}

                <form onSubmit={handleRegister} style={styles.form}>

                    {/* Full name + Gender */}
                    <div style={styles.row}>
                        <input
                            style={styles.input}
                            placeholder="Full Name"
                            name="fullName"
                            value={form.fullName}
                            onChange={handleChange}
                            required
                        />
                        <select
                            style={styles.input}
                            name="gender"
                            value={form.gender}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Gender</option>
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                        </select>
                    </div>

                    {/* DOB + City */}
                    <div style={styles.row}>
                        <input
                            type="date"
                            style={styles.input}
                            name="dob"
                            value={form.dob}
                            onChange={handleChange}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="City"
                            name="city"
                            value={form.city}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Address */}
                    <textarea
                        style={{ ...styles.input, height: "80px" }}
                        placeholder="Full Address"
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        required
                    />

                    {/* Pincode + Mobile */}
                    <div style={styles.row}>
                        <input
                            style={styles.input}
                            placeholder="Pincode"
                            name="pincode"
                            value={form.pincode}
                            onChange={handleChange}
                            required
                        />
                        <input
                            style={styles.input}
                            placeholder="Mobile Number"
                            name="mobileNo"
                            value={form.mobileNo}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Email */}
                    <input
                        style={styles.input}
                        placeholder="Email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    {/* Submit */}
                    <button type="submit" style={styles.button}>
                        Register
                    </button>
                </form>

                <p style={styles.footer}>
                    Already have an account?{" "}
                    <a href="/login" style={styles.link}>Login</a>
                </p>
            </div>
        </div>
    );
}

/* Improved Styling */
const styles = {
    page: {
        minHeight: "100vh",
        background: "linear-gradient(135deg, #dde7ff, #f4f7ff)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },

    card: {
        width: "450px",
        background: "#fff",
        padding: "35px 32px",
        borderRadius: "18px",
        boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
    },

    title: {
        fontSize: "26px",
        fontWeight: "700",
        textAlign: "center",
        color: "#202020",
        marginBottom: "6px",
    },

    subtitle: {
        fontSize: "14px",
        textAlign: "center",
        color: "#555",
        marginBottom: "25px",
    },

    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },

    row: {
        display: "flex",
        gap: "16px",
    },

    input: {
        flex: 1,
        padding: "14px",
        borderRadius: "10px",
        border: "1px solid #d1d9e6",
        background: "#f9f9f9",
        fontSize: "15px",
        outline: "none",
        transition: "border 0.2s ease",
    },

    button: {
        marginTop: "10px",
        width: "100%",
        padding: "14px",
        background: "#4B6FFF",
        borderRadius: "10px",
        border: "none",
        color: "#fff",
        fontSize: "16px",
        fontWeight: "600",
        cursor: "pointer",
    },

    footer: {
        marginTop: "16px",
        textAlign: "center",
        fontSize: "14px",
        color: "#444",
    },

    link: {
        color: "#4B6FFF",
        textDecoration: "none",
        fontWeight: "600",
    },

    error: {
        color: "#e63946",
        textAlign: "center",
        fontWeight: "600",
    },

    success: {
        color: "#2ea44f",
        textAlign: "center",
        fontWeight: "600",
    },
};
