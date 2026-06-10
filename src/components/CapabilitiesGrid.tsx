import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { EDUCATION_CAPABILITIES } from '../data/silaData';
import { EducationCapability } from '../types';
import { 
  School, UserCheck, Users, GraduationCap, Layers, CheckSquare,
  ClipboardList, Award, ArrowLeftRight, ShieldAlert, BarChart3,
  FileSpreadsheet, X, HelpCircle, Check, Database, HelpCircle as HelpIcon
} from 'lucide-react';

interface CapabilitiesGridProps {
  playAudioClick?: () => void;
  capabilities?: EducationCapability[];
  isLoading?: boolean;
}

// Icon mapper to avoid direct string evaluation issues
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  School,
  UserCheck,
  Users,
  GraduationCap,
  Layers,
  CheckSquare,
  ClipboardList,
  Award,
  ArrowLeftRight,
  ShieldAlert,
  BarChart3,
  FileSpreadsheet,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.97, filter: 'blur(4px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 120,
      damping: 18,
    },
  },
};

export default function CapabilitiesGrid({ playAudioClick, capabilities = EDUCATION_CAPABILITIES, isLoading = false }: CapabilitiesGridProps) {
  const [selectedCapability, setSelectedCapability] = useState<EducationCapability | null>(null);

  const handleCardClick = (cap: EducationCapability) => {
    setSelectedCapability(cap);
    if (playAudioClick) playAudioClick();
  };

  const closeModal = () => {
    setSelectedCapability(null);
    if (playAudioClick) playAudioClick();
  };

  if (isLoading) {
    return (
      <div 
        role="status" 
        aria-live="polite" 
        aria-busy="true" 
        className="space-y-6 relative z-10 select-none"
      >
        <span className="sr-only">Carregando competências operacionais do Super-Módulo de Educação do SILA do cache do banco de dados local...</span>
        
        {/* Title block */}
        <div className="max-w-3xl space-y-2">
          <div className="h-3 w-32 bg-[#FFB800]/10 border border-[#FFB800]/20 rounded-full animate-pulse" />
          <div className="h-8 w-80 bg-slate-800 rounded-lg animate-pulse" />
          <div className="h-4 w-[65%] bg-slate-800/60 rounded-lg mt-2 animate-pulse" />
        </div>

        {/* Bento Layout Grid of Capabilities Skeletons with premium shimmer sweeps */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl border border-white/5 bg-white/[0.005] flex flex-col justify-between min-h-[160px] relative overflow-hidden"
            >
              {/* Highlight line effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent"></div>
              
              {/* Premium sovereign blue shimmer slider sweep */}
              <motion.div
                className="absolute inset-y-0 w-2/3 bg-gradient-to-r from-transparent via-blue-500/10 to-transparent -skew-x-12 cursor-default pointer-events-none select-none"
                initial={{ left: "-100%" }}
                animate={{ left: "150%" }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: idx * 0.12,
                }}
              />

              {/* Top Row: Icon circle & badge */}
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-white/5 animate-pulse" />
                <div className="h-4 w-16 bg-slate-800/40 border border-white/5 data-placeholder rounded animate-pulse" />
              </div>

              {/* Bottom Row: Text context */}
              <div className="space-y-2 mt-4">
                <div className="h-4 w-32 bg-slate-700/60 rounded animate-pulse" />
                <div className="h-3 w-full bg-slate-800/40 rounded animate-pulse" />
                <div className="h-3 w-[85%] bg-slate-800/40 rounded animate-pulse" />
              </div>

              {/* View Scope hint bone */}
              <div className="h-3 w-28 bg-slate-800/50 rounded mt-4 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div id="education-capabilities-bento" className="space-y-6 relative z-10">
      
      {/* Title block */}
      <div className="max-w-3xl">
        <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1 block font-bold">
          Arquitetura Operativa
        </span>
        <h3 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
          Super-Módulo de Educação Sincronizado
        </h3>
        <p className="text-sm text-slate-400 mt-2">
          Explore o portfólio de competências nativas do SILA desenvolvidas sob restritos critérios de soberania digital nacional. Clique nos cartões para visualizar o escopo técnico.
        </p>
      </div>

      {/* Bento Layout Grid of Capabilities with Framer Motion staggerChildren */}
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {capabilities.map((cap, capIdx) => {
          const IconComponent = iconMap[cap.iconName] || HelpCircle;
          return (
            <motion.div
              key={cap.id}
              variants={itemVariants}
              onClick={() => handleCardClick(cap)}
              className="group cursor-pointer bg-[#05070a]/40 hover:bg-[#0a0f1d]/50 p-5 rounded-2xl border border-white/5 hover:border-blue-500/20 backdrop-blur-sm transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[160px] hover:shadow-2xl hover:shadow-blue-950/20"
              whileHover={{ 
                y: -4, 
                borderColor: "rgba(59, 130, 246, 0.25)",
                transition: { duration: 0.2, ease: "easeOut" } 
              }}
            >
              {/* Highlight line effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent"></div>
 
              {/* Dynamic subtle premium loading processing shimmer sweep */}
              <motion.div
                className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-blue-500/[0.04] to-transparent -skew-x-12 pointer-events-none select-none"
                initial={{ left: "-150%" }}
                animate={{ left: "150%" }}
                transition={{
                  duration: 3.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                  repeatDelay: 1.5 + (capIdx * 0.4), // Staggered organic offset delay
                }}
              />
 
              {/* Icon and Category Label */}
              <div className="flex items-center justify-between">
                <div className="p-2.5 rounded-xl bg-white/[0.01] border border-white/10 group-hover:bg-blue-600/15 group-hover:border-blue-500/30 transition-all duration-300">
                  <IconComponent className="w-5 h-5 text-blue-400 group-hover:text-blue-300" />
                </div>
                
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-blue-500"></span>
                  </span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-[#FFB800] bg-amber-500/5 px-2 py-0.5 rounded border border-[#FFB800]/20 font-bold">
                    {cap.category}
                  </span>
                </div>
              </div>

              {/* Text Description */}
              <div className="mt-4">
                <h4 className="text-sm font-sans font-semibold text-slate-200 group-hover:text-slate-100 transition-colors">
                  {cap.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2 mt-1 font-sans leading-relaxed">
                  {cap.description}
                </p>
              </div>

              {/* View Scope Hint */}
              <div className="mt-3 text-[10px] font-mono text-slate-500 group-hover:text-blue-300 transition-colors flex items-center gap-1">
                Visualizar Âmbito Técnico
                <span className="group-hover:translate-x-1.5 transition-transform inline-block text-blue-400">→</span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Premium Drawer/Modal for in-depth technical analysis */}
      <AnimatePresence>
        {selectedCapability && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark Mask Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={closeModal}
              className="absolute inset-0 bg-[#05070A]/85 backdrop-blur-sm"
            />

            {/* Modal Body Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-[#05070A] rounded-2xl border border-white/10 relative z-10 overflow-hidden flex flex-col shadow-2xl bg-gradient-to-b from-[#05070A] to-slate-950/20"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-600/10 rounded-xl border border-blue-500/20 text-blue-400">
                    {(() => {
                      const IconComponent = iconMap[selectedCapability.iconName] || HelpCircle;
                      return <IconComponent className="w-5 h-5" />;
                    })()}
                  </div>
                  <div>
                    <span className="text-[9px] font-mono text-slate-500 tracking-widest uppercase">
                      ESPECIFICAÇÕES : MÓDULO {selectedCapability.category}
                    </span>
                    <h3 className="text-lg font-sans font-medium text-slate-200">
                      {selectedCapability.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={closeModal}
                  className="p-1.5 rounded-lg bg-white/[0.02] hover:bg-white/[0.05] text-slate-400 hover:text-slate-200 border border-white/10 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 max-h-[80vh]">
                
                {/* Intro summary */}
                <div className="space-y-2">
                  <p className="text-sm text-slate-300 leading-relaxed">
                    {selectedCapability.description}
                  </p>
                </div>

                {/* Scope of features list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-mono uppercase tracking-widest text-[#FFB800] border-b border-white/5 pb-1.5 font-bold">
                    Escopo Operacional Integrado
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedCapability.detailedScope.map((scopeItem, idx) => (
                      <div key={idx} className="flex items-start gap-2.5 p-2 bg-[#05070A] rounded-lg border border-white/5 text-xs">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-slate-300">{scopeItem}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Custom system UI Mockups depending on selection to prove deep product credibility */}
                <div className="p-4 bg-white/[0.01] rounded-xl border border-white/5 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-[#0066ff]">
                    <span className="flex items-center gap-1.5 font-bold">
                      <Database className="w-3.5 h-3.5" />
                      SIMULAÇÃO DE REGISTO EM SOBERANIA
                    </span>
                    <span className="text-slate-500 text-[10px]">INTEGRIDADE CRIPTOGRÁFICA</span>
                  </div>

                  {selectedCapability.id === 'matriculas' && (
                    <div className="space-y-2 text-[11px] font-mono text-slate-400">
                      <div className="p-2.5 bg-[#05070A] rounded border border-white/5 flex justify-between items-center">
                        <span>MAT-ID: #AO-8724-M</span>
                        <span className="text-emerald-400 font-bold border border-emerald-500/20 px-2 py-0.5 rounded bg-emerald-500/5">HOMOLOGADO</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[10px]">
                        <div className="bg-[#05070A] p-2 rounded border border-white/5">
                          <span className="text-[#05070A]/5 border-slate-900 text-slate-600 block">Aluno</span>
                          <span className="text-slate-200 truncate block">Carlos Neto</span>
                        </div>
                        <div className="bg-[#05070A] p-2 rounded border border-white/5">
                          <span className="text-[#05070A]/5 border-slate-900 text-slate-600 block">Residência Civil</span>
                          <span className="text-slate-200 block">Bairro Benfica, Huambo</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {selectedCapability.id === 'escolas' && (
                    <div className="space-y-2 text-[11px] font-mono text-slate-400">
                      <div className="p-2.5 bg-[#05070A] rounded border border-white/5 flex justify-between items-center">
                        <span>REGISTO GEORREFERENCIADO GPS</span>
                        <span className="text-amber-500 font-mono">12.872° S • 15.735° E</span>
                      </div>
                      <p className="text-[10px] text-slate-400">
                        Polo escolar vinculado à bacia hidrográfica do planalto central. Infraestrutura de rede satélite ativa.
                      </p>
                    </div>
                  )}

                  {selectedCapability.id !== 'matriculas' && selectedCapability.id !== 'escolas' && (
                    <div className="text-[10px] font-mono text-slate-500 space-y-1">
                      <p className="text-slate-400">[REGISTO SEGURO]: Dados de conformidade indexados na Ficha Única.</p>
                      <p className="text-slate-500">Hash de rastro de auditoria: {`sha256-bd4e772ea${selectedCapability.id.substring(0,3)}dc01fe3a`}</p>
                    </div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="p-4 bg-[#05070A] border-t border-white/5 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-xs rounded-xl font-medium shadow-md transition-all duration-300"
                >
                  Concluir Inspeção
                </button>
              </div>

            </motion.div>

          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
