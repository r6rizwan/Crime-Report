import React from "react";
import { NavLink } from "react-router-dom";
import { logoutUser } from "../utils/logout";

export default function InvestigatorLayout({ children }) {
    return (
        <div style={styles.container}>

            {/* Fixed Sidebar */}
            <aside style={styles.sidebar}>

                {/* WRAPPER THAT PREVENTS OVERFLOW */}
                <div style={styles.sidebarInner}>

                    <h2 style={styles.brand}>Investigator</h2>

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
                            style={({ isActive }) =>
                                isActive ? { ...styles.link, ...styles.active } : styles.link
                            }
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
        fontFamily: "Inter, sans-serif",
    },

    // FIXED SIDEBAR
    sidebar: {
        position: "fixed",
        top: 0,
        left: 0,
        width: 260,
        height: "100vh",
        background: "#0E1A33",
        boxShadow: "4px 0 12px rgba(0,0,0,0.25)",
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

    brand: {
        fontSize: 22,
        fontWeight: 700,
        marginBottom: 40,
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
        color: "#c8d5ff",
        transition: "0.25s",
        display: "block",
    },

    active: {
        background: "#1C2F57",
        color: "white",
        fontWeight: 600,
        boxShadow: "0 2px 10px rgba(0,0,0,0.25)",
    },

    logout: {
        background: "#ff5f5f",
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
    },

    content: {
        marginLeft: 260,
        padding: "40px",
        background: "#F5F7FF",
        width: "100%",
        minHeight: "100vh",
    },
};
