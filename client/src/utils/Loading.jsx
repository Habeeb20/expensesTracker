/* eslint-disable no-unused-vars */
import React from 'react';
import { motion } from 'framer-motion';
import LOGO_PATH from "../../public/expense.jpeg"


const ImageLoadingSpinner = ({
  size = 'md',
  text = 'Loading...',
  fullScreen = false,
  speed = 2.5, // seconds per rotation
}) => {
  const sizeMap = {
    sm: { img: 'w-12 h-12', container: 'p-6', text: 'text-sm' },
    md: { img: 'w-20 h-20', container: 'p-10', text: 'text-base' },
    lg: { img: 'w-32 h-32', container: 'p-16', text: 'text-lg' },
  };

  const { img, container, text: textSize } = sizeMap[size];

  const containerClasses = fullScreen
    ? 'fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-black'
    : `flex flex-col items-center justify-center ${container}`;

  return (
    <div className={containerClasses}>
      {/* Floating Container with Shadow & Glow */}
      <motion.div
        className="relative"
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      >
        {/* Outer Glow Ring */}
        <motion.div
          className="absolute -inset-4 rounded-full bg-blue-500 opacity-30 blur-xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        {/* Spinning Image */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
          className="relative z-10"
        >
          <img
            src={LOGO_PATH}
            alt="App Logo"
            className={`${img} rounded-full shadow-2xl object-contain bg-white p-2 ring-4 ring-blue-500 ring-opacity-50`}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/150?text=Logo'; // fallback
            }}
          />

          {/* Inner Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-4 border-blue-400"
            animate={{
              scale: [1, 1.4, 1],
              opacity: [0.8, 0.3, 0.8],
            }}
            transition={{
              duration: 1.8,
              repeat: Infinity,
              ease: 'easeOut',
            }}
          />
        </motion.div>

        {/* Orbiting Dots */}
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute w-3 h-3 bg-blue-600 rounded-full"
            style={{
              top: '50%',
              left: '50%',
              x: '-50%',
              y: '-50%',
            }}
            animate={{
              rotate: 360,
            }}
            transition={{
              duration: speed * 1.5,
              repeat: Infinity,
              ease: 'linear',
              delay: i * 0.2,
            }}
          >
            <motion.div
              className="absolute inset-0 rounded-full bg-blue-400 blur-sm"
              animate={{ scale: [1, 2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Animated Text */}
      <motion.div className="mt-6 text-center">
        <motion.p
          className={`font-semibold text-gray-800 dark:text-gray-200 ${textSize}`}
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          {text}
        </motion.p>
        <motion.div className="flex justify-center gap-1 mt-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-blue-600 rounded-full"
              animate={{
                y: [0, -8, 0],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </motion.div>
      </motion.div>

      {/* Subtext */}
      {fullScreen && (
        <p className="mt-3 text-xs text-gray-500 dark:text-gray-400 animate-pulse">
          Securely loading your financial dashboard
        </p>
      )}
    </div>
  );
};

export default ImageLoadingSpinner;