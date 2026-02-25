import React from "react";
import { useNavigate } from "react-router-dom";

export default function ContactPage() {
    const navigate = useNavigate();

    return (
        <div style={styles.page}>
            <div style={styles.bgGlow} />
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        Crime Reporting Portal
                    </span>
                    <span style={styles.navTag}>Support Center</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>

                    <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
                </div>
            </nav>

            <header style={styles.hero}>
                <div>
                    <p style={styles.eyebrow}>We are here 24/7</p>
                    <h1 style={styles.heroTitle}>Get in touch with the response team.</h1>
                    <p style={styles.heroSubtitle}>
                        Ask a question, report a technical issue, or request a follow-up on
                        your case. We will route you to the right team.
                    </p>
                </div>
                <div style={styles.heroCard}>
                    <h3 style={styles.heroCardTitle}>Emergency Notice</h3>
                    <p style={styles.heroCardText}>
                        For crimes in progress, call emergency services immediately.
                    </p>
                    <div style={styles.emergencyBadge}>Dial 911</div>
                </div>
            </header>

            <div style={styles.mainGrid}>
                <div style={styles.formContainer}>
                    <h2 style={styles.formTitle}>Send a Message</h2>
                    <p style={styles.formSubtitle}>
                        We respond within 1 business day. Sensitive details are encrypted.
                    </p>
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
                            <label style={styles.label}>Topic</label>
                            <select style={styles.input}>
                                <option>General Inquiry</option>
                                <option>Technical Issue</option>
                                <option>Report Feedback</option>
                                <option>Partnership</option>
                            </select>
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Message</label>
                            <textarea rows="5" placeholder="Describe your inquiry..." style={styles.textarea} />
                        </div>
                        <button style={styles.primaryBtn}>Submit Message</button>
                    </form>
                </div>

                <div style={styles.infoSidebar}>
                    {infoCards.map((card) => (
                        <div key={card.title} style={styles.infoCard}>
                            <div style={{ ...styles.infoAccent, background: card.accent }} />
                            <div>
                                <h4 style={styles.infoHeading}>{card.title}</h4>
                                {card.lines.map((line) => (
                                    <p key={line} style={styles.infoText}>{line}</p>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <footer style={styles.footer}>
                © 2026 Crime Report Portal. All rights reserved.
            </footer>
        </div>
    );
}

const infoCards = [
    {
        title: "Emergency Contact",
        lines: ["Dial 911 immediately for crimes in progress."],
        accent: "rgba(227, 91, 107, 0.2)",
    },
    {
        title: "Portal Support Email",
        lines: ["support@crimereport.com", "helpdesk@crimereport.com"],
        accent: "rgba(26, 167, 155, 0.18)",
    },
    {
        title: "Support Helpline",
        lines: ["+1 (800) 000-0000", "Mon - Fri, 9am - 6pm"],
        accent: "rgba(58, 163, 255, 0.18)",
    },
    {
        title: "Head Office",
        lines: ["Crime Report Operations Center", "Downtown District, City HQ"],
        accent: "rgba(245, 158, 11, 0.18)",
    },
];

const styles = {
    page: {
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        paddingBottom: 60,
        position: "relative",
        overflow: "hidden",
    },
    bgGlow: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
        top: -120,
        right: -80,
        animation: "floatSlow 12s ease-in-out infinite",
    },
    navbar: {
        height: 72,
        background: "rgba(255,255,255,0.9)",
        backdropFilter: "blur(6px)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 40px",
        borderBottom: "1px solid rgba(15, 23, 42, 0.06)",
        position: "sticky",
        top: 0,
        zIndex: 1000,
    },
    navLeft: { display: "flex", alignItems: "center", gap: 14 },
    logo: { fontSize: 20, fontWeight: 700, color: "var(--ink-900)", cursor: "pointer" },
    navTag: {
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--mint-600)",
    },
    navRight: { display: "flex", alignItems: "center", gap: 22 },
    navLink: { fontWeight: 600, color: "var(--ink-600)", cursor: "pointer" },
    hero: {
        maxWidth: 1100,
        margin: "0 auto",
        padding: "64px 28px 20px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 30,
        alignItems: "center",
        position: "relative",
        zIndex: 2,
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
        marginBottom: 12,
    },
    heroTitle: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: 40,
        margin: 0,
        color: "var(--ink-900)",
    },
    heroSubtitle: {
        marginTop: 16,
        color: "var(--ink-600)",
        fontSize: 16,
        lineHeight: 1.6,
        maxWidth: 520,
    },
    heroCard: {
        background: "#0f172a",
        color: "#fff",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
    },
    heroCardTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
    heroCardText: { marginTop: 10, color: "rgba(255,255,255,0.75)", lineHeight: 1.6 },
    emergencyBadge: {
        marginTop: 18,
        display: "inline-flex",
        padding: "8px 14px",
        borderRadius: 999,
        background: "rgba(227, 91, 107, 0.2)",
        color: "#fff",
        fontWeight: 700,
    },
    mainGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        maxWidth: 1100,
        margin: "0 auto",
        gap: 30,
        padding: "20px 28px 0",
    },
    formContainer: {
        background: "#fff",
        padding: "36px",
        borderRadius: 18,
        boxShadow: "var(--card-shadow)",
    },
    formTitle: {
        fontSize: 26,
        fontWeight: 700,
        margin: 0,
        fontFamily: '"DM Serif Display", serif',
    },
    formSubtitle: {
        marginTop: 8,
        color: "var(--ink-600)",
        fontSize: 14,
    },
    form: { display: "flex", flexDirection: "column", gap: 16, marginTop: 20 },
    inputGroup: { display: "flex", flexDirection: "column", gap: 8 },
    label: { fontWeight: 600, fontSize: 13, color: "var(--ink-700)" },
    input: {
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        fontSize: 15,
        fontFamily: "inherit",
        background: "rgba(250, 250, 250, 0.9)",
    },
    textarea: {
        padding: "12px 14px",
        borderRadius: 10,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        fontSize: 15,
        fontFamily: "inherit",
        resize: "vertical",
        background: "rgba(250, 250, 250, 0.9)",
    },
    primaryBtn: {
        padding: "12px",
        background: "var(--mint-500)",
        color: "#fff",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: 16,
        marginTop: 6,
    },
    infoSidebar: {
        display: "flex",
        flexDirection: "column",
        gap: 16,
    },
    infoCard: {
        background: "#fff",
        padding: "20px",
        borderRadius: 16,
        boxShadow: "var(--card-shadow)",
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
    },
    infoAccent: {
        width: 10,
        height: 40,
        borderRadius: 999,
    },
    infoHeading: { fontSize: 15, fontWeight: 700, margin: 0, color: "var(--ink-900)" },
    infoText: { margin: "4px 0 0", color: "var(--ink-600)", fontSize: 14 },
    footer: { textAlign: "center", marginTop: 50, fontSize: 13, color: "var(--ink-600)" },
};
