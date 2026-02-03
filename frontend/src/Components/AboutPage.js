import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function AboutPage() {
  const navigate = useNavigate();
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  React.useEffect(() => {
    const closeMenu = () => setShowLoginMenu(false);
    window.addEventListener("click", closeMenu);
    return () => window.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div style={styles.page}>
      <div style={styles.bgWave} />
      <nav style={styles.navbar}>
        <div style={styles.navLeft}>
          <span style={styles.logo} onClick={() => navigate("/")}>
            Crime Reporting Portal
          </span>
          <span style={styles.navTag}>About the Program</span>
        </div>

        <div style={styles.navRight}>
          <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
          <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
          <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>

          <div style={styles.dropdown} onClick={(e) => e.stopPropagation()}>
            <span
              style={styles.navLink}
              onClick={() => setShowLoginMenu((prev) => !prev)}
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

      <section style={styles.hero}>
        <div style={styles.heroCopy}>
          <p style={styles.eyebrow}>Built With Community in Mind</p>
          <h1 style={styles.heroTitle}>Safety through transparency and care.</h1>
          <p style={styles.heroSubtitle}>
            We modernize how communities report, track, and resolve incidents with
            clarity and compassion at every step.
          </p>
        </div>
        <div style={styles.heroPanel}>
          <h3 style={styles.panelTitle}>Guided by accountability</h3>
          <p style={styles.panelText}>
            Every update is timestamped and visible to the right people, ensuring
            meaningful progress and trust.
          </p>
          <button style={styles.panelBtn} onClick={() => navigate("/register")}>
            Start a Report
          </button>
        </div>
      </section>

      <section style={styles.statsBand}>
        {stats.map((s) => (
          <div key={s.label} style={styles.statCard}>
            <h3 style={styles.statNumber}>{s.value}</h3>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </section>

      <section style={styles.section}>
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Our Mission</h2>
          <p style={styles.sectionText}>
            We bridge the gap between citizens and law enforcement by providing a
            secure, guided, and consistent reporting experience.
          </p>
        </div>
        <div style={styles.sectionCard}>
          <h2 style={styles.sectionTitle}>Our Promise</h2>
          <p style={styles.sectionText}>
            Your data stays protected, your report is tracked, and your voice is
            handled with respect from intake to resolution.
          </p>
        </div>
      </section>

      <section style={styles.timeline}>
        <div style={styles.timelineHeader}>
          <h2 style={styles.sectionTitle}>How We Deliver Impact</h2>
          <p style={styles.sectionText}>
            A clear operational path that supports both citizens and investigators.
          </p>
        </div>
        <div style={styles.timelineGrid}>
          {impact.map((item) => (
            <div key={item.title} style={styles.timelineCard}>
              <span style={styles.timelineBadge}>{item.badge}</span>
              <h3 style={styles.timelineTitle}>{item.title}</h3>
              <p style={styles.timelineText}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div>
          <h2 style={styles.ctaTitle}>Want to collaborate or learn more?</h2>
          <p style={styles.ctaText}>
            We partner with city offices and community leaders to improve response time.
          </p>
        </div>
        <button style={styles.ctaBtn} onClick={() => navigate("/contactpage")}>
          Contact Us
        </button>
      </section>

      <footer style={styles.footer}>
        © 2026 Crime Report Portal. All rights reserved.
      </footer>
    </div>
  );
}

const stats = [
  { label: "Reports Filed", value: "25,000+" },
  { label: "City Coverage", value: "100%" },
  { label: "Avg. Response Time", value: "< 2 hrs" },
];

const impact = [
  {
    badge: "01",
    title: "Verified Intake",
    text: "Structured forms help capture evidence and reduce noise at submission.",
  },
  {
    badge: "02",
    title: "Coordinated Assignment",
    text: "Cases reach the right investigators fast with status visibility.",
  },
  {
    badge: "03",
    title: "Community Awareness",
    text: "Aggregated insights provide preventative guidance without exposing data.",
  },
];

const styles = {
  page: {
    background:
      "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
    minHeight: "100vh",
    paddingBottom: 40,
    position: "relative",
    overflow: "hidden",
  },
  bgWave: {
    position: "absolute",
    width: "120%",
    height: 320,
    top: -140,
    left: "-10%",
    background: "linear-gradient(120deg, rgba(26,167,155,0.18), transparent)",
    borderRadius: "40%",
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
  dropdown: { position: "relative" },
  dropdownMenu: {
    position: "absolute",
    top: 34,
    right: 0,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 12px 28px rgba(11,18,32,0.18)",
    minWidth: 190,
    overflow: "hidden",
    zIndex: 2000,
  },
  dropdownItem: {
    padding: "12px 16px",
    cursor: "pointer",
    fontWeight: 600,
    color: "var(--ink-700)",
    borderBottom: "1px solid #f1f1f1",
  },
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
  heroPanel: {
    background: "#fff",
    borderRadius: 20,
    padding: 24,
    boxShadow: "var(--card-shadow)",
    animation: "fadeUp 1s ease both",
  },
  panelTitle: { margin: 0, fontSize: 20, fontWeight: 700 },
  panelText: { marginTop: 10, color: "var(--ink-600)", lineHeight: 1.5 },
  panelBtn: {
    marginTop: 18,
    padding: "10px 18px",
    borderRadius: 12,
    border: "none",
    background: "var(--mint-500)",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
  statsBand: {
    maxWidth: 1100,
    margin: "10px auto 0",
    padding: "0 28px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
    gap: 16,
  },
  statCard: {
    background: "#fff",
    borderRadius: 16,
    padding: 18,
    textAlign: "center",
    boxShadow: "var(--card-shadow)",
  },
  statNumber: { margin: 0, fontSize: 24, fontWeight: 700, color: "var(--mint-600)" },
  statLabel: {
    marginTop: 8,
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "var(--ink-600)",
  },
  section: {
    maxWidth: 1100,
    margin: "50px auto 0",
    padding: "0 28px",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  sectionCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 24,
    boxShadow: "var(--card-shadow)",
  },
  sectionTitle: {
    fontFamily: '"DM Serif Display", serif',
    fontSize: 26,
    margin: 0,
  },
  sectionText: {
    marginTop: 12,
    color: "var(--ink-600)",
    lineHeight: 1.6,
  },
  timeline: {
    maxWidth: 1100,
    margin: "60px auto 0",
    padding: "0 28px",
  },
  timelineHeader: {
    marginBottom: 20,
  },
  timelineGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: 18,
  },
  timelineCard: {
    background: "#fff",
    borderRadius: 18,
    padding: 22,
    boxShadow: "var(--card-shadow)",
  },
  timelineBadge: {
    display: "inline-flex",
    padding: "6px 12px",
    borderRadius: 999,
    background: "rgba(15,23,42,0.08)",
    fontWeight: 600,
    fontSize: 12,
    marginBottom: 12,
  },
  timelineTitle: { margin: 0, fontSize: 18, fontWeight: 700 },
  timelineText: { marginTop: 10, color: "var(--ink-600)", lineHeight: 1.5 },
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
  ctaTitle: { margin: 0, fontFamily: '"DM Serif Display", serif', fontSize: 26 },
  ctaText: { marginTop: 10, color: "rgba(255,255,255,0.75)" },
  ctaBtn: {
    padding: "12px 22px",
    borderRadius: 999,
    border: "none",
    background: "var(--sun-500)",
    color: "#1f1400",
    fontWeight: 700,
    cursor: "pointer",
  },
  footer: { textAlign: "center", marginTop: 50, fontSize: 13, color: "var(--ink-600)" },
};
