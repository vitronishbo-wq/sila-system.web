import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Calculator, DollarSign, Clock, FileText, Sparkles, TrendingDown, HelpCircle, CheckCircle, Smartphone } from 'lucide-react';

interface GovernmentEfficiencyCalculatorProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function GovernmentEfficiencyCalculator({ playAudioClick }: GovernmentEfficiencyCalculatorProps) {
  // Simulator inputs
  const [volumeDocs, setVolumeDocs] = useState<number>(6.5); // millions of docs/year
  const [waitingTime, setWaitingTime] = useState<number>(4.5); // hours average wait
  const [processCost, setProcessCost] = useState<number>(1800); // Kwanza cost per paper filing
  const [hourlyValue, setHourlyValue] = useState<number>(2200); // Kwanza average hourly productivity loss

  // Constants representing the digital leap (SILA impact parameters)
  const SILA_DIGITAL_DOC_REDUCTION_PCT = 85; // 85% of physical document emission avoided through FUC
  const SILA_WAITTIME_MINUTES = 10; // Redundant wait-time drops to 10 minutes (0.16 hours)
  const SILA_DIGITAL_PROCESSING_COST_MULTIPLIER = 0.15; // 85% less direct cost to process pixels vs heavy paper dossier archives

  // Calculation formulas
  const totalVolume = volumeDocs * 1_000_000;
  
  // Traditional system costs
  const traditionalDirectCost = totalVolume * processCost;
  const traditionalTimeWastedHours = totalVolume * waitingTime;
  const traditionalIndirectCost = traditionalTimeWastedHours * hourlyValue;
  const traditionalTotalCost = traditionalDirectCost + traditionalIndirectCost;

  // SILA optimized costs
  // Sila volume that is still processed physically or partially (15%)
  const silaVolumeWithPaper = totalVolume * (1 - SILA_DIGITAL_DOC_REDUCTION_PCT / 100);
  const silaDirectCost = (silaVolumeWithPaper * processCost * SILA_DIGITAL_PROCESSING_COST_MULTIPLIER) + 
                          ((totalVolume - silaVolumeWithPaper) * (processCost * 0.05)); // digital core cost is extremely minimal (5%)
  
  const silaTimeWastedHours = totalVolume * (SILA_WAITTIME_MINUTES / 60);
  const silaIndirectCost = silaTimeWastedHours * hourlyValue;
  const silaTotalCost = silaDirectCost + silaIndirectCost;

  // Net annual savings
  const annualSavingsKz = Math.max(0, traditionalTotalCost - silaTotalCost);
  const hoursSavedValue = Math.max(0, traditionalTimeWastedHours - silaTimeWastedHours);

  // Convert savings to roughly Millions of USD equivalent for quick executive perception
  const exchangeRateUSD = 825; // 1 USD = 825 Kwanza roughly
  const annualSavingsUSD = annualSavingsKz / exchangeRateUSD;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-b from-[#0a0f1d] to-[#04060a] border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden w-full space-y-8"
    >
      {/* Background cyber ambient grid lights */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0066FF]/5 to-transparent blur-[80px] pointer-events-none" />
      <div className="absolute -top-10 -right-10 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none" />

      {/* Decorative top strip */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB800]/40 to-transparent" />

      {/* Header and Value Proposition Title */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div className="space-y-1.5">
          <span className="text-[10px] font-mono text-[#FFB800] font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" /> SIMULADOR DE IMPACTO MACROECONÓMICO
          </span>
          <h4 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight">
            Calculadora de Eficiência Governamental SILA
          </h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-2xl">
            Ajuste as métricas administrativas para projetar a redução de custos de papelada e horas perdidas na burocracia do funcionalismo público.
          </p>
        </div>
        <div className="bg-blue-500/10 border border-blue-500/20 px-3.5 py-1.5 rounded-xl text-[11px] font-mono font-medium text-blue-400 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 animate-pulse" /> SOBERANIA FINANCEIRA DO ESTADO
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Side: Dynamic sliders input panel */}
        <div className="lg:col-span-6 space-y-6 bg-white/[0.01] border border-white/5 p-5 sm:p-6 rounded-2xl flex flex-col justify-between">
          <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-2">
            Mapeamento de Desperdício Operacional
          </span>

          <div className="space-y-6 pt-3">
            {/* Slider 1: Document volume */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-sky-400" /> Volume de Documentos Físicos / Ano
                </span>
                <span className="text-[#FFB800] font-bold text-sm">
                  {volumeDocs.toFixed(1)}M certidões
                </span>
              </div>
              <input
                type="range"
                min="1.0"
                max="25.0"
                step="0.5"
                value={volumeDocs}
                onChange={(e) => {
                  setVolumeDocs(parseFloat(e.target.value));
                  if (playAudioClick) playAudioClick('click');
                }}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>1.0M docs</span>
                <span>Médio Nacional (~6.5M)</span>
                <span>25.0M docs</span>
              </div>
            </div>

            {/* Slider 2: Waiting time is hours */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-rose-400" /> Tempo Médio de Espera e Deslocação
                </span>
                <span className="text-rose-400 font-bold text-sm">
                  {waitingTime.toFixed(1)} horas
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="12.0"
                step="0.5"
                value={waitingTime}
                onChange={(e) => {
                  setWaitingTime(parseFloat(e.target.value));
                  if (playAudioClick) playAudioClick('click');
                }}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>30 min</span>
                <span>Tempo de Balcão Convencional (~4.5h)</span>
                <span>12h extenuantes</span>
              </div>
            </div>

            {/* Slider 3: Operational cost of paper */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <DollarSign className="w-4 h-4 text-[#FFB800]" /> Custo de Arquivo / Dossier Físico
                </span>
                <span className="text-slate-200 font-bold text-sm">
                  {processCost.toLocaleString('pt-PT')} Kz
                </span>
              </div>
              <input
                type="range"
                min="200"
                max="6000"
                step="100"
                value={processCost}
                onChange={(e) => {
                  setProcessCost(parseInt(e.target.value));
                  if (playAudioClick) playAudioClick('click');
                }}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>200 Kz</span>
                <span>Custo de Armazém & Chancelas</span>
                <span>6.000 Kz / Processo</span>
              </div>
            </div>

            {/* Slider 4: Hourly productivity rate */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs font-mono">
                <span className="text-slate-300 flex items-center gap-1.5">
                  <TrendingDown className="w-4 h-4 text-emerald-400" /> Fator de Custos / Hora Perdida
                </span>
                <span className="text-slate-200 font-bold text-sm">
                  {hourlyValue.toLocaleString('pt-PT')} Kz/h
                </span>
              </div>
              <input
                type="range"
                min="800"
                max="5000"
                step="100"
                value={hourlyValue}
                onChange={(e) => {
                  setHourlyValue(parseInt(e.target.value));
                  if (playAudioClick) playAudioClick('click');
                }}
                className="w-full accent-blue-500 h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-[9px] font-mono text-slate-500">
                <span>800 Kz/h</span>
                <span>Valor-Hora de Produtividade</span>
                <span>5.000 Kz/h</span>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4.5 bg-blue-950/20 rounded-xl border border-blue-500/10 flex gap-2.5 items-start">
            <HelpCircle className="w-4.5 h-4.5 text-blue-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-400 leading-relaxed font-sans font-medium">
              A fórmula base calcula o custo direto físico (papel, arquivos e taxas) somado às horas gastas pelo cidadão multiplicadas pela taxa média de valor-hora no setor público.
            </p>
          </div>
        </div>

        {/* Right Side: Projections outputs & metrics meters */}
        <div className="lg:col-span-6 flex flex-col justify-between gap-6">
          
          {/* Main Saving Showcase */}
          <div className="bg-[#05080d] border border-blue-500/20 p-6 rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center py-8">
            {/* Ambient holographic pulse */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.06),transparent_50%)]" />
            <div className="absolute top-2 left-2 bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20 rounded px-2 py-0.5 text-[8px] font-mono font-bold tracking-widest uppercase">
              Projeção de Retorno SILA
            </div>

            <span className="text-[11px] font-mono text-slate-400 uppercase tracking-widest font-semibold">
              POPULAÇÃO ECONOMIZADA POUPOU ANUALMENTE:
            </span>
            
            <motion.h4 
              key={annualSavingsKz}
              initial={{ scale: 0.95, opacity: 0.8 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="text-3xl sm:text-4xl md:text-5xl font-mono font-black text-emerald-400 tracking-tight mt-2 min-h-[50px] sm:min-h-[60px]"
            >
              {annualSavingsKz.toLocaleString('pt-PT', { maximumFractionDigits: 0 })} Kz
            </motion.h4>

            <span className="text-sm font-mono text-slate-300 font-bold py-1 px-3 bg-emerald-500/10 border border-emerald-500/25 rounded-full mt-1.5 text-emerald-300 shrink-0 flex items-center gap-1.5">
              ~ {annualSavingsUSD.toLocaleString('pt-PT', { maximumFractionDigits: 1 })} Milhões USD / Ano
            </span>

            <p className="text-[10px] text-slate-500 mt-4 max-w-sm">
              Impacto fiduciário directo e poupança de tempo social aplicados em prol de infraestrutura física estratégica.
            </p>
          </div>

          {/* Symmetrical Comparison Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Traditional Card */}
            <div className="bg-rose-950/10 border border-rose-500/15 p-4 rounded-xl space-y-1">
              <span className="text-[9px] font-mono text-rose-500 uppercase font-black block tracking-widest">
                Modelo Convencional
              </span>
              <span className="text-[14px] font-sans text-slate-400 block font-medium">
                Desperdiçado de Tempo:
              </span>
              <span className="text-base font-mono font-bold text-rose-400 block pb-1">
                {(traditionalTimeWastedHours / 1_000_000).toFixed(1)}M Horas-Cidadão / ano
              </span>
              <div className="text-[10px] text-slate-500 font-mono border-t border-rose-500/10 pt-1 flex justify-between">
                <span>Custo Direto:</span>
                <span>{(traditionalDirectCost / 1_000_000_000).toFixed(2)}B Kz</span>
              </div>
              <div className="text-[10px] text-slate-500 font-mono flex justify-between">
                <span>Produtividade:</span>
                <span>{(traditionalIndirectCost / 1_000_000_000).toFixed(2)}B Kz</span>
              </div>
            </div>

            {/* Optimized Card */}
            <div className="bg-emerald-950/10 border border-emerald-500/15 p-4 rounded-xl space-y-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-500/30 rounded" />
              <span className="text-[9px] font-mono text-emerald-500 uppercase font-bold block tracking-widest flex items-center gap-1">
                SILA Otimizado <CheckCircle className="w-3 h-3 text-emerald-400" />
              </span>
              <span className="text-[14px] font-sans text-slate-400 block font-medium">
                Tempo Gasto Redundante:
              </span>
              <span className="text-base font-mono font-bold text-emerald-400 block pb-1">
                {(silaTimeWastedHours / 1_000_000).toFixed(2)}M Horas-Cidadão
              </span>
              <div className="text-[10px] text-slate-400 font-mono border-t border-emerald-500/10 pt-1 flex justify-between">
                <span>Custo Direto:</span>
                <span className="text-slate-300 font-semibold">{(silaDirectCost / 1_000_000_000).toFixed(2)}B Kz</span>
              </div>
              <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                <span>Produtividade:</span>
                <span className="text-slate-300 font-semibold">{(silaIndirectCost / 1_000_000_000).toFixed(2)}B Kz</span>
              </div>
            </div>

          </div>

          {/* Efficiency Factor Indicator Gauge */}
          <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[9px] font-mono text-slate-400 uppercase tracking-widest">Total de Horas Economizadas</span>
              <span className="text-lg font-mono font-bold text-[#FFB800] block">
                {(hoursSavedValue / 1_000_000).toFixed(1)} Milhões de Horas
              </span>
            </div>
            <div className="h-10 w-10 shrink-0 rounded-full border border-sky-500/20 flex flex-col items-center justify-center font-mono text-[9px] text-sky-400 text-center uppercase tracking-tighter bg-sky-500/10 gap-0.5">
              <span className="text-[11px] font-black leading-none text-sky-300">85+</span>
              <span className="text-[7.5px] text-sky-400 leading-none">vezes</span>
            </div>
          </div>
          
        </div>
      </div>
    </motion.div>
  );
}
