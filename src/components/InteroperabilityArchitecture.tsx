import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

import SovereignTooltip from './SovereignTooltip';
import FucThreeDViewer from './FucThreeDViewer';
import { 
  Database, School, HeartPulse, Scale, ShieldCheck, 
  Briefcase, Landmark, RefreshCw, Camera, Sparkles, RotateCw
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

interface InteroperabilityArchitectureProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  onOpenAr?: () => void;
}

interface SatelliteNode {
  id: string;
  name: string;
  system: string;
  angle: number;
  icon: LucideIcon;
  color: string;
  desc: string;
}

const SATELLITE_NODES: SatelliteNode[] = [
  { id: 'edu', name: 'Educação', system: 'SILA Educação (MED)', angle: 0, icon: School, color: '#FFB800', desc: 'Historial académico escolar completo, transferências e diplomas assinados digitalmente.' },
  { id: 'sau', name: 'Saúde', system: 'MINSA Integrado', angle: 60, icon: HeartPulse, color: '#10B981', desc: 'Registo de vacinação territorial, prontuários clínicos e alertas do estudante.' },
  { id: 'jus', name: 'Justiça', system: 'DNDH Registo Civil', angle: 120, icon: Scale, color: '#D97706', desc: 'Emissão unificada de certidões, integridade biométrica de B.I. e registo na maternidade.' },
  { id: 'pro', name: 'Proteção Social', system: 'MASFAMU Coesão', angle: 180, icon: ShieldCheck, color: '#EC4899', desc: 'Subsídios programados por rácio de carência e mapeamentos de ajuda territorial.' },
  { id: 'emp', name: 'Emprego & NIF', system: 'AGT / Seg. Social', angle: 240, icon: Briefcase, color: '#8B5CF6', desc: 'Segurança social ativa e validação profissional imediata sem autenticação física.' },
  { id: 'adm', name: 'Admin Local', system: 'SILA Governação do Território', angle: 300, icon: Landmark, color: '#BFDBFE', desc: 'Levantamento de infraestruturas locais, licenças, saneamento e registo habitacional.' },
];

// Client-only wrapper component
const ClientOnly = ({ children }: { children: React.ReactNode }) => {
  const [hasMounted, setHasMounted] = useState(false);
  
  useEffect(() => {
    setHasMounted(true);
  }, []);
  
  if (!hasMounted) return null;
  return <>{children}</>;
};

export default function InteroperabilityArchitecture({ playAudioClick, onOpenAr }: InteroperabilityArchitectureProps) {
  const [activeViewMode, setActiveViewMode] = useState<'2d' | '3d'>('2d'); // Mudei para '2d' como padrão para evitar erro inicial do 3D
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SatelliteNode | null>(SATELLITE_NODES[0]);
  const [syncPhase, setSyncPhase] = useState<'idle' | 'flowing' | 'complete'>('idle');
  const [isClient, setIsClient] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);

  // Garantir que só executamos no cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  useGSAP(() => {
    // Só executa se estivermos no cliente e o ScrollTrigger estiver disponível
    if (typeof window === 'undefined' || !ScrollTrigger) return;
    
    // Garantir que o plugin está registado
    try {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.refresh();
    } catch (error) {
      console.warn('GSAP ScrollTrigger registration failed:', error);
      return;
    }

    const viewer = document.querySelector(".gsap-arch-viewer");
    const ctrl = document.querySelector(".gsap-arch-ctrl");
    
    if (viewer) {
      gsap.fromTo(".gsap-arch-viewer",
        { opacity: 0.4, y: 40, scale: 0.98, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: "blur(0px)",
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 95%",
            end: "bottom 60%",
            scrub: 1,
          }
        }
      );
    }

    if (ctrl) {
      gsap.fromTo(".gsap-arch-ctrl",
        { opacity: 0.4, y: 60, scale: 0.98 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          scrollTrigger: {
            trigger: rootRef.current,
            start: "top 90%",
            end: "bottom 55%",
            scrub: 1.2,
          }
        }
      );
    }
  }, { scope: rootRef, dependencies: [isClient] });

  const startSimulation = () => {
    setIsSyncing(true);
    setSyncPhase('flowing');
    if (playAudioClick) playAudioClick('activation');

    setTimeout(() => {
      setSyncPhase('complete');
      setIsSyncing(false);
      if (playAudioClick) playAudioClick('click');
    }, 4000);
  };

  const resetSimulation = () => {
    setSyncPhase('idle');
    setIsSyncing(false);
    if (playAudioClick) playAudioClick('click');
  };

  const handleNodeClick = (node: SatelliteNode) => {
    setSelectedNode(node);
    if (playAudioClick) playAudioClick('hover');
  };

  return (
    <div ref={rootRef} id="sila-interoperability-architecture" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.01] p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1.5px,transparent_1.5px),linear-gradient(to_bottom,#05070A_1.5px,transparent_1.5px)] bg-[size:36px_36px] opacity-15 pointer-events-none"></div>

      {/* Visual Radial Schema or 3D WebGL Area */}
      <div className="gsap-arch-viewer lg:col-span-7 flex flex-col justify-center relative min-h-[380px] sm:min-h-[480px] select-none rounded-2xl overflow-hidden self-stretch">
        <AnimatePresence mode="wait">
          {activeViewMode === '3d' && isClient ? (
            <motion.div 
              key="3d-webgl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full min-h-[380px] sm:min-h-[440px] flex flex-col"
            >
              <ClientOnly>
                <FucThreeDViewer playAudioClick={playAudioClick} />
              </ClientOnly>
            </motion.div>
          ) : (
            <motion.div
              key="2d-diagram"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full min-h-[380px] sm:min-h-[440px] flex items-center justify-center"
            >
              {/* Central Core FUC node */}
              <div 
                onClick={startSimulation}
                className={`w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-[#05070A] border-2 flex flex-col items-center justify-center p-3 text-center transition-all duration-500 cursor-pointer z-20 ${
                  syncPhase === 'complete'
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                    : syncPhase === 'flowing'
                    ? 'border-blue-500 animate-pulse shadow-xl shadow-blue-500/10'
                    : 'border-white/10'
                }`}
              >
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/5 animate-spin-slow"></div>
                
                <Database className={`w-5 h-5 sm:w-6 sm:h-6 mb-1 transition-all duration-300 ${
                  syncPhase === 'complete' ? 'text-amber-500 scale-110' : syncPhase === 'flowing' ? 'text-blue-500 animate-spin' : 'text-slate-400'
                }`} />
                
                <span className="text-[9px] sm:text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-bold leading-tight">
                  <SovereignTooltip term="CORE FUC" explanation="O núcleo centralizado da Ficha Única que unifica dados de identificação civil nacional.">CORE FUC</SovereignTooltip>
                </span>
                <span className="text-[8px] sm:text-[9px] font-mono text-slate-500 block leading-none mt-1">
                  Ficha Única
                </span>
              </div>

              {/* Orbital circle reference */}
              <div className="absolute w-[60%] aspect-square rounded-full border border-dashed border-white/5 pointer-events-none z-0"></div>

              {/* Dynamic responsive SVG flow route lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {SATELLITE_NODES.map((node) => {
                  const radians = (node.angle * Math.PI) / 180;
                  const radiusFactor = 30;
                  const startX = 50 + radiusFactor * Math.cos(radians);
                  const startY = 50 - radiusFactor * Math.sin(radians);
                  const isFlowing = syncPhase === 'flowing';

                  return (
                    <g key={`flow-${node.id}`}>
                      <line
                        x1={`${startX}%`}
                        y1={`${startY}%`}
                        x2="50%"
                        y2="50%"
                        className={`transition-all duration-300 ${
                          isFlowing ? 'stroke-blue-500/40' : 'stroke-white/[0.03]'
                        }`}
                        strokeWidth={isFlowing ? "1.5" : "0.6"}
                      />

                      {!isFlowing && (
                        [...Array(3)].map((_, i) => (
                          <motion.circle
                            key={`idle-trail-${node.id}-${i}`}
                            r={1.5}
                            fill={node.color}
                            opacity={0.12 - i * 0.04}
                            initial={{ cx: `${startX}%`, cy: `${startY}%` }}
                            animate={{ cx: '50%', cy: '50%' }}
                            transition={{
                              duration: 3.5,
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.2,
                            }}
                          />
                        ))
                      )}

                      {isFlowing && (
                        [...Array(5)].map((_, i) => (
                          <g key={`active-flow-${node.id}-${i}`}>
                            <motion.circle
                              r={2.5 - i * 0.4}
                              fill={node.color}
                              className="filter drop-shadow-[0_0_3px_rgba(59,130,246,0.35)]"
                              opacity={1.0 - i * 0.2}
                              initial={{ cx: `${startX}%`, cy: `${startY}%` }}
                              animate={{ cx: '50%', cy: '50%' }}
                              transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                ease: "easeIn",
                                delay: i * 0.06,
                              }}
                            />
                          </g>
                        ))
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Radial Satellites Absolute placement wrapper */}
              {SATELLITE_NODES.map((node) => {
                const NodeIcon = node.icon;
                const isSelected = selectedNode?.id === node.id;
                const radians = (node.angle * Math.PI) / 180;
                const radiusFactor = 30;
                const leftPercent = 50 + radiusFactor * Math.cos(radians);
                const topPercent = 50 - radiusFactor * Math.sin(radians);

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    style={{
                      left: `${leftPercent}%`,
                      top: `${topPercent}%`,
                    }}
                    className={`absolute w-11 h-11 sm:w-14 sm:h-14 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#05070A] border flex flex-col items-center justify-center cursor-pointer transition-all duration-300 z-20 hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 shadow-md shadow-blue-950/40 text-blue-400'
                        : 'border-white/10 text-slate-500 hover:border-white/20'
                    }`}
                    title={node.system}
                  >
                    <div 
                      className="absolute inset-[1.5px] rounded-full opacity-0 hover:opacity-10 transition-opacity"
                      style={{ backgroundColor: node.color }}
                    ></div>
                    <NodeIcon className="w-4 h-4 sm:w-5.5 sm:h-5.5" />
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side ControlHUD Details panel */}
      <div className="gsap-arch-ctrl lg:col-span-5 space-y-6 relative z-10 bg-white/[0.01] p-6 rounded-2xl border border-white/5">
        
        <div className="border-b border-white/5 pb-4">
          <span className="text-[9px] uppercase font-mono tracking-widest text-emerald-500 mb-1 block font-bold">
            PLATAFORMA INTEGRAL DE <SovereignTooltip term="INTEROPERABILIDADE" explanation="A capacidade segura de conectar e sincronizar instantaneamente os silos de dados de diferentes ministérios de Angola num único barramento soberano.">INTEROPERABILIDADE</SovereignTooltip>
          </span>
          <h4 className="text-lg font-sans font-medium text-slate-100 flex items-center gap-2">
            O SILA Não é um Sistema Isolado
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            É o tecido conjuntivo que une os variados silos governamentais da Nação.
          </p>
        </div>

        {/* View Mode Switcher */}
        <div className="flex bg-[#05080c]/60 border border-white/15 p-1 rounded-xl items-center justify-between no-print gap-1.5 shadow-md">
          <span className="text-[10px] font-mono text-slate-400 pl-2 font-semibold">ESPAÇO DE VISTA:</span>
          <div className="flex gap-1">
            <button
              onClick={() => { setActiveViewMode('2d'); if (playAudioClick) playAudioClick('click'); }}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all cursor-pointer ${
                activeViewMode === '2d' 
                  ? 'bg-blue-600/25 text-blue-400 border border-blue-500/20 font-bold' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              2D Diagrama
            </button>
            <button
              onClick={() => { setActiveViewMode('3d'); if (playAudioClick) playAudioClick('activation'); }}
              className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
                activeViewMode === '3d' 
                  ? 'bg-sky-500/25 text-sky-400 border border-sky-500/30 font-bold shadow-[0_0_15px_-3px_rgba(56,189,248,0.2)]' 
                  : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
              }`}
            >
              <RotateCw className={`w-3 h-3 ${activeViewMode === '3d' ? 'animate-spin-slow' : ''}`} />
              3D WebGL (FUC)
            </button>
          </div>
        </div>

        {/* Console Action Blocks */}
        <div className="space-y-4">
          {syncPhase === 'idle' && (
            <div className="p-4 bg-[#05070A] rounded-xl border border-white/5 space-y-3">
              <span className="text-[10px] font-mono text-slate-500 block">
                AUDITORIA DE COMANDO ATIVA
              </span>
              <p className="text-xs text-slate-300">
                Pode simular o fluxo de consolidação onde os 6 ministérios e agências cruzam dados simultâneos para a Ficha Única.
              </p>
              <button
                onClick={startSimulation}
                className="w-full py-2.5 bg-gradient-to-r from-blue-700 to-blue-950 hover:from-blue-600 hover:to-blue-800 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 shadow-lg transition-transform hover:scale-[1.01]"
              >
                <RefreshCw className="w-4 h-4 animate-spin-slow" />
                Simular Unificação SILA (Singularidade)
              </button>
            </div>
          )}

          {syncPhase === 'flowing' && (
            <div className="p-4 bg-blue-600/5 border border-blue-500/30 rounded-xl space-y-3">
              <span className="text-[10px] font-mono text-blue-400 font-bold block animate-pulse flex items-center gap-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                TRANSMISSÃO CRIPTOGRÁFICA EM CURSO...
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                As pautas do Huambo, prontuários do MINSA, registos civis da maternidade e bases do B.I. estão a consolidar registos no CORE SILA do cidadão Sérgio Chilombo.
              </p>
              <div className="h-1.5 bg-[#05070A] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4 }}
                  className="h-full bg-blue-500"
                />
              </div>
            </div>
          )}

          {syncPhase === 'complete' && (
            <div className="p-4 bg-amber-600/5 border border-amber-500/30 rounded-xl space-y-3">
              <span className="text-[10px] font-mono text-amber-500 font-bold block flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                SINGULARIDADE ATIVADA COM SUCESSO
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Interoperabilidade estável de alta segurança concluída. Dados federativos harmonizados em tempo real sob o NIF do cidadão.
              </p>
              <button
                onClick={resetSimulation}
                className="text-xs text-slate-400 hover:text-slate-200 font-mono flex items-center gap-1 border border-white/10 bg-white/[0.01] px-3 py-1.5 rounded-lg transition-colors"
              >
                Voltar ao Comando Inicial
              </button>
            </div>
          )}
        </div>

        {/* Selected Node Output */}
        {selectedNode && (
          <div className="bg-[#05070A] p-4 rounded-xl border border-white/5 text-xs space-y-2">
            <div className="flex items-center gap-2 border-b border-white/5 pb-2">
              <div 
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: selectedNode.color }}
              />
              <span className="font-mono text-slate-200 uppercase font-semibold">
                {selectedNode.system}
              </span>
            </div>
            <p className="text-slate-400 leading-relaxed">
              {selectedNode.desc}
            </p>
          </div>
        )}

        {/* AR Button */}
        {onOpenAr && (
          <button
            onClick={() => {
              if (playAudioClick) playAudioClick('activation');
              onOpenAr();
            }}
            className="w-full py-3 px-4 bg-gradient-to-r from-teal-500/10 via-emerald-500/15 to-emerald-500/20 hover:from-teal-500/15 hover:via-emerald-500/20 hover:to-emerald-500/30 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/55 rounded-xl font-medium text-xs flex items-center justify-center gap-2.5 shadow-lg group transition-all duration-300 no-print"
          >
            <Camera className="w-4 h-4 text-emerald-400 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
            <div className="flex flex-col items-start leading-none text-left">
              <span className="font-bold flex items-center gap-1">PROJEÇÃO EM REALIDADE AUMENTADA (AR) <Sparkles className="w-3 h-3 text-[#FFB800] animate-pulse" /></span>
              <span className="text-[9px] text-[#A7F3D0] mt-0.5 opacity-80 font-mono">Demos presenciais: projete o Nó Central na mesa</span>
            </div>
          </button>
        )}

      </div>
    </div>
  );
}
