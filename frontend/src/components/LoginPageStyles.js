
const getActionText = (mode) => {
    switch (mode) {
        case "SIGNUP": return "Sign Up";
        case "FORGOT": return "Reset";
        case "QUESTION": return "Verify";
        case "RESET": return "Upadte Password";
        default: return "Login";
    }
};

const inputStyle = {
    mb: 3,
    "& .MuiOutlinedInput-root": {
        color: "white",
        "& fieldset": { borderColor: "rgba(255,255,255,0.2)" },
        "&:hover fieldset": { borderColor: "rgba(255,255,255,0.4)" },
        "&.Mui-focused fieldset": { borderColor: "#818cf8" },
    },
    "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.5)" },
    "& .MuiInputLabel-root.Mui-focused": { color: "#818cf8" },
};

const socialButtonStyle = {
    color: "white",
    borderColor: "rgba(255,255,255,0.2)",
    "&:hover": {
        borderColor: "white",
        bgcolor: "rgba(255,255,255,0.05)"
    },
};
