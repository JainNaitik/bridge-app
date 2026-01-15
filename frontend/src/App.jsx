import React from "react";
import { CssBaseline } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./components/DashBoard";
import LoginPage from "./components/LoginPage";
import HistoryPage from "./components/HistoryPage";
import AccessibilityMenu from "./components/AccessibilityMenu";
import { useAccessibility } from "./context/AccessibilityContext";

function App() {
  const { highContrast, dyslexicFont } = useAccessibility();
  return (
    <BrowserRouter>
      <div className={`${highContrast ? 'high-contrast' : ''} ${dyslexicFont ? 'dyslexic-font' : ''}`}>
        <CssBaseline />
        <a href="#main-content" className="skip-link">Skip to Content</a>
        <AccessibilityMenu />
        <main id="main-content" tabIndex="-1" style={{ outline: 'none' }}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/history" element={<HistoryPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
