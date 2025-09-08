import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import InvoiceForm from '../invoice/InvoiceForm';
import InvoicePreview from '../preview/InvoicePreview';

/**
 * MainContainer component for the Invoxis application
 * Serves as the main content wrapper with tabs for different sections
 */
const MainContainer = () => {
  const [activeTab, setActiveTab] = useState('form');

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.5 }
    }
  };

  const tabVariants = {
    inactive: { y: 0 },
    active: { 
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 20 }
    },
    hover: { y: -2, transition: { duration: 0.2 } },
    tap: { y: 1, transition: { duration: 0.1 } }
  };

  const contentVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.5 }
    },
    exit: { 
      opacity: 0, 
      x: 20,
      transition: { duration: 0.3 }
    }
  };

  return (
    <motion.main 
      className="main-container glass-container"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <div className="tabs">
        <motion.button 
          className={`tab glass-button ${activeTab === 'form' ? 'active' : ''}`}
          onClick={() => setActiveTab('form')}
          aria-label="Switch to Create Invoice tab"
          variants={tabVariants}
          animate={activeTab === 'form' ? 'active' : 'inactive'}
          whileHover="hover"
          whileTap="tap"
        >
          Create Invoice
        </motion.button>
        <motion.button 
          className={`tab glass-button ${activeTab === 'preview' ? 'active' : ''}`}
          onClick={() => setActiveTab('preview')}
          aria-label="Switch to Preview tab"
          variants={tabVariants}
          animate={activeTab === 'preview' ? 'active' : 'inactive'}
          whileHover="hover"
          whileTap="tap"
        >
          Preview
        </motion.button>
      </div>
      
      <div className="tab-content">
        <AnimatePresence mode="wait">
          {activeTab === 'form' ? (
            <motion.div
              key="form"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              <InvoiceForm />
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={contentVariants}
            >
              <InvoicePreview />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.main>
  );
};

export default MainContainer;