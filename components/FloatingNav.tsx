"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";

export default function FloatingNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  const box1Label = "M2";

  const navItems = [
    { label: "Cases", href: "/cases" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Sitemap", href: "/sitemap" },
    { label: "Press", href: "/press" },
  ];

  return (
    <>
      {/* Floating top/bottom nav */}
      <div className="fixed bottom-0 left-0 lg:top-0 lg:bottom-auto z-40 w-full flex justify-center items-baseline flex-wrap font-monumentMedium text-2xl lg:text-6xl p-0.5 gap-0.5">
        {/* Brand name */}
        <motion.div
          key={`box1-${box1Label}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          <Button size="icon">{box1Label}</Button>
        </motion.div>

        {/* Dynamic navigation */}
        <div className="flex items-baseline justify-start flex-wrap gap-0.5">
          <AnimatePresence>
            <motion.div
              key="menu"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Button onClick={() => setMenuOpen(!menuOpen)}>Menu</Button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Full-screen menu overlay */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-end lg:flex-row lg:flex-wrap lg:items-start lg:justify-start z-50 gap-0.5 p-1 lg:h-auto"
          >
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMenuOpen(false)}
              >
                <Button>{item.label}</Button>
              </Link>
            ))}

            <Button onClick={() => setMenuOpen(false)}>Dark mode</Button>
            <Button onClick={() => setMenuOpen(false)}>Close</Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
