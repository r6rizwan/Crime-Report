import React from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../utils/logout";

export default function AdminLayout({ children }) {
    return (
        <div style={styles.container}>

            {/* SIDEBAR */}
            <aside style={styles.sidebar}>

                <div style={styles.sidebarInner}>
                    <div style={styles.brandBlock}>
                        <span style={styles.brandEyebrow}>Operations</span>
                        <h2 style={styles.brand}>Admin Panel</h2>
                    </div>

                    <nav style={styles.nav}>

                        <NavLink
                            to="/admin/dashboard"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Dashboard
                        </NavLink>

                        <NavLink
                            to="/admin/complaints"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            All Complaints
                        </NavLink>

                        <NavLink
                            to="/admin/investigators"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Investigators
                        </NavLink>

                        <NavLink
                            to="/admin/add-investigator"
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
                        >
                            Add Investigator
                        </NavLink>
                    </nav>

                    <button onClick={logoutUser} style={styles.logout}>
                        Logout
                    </button>
                </div>
            </aside>

            {/* CONTENT */}
            <main style={styles.content}>{children}</main>
        </div>
    );
}

//
// Styles
//
const styles = {
    container: { display: "flex", minHeight: "100vh", },

    // sidebar: {
    //     width: 260,
    //     background: "#0E1A33",
    //     padding: "30px 20px",
    //     color: "#c8d5ff",
    //     display: "flex",
    //     flexDirection: "column",
    //     boxShadow: "4px 0 12px rgba(0,0,0,0.25)",
    // },

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
        marginTop: "auto",
        background: "#ff6b7a",
        border: "none",
        padding: "12px",
        borderRadius: 10,
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 15,
        boxShadow: "0 10px 24px rgba(11,18,32,0.3)",
        transition: "0.25s",
    },

    // content: {
    //     flex: 1,
    //     padding: "40px",
    //     background: "#F5F7FF",
    // },

    content: {
        marginLeft: 260,
        padding: "40px",
        background:
            "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        width: "100%",
        minHeight: "100vh",
    },
};
