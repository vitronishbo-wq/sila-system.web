import React from 'react';
import { motion } from 'motion/react';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface SectionItem {
  id: string;
  title: string;
}

interface SovereignQuickJumpProps {
  currentSectionId: string;
  sections: SectionItem[];
  onNavigate: (sectionId: string) => void;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function SovereignQuickJump({
  currentSectionId,
  sections,
  onNavigate,
  playAudioClick,
}: SovereignQuickJumpProps) {
  const currentIndex = sections.findIndex((s) => s.id === currentSectionId);
  if (currentIndex === -1) return null;

  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < sections.length - 1;

  const handlePrevious = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasPrevious) {
      onNavigate(sections[currentIndex - 1].id);
      playAudioClick?.('click');
    }
  };

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasNext) {
      onNavigate(sections[currentIndex + 1].id);
      playAudioClick?.('click');
    }
  };

  const handleCircleJump = (id: string) => {
    onNavigate(id);
    playAudioClick?.('click');
  };

  return (
    <div className="w-full mt-16 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 z-10 relative select-none no-print">
      
      {/* Slide Index / Breadcrumb Description */}
      <div className="flex items-center gap-3">
        <div className="px-2.5 py-1 rounded bg-white/[0.02] border border-white/5 font-mono text-[10px] text-slate-400">
          SLIDE <span className="text-white font-bold">{String(currentIndex + 1).padStart(2, '0')}</span> de <span className="text-slate-500">{sections.length}</span>
        </div>
        <div className="hidden md:block">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block font-bold">
            Posição na Apresentação
          </span>
          <span className="text-xs text-slate-300 font-sans font-medium block">
            {sections[currentIndex].title}
          </span>
        </div>
      </div>

      {/* Visual Breadcrumb Tracks */}
      <div className="flex items-center gap-1.5 max-w-full overflow-x-auto py-1 px-2 no-scrollbar">
        {sections.map((sec, idx) => {
          const isActive = sec.id === currentSectionId;
          const isPassed = idx < currentIndex;
          
          return (
            <button
              key={sec.id}
              onClick={() => handleCircleJump(sec.id)}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="relative p-1 group shrink-0"
              title={sec.title}
            >
              <div 
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive 
                    ? 'w-6 bg-blue-500 shadow-sm shadow-blue-500/50' 
                    : isPassed 
                    ? 'w-2 bg-blue-500/40 hover:bg-blue-400/60' 
                    : 'w-2 bg-white/10 hover:bg-white/20'
                }`}
              />
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50 whitespace-nowrap bg-[#0a0d14] border border-white/10 p-2 text-[9px] font-mono rounded text-slate-300">
                {sec.title}
              </div>
            </button>
          );
        })}
      </div>

      {/* Controls: Next & Previous triggers */}
      <div className="flex items-center gap-2">
        <button
          onClick={handlePrevious}
          disabled={!hasPrevious}
          onMouseEnter={() => hasPrevious && playAudioClick?.('hover')}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all border ${
            hasPrevious
              ? 'bg-white/[0.02] border-white/10 text-slate-300 hover:bg-white/[0.05] hover:text-white cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed opacity-40'
          }`}
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Anterior
        </button>

        <button
          onClick={handleNext}
          disabled={!hasNext}
          onMouseEnter={() => hasNext && playAudioClick?.('hover')}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-[10px] font-mono uppercase tracking-wider transition-all border ${
            hasNext
              ? 'bg-blue-600/15 border-blue-500/30 text-blue-400 hover:bg-blue-600/25 hover:text-blue-300 cursor-pointer'
              : 'border-transparent text-slate-600 cursor-not-allowed opacity-40'
          }`}
        >
          Próximo
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}
