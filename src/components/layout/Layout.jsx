import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Footer from './Footer';
import MainContainer from './MainContainer';

/**
 * Layout component that combines Header, MainContainer, and Footer
 * Provides the overall structure for the application
 */
const Layout = () => {
  // Animation variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.3 } }
  };

  return (
    <motion.div 
      className="app-layout glass-container"
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Header />
      <MainContainer />
      <Footer />
    </motion.div>
  );
};

export default Layout;