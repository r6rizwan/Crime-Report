import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ContactPage() {
    const navigate = useNavigate();
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    // Close dropdown when clicking outside
    React.useEffect(() => {
        const closeMenu = () => setShowLoginMenu(false);
        window.addEventListener('click', closeMenu);
        return () => window.removeEventListener('click', closeMenu);
    }, []);

    return (
        <div style={styles.page}>
            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>

                    {/* LOGIN DROPDOWN */}
                    <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
                        <span
                            style={styles.navLink}
                            onClick={() => setShowLoginMenu(prev => !prev)}
                        >
                            Login ▾
                        </span>

                        {showLoginMenu && (
                            <div style={styles.dropdownMenu}>
                                <div style={styles.dropdownItem} onClick={() => navigate("/login")}>
                                    Citizen Login
                                </div>
                                <div style={styles.dropdownItem} onClick={() => navigate("/investigator/login")}>
                                    Investigator Login
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <header style={styles.heroBox}>
                <h1 style={styles.heroTitle}>Get in Touch</h1>
                <p style={styles.heroSubtitle}>
                    Have questions about reporting or technical issues? Our team is here to support you 24/7.
                </p>
            </header>

            {/* MAIN CONTENT GRID */}
            <div style={styles.mainGrid}>
                
                {/* CONTACT FORM */}
                <div style={styles.formContainer}>
                    <h2 style={styles.featureTitle}>Send a Message</h2>
                    <form onSubmit={(e) => e.preventDefault()} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Full Name</label>
                            <input type="text" placeholder="Enter your name" style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Email Address</label>
                            <input type="email" placeholder="email@example.com" style={styles.input} />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Subject</label>
                            <select style={styles.input}>
                                <option>General Inquiry</option>
                                <option>Technical Issue</option>
                                <option>Report Feedback</option>
                                <option>Partnership</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Message</label>
                            <textarea rows="5" placeholder="Describe your inquiry..." style={styles.textarea}></textarea>
                        </div>
                        <button style={styles.primaryBtn}>Submit Message</button>
                    </form>
                </div>

                {/* INFO SIDEBAR */}
                <div style={styles.infoSidebar}>
                    <div style={styles.infoCard}>
                        <h4 style={styles.infoHeading}>Emergency Contact</h4>
                        <p style={{ ...styles.infoText, color: '#ff4d4d', fontWeight: 'bold' }}>
                            Dial 911 immediately for crimes in progress.
                        </p>
                    </div>

                    <div style={styles.infoCard}>
                        <h4 style={styles.infoHeading}>Email Support</h4>
                        <p style={styles.infoText}>support@crimeportal.gov</p>
                        <p style={styles.infoText}>admin@crimeportal.gov</p>
                    </div>

                    <div style={styles.infoCard}>
                        <h4 style={styles.infoHeading}>Public Relations</h4>
                        <p style={styles.infoText}>+1 (555) 123-4567</p>
                        <p style={styles.infoText}>Mon - Fri, 9am - 5pm</p>
                    </div>

                    <div style={styles.infoCard}>
                        <h4 style={styles.infoHeading}>Office Address</h4>
                        <p style={styles.infoText}>
                            123 Justice Way,<br />
                            Tech City, TC 45678
                        </p>
                    </div>
                </div>
            </div>

            <footer style={styles.footer}>
                © 2026 Crime Report Portal. All rights reserved.
            </footer>
        </div>
    );
}

const styles = {
    page: {
        background: "linear-gradient(135deg, #e5eeff, #f8faff)",
        minHeight: "100vh",
        paddingBottom: 60,
        // fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    },

    /* NAVBAR */
    navbar: {
        height: 64,
        background: "#ffffff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 32px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    navLeft: { display: "flex", alignItems: "center" },
    logo: { fontSize: 20, fontWeight: 800, color: "#304FFE", cursor: "pointer" },
    navRight: { display: "flex", alignItems: "center", gap: 22 },
    navLink: { fontWeight: 600, color: "#333", cursor: "pointer" },
    dropdown: { position: "relative" },
    dropdownMenu: {
        position: "absolute",
        top: 35,
        right: 0,
        background: "#fff",
        borderRadius: 10,
        boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
        minWidth: 180,
        overflow: "hidden",
        zIndex: 2000,
    },
    dropdownItem: {
        padding: "12px 16px",
        cursor: "pointer",
        fontWeight: 600,
        color: "#333",
        borderBottom: "1px solid #f1f1f1",
    },

    /* HERO */
    heroBox: { textAlign: "center", padding: "60px 20px 40px" },
    heroTitle: { fontSize: 36, fontWeight: 800, color: "#1e293b" },
    heroSubtitle: { marginTop: 10, color: "#555", fontSize: 18, maxWidth: 600, margin: "10px auto" },

    /* MAIN CONTENT */
    mainGrid: {
        display: "flex",
        maxWidth: 1100,
        margin: "0 auto",
        gap: 40,
        padding: "0 20px",
        flexWrap: "wrap",
    },

    /* FORM AREA */
    formContainer: {
        flex: 2,
        background: "#fff",
        padding: "40px",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
        minWidth: 320,
    },
    featureTitle: { fontSize: 24, fontWeight: 700, marginBottom: 25, color: "#1e293b" },
    form: { display: "flex", flexDirection: "column", gap: 20 },
    inputGroup: { display: "flex", flexDirection: "column", gap: 8 },
    label: { fontWeight: 600, fontSize: 14, color: "#333" },
    input: {
        padding: "12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontSize: 15,
        fontFamily: "inherit",
    },
    textarea: {
        padding: "12px",
        borderRadius: 8,
        border: "1px solid #ddd",
        fontSize: 15,
        fontFamily: "inherit",
        resize: "none",
    },
    primaryBtn: {
        padding: "14px",
        background: "#4B6FFF",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 16,
        marginTop: 10,
    },

    /* SIDEBAR AREA */
    infoSidebar: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        gap: 20,
        minWidth: 280,
    },
    infoCard: {
        background: "#fff",
        padding: "24px",
        borderRadius: 16,
        boxShadow: "0 4px 15px rgba(0,0,0,0.05)",
        borderLeft: "5px solid #304FFE",
    },
    infoHeading: { fontSize: 16, fontWeight: 700, marginBottom: 10, color: "#304FFE" },
    infoText: { margin: "2px 0", color: "#475569", fontSize: 15 },

    footer: { textAlign: "center", marginTop: 60, fontSize: 14, color: "#666" },
};