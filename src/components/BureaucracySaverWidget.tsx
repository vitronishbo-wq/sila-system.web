import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, TrendingUp, Sparkles, AlertCircle, ChevronDown, ChevronUp, Zap } from 'lucide-react';

interface BureaucracySaverWidgetProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function BureaucracySaverWidget({ playAudioClick }: BureaucracySaverWidgetProps) {
  const [isOpen, setIsOpen] = useState(true);
  
  // Real-time counter simulation states
  // Initial hours count based on current timestamp or seed
  const [hoursSaved, setHoursSaved] = useState(() => {
    // A dynamically seeded starting point (around 142k hours saved, growing)
    const baseDate = new Date('2026-01-01T00:00:00Z').getTime();
    const currentDate = Date.now();
    const millisecondsPassed = Math.max(0, currentDate - baseDate);
    // Approx 24.5 hours saved per minute globally = 0.408 hours/second
    const calculatedHours = 142050 + (millisecondsPassed / 1000) * 0.4083;
    return calculatedHours;
  });

  const [lastIncrement, setLastIncrement] = useState<number | null>(null);

  // Micro-increments simulation loop
  useEffect(() => {
    const timer = setInterval(() => {
      // Simulate incoming batches from SILA's integrated systems (Huambo, Luanda, etc.)
      const increment = 0.05 + Math.random() * 0.12;
      setHoursSaved(prev => prev + increment);
      setLastIncrement(increment);

      // Reset animation cue
      const resetTimer = setTimeout(() => setLastIncrement(null), 850);
      return () => clearTimeout(resetTimer);
    }, 1800);

    return () => clearInterval(timer);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, x: -50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ delay: 1.2, type: 'spring', stiffness: 260, damping: 22 }}
      className="fixed bottom-6 left-6 z-50 max-w-[280px] sm:max-w-[310px] bg-gradient-to-b from-[#0a0f1d]/96 to-[#05070a]/96 border border-amber-500/15 p-1 rounded-2xl shadow-[0_0_40px_rgba(245,158,11,0.08)] backdrop-blur-lg select-none no-print overflow-hidden"
    >
      {/* Corner cyber micro ornaments */}
      <div className="absolute top-0 left-0 w-1.5 h-1.5 border-t border-l border-amber-500/40 rounded-tl" />
      <div className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r border-amber-500/40 rounded-br" />

      <AnimatePresence initial={false} mode="wait">
        {isOpen ? (
          <motion.div
            key="extended"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            className="p-3 pb-3.5 space-y-3"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span className="text-[9px] font-mono text-amber-400 font-bold tracking-widest uppercase flex items-center gap-1">
                  SILA METRICS <Zap className="w-2.5 h-2.5 text-amber-400 fill-amber-500/20" />
                </span>
              </div>
              
              <button
                onClick={() => {
                  setIsOpen(false);
                  if (playAudioClick) playAudioClick('click');
                }}
                className="text-slate-500 hover:text-slate-300 transition-colors p-0.5 rounded cursor-pointer"
                title="Minimizar métricas"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>

            {/* Counter Space */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-400 block uppercase tracking-wider">
                Horas de Burocracia Poupadas:
              </span>
              <div className="flex items-baseline gap-2 relative">
                <span className="text-xl sm:text-2xl font-mono font-bold text-slate-100 tracking-tight glow-text-amber">
                  {hoursSaved.toLocaleString('pt-PT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}h
                </span>

                {/* Animated real-time surge notification */}
                <AnimatePresence>
                  {lastIncrement !== null && (
                    <motion.span
                      initial={{ opacity: 0, y: 5, scale: 0.8 }}
                      animate={{ opacity: 1, y: -10, scale: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute left-40 sm:left-48 bottom-1 text-[10px] font-mono font-bold text-emerald-400 flex items-center"
                    >
                      +{lastIncrement.toFixed(3)}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Progress bar simulation or Sub-details */}
            <div className="bg-white/[0.02] border border-white/5 rounded-xl p-2 space-y-1.5">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-400" /> Ritmo de Trânsito
                </span>
                <span className="text-slate-300 font-bold">+12,5% / Trimestre</span>
              </div>
              <div className="w-full bg-[#05070a] h-1 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: "78%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-emerald-400"
                />
              </div>
              <div className="flex justify-between items-center text-[8px] font-mono text-slate-500">
                <span>Meta Nacional: 500k h</span>
                <span>Eficiência SILA: 98.4%</span>
              </div>
            </div>

            {/* Quick value hook */}
            <p className="text-[9px] text-slate-400 leading-normal font-sans italic">
              Integrando automaticamente MED, MINSA e Registo Civil para evitar repetição de certidões.
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            onClick={() => {
              setIsOpen(true);
              if (playAudioClick) playAudioClick('activation');
            }}
            className="p-2 px-3 flex items-center justify-between gap-4 cursor-pointer hover:bg-white/[0.02] transition-colors rounded-xl"
            title="Exibir Economia SILA em tempo real"
          >
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[10px] font-mono text-amber-400 font-bold tracking-widest uppercase">
                SILA: {Math.floor(hoursSaved / 1000)}k h Economizadas
              </span>
            </div>
            <ChevronUp className="w-4 h-4 text-slate-400 hover:text-slate-200" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
