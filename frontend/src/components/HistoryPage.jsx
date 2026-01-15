import React, { useEffect, useState } from "react";
import {
    Container,
    Typography,
    Paper,
    Box,
    Divider,
    List,
    Chip,
    Fade,
    Button,
    IconButton,
    Tooltip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
    const [summaries, setSummaries] = useState([]);
    const navigate = useNavigate();
    const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "var(--bg-primary)",
                color: "var(--text-primary)",
                py: 6,
                px: 2,
            }}
        >
            <Container maxWidth="md">
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => navigate("/dashboard")}
                    sx={{
                        mb: 4,
                        color: "var(--text-secondary)",
                        "&:hover": { color: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" },
                    }}
                >
                    Back to Dashboard
                </Button>

                <Box sx={{ mb: 6, textAlign: "center" }}>
                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 2, mb: 1 }}>
                        <img src="/logo.png" alt="Bridge Logo" style={{ width: 40, height: 40 }} />
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 800,
                                background: "linear-gradient(to right, #818cf8, #34d399)",
                                backgroundClip: "text",
                                textFillColor: "transparent",
                            }}
                        >
                            Your Library
                        </Typography>
                    </Box>
                    <Typography variant="body1" sx={{ color: "var(--text-secondary)" }}>
                        A collection of your past learnings
                    </Typography>
                </Box>

                <HistoryList API_URL={API_URL} />
            </Container>
        </Box>
    );
}

function HistoryList({ API_URL }) {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${API_URL}/api/history`, {
            credentials: "include",
        })
            .then((res) => res.json())
            .then((data) => {
                setItems(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Failed to fetch history", err);
                setLoading(false);
            });
    }, [API_URL]);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this summary?")) return;

        try {
            const res = await fetch(`${API_URL}/api/history/${id}`, {
                method: "DELETE",
                credentials: "include",
            });
            if (res.ok) {
                setItems((prev) => prev.filter((item) => item._id !== id));
            } else {
                console.error("Failed to delete");
            }
        } catch (err) {
            console.error("Delete error", err);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    if (loading)
        return (
            <Box sx={{ textAlign: "center", mt: 10 }}>
                <Typography sx={{ color: "rgba(255,255,255,0.5)" }}>Loading your library...</Typography>
            </Box>
        );

    if (!items || items.length === 0)
        return (
            <Box sx={{ textAlign: "center", mt: 10, p: 5, border: "2px dashed rgba(255,255,255,0.1)", borderRadius: 4 }}>
                <Typography variant="h6" sx={{ color: "var(--text-secondary)", mb: 1 }}>It's quiet here...</Typography>
                <Typography variant="body2" sx={{ color: "var(--text-secondary)", opacity: 0.7 }}>
                    Start summarizing texts to build your history!
                </Typography>
            </Box>
        );

    const getTypeIcon = (type) => {
        switch (type) {
            case 'image': return <ImageIcon sx={{ color: "#34d399", fontSize: "1.2rem" }} />;
            case 'pdf': return <PictureAsPdfIcon sx={{ color: "#ef4444", fontSize: "1.2rem" }} />;
            case 'audio': return <AudioFileIcon sx={{ color: "#ec4899", fontSize: "1.2rem" }} />;
            default: return <TextFieldsIcon sx={{ color: "#818cf8", fontSize: "1.2rem" }} />;
        }
    };

    const getTypeLabel = (type) => {
        switch (type) {
            case 'image': return "Image Analysis";
            case 'pdf': return "PDF Summary";
            case 'audio': return "Audio Transcript";
            default: return "Text Summary";
        }
    };

    return (
        <List sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {items.map((item, index) => (
                <Fade in timeout={500 + index * 100} key={item._id}>
                    <Paper
                        elevation={0}
                        className="float-animation"
                        sx={{
                            p: 4,
                            bgcolor: "transparent",
                            backdropFilter: "blur(20px)",
                            background: "var(--glass-bg)",
                            border: "var(--glass-border)",
                            borderRadius: 4,
                            boxShadow: "var(--glass-shadow)",
                            transition: "all 0.3s ease",
                            "&:hover": {
                                transform: "translateY(-4px)",
                                background: "rgba(255,255,255,0.8)",
                                border: "1px solid rgba(129, 140, 248, 0.5)",
                                boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)",
                            },
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
                            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                                <Chip
                                    icon={getTypeIcon(item.type)}
                                    label={getTypeLabel(item.type)}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(255,255,255,0.5)",
                                        color: "var(--text-primary)",
                                        fontWeight: 600,
                                        border: "1px solid rgba(0,0,0,0.05)",
                                        height: 28,
                                    }}
                                />
                                <Chip
                                    icon={<CalendarTodayIcon sx={{ fontSize: "0.9rem !important" }} />}
                                    label={new Date(item.date).toLocaleDateString(undefined, {
                                        weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                                    })}
                                    size="small"
                                    sx={{
                                        bgcolor: "rgba(129, 140, 248, 0.15)",
                                        color: "#818cf8",
                                        fontWeight: 600,
                                        border: "1px solid rgba(129, 140, 248, 0.2)",
                                        height: 28,
                                    }}
                                />
                            </Box>
                            <Box>
                                <Tooltip title="Copy Content">
                                    <IconButton
                                        onClick={() => copyToClipboard(item.summaryText)}
                                        size="small"
                                        aria-label="Copy Content"
                                        sx={{ color: "var(--text-secondary)", "&:hover": { color: "#818cf8", bgcolor: "rgba(129,140,248,0.1)" } }}
                                    >
                                        <ContentCopyIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                                <Tooltip title="Delete">
                                    <IconButton
                                        onClick={() => handleDelete(item._id)}
                                        size="small"
                                        aria-label="Delete"
                                        sx={{
                                            color: "var(--text-secondary)",
                                            ml: 1,
                                            "&:hover": { color: "#f87171", bgcolor: "rgba(248, 113, 113, 0.1)" }
                                        }}
                                    >
                                        <DeleteOutlineIcon fontSize="small" />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        </Box>

                        {item.type === 'text' && (
                            <Typography
                                variant="body2"
                                sx={{
                                    color: "var(--text-secondary)",
                                    mb: 3,
                                    fontStyle: "italic",
                                    borderLeft: "2px solid rgba(0,0,0,0.1)",
                                    pl: 2,
                                    py: 0.5,
                                }}
                            >
                                "{item.originalText.substring(0, 120)}{item.originalText.length > 120 ? "..." : ""}"
                            </Typography>
                        )}

                        <Divider sx={{ borderColor: "rgba(255,255,255,0.05)", mb: 3 }} />

                        <Typography
                            sx={{
                                color: "var(--text-primary)",
                                lineHeight: 1.7,
                                fontSize: "1.05rem",
                            }}
                        >
                            {item.summaryText}
                        </Typography>
                    </Paper>
                </Fade>
            ))}
        </List>
    );
}
