import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AboutPage() {
  const navigate = useNavigate();
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  const stats = [
    { label: 'Reports Filed', value: '25,000+' },
    { label: 'City Coverage', value: '100%' },
    { label: 'Response Time', value: '< 2hrs' }
  ];

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
        <h1 style={styles.heroTitle}>Safety through Transparency</h1>
        <p style={styles.heroSubtitle}>
          A unified digital platform for community crime reporting and real-time situational awareness.
        </p>
      </header>

      {/* STATS SECTION */}
      <div style={styles.statsSection}>
        {stats.map((s, idx) => (
          <div key={idx} style={styles.statCard}>
            <h3 style={styles.statNumber}>{s.value}</h3>
            <p style={styles.statLabel}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* MISSION SECTION */}
      <section style={styles.section}>
        <div style={styles.sectionText}>
          <h2 style={styles.featureTitle}>Our Core Mission</h2>
          <p style={styles.description}>
            We aim to modernize the relationship between citizens and law enforcement.
            By providing a seamless digital interface, we ensure that incidents are
            tracked, reported, and managed with 100% integrity.
          </p>
          <p style={styles.description}>
            Our portal utilizes encrypted channels to ensure that your safety and
            privacy are never compromised during the reporting process.
          </p>
        </div>
        <div style={styles.sectionImage}>🛡️</div>
      </section>

      {/* IMPACT SECTION */}
      <section style={{ ...styles.section, flexDirection: 'row-reverse' }}>
        <div style={styles.sectionText}>
          <h2 style={styles.featureTitle}>Community Impact</h2>
          <p style={styles.description}>
            Knowledge is the best deterrent. By visualizing crime hotspots and
            sharing safety alerts, we empower neighborhoods to look out for one
            another effectively.
          </p>
          {/* <button style={styles.secondaryBtn} onClick={() => navigate("/data")}>
            View Live Data
          </button> */}
        </div>
        <div style={styles.sectionImage}>📊</div>
      </section>

      {/* CTA FOOTER */}
      <div style={styles.featuresBox}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={styles.featureTitle}>Ready to contribute?</h2>
          <p style={styles.description}>
            Report an incident anonymously or join our community patrol initiative.
          </p>
          <div style={{ marginTop: '25px' }}>
            <button style={styles.primaryBtn} onClick={() => navigate("/contactpage")}>
              Get in Touch
            </button>
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
    paddingBottom: 40,
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
  heroBox: { textAlign: "center", padding: "70px 20px 30px" },
  heroTitle: { fontSize: 36, fontWeight: 800, color: "#1e293b" },
  heroSubtitle: { marginTop: 10, color: "#555", fontSize: 18, maxWidth: 600, margin: "10px auto" },

  /* STATS */
  statsSection: {
    display: "flex",
    justifyContent: "center",
    gap: 20,
    flexWrap: "wrap",
    padding: "0 20px",
    marginTop: 20
  },
  statCard: {
    width: 180,
    background: "#fff",
    padding: 22,
    borderRadius: 14,
    textAlign: "center",
    boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
  },
  statNumber: { fontSize: 28, fontWeight: 700, color: "#304FFE", margin: 0 },
  statLabel: { marginTop: 6, fontSize: 14, color: "#555", fontWeight: 600 },

  /* SECTIONS */
  section: {
    maxWidth: 1000,
    margin: "60px auto",
    padding: "0 20px",
    display: "flex",
    alignItems: "center",
    gap: 60,
  },
  sectionText: { flex: 1 },
  sectionImage: {
    flex: 1,
    height: 250,
    background: "#fff",
    borderRadius: 24,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "5rem",
    boxShadow: "0 8px 20px rgba(0,0,0,0.05)",
  },
  featureTitle: { fontSize: 28, fontWeight: 700, marginBottom: 15, color: "#1e293b" },
  description: { color: "#475569", fontSize: 16, lineHeight: 1.6 },

  /* BOXES & BUTTONS */
  featuresBox: {
    maxWidth: 800,
    margin: "80px auto 40px",
    background: "#fff",
    padding: "40px",
    borderRadius: 16,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  primaryBtn: {
    padding: "12px 28px",
    background: "#4B6FFF",
    color: "#fff",
    borderRadius: 8,
    border: "none",
    fontWeight: 600,
    cursor: "pointer",
    fontSize: 16,
  },
  secondaryBtn: {
    padding: "10px 22px",
    border: "2px solid #4B6FFF",
    background: "transparent",
    color: "#4B6FFF",
    borderRadius: 8,
    fontWeight: 600,
    cursor: "pointer",
    marginTop: 15,
  },
  footer: { textAlign: "center", marginTop: 40, fontSize: 14, color: "#666" },
};