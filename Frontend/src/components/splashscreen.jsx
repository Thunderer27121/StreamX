import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function SplashScreen({ onFinish }) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false); // trigger exit animation
      setTimeout(onFinish, 800); // wait for exit animation
    }, 2000); // 2 seconds before exit

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-gray-900 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0, y: -50 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="flex flex-col items-center space-y-4"
          >
            {/* Logo */}
            <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-4xl animate-pulse">
              X
            </div>

            {/* App Name */}
            <h1 className="text-white text-5xl sm:text-6xl font-extrabold">
              StreamX
            </h1>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
