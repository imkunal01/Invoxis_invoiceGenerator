import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import BlogSection from '../blog/BlogSection';
import './LandingPage.css';

/**
 * LandingPage component with animations and user greeting
 * Serves as the entry point for the application
 */
const LandingPage = () => {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');   // For saved/displayed name
  const [nameInput, setNameInput] = useState(''); // For input field typing
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Get time of day for greeting
    const getGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    // Get user name from localStorage if available
    const savedName = localStorage.getItem('userName') || '';

    setGreeting(getGreeting());
    setUserName(savedName);   // set greeting name
    setNameInput(savedName);  // prefill input if needed
    
    // Set loaded state for animation
    setTimeout(() => {
      setIsLoaded(true);
    }, 300);
  }, []);

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (nameInput.trim()) {
      localStorage.setItem('userName', nameInput.trim());
      setUserName(nameInput.trim()); // update greeting after submit
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        duration: 0.5
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  return (
    <>
      <motion.div 
        className={`landing-page glass-container ${isLoaded ? 'loaded' : ''}`}
        initial="hidden"
        animate="visible"
        variants={containerVariants}>
      
        <motion.div className="landing-content">
          <div className="landing-header">
            <h1 className="animate-in">Invoice Generator</h1>
            <p className="animate-in delay-1">Create professional invoices in minutes</p>
          </div>

          <motion.div 
            className="greeting-container animate-in delay-2"
            variants={itemVariants}
          >
            <h2>{greeting}{userName ? `, ${userName}` : ''}!</h2>
            
            {!userName && (
              <form onSubmit={handleNameSubmit} className="name-form">
                <input 
                  type="text" 
                  placeholder="What's your name?" 
                  value={nameInput} // <-- controlled by new state
                  onChange={(e) => setNameInput(e.target.value)}
                  aria-label="Enter your name"
                  className="name-input"
                />
                <button 
                  type="submit" 
                  className="primary"
                  disabled={!nameInput.trim()}
                >
                  Save
                </button>
              </form>
            )}
          </motion.div>

          <div className="features animate-in delay-3">
            <div className="feature-card">
              <span className="feature-icon">📝</span>
              <h3>Easy to Use</h3>
              <p>Simple form-based interface to create invoices quickly</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">💾</span>
              <h3>Save & Export</h3>
              <p>Download as PDF or save for later editing</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🌙</span>
              <h3>Dark Mode</h3>
              <p>Easy on the eyes with our beautiful dark theme</p>
            </div>
          </div>

          <Link to="/app" className="get-started-btn animate-in delay-4">Get Started</Link>
        </motion.div>
      </motion.div>
      
      {/* Blog Section */}
      <BlogSection />
    </>
  );
};

export default LandingPage;
