import React from "react";

export default function LogoutConfirmDialog({
    open,
    title = "Confirm Logout",
    message = "Are you sure you want to log out of your account?",
    confirmLabel = "Logout",
    cancelLabel = "Cancel",
    onCancel,
    onConfirm,
}) {
    if (!open) return null;

    return (
        <div style={styles.overlay}>
            <div style={styles.modal}>
                <p style={styles.eyebrow}>Secure Session</p>
                <h3 style={styles.title}>{title}</h3>
                <p style={styles.message}>{message}</p>
                <div style={styles.actions}>
                    <button type="button" style={styles.cancelBtn} onClick={onCancel}>
                        {cancelLabel}
                    </button>
                    <button type="button" style={styles.confirmBtn} onClick={onConfirm}>
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    overlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(11,18,32,0.52)",
        backdropFilter: "blur(6px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: 20,
    },
    modal: {
        width: "100%",
        maxWidth: 420,
        background: "linear-gradient(180deg, #ffffff 0%, #f8f5ef 100%)",
        borderRadius: 20,
        padding: 24,
        boxShadow: "0 24px 60px rgba(11,18,32,0.22)",
        border: "1px solid rgba(15,23,42,0.08)",
    },
    eyebrow: {
        margin: 0,
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "var(--mint-600)",
        fontWeight: 700,
    },
    title: {
        margin: "10px 0 8px",
        fontSize: 24,
        fontWeight: 700,
        color: "var(--ink-900)",
    },
    message: {
        margin: 0,
        color: "var(--ink-600)",
        lineHeight: 1.6,
    },
    actions: {
        display: "flex",
        justifyContent: "flex-end",
        gap: 10,
        marginTop: 20,
    },
    cancelBtn: {
        background: "rgba(15, 23, 42, 0.08)",
        color: "var(--ink-900)",
        border: "1px solid rgba(15, 23, 42, 0.12)",
        padding: "10px 14px",
        borderRadius: 12,
        fontWeight: 600,
        cursor: "pointer",
    },
    confirmBtn: {
        background: "#dc3545",
        color: "#fff",
        border: "none",
        padding: "10px 16px",
        borderRadius: 12,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 10px 24px rgba(185,28,28,0.2)",
    },
};
