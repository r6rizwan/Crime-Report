import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { logoutUser } from "../utils/logout";

export default function InvestigatorLayout({ children }) {
    const location = useLocation();
    const isAssignedSection =
        location.pathname.startsWith("/investigator/assigned") ||
        location.pathname.startsWith("/investigator/update-status/") ||
        location.pathname.startsWith("/investigator/case-files/");

    return (
        <div style={styles.container}>

            {/* Fixed Sidebar */}
            <aside style={styles.sidebar}>

                {/* WRAPPER THAT PREVENTS OVERFLOW */}
                <div style={styles.sidebarInner}>

                    <div style={styles.brandBlock}>
                        <span style={styles.brandEyebrow}>Field Ops</span>
                        <h2 style={styles.brand}>Investigator</h2>
                    </div>

                    <nav style={styles.nav}>
                        <NavLink
                            to="/investigator/dashboard"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/investigator/assigned"
                            style={isAssignedSection ? { ...styles.link, ...styles.active } : styles.link}
                        >
                            Assigned Cases
                        </NavLink>

                        <NavLink
                            to="/investigator/profile"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Profile
                        </NavLink>

                        {/* <NavLink
                            to="/investigator/update-status"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Update Status
                        </NavLink> */}

                        {/* <NavLink
                            to="/investigator/history"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            History
                        </NavLink> */}
                    </nav>

                    {/* Logout button kept inside wrapper */}
                    <button onClick={logoutUser} style={styles.logout}>
                        Logout
                    </button>

                </div>
            </aside>

            {/* Main Content */}
            <main style={styles.content}>{children}</main>
        </div>
    );
}



// STYLES
const styles = {
    container: {
        display: "flex",
        minHeight: "100vh",
        fontFamily: "Space Grotesk, system-ui, sans-serif",
    },

    // FIXED SIDEBAR
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        background: "linear-gradient(180deg, #0b1220 0%, #111c34 100%)",
        boxShadow: "6px 0 18px rgba(11,18,32,0.25)",
        zIndex: 100,
        overflow: "hidden",        // ensure sidebar itself doesn't overflow
    },

    // THIS WRAPPER FIXES YOUR ISSUE
    sidebarInner: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
        padding: "30px 20px",
        overflow: "hidden",         // BLOCKS any child from leaking
        boxSizing: "border-box",
    },

    brandBlock: {
        padding: "10px 14px 18px",
        borderRadius: 16,
        background: "rgba(255,255,255,0.04)",
        textAlign: "center",
        marginBottom: 32,
    },
    brandEyebrow: {
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.28em",
        color: "rgba(255,255,255,0.5)",
        fontWeight: 700,
    },
    brand: {
        fontSize: 22,
        fontWeight: 700,
        margin: "10px 0 0",
        textAlign: "center",
        color: "white",
        letterSpacing: 0.5,
    },

    nav: {
        display: "flex",
        flexDirection: "column",
        gap: 14,
        flexGrow: 1,
    },

    link: {
        padding: "12px 14px",
        borderRadius: 10,
        fontSize: 15,
        textDecoration: "none",
        color: "rgba(226,232,240,0.8)",
        transition: "0.25s",
        display: "block",
    },

    active: {
        background: "rgba(26,167,155,0.2)",
        color: "white",
        fontWeight: 600,
        boxShadow: "0 6px 16px rgba(11,18,32,0.25)",
    },

    logout: {
        background: "#ff6b7a",
        border: "none",
        padding: "12px 16px",
        borderRadius: 8,
        width: "100%",
        textAlign: "center",
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 15,
        transition: "0.25s",
        boxSizing: "border-box",
        boxShadow: "0 10px 24px rgba(11,18,32,0.3)",
    },

    content: {
        marginLeft: 260,
        padding: "40px",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        width: "100%",
        minHeight: "100vh",
    },
};
