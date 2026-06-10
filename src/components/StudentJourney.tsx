import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { STUDENT_JOURNEY_STEPS } from '../data/silaData';
import { StudentJourneyStep } from '../types';
import { 
  ChevronRight, ChevronLeft, Play, Pause, Database, Cpu, FileSpreadsheet,
  FileCheck, ShieldAlert, Sparkles, UserCheck, RefreshCw, Layers
} from 'lucide-react';

interface StudentJourneyProps {
  playAudioClick?: () => void;
  isAutoplayGlobal?: boolean;
}

export default function StudentJourney({ playAudioClick, isAutoplayGlobal = false }: StudentJourneyProps) {
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const stepsLength = STUDENT_JOURNEY_STEPS.length;
  const currentStep = STUDENT_JOURNEY_STEPS[currentStepIdx];

  // Sync isPlaying with dynamic autoplay state
  useEffect(() => {
    setIsPlaying(isAutoplayGlobal);
  }, [isAutoplayGlobal]);

  useEffect(() => {
    if (isPlaying) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => (prev + 1) % stepsLength);
        if (playAudioClick) playAudioClick();
      }, 7500);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, stepsLength]);

  const handleNext = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => (prev + 1) % stepsLength);
    if (playAudioClick) playAudioClick();
  };

  const handlePrev = () => {
    setIsPlaying(false);
    setCurrentStepIdx((prev) => (prev - 1 + stepsLength) % stepsLength);
    if (playAudioClick) playAudioClick();
  };

  const handleStepSelect = (idx: number) => {
    setIsPlaying(false);
    setCurrentStepIdx(idx);
    if (playAudioClick) playAudioClick();
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (playAudioClick) playAudioClick();
  };

  return (
    <div id="carlos-journey-storytelling" className="bg-[#05070A]/30 rounded-3xl border border-white/5 p-6 sm:p-8 backdrop-blur-md relative overflow-hidden">
      {/* Dynamic Background Mesh Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1px,transparent_1px),linear-gradient(to_bottom,#05070A_1px,transparent_1px)] bg-[size:24px_24px] opacity-10 pointer-events-none"></div>

      {/* Stepper Tabs at Top */}
      <div className="relative z-10 grid grid-cols-3 sm:grid-cols-6 gap-2 mb-8">
        {STUDENT_JOURNEY_STEPS.map((step, idx) => {
          const isActive = idx === currentStepIdx;
          const isCompleted = idx < currentStepIdx;
          return (
            <button
              key={step.id}
              onClick={() => handleStepSelect(idx)}
              className={`text-left p-3 rounded-xl border transition-all duration-300 relative ${
                isActive
                  ? 'bg-white/[0.02] border-white/20 shadow-lg'
                  : isCompleted
                  ? 'bg-white/[0.01] border-white/10 text-blue-400'
                  : 'bg-[#05070A] border-white/5 text-slate-500 hover:text-slate-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono uppercase tracking-widest block text-slate-500">
                  {step.stage}
                </span>
                {isCompleted && <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>}
              </div>
              <span className="text-[11px] font-sans font-semibold text-slate-200 block truncate mt-1">
                {step.title}
              </span>
            </button>
          );
        })}
      </div>

      {/* Content Columns */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Storytelling Narrative Panel */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="bg-amber-500/10 text-amber-500 text-[9px] font-mono tracking-widest uppercase border border-amber-500/20 rounded px-2.5 py-0.5">
                Narrativa Realista: O Percurso do Carlos {currentStep.age}
              </span>
              {isPlaying && (
                <span className="text-[9px] font-mono text-[#0066ff] animate-pulse flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  AUTOPLAY ATIVO
                </span>
              )}
            </div>

            <h3 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
              {currentStep.title}
            </h3>

            <p className="text-sm text-slate-300 leading-relaxed min-h-[100px]">
              {currentStep.narrative}
            </p>

            <div className="bg-blue-950/[0.02] p-4 rounded-xl border border-blue-500/10 space-y-2">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 animate-pulse" />
                Interação Técnica na FUC
              </span>
              <p className="text-xs text-slate-400 leading-relaxed">
                {currentStep.systemAction}
              </p>
            </div>
          </div>

          {/* Nav buttons */}
          <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-white/5">
            <div className="flex items-center gap-2">
              <button
                onClick={togglePlay}
                className={`p-2.5 rounded-lg border text-xs font-mono transition-colors ${
                  isPlaying
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 hover:bg-amber-500/20'
                    : 'bg-white/[0.01] border-white/10 text-slate-400 hover:text-slate-200'
                }`}
                title={isPlaying ? 'Pausar Narrativa' : 'Iniciar Reprodução Automática'}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <span className="text-[10px] font-mono text-slate-500">
                História: {currentStepIdx + 1} / {stepsLength}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                className="p-2 bg-white/[0.01] border border-white/10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
                title="Voltar Etapa"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-2 bg-white/[0.01] border border-white/10 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-white/[0.02] transition-colors"
                title="Avançar Etapa"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Live System Interface Simulator (MAT / SILA Education Core Portal) */}
        <div className="lg:col-span-7 bg-[#05070A] rounded-2xl border border-white/10 p-5 font-sans relative overflow-hidden flex flex-col justify-between">
          
          {/* Header of Simulated Platform */}
          <div className="flex items-center justify-between border-b border-white/5 pb-3 mb-4 text-[10px] sm:text-xs">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 bg-[#FFB800] rounded-sm"></div>
              <span className="font-mono text-slate-300 font-semibold tracking-wider">
                PORTAL-SILA // DIRETORIA PEDAGÓGICA
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-blue-400 text-[10px]">
              <Sparkles className="w-3.5 h-3.5" />
              CONECTADO AO MAT_CORE
            </div>
          </div>

          {/* Visual representations corresponding to step states */}
          <div className="flex-1 flex flex-col justify-center min-h-[220px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep.id}
                initial={{ opacity: 0, scale: 0.98, y: 5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98, y: -5 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                {/* 1. Birth State */}
                {currentStep.visualState === 'birth' && (
                  <div className="p-4 bg-blue-650/5 border border-blue-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-blue-400 font-semibold pb-1.5 border-b border-blue-900/30">
                      <span>DECLARAÇÃO ELETRÓNICA DE NASCIMENTO</span>
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block">RECONHECIDO POR</span>
                        <span className="text-slate-200">Maternidade Huambo</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">SISTEMA DESTINO</span>
                        <span className="text-slate-200">SILA Registo Civil</span>
                      </div>
                    </div>
                    <div className="bg-[#05070A] p-2 text-[10px] font-mono text-slate-300 rounded border border-white/5">
                      [LOG_SILA]: Certidão Sincronizada. Dados encaminhados para a Ficha Única. NIU gerado com integridade federal.
                    </div>
                  </div>
                )}

                {/* 2. Identity State */}
                {currentStep.visualState === 'nif' && (
                  <div className="p-4 bg-emerald-650/5 border border-emerald-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-emerald-400 font-semibold pb-1.5 border-b border-emerald-900/30">
                      <span>BI DIGITAL / REGISTO DE BIOMETRIA</span>
                      <UserCheck className="w-4 h-4" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-14 bg-[#05070A] rounded-lg flex items-center justify-center border border-white/5 font-mono text-xs text-slate-500">
                        BI-NIF
                      </div>
                      <div className="flex-1 grid grid-cols-2 gap-3 text-xs font-mono">
                        <div>
                          <span className="text-slate-500 block">NÚMERO NIF</span>
                          <span className="text-slate-200">5009874213</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block">STATUS CIVIL</span>
                          <span className="text-emerald-400 font-bold">ATIVADO</span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-[#05070A] p-2 text-[10px] font-mono text-slate-300 rounded border border-white/5">
                      [LOG_SILA]: Biometria verificada pela delegação do MAT. Dispensa de preenchimento manual de filiação.
                    </div>
                  </div>
                )}

                {/* 3. School Enrollment State */}
                {currentStep.visualState === 'school' && (
                  <div className="p-4 bg-amber-650/5 border border-amber-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-amber-400 font-semibold pb-1.5 border-b border-amber-900/30">
                      <span>MATRÍCULA PROATIVA AUTOPROPULSIONADA</span>
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                      <div>
                        <span className="text-slate-500 block">VAGA PRÉ-RESERVADA</span>
                        <span className="text-slate-200">Escola Primária Nº 44</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">CRITÉRIO MET MAT</span>
                        <span className="text-slate-200">Geolocalização (FUC)</span>
                      </div>
                    </div>
                    <div className="bg-[#05070A] p-2 text-[10px] font-mono text-slate-300 rounded border border-white/5">
                      [LOG_SILA]: O sistema geolocaliza a residência do Carlos na FUC e pré-reserva a vaga escolar. Sem filas na secretaria.
                    </div>
                  </div>
                )}

                {/* 4. Class State */}
                {currentStep.visualState === 'class' && (
                  <div className="p-4 bg-indigo-650/5 border border-indigo-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-indigo-400 font-semibold pb-1.5 border-b border-indigo-900/30">
                      <span>DIÁRIO DE CLASSE / DIETA DIGITAL DO DOCENTE</span>
                      <Layers className="w-4 h-4" />
                    </div>
                    <div className="p-2.5 bg-[#05070A] rounded border border-white/5">
                      <table className="w-full text-[10px] font-mono text-slate-400">
                        <thead>
                          <tr className="border-b border-white/10 text-slate-500">
                            <th className="text-left pb-1 font-medium">DISCIPLINA</th>
                            <th className="text-right pb-1 font-medium">NOTA 1</th>
                            <th className="text-right pb-1 font-medium">FALTA</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="py-1 text-slate-300">Língua Portuguesa</td>
                            <td className="text-right text-emerald-400">18 / 20</td>
                            <td className="text-right text-slate-400">0</td>
                          </tr>
                          <tr>
                            <td className="py-1 text-slate-300">Aritmética/Matemática</td>
                            <td className="text-right text-emerald-400">17 / 20</td>
                            <td className="text-right text-slate-400">1</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 5. Certificate State */}
                {currentStep.visualState === 'grade' && (
                  <div className="p-4 bg-violet-650/5 border border-violet-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-violet-400 font-semibold pb-1.5 border-b border-violet-900/30">
                      <span>CERTIFICADO CONSIGNADO INTEGRAL</span>
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-mono space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-slate-500">CÓDIGO DIGITAL:</span>
                        <span className="text-slate-300 select-all">SILA-CERT-AO-2032-942</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">VALIDAÇÃO CIVIL:</span>
                        <span className="text-emerald-400 font-bold">CERTIFICADO AUTÊNTICO</span>
                      </div>
                    </div>
                    <div className="bg-[#05070A] p-2 text-[10px] font-mono text-slate-300 rounded border border-white/5">
                      [LOG_SILA]: Dispensa autenticação em cartório físico. Impulsiona validade jurídica digital no ato de consulta.
                    </div>
                  </div>
                )}

                {/* 6. Transfer State */}
                {currentStep.visualState === 'transfer' && (
                  <div className="p-4 bg-rose-650/5 border border-rose-500/20 rounded-xl space-y-3">
                    <div className="flex items-center justify-between text-xs text-rose-400 font-semibold pb-1.5 border-b border-rose-900/30">
                      <span>TRANSFERÊNCIA INTERPROVINCIAL HOMOLOGADA</span>
                      <RefreshCw className="w-4 h-4 animate-spin-slow" />
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                      <div className="bg-[#05070A] p-2 rounded border border-white/5">
                        <span className="text-slate-500 block">ORIGEM</span>
                        <span className="text-slate-300 font-semibold">HUAMBO (DPE)</span>
                      </div>
                      <div className="flex flex-col items-center justify-center">
                        <span className="text-slate-500 text-[8px] uppercase">Trânsito</span>
                        <span className="text-slate-300">18s</span>
                      </div>
                      <div className="bg-[#05070A] p-2 rounded border border-white/5 font-semibold">
                        <span className="text-slate-500 block">DESTINO</span>
                        <span className="text-emerald-400">LUANDA (DPE)</span>
                      </div>
                    </div>
                    <div className="bg-[#05070A] p-2 text-[10px] font-mono text-slate-300 rounded border border-white/5">
                      [LOG_SILA]: Dossiê académico de Carlos Neto sincronizado em segundos. Sem burocracia ou perda de pautas anteriores.
                    </div>
                  </div>
                )}

                {/* Live Variables Viewer */}
                <div className="bg-white/[0.01]/30 p-4 rounded-xl border border-white/5">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-[#FFB800] mb-2 flex items-center gap-1.5">
                    <Database className="w-3.5 h-3.5" />
                    CAMPOS ATIVOS DA FICHA ÚNICA (FUC)
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {Object.entries(currentStep.dataPayload).map(([key, value]) => (
                      <div key={key} className="bg-[#05070A] p-2 rounded border border-white/5">
                        <span className="text-[8px] font-mono text-slate-500 uppercase block leading-tight">{key}</span>
                        <span className="text-xs font-sans font-medium text-slate-200 block truncate mt-0.5">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer Terminal Indicators */}
          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[9px] font-mono text-slate-500">
            <span>SILA ENGINE v2.1-STABLE</span>
            <span>PROVÍNCIA REGIONAL: {currentStepIdx < 5 ? 'HUAMBO' : 'LUANDA'}</span>
          </div>

        </div>
      </div>
    </div>
  );
}
