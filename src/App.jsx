import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'
import LandingPage from './components/landing/LandingPage'
import './App.css'
import './styles/layout.css'

/**
 * Main App component for Invoxis Invoice Generator
 * Sets up routing and main layout structure
 */
function App() {
  return (
    <Router>
      <div className="app-wrapper animated-bg">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/app" element={<Layout />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AnimatePresence>
      </div>
    </Router>
  )
}

export default App
