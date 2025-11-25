import React from "react";

export default function Home() {
    return (
        <div style={styles.page}>

            {/* Hero Section */}
            <div style={styles.heroBox}>
                <h1 style={styles.heroTitle}>Crime Reporting Portal</h1>
                <p style={styles.heroSubtitle}>
                    A secure and transparent way for citizens to file and track complaints.
                </p>

                <div style={styles.heroButtons}>
                    <a href="/register" style={styles.primaryBtn}>File a Complaint</a>
                    <a href="/login" style={styles.secondaryBtn}>Login</a>
                </div>
            </div>

            {/* Stats Section */}
            <div style={styles.statsSection}>
                <div style={styles.statCard}>
                    <h2 style={styles.statNumber}>1,248</h2>
                    <p style={styles.statLabel}>Total Complaints</p>
                </div>

                <div style={styles.statCard}>
                    <h2 style={styles.statNumber}>932</h2>
                    <p style={styles.statLabel}>Resolved</p>
                </div>

                <div style={styles.statCard}>
                    <h2 style={styles.statNumber}>286</h2>
                    <p style={styles.statLabel}>Pending</p>
                </div>

                <div style={styles.statCard}>
                    <h2 style={styles.statNumber}>30</h2>
                    <p style={styles.statLabel}>In Progress</p>
                </div>
            </div>

            {/* Features Section */}
            <div style={styles.featuresBox}>
                <h2 style={styles.featureTitle}>Why Use This Portal?</h2>

                <div style={styles.featureList}>
                    <div style={styles.featureItem}>✔ 24/7 Online Complaint Filing</div>
                    <div style={styles.featureItem}>✔ Track Complaint Status Anytime</div>
                    <div style={styles.featureItem}>✔ Fast Investigation Assignment</div>
                    <div style={styles.featureItem}>✔ Secure Data Storage</div>
                    <div style={styles.featureItem}>✔ No Need to Visit Police Station</div>
                </div>
            </div>

            {/* Footer */}
            <footer style={styles.footer}>
                © {new Date().getFullYear()} Crime Reporting Portal • All Rights Reserved
            </footer>

        </div>
    );
}

const styles = {
    page: {
        background: "linear-gradient(135deg, #e5eeff, #f8faff)",
        minHeight: "100vh",
        paddingBottom: "40px",
    },

    heroBox: {
        textAlign: "center",
        padding: "60px 20px 30px",
    },

    heroTitle: {
        fontSize: "36px",
        fontWeight: "800",
        color: "#222",
    },

    heroSubtitle: {
        fontSize: "16px",
        color: "#555",
        marginTop: "10px",
    },

    heroButtons: {
        marginTop: "25px",
        display: "flex",
        justifyContent: "center",
        gap: "16px",
    },

    primaryBtn: {
        padding: "12px 22px",
        background: "#4B6FFF",
        color: "white",
        fontWeight: "600",
        borderRadius: "8px",
        textDecoration: "none",
    },

    secondaryBtn: {
        padding: "12px 22px",
        border: "2px solid #4B6FFF",
        color: "#4B6FFF",
        fontWeight: "600",
        borderRadius: "8px",
        textDecoration: "none",
    },

    statsSection: {
        marginTop: "40px",
        display: "flex",
        justifyContent: "center",
        gap: "20px",
        flexWrap: "wrap",
        padding: "0 20px",
    },

    statCard: {
        width: "180px",
        background: "#ffffff",
        padding: "22px",
        borderRadius: "14px",
        textAlign: "center",
        boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
    },

    statNumber: {
        fontSize: "28px",
        fontWeight: "700",
        color: "#2d4cc8",
    },

    statLabel: {
        marginTop: "6px",
        fontSize: "14px",
        color: "#555",
    },

    featuresBox: {
        maxWidth: "700px",
        margin: "50px auto",
        background: "#ffffff",
        padding: "28px 32px",
        borderRadius: "16px",
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },

    featureTitle: {
        textAlign: "center",
        fontSize: "22px",
        fontWeight: "700",
        marginBottom: "20px",
    },

    featureList: {
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        fontSize: "15px",
        color: "#333",
    },

    featureItem: {
        padding: "12px",
        background: "#f4f7ff",
        borderRadius: "10px",
    },

    footer: {
        marginTop: "40px",
        textAlign: "center",
        fontSize: "14px",
        color: "#666",
    },
};
