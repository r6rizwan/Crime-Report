import React, { useState, useEffect, useRef } from "react";
import { logoutUser } from "../utils/logout";

export default function UserLayout({ children }) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    const profileRef = useRef();

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

    return (
        <div style={styles.wrapper}>

            {/* NAVBAR */}
            <nav style={styles.navbar}>
                <div style={styles.navInner}> {/* ⭐ CENTERED CONTENT */}

                    <div style={styles.logo}>Crime Report Portal</div>

                    {/* Desktop Links */}
                    {!isMobile && (
                        <div style={styles.navLinks}>
                            <a href="/user/dashboard" style={styles.link}>Dashboard</a>
                            <a href="/complaint-tracking" style={styles.link}>Track</a>
                            <a href="/file-complaint" style={styles.link}>Report</a>
                            <a href="/my-complaints" style={styles.link}>My Cases</a>

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

                                        <button onClick={logoutUser} style={styles.dropdownLogout}>
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
                    <a href="/user/dashboard" style={styles.mobileLink}>Dashboard</a>
                    <a href="/complaint-tracking" style={styles.mobileLink}>Track</a>
                    <a href="/file-complaint" style={styles.mobileLink}>Report</a>
                    <a href="/my-complaints" style={styles.mobileLink}>My Cases</a>
                    <a href="/profile" style={styles.mobileLink}>Profile</a>

                    <button onClick={logoutUser} style={styles.mobileLogoutBtn}>
                        Logout
                    </button>
                </div>
            )}

            {/* CONTENT */}
            <main style={{ marginTop: 90 }}>{children}</main>
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
        width: 220,
        background: "#0f172a",
        padding: 20,
        borderRadius: "0 0 0 14px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "-6px 8px 20px rgba(11,18,32,0.3)",
        animation: "slideIn 0.25s forwards",
        zIndex: 150,
    },

    mobileLink: {
        color: "#e2e8f0",
        textDecoration: "none",
        fontSize: 16,
    },

    mobileLogoutBtn: {
        marginTop: 10,
        padding: "10px",
        background: "#ff5c6c",
        border: "none",
        borderRadius: 6,
        color: "white",
        fontWeight: 700,
        cursor: "pointer",
    },
};
