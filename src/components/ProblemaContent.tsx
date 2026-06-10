import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { PROBLEM_METRICS } from '../data/silaData';
import ComparativeSplitScreen from './ComparativeSplitScreen';
import GovernmentEfficiencyCalculator from './GovernmentEfficiencyCalculator';
import SovereignKeyTakeaway from './SovereignKeyTakeaway';
import SovereignQuickJump from './SovereignQuickJump';

// Ensure ScrollTrigger is registered safely
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ProblemaContentProps {
  playAudioClick: (type?: 'hover' | 'activation' | 'click') => void;
  onNavigate: (sectionId: string) => void;
  sections: any[];
}

export default function ProblemaContent({ playAudioClick, onNavigate, sections }: ProblemaContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const leftNarrativeRef = useRef<HTMLDivElement>(null);
  const cardsGridRef = useRef<HTMLDivElement>(null);
  const interactiveAreaRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // 1. Refresh ScrollTrigger calculations on mount so offsets match perfectly
    ScrollTrigger.refresh();

    // 2. Left Narrative Column scroll trigger
    gsap.fromTo(leftNarrativeRef.current,
      { opacity: 0.3, y: 30, scale: 0.98 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        scrollTrigger: {
          trigger: leftNarrativeRef.current,
          start: "top 90%",
          end: "bottom 55%",
          scrub: 0.8,
        }
      }
    );

    // 3. Staggered millimetric scroll-scrubbed problem metric cards
    const cards = gsap.utils.toArray('.gsap-problem-card') as HTMLElement[];
    cards.forEach((card, index) => {
      gsap.fromTo(card,
        { 
          opacity: 0, 
          y: 70, 
          scale: 0.95,
          filter: "blur(6px)",
          boxShadow: "0 0 0px rgba(239, 68, 68, 0)"
        },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          boxShadow: "0 10px 30px rgba(239, 68, 68, 0.02)",
          scrollTrigger: {
            trigger: card,
            start: "top 95%",
            end: "top 65%",
            scrub: 1 + (index * 0.15), // Varied offset coefficient for dynamic feeling
          }
        }
      );
    });

    // 4. Interactive playground block scroll coordinator
    gsap.fromTo(interactiveAreaRef.current,
      { opacity: 0.2, scale: 0.96, filter: "blur(5px)" },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        scrollTrigger: {
          trigger: interactiveAreaRef.current,
          start: "top 85%",
          end: "top 50%",
          scrub: 1.2,
        }
      }
    );

  }, { scope: containerRef });

  return (
    <div ref={containerRef} className="w-full relative">
      {/* Narrative grid row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Narrative Column */}
        <div ref={leftNarrativeRef} className="lg:col-span-5 space-y-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-rose-500 mb-1.5 block font-bold">
            Mapeamento de Obstáculos • Hoje
          </span>
          <h3 className="text-3xl sm:text-4xl font-sans font-medium text-slate-100 tracking-tight leading-none">
            A Crise de Desfragmentação Administrativa
          </h3>
          
          <div className="space-y-4 text-sm text-slate-400 font-sans leading-relaxed">
            <p>
              Atualmente, a máquina estatal opera sob sistemas estanques e autárquicos. O cidadão angolano vê-se obrigado a repetir os mesmos dados básicos diversas vezes para diferentes secretarias, ministérios e províncias.
            </p>
            <p>
              O preenchimento manual recorrente gera desperdício de tempo fiduciário, sobrecarrega os balcões e facilita a ocorrência de fraudes e assimetrias cadastrais.
            </p>
          </div>

          {/* Callout box */}
          <div className="p-4 bg-white/[0.01] rounded-2xl border border-white/5 space-y-2">
            <span className="text-[#0066FF] text-[10px] font-mono uppercase tracking-widest font-bold block">
              Visão de Diagnóstico
            </span>
            <p className="text-xs text-slate-300 leading-relaxed font-sans italic">
              "Sistemas desalinhados alimentam fraudes de matrículas, proliferação de certidões falsas e lentidão territorial."
            </p>
          </div>
        </div>

        {/* Right Bento Cards Grid with GSAP precision scroll selectors */}
        <div ref={cardsGridRef} className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PROBLEM_METRICS.map((metric) => (
            <div 
              key={metric.id}
              className="gsap-problem-card bg-white/[0.01] p-6 rounded-2xl border border-white/5 hover:border-white/10 transition-colors relative overflow-hidden group select-none"
            >
              {/* Top luxury line accent */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-rose-500/20 to-transparent"></div>
              
              <span className="text-[10px] uppercase font-mono tracking-widest text-slate-500 block mb-1">
                {metric.title}
              </span>
              <span className="text-3xl sm:text-4xl font-sans font-bold text-rose-500 block">
                {metric.metric}
              </span>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                {metric.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive split comparative and government efficiency tools section */}
      <div ref={interactiveAreaRef} className="mt-16 relative z-20 space-y-8">
        <ComparativeSplitScreen playAudioClick={playAudioClick} />
        <GovernmentEfficiencyCalculator playAudioClick={playAudioClick} />
        <SovereignKeyTakeaway sectionId="problema" />
        <SovereignQuickJump currentSectionId="problema" sections={sections} onNavigate={onNavigate} playAudioClick={playAudioClick} />
      </div>
    </div>
  );
}
