import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const activeCase = useMemo(
        () => sampleActiveCases[Math.floor(Math.random() * sampleActiveCases.length)],
        []
    );

    return (
        <div style={styles.page}>
            <div style={styles.bgOrbA} />
            <div style={styles.bgOrbB} />

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        CivilEye
                    </span>
                    <span style={styles.navTag}>Civic Safety Network</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>
                        Home
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>
                        About
                    </span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>
                        Contact
                    </span>

                    <span style={styles.navLink} onClick={() => navigate("/login")}>
                        Login
                    </span>

                    <button
                        style={styles.navCta}
                        onClick={() => navigate("/register")}
                    >
                        Report Now
                    </button>
                </div>
            </nav>

            {/* HERO */}
            <section style={styles.hero}>
                <div style={styles.heroCopy}>
                    <p style={styles.eyebrow}>Secure. Transparent. Fast.</p>
                    <h1 style={styles.heroTitle}>
                        A safer city starts with one clear report.
                    </h1>
                    <p style={styles.heroSubtitle}>
                        File incidents in minutes, follow every update, and stay informed
                        as cases move from intake to resolution.
                    </p>

                    <div style={styles.heroButtons}>
                        <button style={styles.primaryBtn} onClick={() => navigate("/register")}>
                            File a Complaint
                        </button>
                        <button style={styles.secondaryBtn} onClick={() => navigate("/login")}>
                            Login
                        </button>
                    </div>

                    <div style={styles.trustRow}>
                        <div style={styles.trustItem}>
                            <span style={styles.trustLabel}>Verified Intake</span>
                            <span style={styles.trustValue}>24/7</span>
                        </div>
                        <div style={styles.trustItem}>
                            <span style={styles.trustLabel}>Avg. Assignment</span>
                            <span style={styles.trustValue}>2 hrs</span>
                        </div>
                        <div style={styles.trustItem}>
                            <span style={styles.trustLabel}>Cases Resolved</span>
                            <span style={styles.trustValue}>94%</span>
                        </div>
                    </div>
                </div>

                <div style={styles.heroVisual}>
                    <div style={styles.heroCardPrimary}>
                        <p style={styles.cardLabel}>Active Case</p>
                        <h3 style={styles.cardTitle}>{activeCase.title}</h3>
                        <p style={styles.cardMeta}>Tracking ID: {activeCase.trackingId}</p>
                        <div style={styles.progressTrack}>
                            <div
                                style={{
                                    ...styles.progressFill,
                                    width: `${activeCase.progress}%`,
                                }}
                            />
                        </div>
                        <div style={styles.cardFooter}>
                            <span style={styles.statusPill}>{activeCase.status}</span>
                            <span style={styles.cardMeta}>{activeCase.updatedText}</span>
                        </div>
                    </div>
                    <div style={styles.heroCardSecondary}>
                        <h4 style={styles.miniTitle}>Live Support</h4>
                        <p style={styles.miniText}>Speak to a coordinator within minutes.</p>
                        <button
                            style={styles.ghostBtn}
                            onClick={() => navigate("/contactpage")}
                        >
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

            {/* HOW IT WORKS */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>How It Works</h2>
                    <p style={styles.sectionSubtitle}>
                        A clear, accountable workflow from report to resolution.
                    </p>
                </div>
                <div style={styles.stepsGrid}>
                    {steps.map((step) => (
                        <div key={step.title} style={styles.stepCard}>
                            <div style={{ ...styles.stepIcon, background: step.accent }}>
                                {step.icon}
                            </div>
                            <h3 style={styles.stepTitle}>{step.title}</h3>
                            <p style={styles.stepText}>{step.text}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* CONFIDENCE BAND */}
            <section style={styles.confidenceBand}>
                {stats.map((item) => (
                    <div key={item.label} style={styles.statCard}>
                        <h3 style={styles.statNumber}>{item.value}</h3>
                        <p style={styles.statLabel}>{item.label}</p>
                    </div>
                ))}
            </section>

            {/* FEATURE CARDS */}
            <section style={styles.section}>
                <div style={styles.sectionHeader}>
                    <h2 style={styles.sectionTitle}>Why Communities Choose Us</h2>
                    <p style={styles.sectionSubtitle}>
                        Built for clarity, accountability, and respect for every report.
                    </p>
                </div>
                <div style={styles.featureGrid}>
                    {features.map((feature) => (
                        <div key={feature.title} style={styles.featureCard}>
                            <h3 style={styles.featureTitle}>{feature.title}</h3>
                            <p style={styles.featureText}>{feature.text}</p>
                            <span style={styles.featureTag}>{feature.tag}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CTA */}
            <section style={styles.ctaSection}>
                <div>
                    <h2 style={styles.ctaTitle}>Ready to file a report?</h2>
                    <p style={styles.ctaText}>
                        Start a secure complaint in under five minutes and track it end to end.
                    </p>
                </div>
                <button style={styles.ctaBtn} onClick={() => navigate("/register")}>
                    Start Report
                </button>
            </section>

            {/* FOOTER */}
            <footer style={styles.footer}>
                © {new Date().getFullYear()} CivilEye • Crime Reporting Portal • All Rights Reserved
            </footer>
        </div>
    );
}

const stats = [
    { label: "Total Complaints", value: "1,248" },
    { label: "Resolved", value: "932" },
    { label: "Pending", value: "286" },
    { label: "In Progress", value: "30" },
];

const steps = [
    {
        title: "Submit Securely",
        text: "Report incidents online with guided prompts and secure uploads.",
        icon: "1",
        accent: "rgba(26, 167, 155, 0.12)",
    },
    {
        title: "Get Assigned",
        text: "Cases route to investigators based on type and location.",
        icon: "2",
        accent: "rgba(58, 163, 255, 0.14)",
    },
    {
        title: "Track Progress",
        text: "Receive timeline updates until the case is closed.",
        icon: "3",
        accent: "rgba(245, 158, 11, 0.16)",
    },
];

const features = [
    {
        title: "Real-Time Status Updates",
        text: "Know who is assigned, when actions were taken, and what happens next.",
        tag: "Transparency",
    },
    {
        title: "Confidential by Design",
        text: "We safeguard your personal data and document uploads end to end.",
        tag: "Privacy",
    },
    {
        title: "Community Alerting",
        text: "Spot emerging trends with aggregated insights and safe updates.",
        tag: "Awareness",
    },
];

const sampleActiveCases = [
    {
        title: "Burglary Report",
        trackingId: "CMP-08/2026",
        status: "Assigned",
        updatedText: "Updated 15m ago",
        progress: 48,
    },
    {
        title: "Online Fraud Complaint",
        trackingId: "CMP-14/2026",
        status: "Open",
        updatedText: "Updated 32m ago",
        progress: 64,
    },
    {
        title: "Vehicle Theft Report",
        trackingId: "CMP-21/2026",
        status: "Resolved",
        updatedText: "Updated 1h ago",
        progress: 88,
    },
    {
        title: "Harassment Complaint",
        trackingId: "CMP-26/2026",
        status: "Assigned",
        updatedText: "Updated 22m ago",
        progress: 54,
    },
    {
        title: "Identity Misuse Report",
        trackingId: "CMP-30/2026",
        status: "Open",
        updatedText: "Updated 9m ago",
        progress: 70,
    },
];

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        position: "relative",
        overflow: "hidden",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        paddingBottom: 48,
    },
    bgOrbA: {
        position: "absolute",
        width: 320,
        height: 320,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
        top: -80,
        left: -120,
        filter: "blur(2px)",
        animation: "floatSlow 10s ease-in-out infinite",
    },
    bgOrbB: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
        bottom: 40,
        right: -80,
        filter: "blur(2px)",
        animation: "floatSlow 12s ease-in-out infinite",
    },

    /* NAVBAR */
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
    navLeft: {
        display: "flex",
        alignItems: "center",
        gap: 14,
    },
    logo: {
        fontSize: 20,
        fontWeight: 700,
        color: "var(--ink-900)",
        cursor: "pointer",
    },
    navTag: {
        fontSize: 12,
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.16em",
        color: "var(--mint-600)",
    },
    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 22,
    },
    navLink: {
        fontWeight: 600,
        color: "var(--ink-600)",
        cursor: "pointer",
    },
    navCta: {
        padding: "10px 18px",
        borderRadius: 999,
        border: "none",
        background: "var(--ink-900)",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },
    /* HERO */
    hero: {
        maxWidth: 1160,
        margin: "0 auto",
        padding: "64px 28px 24px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 36,
        alignItems: "center",
        position: "relative",
        zIndex: 2,
    },
    heroCopy: {
        animation: "fadeUp 0.8s ease both",
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
        fontSize: 44,
        lineHeight: 1.05,
        margin: 0,
        color: "var(--ink-900)",
    },
    heroSubtitle: {
        marginTop: 16,
        color: "var(--ink-600)",
        fontSize: 17,
        lineHeight: 1.6,
        maxWidth: 520,
    },
    heroButtons: {
        marginTop: 24,
        display: "flex",
        gap: 14,
        flexWrap: "wrap",
    },
    primaryBtn: {
        padding: "12px 22px",
        background: "var(--mint-500)",
        color: "#fff",
        borderRadius: 12,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
        boxShadow: "0 12px 26px rgba(26, 167, 155, 0.28)",
    },
    secondaryBtn: {
        padding: "12px 22px",
        border: "1px solid rgba(15, 23, 42, 0.2)",
        background: "rgba(255,255,255,0.8)",
        color: "var(--ink-700)",
        borderRadius: 12,
        fontWeight: 600,
        cursor: "pointer",
    },
    trustRow: {
        marginTop: 24,
        display: "flex",
        gap: 18,
        flexWrap: "wrap",
    },
    trustItem: {
        background: "#fff",
        borderRadius: 14,
        padding: "12px 16px",
        boxShadow: "var(--card-shadow)",
        minWidth: 140,
    },
    trustLabel: {
        display: "block",
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--ink-600)",
        marginBottom: 6,
    },
    trustValue: {
        fontSize: 18,
        fontWeight: 700,
        color: "var(--ink-900)",
    },
    heroVisual: {
        display: "grid",
        gap: 18,
        justifyItems: "center",
    },
    heroCardPrimary: {
        width: "100%",
        maxWidth: 360,
        background: "#fff",
        borderRadius: 20,
        padding: 22,
        boxShadow: "var(--card-shadow)",
        animation: "glowPulse 6s ease-in-out infinite",
    },
    cardLabel: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.2em",
        color: "var(--ink-600)",
        marginBottom: 6,
    },
    cardTitle: {
        margin: 0,
        fontSize: 20,
        fontWeight: 700,
        color: "var(--ink-900)",
    },
    cardMeta: {
        marginTop: 6,
        fontSize: 13,
        color: "var(--ink-600)",
    },
    progressTrack: {
        marginTop: 16,
        height: 8,
        borderRadius: 999,
        background: "rgba(15,23,42,0.08)",
        overflow: "hidden",
    },
    progressFill: {
        width: "62%",
        height: "100%",
        background: "linear-gradient(90deg, var(--mint-500), #6ee7d8)",
    },
    cardFooter: {
        marginTop: 16,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    statusPill: {
        padding: "6px 12px",
        borderRadius: 999,
        background: "rgba(26, 167, 155, 0.12)",
        color: "var(--mint-600)",
        fontWeight: 600,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.08em",
    },
    heroCardSecondary: {
        width: "100%",
        maxWidth: 320,
        background: "rgba(11,18,32,0.92)",
        borderRadius: 18,
        padding: 20,
        color: "#fff",
        boxShadow: "0 18px 40px rgba(11,18,32,0.3)",
        animation: "fadeUp 1s ease both",
    },
    miniTitle: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
    },
    miniText: {
        marginTop: 10,
        fontSize: 14,
        color: "rgba(255,255,255,0.72)",
    },
    ghostBtn: {
        marginTop: 16,
        padding: "10px 16px",
        borderRadius: 10,
        border: "1px solid rgba(255,255,255,0.3)",
        background: "transparent",
        color: "#fff",
        fontWeight: 600,
        cursor: "pointer",
    },

    /* SECTION */
    section: {
        maxWidth: 1140,
        margin: "0 auto",
        padding: "60px 28px 20px",
    },
    sectionHeader: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        marginBottom: 24,
    },
    sectionTitle: {
        fontFamily: '"DM Serif Display", serif',
        fontSize: 32,
        margin: 0,
    },
    sectionSubtitle: {
        color: "var(--ink-600)",
        fontSize: 16,
        maxWidth: 560,
    },

    stepsGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 18,
    },
    stepCard: {
        background: "#fff",
        borderRadius: 18,
        padding: 20,
        boxShadow: "var(--card-shadow)",
        minHeight: 170,
    },
    stepIcon: {
        width: 44,
        height: 44,
        borderRadius: 14,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        color: "var(--ink-900)",
        marginBottom: 16,
    },
    stepTitle: {
        margin: 0,
        fontSize: 18,
    },
    stepText: {
        marginTop: 10,
        color: "var(--ink-600)",
        lineHeight: 1.5,
        fontSize: 14,
    },

    confidenceBand: {
        maxWidth: 1140,
        margin: "20px auto 0",
        padding: "0 28px",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: 16,
    },
    statCard: {
        background: "#fff",
        borderRadius: 16,
        padding: 18,
        textAlign: "center",
        boxShadow: "var(--card-shadow)",
    },
    statNumber: {
        margin: 0,
        fontSize: 24,
        fontWeight: 700,
        color: "var(--mint-600)",
    },
    statLabel: {
        marginTop: 8,
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.12em",
        color: "var(--ink-600)",
    },

    featureGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 18,
    },
    featureCard: {
        background: "#fff",
        borderRadius: 18,
        padding: 22,
        boxShadow: "var(--card-shadow)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        minHeight: 190,
    },
    featureTitle: {
        margin: 0,
        fontSize: 18,
        fontWeight: 700,
    },
    featureText: {
        margin: 0,
        color: "var(--ink-600)",
        lineHeight: 1.5,
        fontSize: 14,
    },
    featureTag: {
        alignSelf: "flex-start",
        padding: "6px 12px",
        borderRadius: 999,
        background: "rgba(15,23,42,0.08)",
        fontSize: 12,
        fontWeight: 600,
        color: "var(--ink-600)",
    },

    ctaSection: {
        maxWidth: 1100,
        margin: "70px auto 0",
        padding: "32px 28px",
        background: "linear-gradient(135deg, #0f172a, #1f2a44)",
        borderRadius: 24,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 20,
        color: "#fff",
    },
    ctaTitle: {
        margin: 0,
        fontFamily: '"DM Serif Display", serif',
        fontSize: 28,
    },
    ctaText: {
        marginTop: 10,
        color: "rgba(255,255,255,0.75)",
        maxWidth: 520,
    },
    ctaBtn: {
        padding: "12px 22px",
        borderRadius: 999,
        border: "none",
        background: "var(--sun-500)",
        color: "#1f1400",
        fontWeight: 700,
        cursor: "pointer",
    },

    footer: {
        textAlign: "center",
        marginTop: 48,
        fontSize: 13,
        color: "var(--ink-600)",
    },
};
