"use client";

import { motion } from "framer-motion";

export default function WelcomeSection() {
  return (
    <section
      aria-labelledby="assistant-welcome-heading"
      className="mx-auto w-full max-w-3xl px-4 pb-6 pt-10 text-center sm:px-6 sm:pt-14"
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="text-3xl sm:text-4xl"
      >
        Namaste <span aria-hidden="true">👋</span>
      </motion.p>

      <motion.h2
        id="assistant-welcome-heading"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="mt-2 text-2xl font-bold text-blue-900 sm:text-3xl"
      >
        Welcome to JalSarthi AI
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-slate-600 sm:text-base"
      >
        JalSarthi AI is your intelligent Government assistant that helps citizens discover schemes, resolve water-related queries, draft complaints, and access verified Ministry information through natural conversation.
      </motion.p>
    </section>
  );
}