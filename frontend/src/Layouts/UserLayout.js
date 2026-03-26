import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { logoutUser } from "../utils/logout";
import LogoutConfirmDialog from "../Components/common/LogoutConfirmDialog";

export default function UserLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [logoutOpen, setLogoutOpen] = useState(false);
    const location = useLocation();

    const profileRef = useRef();
    const isTrackSection = location.pathname.startsWith("/complaint-tracking");
    const isReportSection = location.pathname.startsWith("/file-complaint");
    const isMyCasesSection =
        location.pathname.startsWith("/my-complaints") ||
        location.pathname.startsWith("/complaint/");

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(e) {
            if (profileRef.current && !profileRef.current.contains(e.target)) {
                setProfileOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const media = window.matchMedia("(max-width: 860px)");
        const update = () => setIsMobile(media.matches);
        update();
        if (media.addEventListener) {
            media.addEventListener("change", update);
        } else {
            media.addListener(update);
        }
        return () => {
            if (media.removeEventListener) {
                media.removeEventListener("change", update);
            } else {
                media.removeListener(update);
            }
        };
    }, []);

    const openLogoutDialog = () => {
        setProfileOpen(false);
        setMenuOpen(false);
        setLogoutOpen(true);
    };

    return (
        <div style={styles.wrapper}>

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navInner}> {/* ⭐ CENTERED CONTENT */}

                    <div style={styles.logo}>CivilEye</div>

                    {/* Desktop Links */}
                    {!isMobile && (
                        <div style={styles.navLinks}>
                            <NavLink
                                to="/user/dashboard"
                                style={({ isActive }) =>
                                    isActive ? { ...styles.link, ...styles.activeLink } : styles.link
                                }
                            >
                                Dashboard
                            </NavLink>
                            <NavLink
                                to="/complaint-tracking"
                                style={isTrackSection ? { ...styles.link, ...styles.activeLink } : styles.link}
                            >
                                Track
                            </NavLink>
                            <NavLink
                                to="/file-complaint"
                                style={isReportSection ? { ...styles.link, ...styles.activeLink } : styles.link}
                            >
                                Report
                            </NavLink>
                            <NavLink
                                to="/my-complaints"
                                style={isMyCasesSection ? { ...styles.link, ...styles.activeLink } : styles.link}
                            >
                                My Cases
                            </NavLink>

                            <div style={styles.profileWrapper} ref={profileRef}>
                                <div
                                    style={styles.profileIcon}
                                    onClick={() => setProfileOpen(!profileOpen)}
                                >
                                    👤
                                </div>

                                {profileOpen && (
                                    <div style={styles.dropdown}>
                                        <a href="/profile" style={styles.dropdownItem}>My Profile</a>

                                        <button onClick={openLogoutDialog} style={styles.dropdownLogout}>
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* MOBILE HAMBURGER */}
                    {isMobile && (
                        <div
                            style={styles.hamburger}
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            <span style={styles.bar}></span>
                            <span style={styles.bar}></span>
                            <span style={styles.bar}></span>
                        </div>
                    )}

                </div>
            </nav>

            {/* MOBILE MENU */}
            {menuOpen && isMobile && (
                <div style={styles.mobileMenu}>
                    <NavLink
                        to="/user/dashboard"
                        style={({ isActive }) =>
                            isActive ? { ...styles.mobileLink, ...styles.mobileActiveLink } : styles.mobileLink
                        }
                    >
                        Dashboard
                    </NavLink>
                    <NavLink
                        to="/complaint-tracking"
                        style={isTrackSection ? { ...styles.mobileLink, ...styles.mobileActiveLink } : styles.mobileLink}
                    >
                        Track
                    </NavLink>
                    <NavLink
                        to="/file-complaint"
                        style={isReportSection ? { ...styles.mobileLink, ...styles.mobileActiveLink } : styles.mobileLink}
                    >
                        Report
                    </NavLink>
                    <NavLink
                        to="/my-complaints"
                        style={isMyCasesSection ? { ...styles.mobileLink, ...styles.mobileActiveLink } : styles.mobileLink}
                    >
                        My Cases
                    </NavLink>
                    <NavLink
                        to="/profile"
                        style={({ isActive }) =>
                            isActive ? { ...styles.mobileLink, ...styles.mobileActiveLink } : styles.mobileLink
                        }
                    >
                        Profile
                    </NavLink>

                    <button onClick={openLogoutDialog} style={styles.mobileLogoutBtn}>
                        Logout
                    </button>
                </div>
            )}

            {/* CONTENT */}
            <main style={{ marginTop: 90 }}>{children}</main>

            <LogoutConfirmDialog
                open={logoutOpen}
                onCancel={() => setLogoutOpen(false)}
                onConfirm={logoutUser}
            />
        </div>
    );
}

//
// UPDATED STYLES
//
const styles = {
    wrapper: { fontFamily: "Space Grotesk, system-ui, sans-serif" },

    navbar: {
        position: "fixed",
        top: 0,
        width: "100%",
        background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)",
        padding: "12px 0",
        zIndex: 200,
        borderBottom: "1px solid rgba(15,23,42,0.08)",
    },

    navInner: {
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "0 26px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
    },

    logo: { fontSize: 20, fontWeight: 700, color: "var(--ink-900)" },

    navLinks: {
        display: "flex",
        gap: 22,
        alignItems: "center",
    },

    link: {
        color: "var(--ink-600)",
        textDecoration: "none",
        fontSize: 15,
        transition: "0.2s ease",
        paddingBottom: 8,
        borderBottom: "2px solid transparent",
        fontWeight: 500,
    },

    activeLink: {
        color: "var(--ink-900)",
        borderBottom: "2px solid var(--mint-500)",
        fontWeight: 700,
    },

    /******** PROFILE ICON ********/
    profileWrapper: {
        position: "relative",
    },

    profileIcon: {
        width: 38,
        height: 38,
        borderRadius: "50%",
        background: "rgba(15,23,42,0.08)",
        border: "1px solid rgba(15,23,42,0.12)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 18,
    },

    dropdown: {
        position: "absolute",
        top: 48,
        right: 0,
        width: 170,
        background: "#0f172a",
        borderRadius: 10,
        boxShadow: "0 14px 32px rgba(11,18,32,0.25)",
        padding: "10px 0",
        animation: "fadeIn 0.2s ease-out",
        zIndex: 300,
    },

    dropdownItem: {
        display: "block",
        padding: "10px 16px",
        color: "#e2e8f0",
        textDecoration: "none",
        fontSize: 15,
    },

    dropdownLogout: {
        width: "100%",
        padding: "10px 16px",
        textAlign: "left",
        color: "#ff9aa6",
        background: "transparent",
        border: "none",
        fontSize: 15,
        cursor: "pointer",
        fontWeight: 600,
    },

    mobileLink: {
        display: "block",
        padding: "12px 14px",
        borderRadius: 12,
        textDecoration: "none",
        color: "var(--ink-700)",
        fontWeight: 600,
        background: "rgba(255,255,255,0.55)",
        border: "1px solid rgba(15,23,42,0.08)",
    },

    mobileActiveLink: {
        color: "var(--ink-900)",
        background: "rgba(26,167,155,0.12)",
        border: "1px solid rgba(26,167,155,0.28)",
        boxShadow: "0 8px 20px rgba(26,167,155,0.08)",
    },

    /******** HAMBURGER ********/
    hamburger: {
        display: "none",
        flexDirection: "column",
        gap: 4,
        cursor: "pointer",
    },

    bar: {
        width: 24,
        height: 3,
        background: "var(--ink-900)",
        borderRadius: 2,
    },

    /******** MOBILE MENU ********/
    mobileMenu: {
        position: "fixed",
        top: 65,
        right: 0,
        width: 240,
        background: "linear-gradient(180deg, #ffffff 0%, #f8f5ef 100%)",
        padding: 20,
        borderRadius: "0 0 0 18px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "-10px 14px 28px rgba(11,18,32,0.18)",
        borderLeft: "1px solid rgba(15,23,42,0.08)",
        borderBottom: "1px solid rgba(15,23,42,0.08)",
        animation: "slideIn 0.25s forwards",
        zIndex: 150,
    },

    mobileLogoutBtn: {
        marginTop: 10,
        padding: "12px",
        background: "#ff5c6c",
        border: "none",
        borderRadius: 12,
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
    },
};
