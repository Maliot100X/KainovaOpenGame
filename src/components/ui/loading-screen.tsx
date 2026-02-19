"use client";

import { motion } from "framer-motion";

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-kainova-dark flex items-center justify-center z-50">
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="relative w-20 h-20 mx-auto mb-4"
          animate={{
            rotate: [0, 360],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {/* Outer Ring */}
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-kainova-accent/30"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          
          {/* Inner Ring */}
          <motion.div
            className="absolute inset-2 rounded-full border-2 border-kainova-glow/50"
            animate={{
              rotate: -360,
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
          />
          
          {/* Center */}
          <div className="absolute inset-4 rounded-xl bg-gradient-to-br from-kainova-accent to-kainova-glow flex items-center justify-center">
            <span className="text-2xl font-bold text-black">K</span>
          </div>
        </motion.div>

        {/* Loading Text */}
        <motion.h2
          className="text-lg font-bold text-white mb-2"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Synchronizing Grid...
        </motion.h2>

        <p className="text-xs text-gray-400">KAINOVA Agent Grid v1.0</p>

        {/* Progress Bar */}
        <div className="mt-6 w-48 h-1 bg-kainova-grid rounded-full overflow-hidden mx-auto">
          <motion.div
            className="h-full bg-gradient-to-r from-kainova-accent to-kainova-glow"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>
    </div>
  );
}
