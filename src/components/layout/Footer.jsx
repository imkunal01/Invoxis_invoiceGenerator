import React from 'react';
import { motion } from 'framer-motion';

/**
 * Footer component for the Invoxis application
 * Displays copyright information and links
 */
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const footerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" } 
    }
  };

  const linkVariants = {
    hover: { y: -2, color: "var(--primary-light)", transition: { duration: 0.2 } }
  };

  return (
    <motion.footer 
      className="app-footer glass-footer"
      initial="hidden"
      animate="visible"
      variants={footerVariants}
    >
      <div className="footer-content">
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          &copy; {currentYear} Invoxis. All rights reserved.
        </motion.p>
        <div className="footer-links">
          <motion.a href="#" whileHover={linkVariants.hover}>Terms</motion.a>
          <motion.a href="#" whileHover={linkVariants.hover}>Privacy</motion.a>
          <motion.a href="#" whileHover={linkVariants.hover}>Help</motion.a>
        </div>
      </div>
    </motion.footer>
  );
};

export default Footer;