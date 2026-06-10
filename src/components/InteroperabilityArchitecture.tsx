import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger for client-side environments
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}
import SovereignTooltip from './SovereignTooltip';
import FucThreeDViewer from './FucThreeDViewer';
import { 
  Network, Database, ArrowLeftRight, HelpCircle, ShieldAlert,
  School, HeartPulse, Scale, ShieldCheck, Briefcase, Landmark, RefreshCw,
  Camera, Sparkles, RotateCw
} from 'lucide-react';

interface InteroperabilityArchitectureProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  onOpenAr?: () => void;
}

interface SatelliteNode {
  id: string;
  name: string;
  system: string;
  angle: number; // Degrees for radial layout
  icon: React.ComponentType<{ className?: string }>;
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

export default function InteroperabilityArchitecture({ playAudioClick, onOpenAr }: InteroperabilityArchitectureProps) {
  const [activeViewMode, setActiveViewMode] = useState<'2d' | '3d'>('3d'); // 3D enabled by default to immediately showcase the new WebGL visual
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedNode, setSelectedNode] = useState<SatelliteNode | null>(SATELLITE_NODES[0]);
  const [syncPhase, setSyncPhase] = useState<'idle' | 'flowing' | 'complete'>('idle');

  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Refresh ScrollTrigger calculations on mount so coordinates match
    ScrollTrigger.refresh();

    // Direct scroll-linked scrub transitions for 3D WebGL/2D diagram
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

    // Direct scroll-linked scrub transitions for interactive settings column
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
  }, { scope: rootRef });

  const startSimulation = () => {
    setIsSyncing(true);
    setSyncPhase('flowing');
    if (playAudioClick) playAudioClick();

    // Flow phase animation timeline
    setTimeout(() => {
      setSyncPhase('complete');
      setIsSyncing(false);
      if (playAudioClick) playAudioClick();
    }, 4000);
  };

  const resetSimulation = () => {
    setSyncPhase('idle');
    setIsSyncing(false);
    if (playAudioClick) playAudioClick();
  };

  const handleNodeClick = (node: SatelliteNode) => {
    setSelectedNode(node);
    if (playAudioClick) playAudioClick();
  };

  return (
    <div ref={rootRef} id="sila-interoperability-architecture" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.01] p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
      
      {/* Background grids */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1.5px,transparent_1.5px),linear-gradient(to_bottom,#05070A_1.5px,transparent_1.5px)] bg-[size:36px_36px] opacity-15 pointer-events-none"></div>

      {/* Visual Radial Schema or 3D WebGL Area */}
      <div className="gsap-arch-viewer lg:col-span-7 flex flex-col justify-center relative min-h-[360px] sm:min-h-[460px] select-none rounded-2xl overflow-hidden self-stretch">
        <AnimatePresence mode="wait">
          {activeViewMode === '3d' ? (
            <motion.div 
              key="3d-webgl"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full min-h-[360px] sm:min-h-[440px] flex flex-col"
            >
              <FucThreeDViewer playAudioClick={playAudioClick} />
            </motion.div>
          ) : (
            <motion.div
              key="2d-diagram"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
              className="relative w-full h-full min-h-[360px] sm:min-h-[440px] flex flex-col items-center justify-center"
            >
              {/* Core FUC node in the center */}
              <div 
                onClick={startSimulation}
                className={`absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-[#05070A] border-2 flex flex-col items-center justify-center p-3 text-center transition-all duration-500 cursor-pointer z-20 ${
                  syncPhase === 'complete'
                    ? 'border-amber-500 shadow-xl shadow-amber-500/10'
                    : syncPhase === 'flowing'
                    ? 'border-blue-500 animate-pulse shadow-xl shadow-blue-500/10'
                    : 'border-white/10'
                }`}
              >
                {/* Internal core visuals */}
                <div className="absolute inset-0.5 rounded-full border border-dashed border-white/5 animate-spin-slow"></div>
                
                <Database className={`w-6 h-6 mb-1 transition-all duration-300 ${
                  syncPhase === 'complete' ? 'text-amber-500 scale-110' : syncPhase === 'flowing' ? 'text-blue-500 animate-spin' : 'text-slate-400'
                }`} />
                
                <span className="text-[10px] uppercase font-mono tracking-widest text-slate-400 block font-bold leading-tight">
                  <SovereignTooltip term="CORE FUC" explanation="O núcleo centralizado da Ficha Única que unifica dados de identificação civil nacional.">CORE FUC</SovereignTooltip>
                </span>
                <span className="text-[9px] font-mono text-slate-500 block leading-none mt-1">
                  Ficha Única
                </span>
              </div>

              {/* Outer orbital boundary circle */}
              <div className="absolute w-[240px] h-[240px] sm:w-[320px] sm:h-[320px] rounded-full border border-dashed border-white/5 pointer-events-none z-0"></div>

              {/* Dynamic active SVG flow particles overlaying diagram */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
                {SATELLITE_NODES.map((node) => {
                  // Radial trigonometry layout calculation
                  const radians = (node.angle * Math.PI) / 180;
                  // Map percentages relative to center (50%)
                  const radiusPercent = window.innerWidth < 640 ? 25 : 32; // Responsive radius scaling
                  const startX = 50 + radiusPercent * Math.cos(radians);
                  const startY = 50 - radiusPercent * Math.sin(radians);

                  const isFlowing = syncPhase === 'flowing';

                  return (
                    <g key={`flow-${node.id}`}>
                      {/* Visual connection route */}
                      <line
                        x1={`${startX}%`}
                        y1={`${startY}%`}
                        x2="50%"
                        y2="50%"
                        className={`transition-all duration-300 ${
                          isFlowing ? 'stroke-blue-500/40 font-bold' : 'stroke-white/[0.03]'
                        }`}
                        strokeWidth={isFlowing ? "1.5" : "0.6"}
                      />

                      {/* Continuous faint background heartbeat flows (representing standard telemetry at idle) */}
                      {!isFlowing && (
                        [...Array(3)].map((_, i) => (
                          <motion.circle
                            key={`idle-trail-${node.id}-${i}`}
                            r={1.8 - i * 0.4}
                            fill={node.color}
                            opacity={0.14 - i * 0.04}
                            initial={{ cx: `${startX}%`, cy: `${startY}%` }}
                            animate={{ cx: '50%', cy: '50%' }}
                            transition={{
                              duration: 3.8,
                              repeat: Infinity,
                              ease: "linear",
                              delay: i * 0.16,
                            }}
                          />
                        ))
                      )}

                      {/* Cryptographic stem cell stream trails with zero-latency high frequency flow */}
                      {isFlowing && (
                        [...Array(6)].map((_, i) => (
                          <g key={`active-flow-${node.id}-${i}`}>
                            <motion.circle
                              r={3.2 - i * 0.5}
                              fill={node.color}
                              className="filter drop-shadow-[0_0_3px_rgba(59,130,246,0.35)]"
                              opacity={1.0 - i * 0.16}
                              initial={{ cx: `${startX}%`, cy: `${startY}%` }}
                              animate={{ cx: '50%', cy: '50%' }}
                              transition={{
                                duration: 1.1,
                                repeat: Infinity,
                                ease: "easeIn",
                                delay: i * 0.06, // Millimetric trailing delay offsets
                              }}
                            />
                            {/* Organic stem cell vanguard bloom bubble */}
                            {i === 0 && (
                              <motion.circle
                                r={8}
                                fill={node.color}
                                opacity={0.12}
                                initial={{ cx: `${startX}%`, cy: `${startY}%`, scale: 0.5 }}
                                animate={{ cx: '50%', cy: '50%', scale: 1.3 }}
                                transition={{
                                  duration: 1.1,
                                  repeat: Infinity,
                                  ease: "easeOut",
                                }}
                              />
                            )}
                          </g>
                        ))
                      )}
                    </g>
                  );
                })}
              </svg>

              {/* Radial Satellites layout */}
              {SATELLITE_NODES.map((node) => {
                const NodeIcon = node.icon;
                const isSelected = selectedNode?.id === node.id;
                const radians = (node.angle * Math.PI) / 180;
                const radiusStyle = window.innerWidth < 640 ? 115 : 155; // matches radians radius coordinates exactly
                const xPos = radiusStyle * Math.cos(radians);
                const yPos = -radiusStyle * Math.sin(radians);

                return (
                  <div
                    key={node.id}
                    onClick={() => handleNodeClick(node)}
                    style={{
                      transform: `translate(${xPos}px, ${yPos}px)`,
                    }}
                    className={`absolute w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#05070A] border flex flex-col items-center justify-center cursor-pointer transition-all duration-350 z-20 hover:scale-105 ${
                      isSelected
                        ? 'border-blue-500 shadow-md shadow-blue-950/40 text-blue-400'
                        : 'border-white/10 text-slate-500 hover:border-white/20'
                    }`}
                    title={node.system}
                  >
                    {/* Colored active border accent */}
                    <div 
                      className="absolute inset-[1.5px] rounded-full opacity-0 hover:opacity-10 transition-opacity"
                      style={{ backgroundColor: node.color }}
                    ></div>
                    <NodeIcon className="w-5 h-5 sm:w-5.5 sm:h-5.5" />
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Side ControlHUD Details panel */}
      <div className="gsap-arch-ctrl lg:col-span-5 space-y-6 relative z-10 bg-white/[0.01] p-6 rounded-2xl border border-white/5">
        
        {/* Title */}
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

        {/* Dynamic 3D WebGL / 2D Diagram Space switcher */}
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

        {/* Trigger Simulation Console / Active block */}
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
                As pautas do Huambo, prontuários do MINSA, registos civis da maternidade e bases do B.I. estão a consolidar registros no CORE SILA do cidadão Sérgio Chilombo.
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

        {/* Selected Hub Details Indicator */}
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

        {/* AR Space Demonstrator Launcher Button */}
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
