import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#6366f1", // Indigo 500
      light: "#818cf8",
      dark: "#4f46e5",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#10b981", // Emerald 500
      light: "#34d399",
      dark: "#059669",
      contrastText: "#ffffff",
    },
    background: {
      default: "#0f172a", // Darker slate
      paper: "rgba(255, 255, 255, 0.05)", // Glass effect
    },
    text: {
      primary: "#f8fafc",
      secondary: "#94a3b8",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h3: {
      fontWeight: 800,
      letterSpacing: "-0.02em",
      color: "#0f172a", // Slate 900
    },
    h6: {
      fontWeight: 500,
      color: "#475569", // Slate 600
    },
    button: {
      textTransform: "none", // Remove uppercase transformation
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "10px 24px",
          boxShadow: "none",
          "&:hover": {
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
          },
        },
        containedPrimary: {
          background: "linear-gradient(to right, #6366f1, #4f46e5)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
          backgroundImage: "none",
        },
        elevation1: {
          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: "12px",
            backgroundColor: "#f8fafc",
            "&:hover fieldset": {
              borderColor: "#6366f1",
            },
            "&.Mui-focused fieldset": {
              borderColor: "#4f46e5",
              borderWidth: "2px",
            },
          },
        },
      },
    },
  },
});

export default theme;
