import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Typography,
  Button,
  Paper,
  Stack,
  Divider,
  TextField,
  Box,
  CircularProgress,
  Fade,
  IconButton,
  Tooltip,
  Grow,
  Chip,
} from "@mui/material";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import StopIcon from "@mui/icons-material/Stop";
import MicIcon from "@mui/icons-material/Mic";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import HistoryIcon from "@mui/icons-material/History";
import LogoutIcon from "@mui/icons-material/Logout";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import AudioFileIcon from "@mui/icons-material/AudioFile";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useNavigate } from "react-router-dom";
import { useTextToSpeech } from "../hooks/UseTextToSpeech";
import { useSpeechToText } from "../hooks/UseSpeechToText";

export default function Dashboard() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [imageDescription, setImageDescription] = useState("");
  const [pdfAnalysis, setPdfAnalysis] = useState("");
  const [audioAnalysis, setAudioAnalysis] = useState("");
  const [isAnalyzingPdf, setIsAnalyzingPdf] = useState(false);
  const [isAnalyzingAudio, setIsAnalyzingAudio] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [isDescribing, setIsDescribing] = useState(false);

  const fileInputRef = useRef(null);
  const pdfInputRef = useRef(null);
  const audioInputRef = useRef(null);
  const navigate = useNavigate();

  const { speak, cancel, isSpeaking } = useTextToSpeech();
  const { startListening, stopListening, isListening } = useSpeechToText();

  const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "http://localhost:5001" : "");

  useEffect(() => {
    fetch(`${API_URL}/api/current_user`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch((err) => console.error("Error fetching user:", err));
  }, []);

  const handleLogout = () => {
    navigate("/");
  };

  const summarize = async () => {
    if (!text) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/summarize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
        credentials: "include",
      });
      const data = await res.json();
      setSummary(data.summary);
    } catch (error) {
      console.error("Error summarizing:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (content) => {
    navigator.clipboard.writeText(content);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      const mimeType = file.type;

      setIsDescribing(true);
      setImageDescription(""); // Clear previous
      try {
        const res = await fetch(`${API_URL}/api/describe`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ image: base64String, mimeType }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);
          return;
        }

        const data = await res.json();
        if (data.description) {
          setImageDescription(data.description);
        }
      } catch (error) {
        console.error("Image description error:", error);
      } finally {
        setIsDescribing(false);
      }
    };
    reader.onerror = (err) => console.error("FileReader error:", err);
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleClearAll = () => {
    setSummary("");
    setImageDescription("");
    setPdfAnalysis("");
    setAudioAnalysis("");
    setText("");
  };

  const handleFileUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = reader.result.split(',')[1];
      const mimeType = file.type;

      if (type === 'pdf') {
        setIsAnalyzingPdf(true);
        setPdfAnalysis("");
      } else if (type === 'audio') {
        setIsAnalyzingAudio(true);
        setAudioAnalysis("");
      }

      try {
        const res = await fetch(`${API_URL}/api/analyze-file`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ fileData: base64String, mimeType }),
          credentials: "include",
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error("API Error:", errorText);
          return;
        }

        const data = await res.json();
        if (type === 'pdf') {
          setPdfAnalysis(data.result);
        } else if (type === 'audio') {
          setAudioAnalysis(data.result);
        }
      } catch (error) {
        console.error("File analysis error:", error);
      } finally {
        if (type === 'pdf') setIsAnalyzingPdf(false);
        if (type === 'audio') setIsAnalyzingAudio(false);
      }
    };
    reader.onerror = (err) => console.error("FileReader error:", err);
    reader.readAsDataURL(file);
  };

  const triggerPdfInput = () => pdfInputRef.current.click();
  const triggerAudioInput = () => audioInputRef.current.click();

  const handleDictation = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((transcript) => {
        setText((prev) => prev ? prev + " " + transcript : transcript);
      });
    }
  }

  const handleRead = (content) => {
    if (isSpeaking) {
      cancel();
    } else {
      speak(content);
    }
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        minHeight: "100vh",
        // background: "var(--bg-primary)", // Removed to allow -1 z-index elements to show
        color: "var(--text-primary)",
        py: 4,
      }}
    >
      <div className="blob-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      {/* Hero Background Graphic */}
      <Box
        component="img"
        src="/hero_bg.png"
        alt="Background Graphic"
        sx={{
          position: "fixed",
          top: "25%",
          left: "45%",
          transform: "translate(-50%, -40%)",
          width: { xs: "90%", md: "70%" },
          maxWidth: "1000px",
          zIndex: -1,
          opacity: 0.6,
          mixBlendMode: "multiply",
          filter: "contrast(1.1)",
          animation: "float 10s ease-in-out infinite",
          pointerEvents: "none",
          display: { xs: "none", sm: "block" }
        }}
      />

      <Container maxWidth="lg">
        {/* Header */}
        <Stack
          direction={{ xs: "column", md: "row" }}
          justifyContent="space-between"
          alignItems="center"
          sx={{ mb: 6, gap: 3 }}
        >
          {/* Logo & Welcome Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems="center"
            spacing={{ xs: 2, sm: 4 }}
            sx={{ textAlign: { xs: "center", sm: "left" } }}
          >
            {/* Brand */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <img src="/logo.png" alt="Bridge Logo" style={{ width: 48, height: 48 }} />
              <Typography
                variant="h5"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background: "linear-gradient(to right, #818cf8, #34d399)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  letterSpacing: "-1px",
                }}
              >
                Bridge
              </Typography>
            </Stack>

            <Divider
              orientation="vertical"
              flexItem
              sx={{
                display: { xs: "none", sm: "block" },
                bgcolor: "rgba(255,255,255,0.1)",
                height: 40,
                alignSelf: "center",
              }}
            />

            <Grow in={!!user} timeout={1000}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Box>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 800,
                      background: "linear-gradient(135deg, #1e293b 0%, #475569 100%)",
                      backgroundClip: "text",
                      textFillColor: "transparent",
                      letterSpacing: "-0.5px",
                      mb: 0.5
                    }}
                  >
                    Welcome, {user ? user.displayName.split(" ")[0] : "Learner"}!
                  </Typography>
                  <Typography variant="body1" sx={{ color: "var(--text-secondary)", opacity: 0.8 }}>
                    Ready to explore something new?
                  </Typography>
                </Box>
              </Box>
            </Grow>

            <Tooltip title="Clear All Results">
              <IconButton
                onClick={handleClearAll}
                sx={{
                  color: "var(--text-secondary)",
                  border: "1px solid rgba(0,0,0,0.1)",
                  "&:hover": { color: "#ef4444", borderColor: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.1)" }
                }}
              >
                <RestartAltIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Action Buttons */}
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              onClick={() => navigate("/history")}
              startIcon={<HistoryIcon />}
              sx={{
                borderColor: "rgba(0,0,0,0.1)",
                color: "var(--text-primary)",
                "&:hover": { borderColor: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" }
              }}
            >
              History
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={handleLogout}
              startIcon={<LogoutIcon />}
              sx={{
                borderColor: "rgba(248, 113, 113, 0.3)",
                color: "#f87171",
                "&:hover": { borderColor: "#f87171", bgcolor: "rgba(248, 113, 113, 0.1)" }
              }}
            >
              Logout
            </Button>
          </Stack>
        </Stack>

        {/* Input Section */}
        <Paper
          elevation={0}
          className="float-animation"
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backdropFilter: "blur(12px)",
            background: "rgba(255, 255, 255, 0.25)",
            border: "var(--glass-border)",
            boxShadow: "var(--glass-shadow)",
            mb: 4,
          }}
        >
          <Box sx={{ position: "relative" }}>
            <TextField
              multiline
              rows={8}
              fullWidth
              placeholder="Paste your text here to summarize..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              variant="outlined"
              sx={{
                mb: 3,
                "& .MuiOutlinedInput-root": {
                  color: "var(--text-primary)",
                  fontSize: "1.05rem",
                  lineHeight: 1.6,
                  backgroundColor: "rgba(255,255,255,0.4)",
                  borderRadius: 3,
                  p: 3,
                  "& fieldset": { borderColor: "transparent" },
                  "&:hover fieldset": { borderColor: "rgba(0,0,0,0.1)" },
                  "&.Mui-focused fieldset": { borderColor: "#818cf8" },
                },
              }}
            />
            {text && (
              <Tooltip title="Clear Text">
                <IconButton
                  size="small"
                  onClick={() => setText("")}
                  aria-label="Clear Text"
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    color: "var(--text-secondary)",
                    opacity: 0.6,
                    "&:hover": { color: "#f87171", bgcolor: "rgba(248,113,113,0.1)", opacity: 1 }
                  }}
                >
                  <DeleteOutlineIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            )}
          </Box>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems="center"
            justifyContent="space-between"
          >
            <Stack direction="row" spacing={1}>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept="image/*"
                onChange={handleImageUpload}
              />
              <input
                type="file"
                ref={pdfInputRef}
                style={{ display: 'none' }}
                accept="application/pdf"
                onChange={(e) => handleFileUpload(e, 'pdf')}
              />
              <input
                type="file"
                ref={audioInputRef}
                style={{ display: 'none' }}
                accept="audio/*"
                onChange={(e) => handleFileUpload(e, 'audio')}
              />

              <Tooltip title="Upload Image for Analysis">
                <Button
                  variant="outlined"
                  onClick={triggerFileInput}
                  disabled={isDescribing}
                  sx={{
                    color: "var(--text-secondary)",
                    borderColor: "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    "&:hover": { borderColor: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                  startIcon={isDescribing ? <CircularProgress size={20} color="inherit" /> : <AddPhotoAlternateIcon />}
                >
                  {isDescribing ? "Analyzing..." : "Image"}
                </Button>
              </Tooltip>

              <Tooltip title="Upload PDF">
                <Button
                  variant="outlined"
                  onClick={triggerPdfInput}
                  disabled={isAnalyzingPdf}
                  sx={{
                    color: "var(--text-secondary)",
                    borderColor: "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    "&:hover": { borderColor: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                  startIcon={isAnalyzingPdf ? <CircularProgress size={20} color="inherit" /> : <PictureAsPdfIcon />}
                >
                  {isAnalyzingPdf ? "Reading..." : "PDF"}
                </Button>
              </Tooltip>

              <Tooltip title="Upload Audio">
                <Button
                  variant="outlined"
                  onClick={triggerAudioInput}
                  disabled={isAnalyzingAudio}
                  sx={{
                    color: "var(--text-secondary)",
                    borderColor: "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    "&:hover": { borderColor: "var(--text-primary)", bgcolor: "rgba(0,0,0,0.05)" },
                  }}
                  startIcon={isAnalyzingAudio ? <CircularProgress size={20} color="inherit" /> : <AudioFileIcon />}
                >
                  {isAnalyzingAudio ? "Listening..." : "Audio"}
                </Button>
              </Tooltip>

              <Tooltip title={isSpeaking ? "Stop Reading" : "Read text aloud"}>
                <Button
                  variant={isSpeaking ? "contained" : "outlined"}
                  color={isSpeaking ? "error" : "primary"}
                  onClick={() => handleRead(text)}
                  disabled={!text}
                  sx={{
                    color: isSpeaking ? "white" : "var(--text-secondary)",
                    borderColor: "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    "&:hover": {
                      borderColor: isSpeaking ? "#ef4444" : "var(--text-primary)",
                      bgcolor: isSpeaking ? "#dc2626" : "rgba(0,0,0,0.05)"
                    },
                    "&:disabled": { borderColor: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.2)" }
                  }}
                  startIcon={isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
                >
                  {isSpeaking ? "Stop" : "Read"}
                </Button>
              </Tooltip>
              <Tooltip title="Dictate text">
                <Button
                  variant="outlined"
                  onClick={handleDictation}
                  sx={{
                    color: isListening ? "#fbbf24" : "var(--text-secondary)",
                    borderColor: isListening ? "#fbbf24" : "rgba(0,0,0,0.15)",
                    borderRadius: 2,
                    bgcolor: isListening ? "rgba(251, 191, 36, 0.1)" : "transparent",
                    "&:hover": {
                      borderColor: isListening ? "#f59e0b" : "var(--text-primary)",
                      bgcolor: isListening ? "rgba(251, 191, 36, 0.2)" : "rgba(0,0,0,0.05)"
                    },
                    animation: isListening ? "pulse 1.5s infinite" : "none",
                    "@keyframes pulse": {
                      "0%": { boxShadow: "0 0 0 0 rgba(251, 191, 36, 0.4)" },
                      "70%": { boxShadow: "0 0 0 10px rgba(251, 191, 36, 0)" },
                      "100%": { boxShadow: "0 0 0 0 rgba(251, 191, 36, 0)" },
                    }
                  }}
                  startIcon={<MicIcon />}
                >
                  {isListening ? "Listening..." : "Dictate"}
                </Button>
              </Tooltip>
            </Stack>

            <Button
              variant="contained"
              onClick={summarize}
              className="glow-on-hover"
              disabled={loading || !text}
              startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <AutoAwesomeIcon />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 2,
                minWidth: "180px",
                width: { xs: "100%", sm: "auto" },
                background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)",
                fontWeight: 700,
                fontSize: "1rem",
                textTransform: "none",
                boxShadow: "0 10px 20px -5px rgba(99, 102, 241, 0.4)",
                transition: "all 0.3s ease",
                "&:hover": {
                  background: "linear-gradient(135deg, #4f46e5 0%, #4338ca 100%)",
                  transform: "translateY(-2px)",
                  boxShadow: "0 15px 25px -5px rgba(99, 102, 241, 0.5)",
                },
                "&:active": { transform: "translateY(0)" },
                "&:disabled": { background: "rgba(0,0,0,0.05)", color: "rgba(0,0,0,0.3)", boxShadow: "none", transform: "none" }
              }}
            >
              {loading ? "Summarizing..." : "Summarize"}
            </Button>
          </Stack>
        </Paper>

        {/* Visual Analysis Section */}
        <Fade in={!!imageDescription} mountOnEnter unmountOnExit timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: "var(--glass-bg)",
                border: "var(--glass-border)",
                color: "var(--text-primary)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#6ee7b7",
                      fontWeight: 700
                    }}
                  >
                    <VisibilityIcon sx={{ color: "#34d399" }} />
                    Visual Analysis
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                    Analyzed by <strong>Gemini Vision</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Tooltip title={isSpeaking ? "Stop Reading" : "Read Description"}>
                    <IconButton
                      onClick={() => handleRead(imageDescription)}
                      aria-label={isSpeaking ? "Stop Reading Description" : "Read Description Aloud"}
                      sx={{
                        color: isSpeaking ? "#f87171" : "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          color: isSpeaking ? "#ef4444" : "#34d399",
                          bgcolor: isSpeaking ? "rgba(239, 68, 68, 0.1)" : "rgba(52, 211, 153, 0.1)",
                          borderColor: isSpeaking ? "#ef4444" : "#34d399"
                        }
                      }}
                    >
                      {isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Description">
                    <IconButton
                      onClick={() => copyToClipboard(imageDescription)}
                      aria-label="Copy Description"
                      sx={{
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { color: "#34d399", bgcolor: "rgba(52, 211, 153, 0.1)", borderColor: "#34d399" }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 3, borderColor: "rgba(52, 211, 153, 0.2)" }} />
              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {imageDescription}
              </Typography>
            </Paper>
          </Box>
        </Fade>

        {/* PDF Analysis Section */}
        <Fade in={!!pdfAnalysis} mountOnEnter unmountOnExit timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: "var(--glass-bg)",
                border: "var(--glass-border)",
                color: "var(--text-primary)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#ef4444",
                      fontWeight: 700
                    }}
                  >
                    <PictureAsPdfIcon sx={{ color: "#ef4444" }} />
                    PDF Analysis
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                    Analyzed by <strong>Gemini 1.5 Flash</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Tooltip title={isSpeaking ? "Stop Reading" : "Read Analysis"}>
                    <IconButton
                      onClick={() => handleRead(pdfAnalysis)}
                      aria-label={isSpeaking ? "Stop Reading Analysis" : "Read Analysis Aloud"}
                      sx={{
                        color: isSpeaking ? "#f87171" : "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          color: isSpeaking ? "#ef4444" : "#ef4444",
                          bgcolor: isSpeaking ? "rgba(239, 68, 68, 0.1)" : "rgba(239, 68, 68, 0.1)",
                          borderColor: isSpeaking ? "#ef4444" : "#ef4444"
                        }
                      }}
                    >
                      {isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Analysis">
                    <IconButton
                      onClick={() => copyToClipboard(pdfAnalysis)}
                      aria-label="Copy Analysis"
                      sx={{
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { color: "#ef4444", bgcolor: "rgba(239, 68, 68, 0.1)", borderColor: "#ef4444" }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 3, borderColor: "rgba(239, 68, 68, 0.2)" }} />
              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {pdfAnalysis}
              </Typography>
            </Paper>
          </Box>
        </Fade>

        {/* Audio Analysis Section */}
        <Fade in={!!audioAnalysis} mountOnEnter unmountOnExit timeout={500}>
          <Box sx={{ mb: 4 }}>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: "var(--glass-bg)",
                border: "var(--glass-border)",
                color: "var(--text-primary)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#ec4899",
                      fontWeight: 700
                    }}
                  >
                    <AudioFileIcon sx={{ color: "#ec4899" }} />
                    Audio Transcript
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                    Transcribed by <strong>Gemini 1.5 Flash</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Tooltip title={isSpeaking ? "Stop Reading" : "Read Transcript"}>
                    <IconButton
                      onClick={() => handleRead(audioAnalysis)}
                      aria-label={isSpeaking ? "Stop Reading Transcript" : "Read Transcript Aloud"}
                      sx={{
                        color: isSpeaking ? "#f87171" : "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          color: isSpeaking ? "#ef4444" : "#ec4899",
                          bgcolor: isSpeaking ? "rgba(239, 68, 68, 0.1)" : "rgba(236, 72, 153, 0.1)",
                          borderColor: isSpeaking ? "#ef4444" : "#ec4899"
                        }
                      }}
                    >
                      {isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Transcript">
                    <IconButton
                      onClick={() => copyToClipboard(audioAnalysis)}
                      aria-label="Copy Transcript"
                      sx={{
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { color: "#ec4899", bgcolor: "rgba(236, 72, 153, 0.1)", borderColor: "#ec4899" }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>
              <Divider sx={{ mb: 3, borderColor: "rgba(236, 72, 153, 0.2)" }} />
              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {audioAnalysis}
              </Typography>
            </Paper>
          </Box>
        </Fade>

        {/* Summary Section */}
        <Fade in={!!summary} mountOnEnter unmountOnExit timeout={500}>
          <Box>
            <Paper
              elevation={0}
              sx={{
                p: { xs: 4, md: 5 },
                borderRadius: 4,
                backdropFilter: "blur(20px)",
                background: "var(--glass-bg)",
                border: "var(--glass-border)",
                color: "var(--text-primary)",
                position: "relative",
                overflow: "hidden",
                boxShadow: "var(--glass-shadow)",
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 3 }}>
                <Box>
                  <Typography
                    variant="h5"
                    gutterBottom
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      color: "#a5b4fc",
                      fontWeight: 700
                    }}
                  >
                    <AutoAwesomeIcon sx={{ color: "#fbbf24" }} />
                    AI Summary
                  </Typography>
                  <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                    Generated by <strong>Gemini 2.0 Flash</strong>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Tooltip title={isSpeaking ? "Stop Reading" : "Read Summary"}>
                    <IconButton
                      onClick={() => handleRead(summary)}
                      aria-label={isSpeaking ? "Stop Reading Summary" : "Read Summary Aloud"}
                      sx={{
                        color: isSpeaking ? "#f87171" : "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": {
                          color: isSpeaking ? "#ef4444" : "#818cf8",
                          bgcolor: isSpeaking ? "rgba(239, 68, 68, 0.1)" : "rgba(129,140,248,0.1)",
                          borderColor: isSpeaking ? "#ef4444" : "#818cf8"
                        }
                      }}
                    >
                      {isSpeaking ? <StopIcon /> : <VolumeUpIcon />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Copy Summary">
                    <IconButton
                      onClick={() => copyToClipboard(summary)}
                      aria-label="Copy Summary"
                      sx={{
                        color: "var(--text-secondary)",
                        border: "1px solid rgba(0,0,0,0.1)",
                        "&:hover": { color: "#34d399", bgcolor: "rgba(52, 211, 153, 0.1)", borderColor: "#34d399" }
                      }}
                    >
                      <ContentCopyIcon />
                    </IconButton>
                  </Tooltip>
                </Stack>
              </Stack>

              <Divider sx={{ mb: 3, borderColor: "rgba(99, 102, 241, 0.2)" }} />

              <Typography sx={{ whiteSpace: "pre-line", lineHeight: 1.8, fontSize: "1.1rem", color: "var(--text-primary)" }}>
                {summary}
              </Typography>
            </Paper>
          </Box>
        </Fade >
      </Container >
    </Box >
  );
}
