import React from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { Toaster } from './components/ui/toaster';
import ChessApp from './components/chess/ChessApp';

const App: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>ChessHub - Master Your Chess Game</title>
        <meta name="description" content="Professional chess platform with game analysis, player profiles, and interactive gameplay. Improve your chess skills with our comprehensive tools." />
      </Helmet>
      
      <div className="min-h-screen bg-[#1e293b]">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <ChessApp />
        </motion.div>
        <Toaster />
      </div>
    </>
  );
};

export default App;