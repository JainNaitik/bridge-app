import React, { createContext, useState, useContext, useEffect } from 'react';

const AccessibilityContext = createContext();

export const useAccessibility = () => useContext(AccessibilityContext);

export const AccessibilityProvider = ({ children }) => {
    // Priority: Local Storage > Defaults
    const [highContrast, setHighContrast] = useState(() => {
        return localStorage.getItem('highContrast') === 'true';
    });

    const [fontSize, setFontSize] = useState(() => {
        return parseInt(localStorage.getItem('fontSize')) || 16; // Default 16px
    });

    const [dyslexicFont, setDyslexicFont] = useState(() => {
        return localStorage.getItem('dyslexicFont') === 'true';
    });

    // Sync with Local Storage
    useEffect(() => {
        localStorage.setItem('highContrast', highContrast);
    }, [highContrast]);

    useEffect(() => {
        localStorage.setItem('fontSize', fontSize);
        document.documentElement.style.fontSize = `${fontSize}px`; // Root font size scaling
    }, [fontSize]);

    useEffect(() => {
        localStorage.setItem('dyslexicFont', dyslexicFont);
    }, [dyslexicFont]);

    const toggleHighContrast = () => setHighContrast(prev => !prev);
    const increaseFontSize = () => setFontSize(prev => Math.min(prev + 2, 24)); // Max 24px
    const decreaseFontSize = () => setFontSize(prev => Math.max(prev - 2, 12)); // Min 12px
    const resetFontSize = () => setFontSize(16);
    const toggleDyslexicFont = () => setDyslexicFont(prev => !prev);

    const value = {
        highContrast,
        fontSize,
        dyslexicFont,
        toggleHighContrast,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        toggleDyslexicFont
    };

    return (
        <AccessibilityContext.Provider value={value}>
            {children}
        </AccessibilityContext.Provider>
    );
};
