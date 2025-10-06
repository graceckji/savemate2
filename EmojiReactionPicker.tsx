import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";

const EMOJI_OPTIONS = ["❤️", "😍", "😂", "😮", "😢", "👍", "🔥", "💯"];

export default function EmojiReactionPicker({ onSelect, onClose }) {
  const pickerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <motion.div
      ref={pickerRef}
      
      initial={{ opacity: 0, scale: 0.9, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, y: 10 }}
      
      className="absolute bottom-full left-0 mb-2 bg-white rounded-2xl shadow-2xl p-2 z-50 border border-gray-100"
    >
      <div className="flex gap-1">
        {EMOJI_OPTIONS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => onSelect(emoji)}
            className="w-10 h-10 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center text-2xl"
          >
            {emoji}
          </button>
        ))}
      </div>
    </motion.div>
  );
}
