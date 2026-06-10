import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Clock, 
  User, 
  Database, 
  Loader2, 
  Layers, 
  RefreshCw,
  FolderOpen,
  Check,
  Server,
  Fingerprint
} from 'lucide-react';

interface ComparativeSplitScreenProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function ComparativeSplitScreen({ playAudioClick }: ComparativeSplitScreenProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [sliderPosition, setSliderPosition] = useState<number>(50); // percentage (0 - 100)
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [activePreset, setActivePreset] = useState<'both' | 'yesterday' | 'tomorrow'>('both');

  // Simulated live counter/ticks for fragmented flow to feel dynamic
  const [yesterdayStep, setYesterdayStep] = useState<number>(0);
  const [tomorrowResponse, setTomorrowResponse] = useState<'success' | 'idle' | 'loading'>('idle');

  // Handle auto alternating state triggers for interactive demos
  useEffect(() => {
    const interval = setInterval(() => {
      setYesterdayStep((prev) => (prev + 1) % 4);
    }, 3800);
    return () => clearInterval(interval);
  }, []);

  const handleSimulateTomorrowClick = () => {
    playAudioClick?.('click');
    setTomorrowResponse('loading');
    setTimeout(() => {
      setTomorrowResponse('success');
      playAudioClick?.('activation');
    }, 1200);
  };

  const handleResetTomorrow = () => {
    setTomorrowResponse('idle');
  };

  // Convert client coordinates to percentage relative to container bounding box
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    handleMove(e.touches[0].clientX);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const selectPreset = (preset: 'both' | 'yesterday' | 'tomorrow') => {
    playAudioClick?.('click');
    setActivePreset(preset);
    if (preset === 'both') setSliderPosition(50);
    else if (preset === 'yesterday') setSliderPosition(98);
    else if (preset === 'tomorrow') setSliderPosition(2);
  };

  return (
    <div className="w-full space-y-6">
      
      {/* Header and Controls Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white/[0.01] p-4 rounded-xl border border-white/5">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-blue-500/10 border border-blue-500/20 text-[10px] font-mono text-blue-400">
            <span>SILA INTERACTION LAB</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight">
            Visualizador Comparativo de Paradigma
          </h4>
          <p className="text-xs text-slate-400 font-sans max-w-xl">
            Arraste o slider central ou use os controlos abaixo para comparar diretamente a antiga fragmentação burocrática com o ecossistema unificado SILA.
          </p>
        </div>

        {/* Preset switch buttons */}
        <div className="flex bg-[#05070A] border border-white/10 p-1 rounded-lg self-start md:self-end">
          <button
            onClick={() => selectPreset('yesterday')}
            className={`px-3 py-1.5 text-[10px] font-mono font-semibold uppercase rounded transition-all duration-200 ${
              activePreset === 'yesterday' || sliderPosition > 85
                ? 'bg-rose-500/10 border border-rose-500/35 text-rose-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Antes (Papel)
          </button>
          <button
            onClick={() => selectPreset('both')}
            className={`px-3 py-1.5 text-[10px] font-mono font-semibold uppercase rounded transition-all duration-200 ${
              activePreset === 'both' && sliderPosition > 15 && sliderPosition < 85
                ? 'bg-white/10 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Dividido
          </button>
          <button
            onClick={() => selectPreset('tomorrow')}
            className={`px-3 py-1.5 text-[10px] font-mono font-semibold uppercase rounded transition-all duration-200 ${
              activePreset === 'tomorrow' || sliderPosition < 15
                ? 'bg-blue-500/15 border border-blue-500/30 text-blue-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Depois (SILA)
          </button>
        </div>
      </div>

      {/* Main comparative slider stage */}
      <div 
        ref={containerRef}
        className="relative w-full min-h-[500px] md:min-h-[480px] bg-[#030508] border border-white/5 rounded-2xl overflow-hidden select-none"
        style={{ cursor: isDragging ? 'ew-resize' : 'default' }}
      >
        
        {/* ==================== LAYER A (YESTERDAY) ==================== */}
        {/* Occupies full width, serves as background revealed on left of slider */}
        <div className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch bg-gradient-to-br from-[#0c0507] via-[#050304] to-[#0a0507]">
          
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-rose-500/10 px-2.5 py-1 rounded border border-rose-500/20 text-rose-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                <AlertTriangle className="w-3 h-3" />
                Cenário Atual: Fragmentação Administrativa
              </div>
              <h5 className="text-2xl font-sans text-slate-100 leading-tight">
                Instruções em Papel e Pilhas de Documentos
              </h5>
              <p className="text-xs text-rose-200/50 leading-relaxed font-sans max-w-sm">
                O cidadão atua como mensageiro do Estado. Sem interoperabilidade, cada agência exige certidões com as mesmas informações já cadastradas noutras agências.
              </p>
            </div>

            {/* Simulated manual pipeline */}
            <div className="bg-rose-950/10 border border-rose-800/20 rounded-xl p-4 space-y-3">
              <span className="text-[10px] font-mono text-rose-400 uppercase tracking-widest font-bold block">
                Fluxo de Matrícula Tradicional (Sem SILA)
              </span>
              
              <div className="grid grid-cols-4 gap-1 text-[9px] font-mono text-center">
                <div className={`p-1.5 rounded border transition-colors ${yesterdayStep === 0 ? 'bg-rose-900/30 border-rose-500/50 text-rose-200 animate-pulse' : 'bg-white/[0.01] border-white/5 text-slate-500'}`}>
                  1. Registo Notarial
                </div>
                <div className={`p-1.5 rounded border transition-colors ${yesterdayStep === 1 ? 'bg-rose-900/30 border-rose-500/50 text-rose-200 animate-pulse' : 'bg-white/[0.01] border-white/5 text-slate-500'}`}>
                  2. Cópia Física BI
                </div>
                <div className={`p-1.5 rounded border transition-colors ${yesterdayStep === 2 ? 'bg-rose-900/30 border-rose-500/50 text-rose-200 animate-pulse' : 'bg-white/[0.01] border-white/5 text-slate-500'}`}>
                  3. Atestado Médico
                </div>
                <div className={`p-1.5 rounded border transition-colors ${yesterdayStep === 3 ? 'bg-rose-900/30 border-rose-500/50 text-rose-200 animate-pulse' : 'bg-white/[0.01] border-white/5 text-slate-500'}`}>
                  4. Entrega Escola
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs text-rose-300 font-sans">
                <Clock className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>Status atual: <strong className="text-rose-400">Tempo mínimo de espera: {yesterdayStep * 2 + 3} dias</strong></span>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-rose-950/[0.05] border border-rose-950/20 p-2.5 rounded-lg">
                <span className="text-[9px] font-mono text-rose-400 uppercase block">Desperdício</span>
                <span className="text-base font-sans font-bold text-slate-200">62 Horas/Ano</span>
              </div>
              <div className="bg-rose-950/[0.05] border border-rose-950/20 p-2.5 rounded-lg">
                <span className="text-[9px] font-mono text-rose-400 uppercase block">Taxa de Fraude</span>
                <span className="text-base font-sans font-bold text-slate-200">Elevada</span>
              </div>
              <div className="bg-rose-950/[0.05] border border-rose-950/20 p-2.5 rounded-lg">
                <span className="text-[9px] font-mono text-rose-400 uppercase block">Sincronização</span>
                <span className="text-base font-sans font-bold text-slate-200">Não existe</span>
              </div>
            </div>
          </div>

          {/* Interactive Burocracy layout representation */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="bg-rose-950/5 border border-rose-900/10 p-5 rounded-xl space-y-4 relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-rose-950/40 pb-2">
                <span className="text-xs font-mono text-rose-400">PROCESSOS FÍSICOS DUPLICADOS</span>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20 uppercase">Risco de inconsitência</span>
              </div>

              <div className="space-y-2.5">
                {[
                  { office: "Conservatória do Registo Civil", file: "Registo de Nascimento Papel", reason: "Sem integração com a Justiça" },
                  { office: "Escola Primária Nº 404", file: "Processo Escolar do Aluno", reason: "Ficha duplicada manualmente" },
                  { office: "Repartição Municipal de Saúde", file: "Ficha de Vacinas Manual", reason: "Atualização física irregular" }
                ].map((item, i) => (
                  <div key={i} className="flex gap-3 bg-white/[0.01] p-3 rounded-lg border border-rose-950/20 hover:bg-rose-950/10 transition-colors">
                    <FolderOpen className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-mono font-bold text-slate-200">{item.office}</span>
                      </div>
                      <p className="text-[10px] font-sans text-rose-300">Ficheiro requisitado: {item.file}</p>
                      <p className="text-[9px] font-mono text-rose-400/70 italic">Anomalia: {item.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

        {/* ==================== LAYER B (TOMORROW / SILA) ==================== */}
        {/* Placed on top, clipped/polygon cropped based on sliderPosition */}
        <div 
          className="absolute inset-0 w-full h-full p-6 sm:p-8 flex flex-col md:grid md:grid-cols-12 gap-6 items-stretch bg-gradient-to-br from-[#020914] via-[#04060b] to-[#040b12]"
          style={{
            clipPath: `polygon(${sliderPosition}% 0, 100% 0, 100% 100%, ${sliderPosition}% 100%)`
          }}
        >
          
          <div className="md:col-span-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-1.5 bg-blue-500/15 px-2.5 py-1 rounded border border-blue-500/30 text-blue-400 text-[10px] font-mono uppercase tracking-wider font-bold">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                SILA: Interoperabilidade e Soberania
              </div>
              <h5 className="text-2xl font-sans text-white leading-tight">
                Um Canal Único. Ligação Imediata ao Cidadão.
              </h5>
              <p className="text-xs text-slate-400 leading-relaxed font-sans max-w-sm">
                Sistemas conectados de forma segura em barramento nacional. Os dados fluem de forma transparente, permitindo atualizações automáticas e em tempo real na <span className="text-amber-400">Ficha Única do Cidadão (FUC)</span>.
              </p>
            </div>

            {/* Dynamic demonstration interaction */}
            <div className="bg-blue-950/15 border border-blue-900/30 rounded-xl p-4 space-y-3 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 blur-md"></div>
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold block">
                Ação Simulada: Consulta de FUC
              </span>

              {tomorrowResponse === 'idle' && (
                <div className="space-y-2">
                  <p className="text-[11px] font-sans text-slate-300">
                    Clique abaixo para simular uma consulta automatizada cruzada entre a Escola e a Justiça via SILA.
                  </p>
                  <button
                    onClick={handleSimulateTomorrowClick}
                    className="w-full py-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-mono font-bold rounded uppercase transition-all duration-200 tracking-wide flex items-center justify-center gap-1.5"
                  >
                    Executar Cruzamento de Dados
                  </button>
                </div>
              )}

              {tomorrowResponse === 'loading' && (
                <div className="py-2 flex flex-col items-center justify-center space-y-2">
                  <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  <span className="text-[10px] font-mono text-blue-400 animate-pulse">Sincronizando Barramento SILA...</span>
                </div>
              )}

              {tomorrowResponse === 'success' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-bold font-sans">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Conexão Concluída (14 ms)</span>
                  </div>
                  <p className="text-[10px] font-mono text-slate-300 leading-normal">
                    FUC localizada. Matrícula confirmada no Huambo. Certidões validadas na Justiça automaticamente.
                  </p>
                  <button
                    onClick={handleResetTomorrow}
                    className="text-[9px] font-mono text-amber-400 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-2.5 h-2.5" /> Repetir simulação
                  </button>
                </div>
              )}
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-3 gap-2">
              <div className="bg-blue-950/[0.1] border border-blue-900/25 p-2.5 rounded-lg text-left">
                <span className="text-[9px] font-mono text-blue-400 block uppercase">Tempo</span>
                <span className="text-base font-sans font-bold text-slate-100">Imediato (15s)</span>
              </div>
              <div className="bg-blue-950/[0.1] border border-blue-900/25 p-2.5 rounded-lg text-left">
                <span className="text-[9px] font-mono text-blue-400 block uppercase">Integridade</span>
                <span className="text-base font-sans font-bold text-slate-100">100% Cripto</span>
              </div>
              <div className="bg-blue-950/[0.1] border border-blue-900/25 p-2.5 rounded-lg text-left">
                <span className="text-[9px] font-mono text-blue-400 block uppercase">Duplicação</span>
                <span className="text-base font-sans font-bold text-slate-100">Eliminada</span>
              </div>
            </div>
          </div>

          {/* Connected state visualization dashboard panel */}
          <div className="md:col-span-7 flex flex-col justify-center">
            <div className="bg-blue-950/10 border border-blue-900/20 p-5 rounded-xl space-y-4 relative">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-blue-500/5 blur-[50px] rounded-full pointer-events-none"></div>

              <div className="flex items-center justify-between border-b border-blue-900/40 pb-2 relative z-10">
                <span className="text-xs font-mono text-blue-300">FICHA ÚNICA DO CIDADÃO (FUC) ATIVA</span>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping"></span>
                  SOBERANA
                </span>
              </div>

              <div className="space-y-3 relative z-10">
                <div className="flex items-center justify-between bg-[#050c18]/80 p-3 rounded-lg border border-blue-900/30">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 rounded bg-blue-500/10 border border-blue-500/20">
                      <User className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <h6 className="text-xs font-mono font-bold text-white">Augusto Ndalu</h6>
                      <p className="text-[9px] font-mono text-slate-400">BI nº: 00582937HA023</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-mono text-emerald-400 block">Sincronizado</span>
                    <span className="text-[9px] font-sans text-slate-400">Província do Huambo</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div className="bg-[#050ca8]/10 border border-blue-900/20 p-2.5 rounded-lg flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-blue-300">REGISTO CIVIL</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-sans mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Justiça ok
                    </div>
                  </div>
                  <div className="bg-[#050ca8]/10 border border-blue-900/20 p-2.5 rounded-lg flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-blue-300">SISTEMA ESCOLAR</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-sans mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Estudante ok
                    </div>
                  </div>
                  <div className="bg-[#050ca8]/10 border border-blue-900/20 p-2.5 rounded-lg flex flex-col justify-between">
                    <span className="text-[9px] font-mono text-blue-300">SAÚDE PÚBLICA</span>
                    <div className="flex items-center gap-1 text-[10px] text-slate-300 font-sans mt-1">
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      Vacinas ok
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 p-2 rounded bg-white/[0.01] border border-white/5">
                  <span className="flex items-center gap-1"><Server className="w-3 h-3 text-blue-400" /> Rede ICP-Angola Ativa</span>
                  <span className="flex items-center gap-1"><Fingerprint className="w-3 h-3 text-amber-500" /> Criptografia Governamental</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* ==================== INTERACTIVE DRAG DIVIDER CONTROLLER ==================== */}
        <div 
          className="absolute top-0 bottom-0 w-[4px] bg-blue-500 hover:bg-blue-400 transition-colors cursor-ew-resize z-30 group"
          style={{ left: `${sliderPosition}%` }}
          onMouseDown={() => setIsDragging(true)}
          onTouchStart={() => setIsDragging(true)}
        >
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-slate-900 border border-blue-500/50 flex items-center justify-center shadow-lg shadow-black/80 transition-transform group-hover:scale-110 z-30">
            <div className="flex items-center gap-0.5 text-slate-200">
              <span className="text-[9px] font-bold">◀</span>
              <span className="text-[9px] font-bold">▶</span>
            </div>
          </div>

          {/* Interactive instruction tag hovering near the drag bar */}
          <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900/90 border border-white/10 px-2 py-0.5 rounded text-[8px] font-mono text-slate-400 uppercase tracking-widest whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Arrastar para comparar
          </div>
        </div>

      </div>

      {/* Helpful Hint Tagline */}
      <div className="flex justify-center">
        <span className="text-[10px] font-mono tracking-wider text-slate-500 uppercase flex items-center gap-1.5">
          <span>*</span> Arraste o slider para a esquerda ou direita para entender a transição de soberania nacional.
        </span>
      </div>

    </div>
  );
}
