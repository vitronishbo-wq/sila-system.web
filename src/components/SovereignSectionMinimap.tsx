import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Compass, Navigation, Layers, ChevronRight, ChevronLeft, CheckCircle2, Bookmark, Flame } from 'lucide-react';

interface Section {
  id: string;
  title: string;
}

interface SovereignSectionMinimapProps {
  activeSection: string;
  sections: Section[];
  onNavigate: (sectionId: string) => void;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function SovereignSectionMinimap({
  activeSection,
  sections,
  onNavigate,
  playAudioClick,
}: SovereignSectionMinimapProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const activeIndex = sections.findIndex((s) => s.id === activeSection);
  const totalSections = sections.length;
  const progressPercent = Math.round(((activeIndex + 1) / totalSections) * 100);

  const handleSelect = (id: string) => {
    playAudioClick?.('click');
    onNavigate(id);
  };

  return (
    <div className="fixed right-6 top-28 z-[110] hidden xl:flex items-center no-print antialiased select-none pointer-events-none">
      <div className="flex items-start gap-3 pointer-events-auto">
        
        {/* Toggle Button to expand/collapse minimap */}
        <button
          onClick={() => {
            setIsExpanded(!isExpanded);
            playAudioClick?.('activation');
          }}
          onMouseEnter={() => playAudioClick?.('hover')}
          className="flex items-center justify-center w-8 h-8 rounded-full bg-[#05070A]/85 hover:bg-[#090d14] text-slate-400 hover:text-white border border-white/10 shadow-lg backdrop-blur-md transition-all duration-300 focus:outline-none"
          title={isExpanded ? "Contrair Mapa de Seções" : "Expandir Mapa de Seções"}
        >
          {isExpanded ? (
            <ChevronRight className="w-4 h-4 text-slate-300" />
          ) : (
            <div className="relative flex items-center justify-center">
              <Compass className="w-4 h-4 text-blue-400 animate-spin-slow" />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500"></span>
            </div>
          )}
        </button>

        {/* Dynamic Panel Container */}
        <AnimatePresence mode="wait">
          {isExpanded ? (
            <motion.div
              initial={{ opacity: 0, x: 20, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 20, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="w-64 bg-[#05070a]/90 backdrop-blur-lg border border-white/10 rounded-2xl p-4 shadow-2xl flex flex-col gap-3.5"
            >
              {/* Header Status of Minimap */}
              <div className="flex items-center justify-between border-b border-white/5 pb-2.5">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-blue-400 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-200">
                    SILA MAPA DE SEÇÕES
                  </span>
                </div>
                <span className="text-[9px] font-mono bg-blue-500/10 text-blue-400 border border-blue-500/15 px-1.5 py-0.5 rounded">
                  {activeIndex + 1}/{totalSections}
                </span>
              </div>

              {/* Graphical vertical connector path list of sections */}
              <div className="relative flex flex-col gap-2.5 max-h-[50vh] overflow-y-auto pr-1.5 scrollbar-thin">
                {/* Simulated vertical timeline laser guide */}
                <div className="absolute left-3 top-2.5 bottom-2.5 w-[1.5px] bg-white/5 pointer-events-none">
                  <div 
                    className="w-full bg-gradient-to-b from-blue-500 to-emerald-500 transition-all duration-500" 
                    style={{ height: `${progressPercent}%` }}
                  />
                </div>

                {sections.map((section, idx) => {
                  const isActive = section.id === activeSection;
                  const isCompleted = idx < activeIndex;

                  return (
                    <button
                      key={section.id}
                      onClick={() => handleSelect(section.id)}
                      onMouseEnter={() => playAudioClick?.('hover')}
                      className={`flex items-start gap-3 w-full text-left group relative pl-1.5 py-0.5 focus:outline-none transition-all`}
                    >
                      {/* Interactive Bead indicator */}
                      <div className="relative z-10 flex items-center justify-center w-3 h-3 mt-1 shrink-0">
                        {isActive ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-md shadow-blue-500/50"></span>
                          </>
                        ) : isCompleted ? (
                          <div className="w-2 h-2 rounded-full bg-emerald-500 border border-emerald-400/50" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white/15 group-hover:bg-white/30 transition-colors" />
                        )}
                      </div>

                      {/* Title description metadata */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] font-mono ${isActive ? 'text-blue-400 font-bold' : 'text-slate-500'}`}>
                            {String(idx + 1).padStart(2, '0')}
                          </span>
                          {isActive && (
                            <motion.span 
                              layoutId="activePointer"
                              className="text-[7px] font-mono text-emerald-400 font-bold uppercase tracking-widest flex items-center gap-0.5"
                            >
                              <span className="w-1 h-1 rounded-full bg-emerald-500 animate-ping"></span>
                              AQUI
                            </motion.span>
                          )}
                        </div>
                        <p className={`text-xs truncate font-medium tracking-wide mt-0.5 transition-colors ${
                          isActive 
                            ? 'text-white font-bold' 
                            : isCompleted 
                            ? 'text-slate-300 hover:text-white' 
                            : 'text-slate-400 hover:text-slate-200'
                        }`}>
                          {section.title}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Consolidated completion bar */}
              <div className="border-t border-white/5 pt-2.5 space-y-1.5 font-mono text-[9px]">
                <div className="flex justify-between items-center text-slate-500">
                  <span>PROGRESSO DA SESSÃO</span>
                  <span className="text-emerald-400 font-bold">{progressPercent}%</span>
                </div>
                <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

            </motion.div>
          ) : (
            /* Collapsed simple light beads/dots panel showing active navigation state */
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="bg-[#05070a]/75 backdrop-blur-md border border-white/10 rounded-2xl py-3 px-2 flex flex-col gap-3 shadow-lg"
            >
              {sections.map((section, idx) => {
                const isActive = section.id === activeSection;
                const isCompleted = idx < activeIndex;

                return (
                  <button
                    key={section.id}
                    onClick={() => handleSelect(section.id)}
                    onMouseEnter={() => playAudioClick?.('hover')}
                    className="relative group flex items-center justify-center focus:outline-none"
                    title={`${idx + 1}. ${section.title}`}
                  >
                    <div className="relative w-3.5 h-3.5 flex items-center justify-center">
                      {isActive ? (
                        <>
                          <span className="animate-ping absolute inline-flex h-3 w-3 rounded-full bg-blue-400 opacity-60"></span>
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500 shadow-md shadow-blue-400/50"></span>
                        </>
                      ) : isCompleted ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/80 group-hover:bg-emerald-400 transition-colors" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-slate-600 group-hover:bg-slate-400 transition-colors" />
                      )}
                    </div>

                    {/* Left hovering tooltip when collapsed to display title */}
                    <div className="absolute right-7 bg-black/95 border border-white/10 px-2 py-1 rounded-md text-[9px] font-mono text-slate-200 whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 translate-x-2 group-hover:translate-x-0 shadow-xl">
                      <span className="text-blue-400 font-bold mr-1">{String(idx + 1).padStart(2, '0')}.</span>
                      {section.title}
                    </div>
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
