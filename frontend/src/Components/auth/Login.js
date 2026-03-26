import React, { useState } from "react";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import OtpInput6 from "./OtpInput6";

const INITIAL_STEP = "email"; // email | password | verifyEmail | setupPassword

export default function Login() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [setupToken, setSetupToken] = useState("");

    const [step, setStep] = useState(INITIAL_STEP);
    const [otpSent, setOtpSent] = useState(false);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [disabledDialog, setDisabledDialog] = useState(false);

    const resetMessages = () => {
        setError("");
        setSuccess("");
    };

    const normalizeEmail = (value) => value.trim().toLowerCase();

    const resetToEmailStep = () => {
        setStep(INITIAL_STEP);
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setSetupToken("");
        setOtpSent(false);
        resetMessages();
    };

    const handleContinueWithEmail = async (e) => {
        e.preventDefault();
        if (loading) return;
        resetMessages();

        const normalizedEmail = normalizeEmail(email);
        if (!normalizedEmail) {
            setError("Email is required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/login/email-status", { email: normalizedEmail });
            const { nextStep } = res.data;

            setEmail(normalizedEmail);

            if (nextStep === "verifyEmail") {
                setStep("verifyEmail");
                setSuccess("Continue with email verification.");
                return;
            }

            if (nextStep === "verifyUserOtp") {
                navigate(`/otp?email=${encodeURIComponent(normalizedEmail)}`);
                return;
            }

            if (nextStep === "setupUserPassword") {
                navigate(`/set-password?email=${encodeURIComponent(normalizedEmail)}`);
                return;
            }

            if (nextStep === "setupPassword") {
                setStep("setupPassword");
                setSuccess("Continue to create your password.");
                return;
            }

            if (nextStep === "disabled") {
                setDisabledDialog(true);
                return;
            }

            if (nextStep === "notFound") {
                setStep(INITIAL_STEP);
                setError("Email not found. Please register first.");
                return;
            }

            setStep("password");
        } catch (err) {
            setError(err.response?.data?.error || "Unable to verify email");
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordLogin = async (e) => {
        e.preventDefault();
        if (loading) return;
        resetMessages();

        if (!email || !password) {
            setError("Email and password are required");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/login", { email, password });
            const role = res.data.role;

            localStorage.setItem("token", res.data.token);
            console.log("Received token:", res.data.token);
            localStorage.setItem("role", role);
            localStorage.setItem("email", email);
            if (role === "Admin") {
                localStorage.setItem("adminToken", res.data.token);
            }

            setSuccess("Login successful. Redirecting...");

            setTimeout(() => {
                if (role === "Admin") {
                    window.location.href = "/admin/dashboard";
                } else if (role === "Investigator") {
                    window.location.href = "/investigator/dashboard";
                } else {
                    window.location.href = "/user/dashboard";
                }
            }, 700);
        } catch (err) {
            const errMsg = err.response?.data?.error || "Invalid credentials";
            if (err.response?.status === 403 && errMsg.toLowerCase().includes("disabled")) {
                setDisabledDialog(true);
                setPassword("");
            } else {
                setError(errMsg);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSendVerificationOtp = async () => {
        if (loading) return;
        resetMessages();
        setLoading(true);
        try {
            await api.post("/api/investigators/verify-email/request-otp", { email });
            setOtpSent(true);
            setSuccess("If eligible, a verification OTP has been sent.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send verification OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyEmailOtp = async () => {
        if (loading) return;
        resetMessages();

        if (!/^\d{6}$/.test(otp)) {
            setError("Enter a valid 6-digit OTP");
            return;
        }

        setLoading(true);
        try {
            const res = await api.post("/api/investigators/verify-email/confirm-otp", { email, otp });
            setOtp("");
            setOtpSent(false);
            setSetupToken(res.data?.setupToken || "");
            setStep("setupPassword");
            setSuccess("Email verified. Now create your password.");
        } catch (err) {
            setError(err.response?.data?.error || "OTP verification failed");
        } finally {
            setLoading(false);
        }
    };

    const handleCreatePassword = async () => {
        if (loading) return;
        resetMessages();

        if (!setupToken) {
            setError("Session expired. Verify email again.");
            setStep("verifyEmail");
            return;
        }
        if (!password || !confirmPassword) {
            setError("Password and confirm password are required");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            await api.post("/api/investigators/set-password", {
                setupToken,
                newPassword: password,
            });

            setPassword("");
            setConfirmPassword("");
            setSetupToken("");
            setStep("password");
            setSuccess("Password created. Sign in with your email and password.");
        } catch (err) {
            setError(err.response?.data?.error || "Failed to create password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.page}>
            <div style={styles.glowA} />
            <div style={styles.glowB} />

            <nav style={styles.navbar}>
                <div style={styles.navLeft}>
                    <span style={styles.logo} onClick={() => navigate("/")}>
                        CivilEye
                    </span>
                    <span style={styles.navTag}>Unified Access</span>
                </div>

                <div style={styles.navRight}>
                    <span style={styles.navLink} onClick={() => navigate("/")}>Home</span>
                    <span style={styles.navLink} onClick={() => navigate("/aboutpage")}>About</span>
                    <span style={styles.navLink} onClick={() => navigate("/contactpage")}>Contact</span>
                    <span style={styles.navLink} onClick={() => navigate("/login")}>Login</span>
                </div>
            </nav>

            <div style={styles.container}>
                <div style={styles.sideCard}>
                    <p style={styles.eyebrow}>Welcome Back</p>
                    <h2 style={styles.sideTitle}>Protect your account before you proceed.</h2>
                    <p style={styles.sideText}>
                        Use your registered email and keep your password private. Never share
                        OTPs, passwords, or reset links with anyone.
                    </p>
                    <div style={styles.sideNote}>
                        Security tip: verify the website address before logging in and avoid
                        signing in on unknown/public devices.
                    </div>
                </div>

                <div style={styles.card}>
                    <h2 style={styles.title}>Sign In</h2>
                    <p style={styles.subtitle}>Enter your registered email to continue</p>

                    {error && <p style={styles.error}>{error}</p>}
                    {success && <p style={styles.success}>{success}</p>}

                    {step === "email" && (
                        <form onSubmit={handleContinueWithEmail} style={styles.form}>
                            <input
                                type="email"
                                style={styles.input}
                                placeholder="Email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <button type="submit" style={styles.button} disabled={loading}>
                                {loading ? "Checking..." : "Continue"}
                            </button>
                        </form>
                    )}

                    {step === "password" && (
                        <form onSubmit={handlePasswordLogin} style={styles.form}>
                            <input type="email" style={styles.input} value={email} disabled />
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit" style={styles.button} disabled={loading}>
                                {loading ? "Signing in..." : "Login"}
                            </button>
                        </form>
                    )}

                    {step === "verifyEmail" && (
                        <div style={styles.form}>
                            <input type="email" style={styles.input} value={email} disabled />

                            {!otpSent && (
                                <button onClick={handleSendVerificationOtp} style={styles.button} disabled={loading}>
                                    {loading ? "Sending..." : "Send Email Verification OTP"}
                                </button>
                            )}

                            {otpSent && (
                                <>
                                    <OtpInput6 value={otp} onChange={setOtp} disabled={loading} />
                                    <button onClick={handleVerifyEmailOtp} style={styles.button} disabled={loading}>
                                        {loading ? "Verifying..." : "Verify Email"}
                                    </button>
                                    <button onClick={handleSendVerificationOtp} style={styles.secondaryButton} disabled={loading}>
                                        {loading ? "Sending..." : "Resend OTP"}
                                    </button>
                                </>
                            )}
                        </div>
                    )}

                    {step === "setupPassword" && (
                        <div style={styles.form}>
                            <input type="email" style={styles.input} value={email} disabled />
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="Create Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                style={styles.input}
                                placeholder="Confirm Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                            <button onClick={handleCreatePassword} style={styles.button} disabled={loading}>
                                {loading ? "Saving..." : "Save Password"}
                            </button>
                        </div>
                    )}

                    {step !== "email" && (
                        <p style={styles.footer}>
                            <span style={styles.link} onClick={resetToEmailStep}>Change email</span>
                        </p>
                    )}

                    {step === "password" && (
                        <p style={styles.footer}>
                            <span style={styles.link} onClick={() => navigate("/forgot-password")}>Forgot password?</span>
                        </p>
                    )}

                    {(step === "email" || step === "password") && (
                        <p style={styles.footer}>
                            Don’t have an account? <span style={styles.link} onClick={() => navigate("/register")}>Register</span>
                        </p>
                    )}
                </div>
            </div>

            {disabledDialog && (
                <div style={styles.modalOverlay}>
                    <div style={styles.modal}>
                        <h3 style={styles.modalTitle}>Account Disabled</h3>
                        <p style={styles.modalText}>
                            Your investigator account is currently disabled. Please contact admin.
                        </p>
                        <div style={styles.modalActions}>
                            <button
                                style={styles.button}
                                onClick={() => setDisabledDialog(false)}
                            >
                                OK
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

const styles = {
    page: {
        background: "radial-gradient(circle at top, #ffffff 0%, #f6f3ee 40%, #efe9df 100%)",
        minHeight: "100vh",
        paddingBottom: 40,
        position: "relative",
        overflow: "hidden",
    },
    glowA: {
        position: "absolute",
        width: 260,
        height: 260,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(26,167,155,0.18), transparent 70%)",
        top: -120,
        left: -80,
    },
    glowB: {
        position: "absolute",
        width: 220,
        height: 220,
        borderRadius: "50%",
        background: "radial-gradient(circle, rgba(58,163,255,0.18), transparent 70%)",
        bottom: -120,
        right: -60,
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
    container: {
        width: "100%",
        maxWidth: 1100,
        margin: "40px auto 0",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: 24,
        padding: "0 28px",
        position: "relative",
        zIndex: 1,
    },
    sideCard: {
        background: "#0f172a",
        color: "#fff",
        padding: "32px",
        borderRadius: 22,
        boxShadow: "0 18px 40px rgba(11,18,32,0.28)",
        animation: "fadeUp 0.8s ease both",
    },
    eyebrow: {
        fontSize: 12,
        textTransform: "uppercase",
        letterSpacing: "0.24em",
        color: "rgba(255,255,255,0.7)",
        fontWeight: 700,
        marginBottom: 12,
    },
    sideTitle: { fontFamily: '"DM Serif Display", serif', fontSize: 30, margin: 0 },
    sideText: { marginTop: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.6 },
    sideNote: {
        marginTop: 22,
        padding: "12px 14px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.08)",
        fontSize: 13,
    },
    card: {
        width: "100%",
        background: "#fff",
        padding: "32px",
        borderRadius: 22,
        boxShadow: "var(--card-shadow)",
        animation: "fadeUp 0.9s ease both",
    },
    title: { fontSize: 24, fontWeight: 700, marginBottom: 6 },
    subtitle: { fontSize: 14, color: "var(--ink-600)", marginBottom: 24 },
    form: { display: "flex", flexDirection: "column", gap: 16 },
    input: {
        padding: "13px 14px",
        borderRadius: 12,
        border: "1px solid rgba(15, 23, 42, 0.15)",
        background: "rgba(250, 250, 250, 0.9)",
    },
    button: {
        padding: 14,
        background: "var(--mint-500)",
        borderRadius: 12,
        border: "none",
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
    },
    secondaryButton: {
        padding: 14,
        background: "#eef4f8",
        borderRadius: 12,
        border: "1px solid #d9e2ec",
        color: "#334155",
        fontWeight: 700,
        cursor: "pointer",
    },
    footer: { marginTop: 16, fontSize: 14, color: "var(--ink-600)" },
    link: { color: "var(--mint-600)", fontWeight: 600, cursor: "pointer" },
    error: { color: "#e63946", fontWeight: 600 },
    success: { color: "#2ea44f", fontWeight: 600 },
    modalOverlay: {
        position: "fixed",
        inset: 0,
        background: "rgba(11,18,32,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 3000,
        padding: 16,
    },
    modal: {
        width: "100%",
        maxWidth: 420,
        background: "#fff",
        borderRadius: 16,
        padding: 22,
        boxShadow: "0 20px 38px rgba(11,18,32,0.26)",
    },
    modalTitle: {
        margin: "0 0 8px",
        fontSize: 20,
    },
    modalText: {
        margin: 0,
        color: "var(--ink-600)",
    },
    modalActions: {
        display: "flex",
        justifyContent: "flex-end",
        marginTop: 18,
    },
};
