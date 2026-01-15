import React, { useState } from "react";
import {
    Box,
    Button,
    TextField,
    Typography,
    Paper,
    Fade,
    Stack,
    Divider,
    IconButton,
    CircularProgress,
    InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import SecurityIcon from "@mui/icons-material/Security";

export default function LoginPage() {
    const [mode, setMode] = useState("LOGIN"); // LOGIN, SIGNUP, FORGOT, QUESTION, RESET
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");
    const [securityAnswer, setSecurityAnswer] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (mode === "SIGNUP") {
                const res = await fetch(`${API_URL}/api/signup`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ name, email, password, securityQuestion: "Which city were you born in?", securityAnswer }),
                });
                if (res.ok) navigate("/dashboard");
                else alert((await res.json()).error);

            } else if (mode === "LOGIN") {
                const res = await fetch(`${API_URL}/api/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password }),
                });
                if (res.ok) navigate("/dashboard");
                else alert((await res.json()).error);

            } else if (mode === "FORGOT") {
                const res = await fetch(`${API_URL}/api/recover`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email }),
                });
                const data = await res.json();
                if (res.ok) setMode("QUESTION");
                else alert(data.error);

            } else if (mode === "QUESTION") {
                const res = await fetch(`${API_URL}/api/recover`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, answer: securityAnswer }),
                });
                if (res.ok) setMode("RESET");
                else alert((await res.json()).error);

            } else if (mode === "RESET") {
                const res = await fetch(`${API_URL}/api/reset`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, newPassword: password }),
                });
                if (res.ok) {
                    setMode("LOGIN");
                    alert("Password reset successfully! Please login.");
                } else alert((await res.json()).error);
            }
        } catch (err) {
            console.error(err);
            alert("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const getTitle = () => {
        switch (mode) {
            case "SIGNUP": return "Create Account";
            case "FORGOT": return "Reset Password";
            case "QUESTION": return "Security Check";
            case "RESET": return "New Password";
            default: return "Welcome Back";
        }
    };

    const getSubtitle = () => {
        switch (mode) {
            case "SIGNUP": return "Join us to start learning smarter.";
            case "FORGOT": return "Enter your email to find your account.";
            case "QUESTION": return "Verify your identity.";
            case "RESET": return "Choose a strong new password.";
            default: return "Login to access your summaries.";
        }
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "var(--bg-primary)",
                p: 2,
            }}
        >
            <Fade in={true} timeout={800}>
                <Paper
                    elevation={0}
                    className="float-animation"
                    sx={{
                        p: { xs: 3, sm: 5 },
                        width: "100%",
                        maxWidth: 420,
                        borderRadius: 4,
                        backdropFilter: "blur(20px)",
                        background: "var(--glass-bg)",
                        border: "var(--glass-border)",
                        boxShadow: "var(--glass-shadow)",
                    }}
                >
                    {mode !== "LOGIN" && (
                        <Fade in={true}>
                            <IconButton
                                onClick={() => setMode("LOGIN")}
                                sx={{
                                    color: "var(--text-secondary)",
                                    mb: 1,
                                    ml: -1.5,
                                    "&:hover": { color: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" }
                                }}
                            >
                                <ArrowBackIcon />
                            </IconButton>
                        </Fade>
                    )}

                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 2, mb: 1 }}>
                            <img src="/logo.png" alt="Bridge Logo" style={{ width: 48, height: 48 }} />
                            <Typography
                                variant="h4"
                                sx={{
                                    fontWeight: 800,
                                    background: "linear-gradient(to right, #818cf8, #34d399)",
                                    backgroundClip: "text",
                                    textFillColor: "transparent",
                                    letterSpacing: "-0.5px",
                                }}
                            >
                                Bridge
                            </Typography>
                        </Box>
                        <Typography variant="h5" sx={{ fontWeight: 700, color: "var(--text-primary)", mb: 0.5 }}>
                            {getTitle()}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
                            {getSubtitle()}
                        </Typography>
                    </Box>

                    <form onSubmit={handleAuth}>
                        <Stack spacing={2.5}>
                            {mode === "SIGNUP" && (
                                <Fade in={true}>
                                    <Box>
                                        <TextField
                                            fullWidth
                                            placeholder="Full Name"
                                            variant="outlined"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonIcon sx={{ color: "var(--text-secondary)" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />
                                        <Typography sx={{ color: "var(--text-secondary)", mt: 2, mb: 1, fontSize: "0.85rem", ml: 1 }}>
                                            Security Question: <strong>Which city were you born in?</strong>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="City Name"
                                            variant="outlined"
                                            value={securityAnswer}
                                            onChange={(e) => setSecurityAnswer(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SecurityIcon sx={{ color: "var(--text-secondary)" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Fade>
                            )}

                            {(mode === "LOGIN" || mode === "SIGNUP" || mode === "FORGOT") && (
                                <TextField
                                    fullWidth
                                    placeholder="Email Address"
                                    variant="outlined"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailIcon sx={{ color: "var(--text-secondary)" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />
                            )}

                            {mode === "QUESTION" && (
                                <Fade in={true}>
                                    <Box>
                                        <Typography sx={{ color: "var(--text-primary)", mb: 2, textAlign: "center" }}>
                                            Security Question: <br /><strong>Which city were you born in?</strong>
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            placeholder="Your Answer"
                                            variant="outlined"
                                            value={securityAnswer}
                                            onChange={(e) => setSecurityAnswer(e.target.value)}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <SecurityIcon sx={{ color: "var(--text-secondary)" }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={inputStyle}
                                        />
                                    </Box>
                                </Fade>
                            )}

                            {(mode === "LOGIN" || mode === "SIGNUP" || mode === "RESET") && (
                                <TextField
                                    fullWidth
                                    placeholder={mode === "RESET" ? "New Password" : "Password"}
                                    type="password"
                                    variant="outlined"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockIcon sx={{ color: "var(--text-secondary)" }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={inputStyle}
                                />
                            )}

                            <Button
                                fullWidth
                                type="submit"
                                variant="contained"
                                size="large"
                                disabled={loading}
                                sx={{
                                    py: 1.8,
                                    borderRadius: 3,
                                    fontSize: "1rem",
                                    fontWeight: 700,
                                    textTransform: "none",
                                    background: "linear-gradient(to right, #6366f1, #4f46e5)",
                                    boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
                                    transition: "all 0.3s ease",
                                    "&:hover": {
                                        background: "linear-gradient(to right, #4f46e5, #4338ca)",
                                        transform: "translateY(-2px)",
                                        boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.5)",
                                    },
                                    "&:active": {
                                        transform: "translateY(0)",
                                    },
                                }}
                            >
                                {loading ? <CircularProgress size={24} color="inherit" /> : getActionText(mode)}
                            </Button>
                        </Stack>
                    </form>

                    {mode === "LOGIN" && (
                        <Fade in={true} timeout={1000}>
                            <Box sx={{ mt: 3 }}>
                                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "var(--text-secondary)",
                                            cursor: "pointer",
                                            transition: "color 0.2s",
                                            "&:hover": { color: "var(--text-primary)" }
                                        }}
                                        onClick={() => setMode("FORGOT")}
                                    >
                                        Forgot Password?
                                    </Typography>
                                    <Typography
                                        variant="body2"
                                        sx={{
                                            color: "var(--accent-color)",
                                            fontWeight: 600,
                                            cursor: "pointer",
                                            transition: "color 0.2s",
                                            "&:hover": { color: "#4f46e5" }
                                        }}
                                        onClick={() => setMode("SIGNUP")}
                                    >
                                        Create Account
                                    </Typography>
                                </Box>

                                <Divider sx={{ borderColor: "rgba(0,0,0,0.1)", mb: 3 }}>
                                    <Typography variant="caption" sx={{ color: "var(--text-secondary)", px: 1 }}>
                                        OR CONTINUE WITH
                                    </Typography>
                                </Divider>

                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<GoogleIcon />}
                                    href={`${API_URL}/auth/google`}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 3,
                                        color: "var(--text-primary)",
                                        borderColor: "rgba(0,0,0,0.15)",
                                        background: "white",
                                        textTransform: "none",
                                        fontSize: "0.95rem",
                                        transition: "all 0.2s",
                                        "&:hover": {
                                            borderColor: "var(--text-primary)",
                                            background: "rgba(0,0,0,0.02)"
                                        },
                                    }}
                                >
                                    Google
                                </Button>
                            </Box>
                        </Fade>
                    )}
                </Paper>
            </Fade>
        </Box>
    );
}

const getActionText = (mode) => {
    switch (mode) {
        case "SIGNUP": return "Create Account";
        case "FORGOT": return "Send Recovery Link";
        case "QUESTION": return "Verify Answer";
        case "RESET": return "Update Password";
        default: return "Sign In";
    }
};

const inputStyle = {
    "& .MuiOutlinedInput-root": {
        color: "var(--text-primary)",
        borderRadius: 3,
        backgroundColor: "rgba(255,255,255,0.4)",
        transition: "all 0.2s",
        "& fieldset": { borderColor: "rgba(0,0,0,0.1)" },
        "&:hover": { backgroundColor: "rgba(255,255,255,0.6)" },
        "&:hover fieldset": { borderColor: "rgba(0,0,0,0.2)" },
        "&.Mui-focused": { backgroundColor: "rgba(255,255,255,0.8)" },
        "&.Mui-focused fieldset": { borderColor: "#818cf8", borderWidth: "1px" },
    },
    "& .MuiInputBase-input::placeholder": {
        color: "var(--text-secondary)",
        opacity: 0.7,
    },
};
