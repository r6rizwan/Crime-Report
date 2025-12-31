// import React from "react";

// export default function Home() {
//     return (
//         <div style={styles.page}>

//             {/* Hero Section */}
//             <div style={styles.heroBox}>
//                 <h1 style={styles.heroTitle}>Crime Reporting Portal</h1>
//                 <p style={styles.heroSubtitle}>
//                     A secure and transparent way for citizens to file and track complaints.
//                 </p>

//                 <div style={styles.heroButtons}>
//                     <a href="/register" style={styles.primaryBtn}>File a Complaint</a>
//                     <a href="/login" style={styles.secondaryBtn}>Login</a>
//                 </div>
//             </div>

//             {/* Stats Section */}
//             <div style={styles.statsSection}>
//                 <div style={styles.statCard}>
//                     <h2 style={styles.statNumber}>1,248</h2>
//                     <p style={styles.statLabel}>Total Complaints</p>
//                 </div>

//                 <div style={styles.statCard}>
//                     <h2 style={styles.statNumber}>932</h2>
//                     <p style={styles.statLabel}>Resolved</p>
//                 </div>

//                 <div style={styles.statCard}>
//                     <h2 style={styles.statNumber}>286</h2>
//                     <p style={styles.statLabel}>Pending</p>
//                 </div>

//                 <div style={styles.statCard}>
//                     <h2 style={styles.statNumber}>30</h2>
//                     <p style={styles.statLabel}>In Progress</p>
//                 </div>
//             </div>

//             {/* Features Section */}
//             <div style={styles.featuresBox}>
//                 <h2 style={styles.featureTitle}>Why Use This Portal?</h2>

//                 <div style={styles.featureList}>
//                     <div style={styles.featureItem}>✔ 24/7 Online Complaint Filing</div>
//                     <div style={styles.featureItem}>✔ Track Complaint Status Anytime</div>
//                     <div style={styles.featureItem}>✔ Fast Investigation Assignment</div>
//                     <div style={styles.featureItem}>✔ Secure Data Storage</div>
//                     <div style={styles.featureItem}>✔ No Need to Visit Police Station</div>
//                 </div>
//             </div>

//             {/* Footer */}
//             <footer style={styles.footer}>
//                 © {new Date().getFullYear()} Crime Reporting Portal • All Rights Reserved
//             </footer>

//         </div>
//     );
// }

// const styles = {
//     page: {
//         background: "linear-gradient(135deg, #e5eeff, #f8faff)",
//         minHeight: "100vh",
//         paddingBottom: "40px",
//     },

//     heroBox: {
//         textAlign: "center",
//         padding: "60px 20px 30px",
//     },

//     heroTitle: {
//         fontSize: "36px",
//         fontWeight: "800",
//         color: "#222",
//     },

//     heroSubtitle: {
//         fontSize: "16px",
//         color: "#555",
//         marginTop: "10px",
//     },

//     heroButtons: {
//         marginTop: "25px",
//         display: "flex",
//         justifyContent: "center",
//         gap: "16px",
//     },

//     primaryBtn: {
//         padding: "12px 22px",
//         background: "#4B6FFF",
//         color: "white",
//         fontWeight: "600",
//         borderRadius: "8px",
//         textDecoration: "none",
//     },

//     secondaryBtn: {
//         padding: "12px 22px",
//         border: "2px solid #4B6FFF",
//         color: "#4B6FFF",
//         fontWeight: "600",
//         borderRadius: "8px",
//         textDecoration: "none",
//     },

//     statsSection: {
//         marginTop: "40px",
//         display: "flex",
//         justifyContent: "center",
//         gap: "20px",
//         flexWrap: "wrap",
//         padding: "0 20px",
//     },

//     statCard: {
//         width: "180px",
//         background: "#ffffff",
//         padding: "22px",
//         borderRadius: "14px",
//         textAlign: "center",
//         boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
//     },

//     statNumber: {
//         fontSize: "28px",
//         fontWeight: "700",
//         color: "#2d4cc8",
//     },

//     statLabel: {
//         marginTop: "6px",
//         fontSize: "14px",
//         color: "#555",
//     },

//     featuresBox: {
//         maxWidth: "700px",
//         margin: "50px auto",
//         background: "#ffffff",
//         padding: "28px 32px",
//         borderRadius: "16px",
//         boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
//     },

//     featureTitle: {
//         textAlign: "center",
//         fontSize: "22px",
//         fontWeight: "700",
//         marginBottom: "20px",
//     },

//     featureList: {
//         display: "flex",
//         flexDirection: "column",
//         gap: "12px",
//         fontSize: "15px",
//         color: "#333",
//     },

//     featureItem: {
//         padding: "12px",
//         background: "#f4f7ff",
//         borderRadius: "10px",
//     },

//     footer: {
//         marginTop: "40px",
//         textAlign: "center",
//         fontSize: "14px",
//         color: "#666",
//     },
// };

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
    const navigate = useNavigate();
    const [showLoginMenu, setShowLoginMenu] = useState(false);

    // Close dropdown on outside click
    useEffect(() => {
        const closeMenu = () => setShowLoginMenu(false);
        window.addEventListener("click", closeMenu);
        return () => window.removeEventListener("click", closeMenu);
    }, []);

    return (
        <div style={styles.page}>

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo}>Crime Reporting Portal</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>
                        Home
                    </span>

                    <span style={styles.navLink}>About</span>
                    <span style={styles.navLink}>Contact</span>

                    {/* LOGIN DROPDOWN */}
                    <div
                        style={styles.dropdown}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <span
                            style={styles.navLink}
                            onClick={() =>
                                setShowLoginMenu((prev) => !prev)
                            }
                        >
                            Login ▾
                        </span>

                        {showLoginMenu && (
                            <div style={styles.dropdownMenu}>
                                <div
                                    style={styles.dropdownItem}
                                    onClick={() => navigate("/login")}
                                >
                                    Citizen Login
                                </div>

                                <div
                                    style={styles.dropdownItem}
                                    onClick={() =>
                                        navigate("/investigator/login")
                                    }
                                >
                                    Investigator Login
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </nav>

            {/* HERO SECTION */}
            <div style={styles.heroBox}>
                <h1 style={styles.heroTitle}>Crime Reporting Portal</h1>
                <p style={styles.heroSubtitle}>
                    A secure and transparent way for citizens to file and track
                    complaints.
                </p>

                <div style={styles.heroButtons}>
                    <button
                        style={styles.primaryBtn}
                        onClick={() => navigate("/register")}
                    >
                        File a Complaint
                    </button>

                    <button
                        style={styles.secondaryBtn}
                        onClick={() => navigate("/login")}
                    >
                        Citizen Login
                    </button>
                </div>
            </div>

            {/* STATS SECTION */}
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

            {/* FEATURES */}
            <div style={styles.featuresBox}>
                <h2 style={styles.featureTitle}>Why Use This Portal?</h2>

                <div style={styles.featureList}>
                    <div style={styles.featureItem}>
                        ✔ 24/7 Online Complaint Filing
                    </div>
                    <div style={styles.featureItem}>
                        ✔ Track Complaint Status Anytime
                    </div>
                    <div style={styles.featureItem}>
                        ✔ Fast Investigator Assignment
                    </div>
                    <div style={styles.featureItem}>
                        ✔ Secure & Confidential
                    </div>
                    <div style={styles.featureItem}>
                        ✔ No Need to Visit Police Station
                    </div>
                </div>
            </div>

            {/* FOOTER */}
            <footer style={styles.footer}>
                © {new Date().getFullYear()} Crime Reporting Portal • All Rights
                Reserved
            </footer>
        </div>
    );
}

/* ---------------- STYLES ---------------- */

const styles = {
    page: {
        background: "linear-gradient(135deg, #e5eeff, #f8faff)",
        minHeight: "100vh",
        paddingBottom: 40,
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

    navLeft: {
        display: "flex",
        alignItems: "center",
    },

    logo: {
        fontSize: 20,
        fontWeight: 800,
        color: "#304FFE",
        cursor: "pointer",
    },

    navRight: {
        display: "flex",
        alignItems: "center",
        gap: 22,
    },

    navLink: {
        fontWeight: 600,
        color: "#333",
        cursor: "pointer",
    },

    dropdown: {
        position: "relative",
    },

    dropdownMenu: {
        position: "absolute",
        top: 32,
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
    heroBox: {
        textAlign: "center",
        padding: "70px 20px 30px",
    },

    heroTitle: {
        fontSize: 36,
        fontWeight: 800,
    },

    heroSubtitle: {
        marginTop: 10,
        color: "#555",
    },

    heroButtons: {
        marginTop: 26,
        display: "flex",
        justifyContent: "center",
        gap: 16,
    },

    primaryBtn: {
        padding: "12px 22px",
        background: "#4B6FFF",
        color: "#fff",
        borderRadius: 8,
        border: "none",
        fontWeight: 600,
        cursor: "pointer",
    },

    secondaryBtn: {
        padding: "12px 22px",
        border: "2px solid #4B6FFF",
        background: "transparent",
        color: "#4B6FFF",
        borderRadius: 8,
        fontWeight: 600,
        cursor: "pointer",
    },

    /* STATS */
    statsSection: {
        marginTop: 40,
        display: "flex",
        justifyContent: "center",
        gap: 20,
        flexWrap: "wrap",
        padding: "0 20px",
    },

    statCard: {
        width: 180,
        background: "#fff",
        padding: 22,
        borderRadius: 14,
        textAlign: "center",
        boxShadow: "0 10px 22px rgba(0,0,0,0.08)",
    },

    statNumber: {
        fontSize: 28,
        fontWeight: 700,
        color: "#304FFE",
    },

    statLabel: {
        marginTop: 6,
        fontSize: 14,
        color: "#555",
    },

    /* FEATURES */
    featuresBox: {
        maxWidth: 720,
        margin: "50px auto",
        background: "#fff",
        padding: "30px",
        borderRadius: 16,
        boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
    },

    featureTitle: {
        textAlign: "center",
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 20,
    },

    featureList: {
        display: "flex",
        flexDirection: "column",
        gap: 12,
    },

    featureItem: {
        padding: 12,
        background: "#f4f7ff",
        borderRadius: 10,
        fontWeight: 500,
    },

    footer: {
        textAlign: "center",
        marginTop: 40,
        fontSize: 14,
        color: "#666",
    },
};
