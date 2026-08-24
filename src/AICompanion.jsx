import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CloseIcon } from './icons';

export default function AICompanion({ message, isVisible, onClose }) {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    if (isVisible && message) {
      setDisplayedText('');
      let i = 0;
      const typingInterval = setInterval(() => {
        setDisplayedText(message.slice(0, i));
        i++;
        if (i > message.length) {
          clearInterval(typingInterval);
        }
      }, 30); // Typing speed
      
      return () => clearInterval(typingInterval);
    }
  }, [isVisible, message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          className="fixed bottom-24 right-4 z-[100] flex flex-col items-end pointer-events-none"
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 50, scale: 0.8, transition: { duration: 0.2 } }}
        >
          {/* Message Bubble */}
          <motion.div 
            className="bg-white text-zinc-900 px-4 py-3 rounded-2xl rounded-br-none shadow-2xl mb-2 max-w-[250px] relative pointer-events-auto"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 200, damping: 20 }}
          >
            <button 
              onClick={onClose}
              className="absolute -top-2 -left-2 bg-zinc-800 text-white rounded-full p-1 shadow-md hover:bg-zinc-700 transition-colors w-6 h-6 flex items-center justify-center"
            >
              <CloseIcon />
            </button>
            <p className="text-sm font-medium leading-tight" dir="rtl">
              {displayedText}
              <motion.span 
                animate={{ opacity: [0, 1, 0] }} 
                transition={{ repeat: Infinity, duration: 0.8 }}
                className="inline-block ml-1 w-1.5 h-4 bg-purple-500 align-middle rounded-full"
              />
            </p>
          </motion.div>

          {/* Character Avatar */}
          <motion.div
            className="relative pointer-events-auto cursor-pointer"
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            onClick={() => {
              // Can add some interaction here later
            }}
          >
            <div className="w-20 h-20 rounded-full border-4 border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.5)] overflow-hidden bg-gradient-to-br from-amber-200 to-orange-400">
              <img 
                src="https://api.dicebear.com/9.x/adventurer/svg?seed=Valkyrie&hair=long16&hairColor=d84b2b&backgroundColor=transparent" 
                alt="AI Guide" 
                className="w-full h-full object-cover scale-110 translate-y-2"
              />
            </div>
            
            {/* Glow behind */}
            <div className="absolute inset-0 bg-purple-500 rounded-full blur-xl opacity-30 -z-10"></div>
          </motion.div>

        </motion.div>
      )}
    </AnimatePresence>
  );
}
