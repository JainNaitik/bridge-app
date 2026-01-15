import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("Uncaught error:", error, errorInfo);
        this.setState({ error, errorInfo });
    }

    render() {
        if (this.state.hasError) {
            return (
                <Box sx={{ p: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', bgcolor: '#fed7d7' }}>
                    <Paper sx={{ p: 4, maxWidth: 600 }}>
                        <Typography variant="h5" color="error" gutterBottom>
                            Something went wrong.
                        </Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {this.state.error && this.state.error.toString()}
                        </Typography>
                        <Box sx={{ bgcolor: '#eee', p: 2, borderRadius: 1, overflow: 'auto', maxHeight: 200 }}>
                            <pre style={{ margin: 0 }}>
                                {this.state.errorInfo && this.state.errorInfo.componentStack}
                            </pre>
                        </Box>
                    </Paper>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
