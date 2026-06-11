import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, Info } from 'lucide-react';

interface SovereignTooltipProps {
  term: string;
  explanation: string;
  children?: React.ReactNode;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  variant?: 'default' | 'clean';
}

export default function SovereignTooltip({ term, explanation, children, playAudioClick, variant = 'default' }: SovereignTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const handleMouseEnter = () => {
    setIsVisible(true);
    playAudioClick?.('hover');
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
  };

  return (
    <span 
      className="relative inline-block cursor-help group"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {variant === 'clean' ? (
        children || term
      ) : (
        <span className="underline decoration-dotted decoration-blue-500/60 hover:decoration-blue-400 text-blue-400 font-medium transition-colors">
          {children || term}
        </span>
      )}
      
      <AnimatePresence>
        {isVisible && (
          <motion.span
            initial={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: 8, scale: 0.95, filter: 'blur(4px)' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 bg-[#0a0d14] border border-white/10 rounded-xl p-3 shadow-2xl z-50 pointer-events-none block text-left"
          >
            <span className="flex items-center gap-1.5 border-b border-white/5 pb-1.5 mb-1.5">
              <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="text-[10px] font-mono font-bold tracking-wider text-slate-300 uppercase">
                Glossário SILA Soberano
              </span>
            </span>
            <span className="text-[11px] text-slate-100 font-sans leading-relaxed block font-normal">
              <strong className="text-blue-400">{term}</strong>: {explanation}
            </span>
            {/* Minimal pointy arrow */}
            <span className="absolute top-full left-1/2 -translate-x-1/2 -mt-[1px] border-[5px] border-transparent border-t-[#0a0d14] block w-0 h-0" />
          </motion.span>
        )}
      </AnimatePresence>
    </span>
  );
}
