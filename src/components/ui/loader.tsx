import { motion } from "framer-motion";

export function Loader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {/* Animated circles */}
      <div className="relative">
        <motion.div
          className="w-16 h-16 border-4 border-blue-200 rounded-full"
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
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-4 border-purple-400 rounded-full"
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [1, 0.5, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        />
        <motion.div
          className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full"
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Loading text with typing effect */}
      <div className="text-center">
        <motion.div
          className="text-lg font-semibold text-gray-700"
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          Simplifying your document...
        </motion.div>
        <motion.div
          className="text-sm text-gray-500 mt-2"
          animate={{
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
        >
          This may take a few moments
        </motion.div>
      </div>

      {/* Progress dots */}
      <div className="flex space-x-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-blue-600 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  );
} 