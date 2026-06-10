import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { FUC_MILESTONES } from '../data/silaData';
import { FucMilestone } from '../types';
import SovereignTooltip from './SovereignTooltip';
import { 
  FileText, ShieldCheck, Milestone, Fingerprint, Construction,
  HeartPulse, User, Award, CheckCircle, Database, HelpCircle, Lock
} from 'lucide-react';

interface TimelineLifeProps {
  playAudioClick?: () => void;
  milestones?: FucMilestone[];
  isLoading?: boolean;
}

export default function TimelineLife({ playAudioClick, milestones = FUC_MILESTONES, isLoading = false }: TimelineLifeProps) {
  const [activeStep, setActiveStep] = useState<FucMilestone>(milestones[0] || FUC_MILESTONES[0]);

  // Synchronize state when the milestones list changes (such as when dynamic cache loads asynchronously)
  useEffect(() => {
    if (milestones && milestones.length > 0) {
      // Find matching item or default to first
      const currentExists = milestones.find(m => m.id === activeStep?.id);
      if (!currentExists) {
        setActiveStep(milestones[0]);
      }
    }
  }, [milestones]);

  // Handler for milestone click
  const handleMilestoneClick = (step: FucMilestone) => {
    setActiveStep(step);
    if (playAudioClick) playAudioClick();
  };

  if (isLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-busy="true" 
        id="fuc-experience-timeline-skeleton" 
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10 animate-pulse select-none"
      >
        <span className="sr-only">Carregando cronograma do ciclo de vida e registros da Ficha Única do Cidadão do cache local...</span>
        
        {/* Left side: Timeline selector points skeleton */}
        <div className="lg:col-span-6 space-y-4">
          <div className="mb-6 space-y-2">
            {/* Tag */}
            <div className="h-3.5 w-32 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-full" />
            {/* Title */}
            <div className="h-8 w-[90%] bg-slate-800 rounded-lg" />
            {/* Subtitle / Description */}
            <div className="h-4 w-[80%] bg-slate-800/50 rounded-lg mt-2" />
          </div>

          <div className="space-y-2.5 relative before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-[2px] before:bg-white/5">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div
                key={idx}
                className="flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/[0.005]"
              >
                {/* Timeline node ring bone */}
                <div className="w-3.5 h-3.5 rounded-full bg-slate-800 shrink-0 mt-1.5 border border-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="h-2.5 w-12 bg-slate-800 rounded-full" />
                    <div className="h-4 w-16 bg-slate-800/40 border border-white/5 rounded text-[8px]" />
                  </div>
                  <div className="h-4 w-48 bg-slate-800 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Ficha Única do Cidadão (FUC) Blueprint Mockup skeleton */}
        <div className="lg:col-span-6 bg-white/[0.01] border border-white/10 p-6 sm:p-8 rounded-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-white/5" />
              <div className="space-y-1.5">
                <div className="h-2 w-28 bg-slate-800 rounded-full" />
                <div className="h-3 w-40 bg-slate-800 rounded" />
              </div>
            </div>
            <div className="space-y-1 text-right">
              <div className="h-2 w-20 bg-slate-800/50 ml-auto rounded-full" />
              <div className="h-3 w-12 bg-slate-800 ml-auto rounded" />
            </div>
          </div>

          {/* Citizen Profile skeleton */}
          <div className="flex items-center gap-4 bg-white/[0.005] p-5 rounded-xl border border-white/5">
            <div className="w-16 h-16 rounded-xl bg-slate-800 shrink-0 border border-white/5" />
            <div className="space-y-2 flex-1">
              <div className="h-2.5 w-24 bg-slate-800/60 rounded" />
              <div className="h-4 w-48 bg-slate-800 rounded" />
              <div className="h-2.5 w-32 bg-slate-800/60 rounded" />
            </div>
          </div>

          {/* Ledger block rows skeleton */}
          <div className="space-y-2.5">
            <div className="h-2.5 w-36 bg-slate-800/50 rounded-full mb-3" />
            {[1, 2, 3].map((idx) => (
              <div key={idx} className="flex justify-between items-center p-3.5 rounded-lg border border-white/5 bg-white/[0.005]">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-slate-800" />
                  <div className="space-y-1.5">
                    <div className="h-2 w-12 bg-slate-800/40 rounded-full" />
                    <div className="h-3 w-28 bg-slate-800 rounded" />
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-4 w-12 bg-slate-800/40 rounded" />
                  <div className="h-4 w-10 bg-slate-800/40 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="fuc-experience-timeline" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
      {/* Background radial soft light purely on FUC section to match premium branding */}
      <div className="absolute top-[30%] left-[50%] -translate-x-[50%] -translate-y-[50%] w-[500px] h-[500px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Left side: Timeline selector points */}
      <div className="lg:col-span-6 space-y-4">
        <div className="mb-6">
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1.5 block font-bold">
            Eixo Estratégico Único
          </span>
          <h3 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight">
            Toda a jornada de vida numa única ficha integrada
          </h3>
          <p className="text-sm text-slate-400 mt-2">
            Clique nas etapas abaixo para assistir à agregação automática e impercetível de dados ao longo do ciclo de vida nacional do cidadão angolano.
          </p>
        </div>

        <div className="space-y-2 relative before:absolute before:top-2 before:bottom-2 before:left-[21px] before:w-[2px] before:bg-white/5">
          {milestones.map((milestone) => {
            const isSelected = activeStep.id === milestone.id;
            return (
              <div
                key={milestone.id}
                onClick={() => handleMilestoneClick(milestone)}
                className={`group flex items-start gap-4 p-4 rounded-xl cursor-pointer transition-all duration-300 relative ${
                  isSelected
                    ? 'bg-white/[0.02] border border-white/10 shadow-lg shadow-black/40'
                    : 'hover:bg-white/[0.01]/40 border border-transparent'
                }`}
              >
                {/* Timeline Node Ring */}
                <div className="relative z-10 flex items-center justify-center mt-1.5">
                  <div
                    className={`w-[14px] h-[14px] rounded-full transition-all duration-300 ${
                      isSelected
                        ? 'bg-blue-500 ring-4 ring-blue-500/20'
                        : 'bg-slate-700 ring-0 group-hover:bg-slate-500'
                    }`}
                  />
                </div>

                {/* Text Context */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500 tracking-wider">
                      {milestone.age}
                    </span>
                    <span 
                      className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded"
                      style={{ 
                        color: milestone.color, 
                        backgroundColor: `${milestone.color}15`,
                        border: `1px solid ${milestone.color}25`
                      }}
                    >
                      {milestone.phase}
                    </span>
                  </div>
                  <h4 className={`text-sm font-sans font-medium transition-colors mt-0.5 ${
                    isSelected ? 'text-slate-100' : 'text-slate-400 group-hover:text-slate-300'
                  }`}>
                    {milestone.label}
                  </h4>
                  
                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      transition={{ duration: 0.25 }}
                      className="mt-2 text-xs text-slate-400 space-y-3 pt-2 border-t border-white/5 leading-relaxed"
                    >
                      <p>{milestone.description}</p>
                      
                      <div className="space-y-1.5">
                        <span className="text-[9px] font-mono uppercase tracking-wider text-[#FFB800] block">
                          Sincronização Ativa:
                        </span>
                        <div className="text-[10px] font-mono text-slate-300 flex items-center gap-1.5 bg-[#05070A] px-2 py-1 rounded border border-white/5">
                          <Database className="w-3 h-3 text-blue-500 shrink-0" />
                          {milestone.systemIntegration}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right side: Ficha Única do Cidadão (FUC) Blueprint Mockup */}
      <div className="lg:col-span-6 sticky top-28 bg-[#05070A] p-[1.5px] rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-blue-900/10 shadow-2xl">
        <div className="bg-[#05070A] p-6 sm:p-8 rounded-2xl relative overflow-hidden">
          {/* Subtle light effect on card */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-b from-blue-500/10 to-transparent blur-3xl rounded-full"></div>

          {/* Secure Header */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <div>
                <span className="text-[9px] uppercase font-mono tracking-widest text-[#FFB800] block font-bold">
                  Sovereign Identity Card
                </span>
                <span className="text-xs font-sans font-medium text-slate-100 block">
                  <SovereignTooltip term="FUC" explanation="Ficha Única do Cidadão - o repositório centralizado de identidade soberana que unifica os dados cívicos, académicos e sociais de cada cidadão num registo nacional único e imutável.">Ficha Única do Cidadão (FUC)</SovereignTooltip>
                </span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                Dispositivo de Validação
              </span>
              <span className="text-[10px] font-mono text-emerald-400 font-bold block flex items-center gap-1 justify-end">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                ONLINE
              </span>
            </div>
          </div>

          {/* Citizen Primary Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 bg-white/[0.01] p-5 rounded-xl border border-white/5 mb-6">
            <div className="relative">
              {/* Virtual Fingerprint / Profile Placeholder */}
              <div className="w-20 h-20 rounded-xl bg-[#05070A] border border-white/10 flex items-center justify-center relative overflow-hidden">
                <User className="w-8 h-8 text-slate-600" />
                <div className="absolute inset-0 bg-blue-500/5 flex items-center justify-center">
                  <Fingerprint className="w-16 h-16 text-blue-500/10 rotate-12" />
                </div>
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center border-2 border-[#05070A]">
                <ShieldCheck className="w-3 h-3 text-white" />
              </div>
            </div>

            <div className="text-center sm:text-left space-y-1.5 flex-1 min-w-0">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widening font-bold block">
                Cidadão Angolano
              </span>
              <h4 className="text-lg font-sans font-medium text-slate-100 tracking-tight leading-tight">
                Sérgio Constantino Chilombo
              </h4>
              <div className="text-xs font-mono text-slate-400 space-y-1">
                <p>NIF: <span className="text-slate-200">5048214739</span></p>
                <p>N.I.U: <span className="text-slate-200">AO-2026-CHILOMBO-FUC</span></p>
              </div>
            </div>
          </div>

          {/* Interactive Dynamic Data Aggregations (Visual Ledger) */}
          <div className="space-y-4">
            <h5 className="text-[10px] uppercase font-mono tracking-wider text-slate-500 border-b border-white/5 pb-1.5">
              Dados Integrados no Sistema de Segurança do Estado (Ledger)
            </h5>

            <div className="space-y-2.5">
              {fucMilestonesUpTo(activeStep.id, milestones).map((milestone) => (
                <motion.div
                  key={milestone.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-between gap-4 bg-white/[0.01] px-3.5 py-2.5 rounded-lg border border-white/5 hover:bg-white/[0.02] transition-colors duration-300"
                >
                  <div className="flex items-center gap-2.5">
                    <div 
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: milestone.color }}
                    />
                    <div>
                      <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
                        {milestone.phase}
                      </span>
                      <span className="text-xs text-slate-100 font-sans font-medium">
                        {milestone.label}
                      </span>
                    </div>
                  </div>

                  {/* Micro pill listing the data payloads gathered */}
                  <div className="flex gap-1.5 max-w-[50%] flex-wrap justify-end">
                    {milestone.dataRegistered.slice(0, 2).map((item, idx) => (
                      <span key={idx} className="bg-[#05070A] text-slate-400 text-[8px] px-1.5 py-0.5 rounded border border-white/5 font-mono">
                        {item}
                      </span>
                    ))}
                    {milestone.dataRegistered.length > 2 && (
                      <span className="bg-[#05070A] text-slate-500 text-[8px] px-1.5 py-0.5 rounded border border-white/5 font-mono">
                        +{milestone.dataRegistered.length - 2}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Locked/Upcoming milestones (shown as blurred or locked rows to represent potential future life stages) */}
              {fucMilestonesLockedAfter(activeStep.id, milestones).map((milestone) => (
                <div
                  key={milestone.id}
                  className="flex items-center justify-between gap-4 bg-white/[0.005] px-3.5 py-2.5 rounded-lg border border-dashed border-white/5 opacity-40 select-none"
                >
                  <div className="flex items-center gap-2.5">
                    <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                    <div>
                      <span className="text-[9px] font-mono text-slate-600 uppercase tracking-widest block">
                        Etapa Disponível {milestone.age}
                      </span>
                      <span className="text-xs text-slate-500 font-sans font-medium">
                        {milestone.label} (Aguardando)
                      </span>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono text-slate-700">INTEGRAÇÃO BLOQUEADA</span>
                </div>
              ))}
            </div>
          </div>

          {/* Strategic central reminder block */}
          <div className="mt-6 pt-5 border-t border-white/5 text-center relative">
            <p className="text-xs text-[#FFB800] tracking-wide font-sans font-medium italic">
              "O cidadão fornece os dados uma única vez."
            </p>
            <span className="text-[9px] font-mono text-slate-500 block mt-1 uppercase tracking-widest">
              Surgimento do SILA: O ecossistema soberano de interoperabilidade
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}

// Helper to resolve milestone stacks up to current selection
function fucMilestonesUpTo(id: string, list: FucMilestone[]) {
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return list.slice(0, 1);
  return list.slice(0, idx + 1);
}

// Helper to resolve remaining upcoming milestones as locked slots
function fucMilestonesLockedAfter(id: string, list: FucMilestone[]) {
  const idx = list.findIndex((x) => x.id === id);
  if (idx === -1) return [];
  return list.slice(idx + 1);
}
