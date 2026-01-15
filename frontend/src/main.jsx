import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'
import { AccessibilityProvider } from './context/AccessibilityContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ErrorBoundary>
            <AccessibilityProvider>
                <App />
            </AccessibilityProvider>
        </ErrorBoundary>
    </React.StrictMode>,
)
