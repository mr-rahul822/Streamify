import React from "react";
import { motion } from "framer-motion";

const Aituttor = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-base-100">
      <motion.h1
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-3xl sm:text-5xl font-extrabold text-base-content tracking-wide drop-shadow-lg"
      >
        🤖 AI Tutor Page Coming Soon
      </motion.h1>
    </div>
  );
};

export default Aituttor;
