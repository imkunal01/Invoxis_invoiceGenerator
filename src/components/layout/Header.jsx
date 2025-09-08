import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

/**
 * Header component for the Invoxis application
 * Displays the application name and theme toggle
 * Handles dark mode preference with localStorage persistence
 */
const Header = () => {
  // Initialize theme mode based on localStorage or default to dark mode
  const [lightMode, setLightMode] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('invoxis_light_mode');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    // Default to dark mode (lightMode = false)
    return false;
  });

  // Apply theme class on initial render and when lightMode changes
  useEffect(() => {
    if (lightMode) {
      document.body.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
    } else {
      document.body.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
    }
    // Save preference to localStorage
    localStorage.setItem('invoxis_light_mode', lightMode);
  }, [lightMode]);

  // Toggle between dark and light mode
  const toggleTheme = () => {
    setLightMode(!lightMode);
  };

  // Animation variants
  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" } 
    }
  };

  const logoVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.6, delay: 0.2, ease: "easeOut" } 
    }
  };

  const buttonVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, delay: 0.4 } 
    },
    hover: { 
      scale: 1.05,
      transition: { duration: 0.2 }
    },
    tap: { 
      scale: 0.95,
      transition: { duration: 0.1 }
    }
  };

  return (
    <motion.header 
      className="app-header glass-navbar"
      initial="hidden"
      animate="visible"
      variants={headerVariants}
    >
      <motion.div className="logo" variants={logoVariants}>
        <h1>
          <span className="logo-icon">📄</span> Invoxis
        </h1>
        <p>Professional Invoice Generator</p>
      </motion.div>
      <div className="theme-toggle">
        <motion.button 
          onClick={toggleTheme} 
          aria-label="Toggle theme mode"
          variants={buttonVariants}
          whileHover="hover"
          whileTap="tap"
          className="glass-button hover-glow"
        >
          {lightMode ? '🌙 Dark Mode' : '☀️ Light Mode'}
        </motion.button>
      </div>
    </motion.header>
  );
};

export default Header;