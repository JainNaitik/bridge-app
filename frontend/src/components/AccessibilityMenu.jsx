import React, { useState } from 'react';
import {
    Fab,
    Menu,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Switch,
    Divider,
    Typography,
    Box,
    Slider,
    Tooltip
} from '@mui/material';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import ContrastIcon from '@mui/icons-material/Contrast';
import FormatSizeIcon from '@mui/icons-material/FormatSize';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import { useAccessibility } from '../context/AccessibilityContext';

export default function AccessibilityMenu() {
    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);

    const {
        highContrast,
        toggleHighContrast,
        fontSize,
        increaseFontSize,
        decreaseFontSize,
        resetFontSize,
        dyslexicFont,
        toggleDyslexicFont
    } = useAccessibility();

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <Box sx={{ position: 'fixed', bottom: 30, right: 30, zIndex: 9999 }}>
            <Tooltip title="Accessibility Tools" placement="left">
                <Fab
                    color="primary"
                    aria-label="accessibility options"
                    onClick={handleClick}
                    sx={{
                        background: highContrast ? '#ffff00' : 'linear-gradient(135deg, #6366f1, #34d399)',
                        color: highContrast ? '#000000' : '#ffffff',
                        border: highContrast ? '2px solid #ffff00' : 'none',
                        '&:hover': {
                            background: highContrast ? '#d4d400' : 'linear-gradient(135deg, #4f46e5, #10b981)',
                        }
                    }}
                >
                    <AccessibilityNewIcon />
                </Fab>
            </Tooltip>

            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        width: 300,
                        p: 1,
                        borderRadius: 3,
                        bgcolor: highContrast ? '#000000' : 'rgba(15, 23, 42, 0.95)',
                        color: highContrast ? '#ffff00' : 'white',
                        border: highContrast ? '2px solid #ffff00' : '1px solid rgba(255,255,255,0.1)',
                        backdropFilter: highContrast ? 'none' : 'blur(10px)',
                    }
                }}
            >
                <Box sx={{ p: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccessibilityNewIcon fontSize="small" />
                        Accessibility
                    </Typography>

                    {/* High Contrast */}
                    <MenuItem onClick={toggleHighContrast} disableRipple sx={{ p: 0, mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <ContrastIcon />
                                <Typography>High Contrast</Typography>
                            </Box>
                            <Switch checked={highContrast} />
                        </Box>
                    </MenuItem>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                    {/* Font Size Controls */}
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
                            <FormatSizeIcon fontSize="small" /> Text Size: {fontSize}px
                        </Typography>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }} role="group" aria-label="Font Size Controls">
                            <Box
                                component="button"
                                onClick={decreaseFontSize}
                                aria-label="Decrease Font Size"
                                sx={{
                                    p: 1,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    flex: 1,
                                    textAlign: 'center',
                                    bgcolor: 'transparent',
                                    color: 'inherit',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                A-
                            </Box>
                            <Box
                                component="button"
                                onClick={resetFontSize}
                                aria-label="Reset Font Size"
                                sx={{
                                    p: 1,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    flex: 1,
                                    textAlign: 'center',
                                    bgcolor: 'transparent',
                                    color: 'inherit',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                Reset
                            </Box>
                            <Box
                                component="button"
                                onClick={increaseFontSize}
                                aria-label="Increase Font Size"
                                sx={{
                                    p: 1,
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: 1,
                                    cursor: 'pointer',
                                    flex: 1,
                                    textAlign: 'center',
                                    bgcolor: 'transparent',
                                    color: 'inherit',
                                    '&:hover': { bgcolor: 'rgba(255,255,255,0.1)' }
                                }}
                            >
                                A+
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mb: 2 }} />

                    {/* Dyslexic Font */}
                    <MenuItem onClick={toggleDyslexicFont} disableRipple sx={{ p: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                                <TextFieldsIcon />
                                <Typography>Dyslexic Font</Typography>
                            </Box>
                            <Switch checked={dyslexicFont} />
                        </Box>
                    </MenuItem>
                </Box>
            </Menu>
        </Box>
    );
}
