import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PILOT_PHASES } from '../data/silaData';
import { PilotPhase } from '../types';
import { Shield, Calendar, Users, Map, CheckCircle2, Circle, TrendingUp, Compass, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import PilotProtocolVisualizer from './PilotProtocolVisualizer';

interface PilotProposalsProps {
  playAudioClick?: () => void;
}

export default function PilotProposals({ playAudioClick }: PilotProposalsProps) {
  const [selectedPhase, setSelectedPhase] = useState<PilotPhase>(PILOT_PHASES[0]);
  const [showOfficialProtocol, setShowOfficialProtocol] = useState<boolean>(false);

  const handlePhaseChange = (phase: PilotPhase) => {
    setSelectedPhase(phase);
    if (playAudioClick) playAudioClick();
  };

  const handleToggleProtocol = () => {
    setShowOfficialProtocol(!showOfficialProtocol);
    if (playAudioClick) playAudioClick();
  };

  return (
    <div className="space-y-8 w-full" id="government-pilot-proposals-container">
      <div id="government-pilot-proposals" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Absolute Neon Glow purely for local highlights */}
        <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

        {/* Left side: Professional Interactive Phase Stepper */}
        <div className="lg:col-span-4 space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1 block font-bold">
              Implementação Localizada
            </span>
            <h3 className="text-2xl font-sans font-medium text-slate-100 tracking-tight leading-none">
              Roteiro de Ativação Soberana
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              A transformação digital do Estado Angolano assenta num plano estruturado em três fases de robustecimento e teste de stress sistémico.
            </p>
          </div>

          {/* Phase buttons stacked */}
          <div className="space-y-2.5">
            {PILOT_PHASES.map((phase) => {
              const isSelected = selectedPhase.id === phase.id;
              const isReady = phase.status === 'Pronto';
              return (
                <button
                  key={phase.id}
                  onClick={() => handlePhaseChange(phase)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden block cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.02] border-white/20 shadow-lg'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  {/* Visual side accent on selected */}
                  {isSelected && (
                    <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500"></div>
                  )}
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                      {phase.phase} • {phase.timeline}
                    </span>
                    {isReady ? (
                      <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                        PRONTO A INICIAR
                      </span>
                    ) : (
                      <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                        PLANEADO
                      </span>
                    )}
                  </div>
                  
                  <h4 className={`text-base font-sans font-semibold mt-1 transition-colors ${
                    isSelected ? 'text-slate-100' : 'text-slate-300'
                  }`}>
                    {phase.title}
                  </h4>
                  
                  <span className="text-xs text-slate-400 block mt-0.5 font-sans">
                    Polo: {phase.locationName}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right side: Phase detailed HUD with beautiful cards */}
        <div className="lg:col-span-8 bg-white/[0.01] p-6 sm:p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-[#05070A] via-[#05070A]/30 to-blue-950/5 shadow-2xl relative overflow-hidden">
          
          {/* Dynamic header representation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedPhase.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25 }}
              className="space-y-6"
            >
              {/* Visual Header */}
              <div className="border-b border-white/5 pb-5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] tracking-wider mb-1">
                  <Compass className="w-4 h-4 animate-spin-slow" />
                  CONTEÚDO DE MODELAGEM TERRITORIAL DA {selectedPhase.phase}
                </div>
                <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 italic">
                  {selectedPhase.title}
                </h4>
                <p className="text-sm text-slate-300 mt-2 font-sans leading-relaxed">
                  {selectedPhase.scope}
                </p>
              </div>

              {/* Structured Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {selectedPhase.metrics.map((metric, idx) => (
                  <div key={idx} className="bg-[#05070A] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                    <span className="text-[10px] uppercase font-mono text-slate-500 block">
                      {metric.label}
                    </span>
                    <span className="text-lg sm:text-2xl font-sans font-bold text-slate-200 mt-1 block">
                      {metric.value}
                    </span>
                  </div>
                ))}
              </div>

              {/* Strategic Phase Goal Cards */}
              <div className="bg-blue-600/[0.02] p-5 rounded-xl border border-blue-500/10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider block flex items-center gap-2">
                    <Shield className="w-4 h-4 text-amber-500" />
                    MATEUS NETO E ALUNOS COBERTOS
                  </span>
                  <span className="text-[9px] font-mono text-slate-500">
                    CRITÉRIOS SOBERANIA DO ESTADO
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-300 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-white/[0.01] rounded border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#FFB800] font-mono text-[9px] font-bold">1</div>
                    <p>
                      <strong className="text-slate-200">Sincronização Cadastral:</strong> Sincronizar bases civis nos primeiros 90 dias garantindo zero duplicação escolar no ato da matrícula.
                    </p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-5 h-5 bg-white/[0.01] rounded border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#FFB800] font-mono text-[9px] font-bold">2</div>
                    <p>
                      <strong className="text-slate-200">Auditabilidade Federal:</strong> Rastreio rigoroso de verbas por aluno inscrito direto do MAT ao órgão financeiro municipal, evitando ociosidade.
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual indicator showing progress roadmap bar */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>ESTADO DO PILOTO NACIONAL</span>
                  <span>FASE ATUAL:  {selectedPhase.id === 1 ? '75% SEGURO' : selectedPhase.id === 2 ? 'PLANEAMENTO BÁSICO' : 'ESCALAÇÃO PREVISTA'}</span>
                </div>
                <div className="h-2 bg-[#05070A] rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-700 ${
                      selectedPhase.id >= 1 ? 'bg-gradient-to-r from-blue-600 to-amber-500' : 'bg-slate-800'
                    }`}
                    style={{ width: selectedPhase.id === 3 ? '100%' : selectedPhase.id === 2 ? '65%' : '35%' }}
                  />
                </div>
              </div>
              
            </motion.div>
          </AnimatePresence>

        </div>

      </div>

      {/* Button to toggle official protocol details */}
      <div className="flex justify-center pt-4 relative z-10 w-full">
        <button
          onClick={handleToggleProtocol}
          className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border font-mono text-xs font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
            showOfficialProtocol
              ? 'bg-[#FFB800] text-black border-[#FFB800] hover:bg-[#e0a200]'
              : 'bg-white/[0.02] text-slate-200 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>{showOfficialProtocol ? 'OCULTAR PROTOCOLO OFICIAL' : 'VER PROTOCOLO OFICIAL (MAT-MED)'}</span>
          {showOfficialProtocol ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Embedded Protocol Roadmap Section */}
      <AnimatePresence>
        {showOfficialProtocol && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="overflow-hidden w-full pt-2"
          >
            <PilotProtocolVisualizer />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
