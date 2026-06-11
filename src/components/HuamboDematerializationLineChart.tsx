import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, ReferenceLine
} from 'recharts';
import { TrendingUp, FileSpreadsheet, ChevronRight, Leaf, ShieldAlert, CheckCircle, Database, Sparkles } from 'lucide-react';

interface MonthlyDataPoint {
  month: string;
  dematerializationRate?: number; // Percent (%) - Actual
  paperAvoided?: number;          // Thousands of sheets - Actual
  rateProjected?: number;         // Percent (%) - Projected trend
  paperProjected?: number;        // Thousands of sheets - Projected trend
  activeSyncs: number;           // State integration channels
  milestoneName?: string;
  milestoneDesc?: string;
  isProjected?: boolean;
}

const HUAMBO_CHART_DATA: MonthlyDataPoint[] = [
  { 
    month: 'Mês 1', 
    dematerializationRate: 15, 
    paperAvoided: 8.5, 
    activeSyncs: 2,
    milestoneName: 'Ignição Tecnológica',
    milestoneDesc: 'Inicialização do Nó CORE FUC no Huambo (Sede) e integração inicial com 5 liceus chave.'
  },
  { 
    month: 'Mês 2', 
    dematerializationRate: 35, 
    paperAvoided: 22.1, 
    activeSyncs: 4,
    milestoneName: 'Sincronização Escolar',
    milestoneDesc: 'Expansão do cadastro único fiduciário para escolas primárias e securitização de matrículas.'
  },
  { 
    month: 'Mês 3', 
    dematerializationRate: 58, 
    paperAvoided: 45.3, 
    activeSyncs: 7,
    milestoneName: 'Alinhamento Inter-Pastas',
    milestoneDesc: 'Inclusão da Secretaria Estadual da Educação e conexões rápidas com Finanças para rastreio de pagamentos.'
  },
  { 
    month: 'Mês 4', 
    dematerializationRate: 75, 
    paperAvoided: 71.8, 
    activeSyncs: 9,
    milestoneName: 'Conexão Caála-Bailundo',
    milestoneDesc: 'Replicação fiduciária para áreas conectadas extra-sede, reduzindo tráfego físico municipal.'
  },
  { 
    month: 'Mês 5', 
    dematerializationRate: 88, 
    paperAvoided: 98.4, 
    activeSyncs: 12,
    milestoneName: 'Auditoria Zero Papel',
    milestoneDesc: 'Consolidação de fluxos e emissão automatizada do Relatório Executivo SILA livre de chancelas.'
  },
  { 
    month: 'Mês 6', 
    dematerializationRate: 97, 
    paperAvoided: 124.6, 
    rateProjected: 97,
    paperProjected: 124.6,
    activeSyncs: 15,
    milestoneName: 'Escala Plena Huambo',
    milestoneDesc: '97% dos processos desmaterializados no Huambo com sincronização federal segura e latência controlada.'
  },
  { 
    month: 'Mês 9 (P)', 
    rateProjected: 99,
    paperProjected: 202.5,
    activeSyncs: 18,
    isProjected: true,
    milestoneName: 'Saúde & Nutrição Preventivas',
    milestoneDesc: 'Projeção de impacto: Cobertura total das áreas de saúde escolar e merenda automatizada nos 11 municípios do Huambo.'
  },
  { 
    month: 'Mês 12 (P)', 
    rateProjected: 100,
    paperProjected: 285.0,
    activeSyncs: 22,
    isProjected: true,
    milestoneName: 'Replicação no Litoral',
    milestoneDesc: 'Projeção de impacto: Homologação no Huambo provê infraestrutura técnica padrão exportável para província de Benguela.'
  },
  { 
    month: 'Mês 15 (P)', 
    rateProjected: 100,
    paperProjected: 367.5,
    activeSyncs: 28,
    isProjected: true,
    milestoneName: 'Planalto Central Coberto',
    milestoneDesc: 'Projeção de impacto: Integração federalizada da Província do Bié. Mais de 1,2 milhões de alunos sob a FUC unificada.'
  },
  { 
    month: 'Mês 18 (P)', 
    rateProjected: 100,
    paperProjected: 450.0,
    activeSyncs: 35,
    isProjected: true,
    milestoneName: 'Soberania Nacional Absoluta',
    milestoneDesc: 'Projeção de impacto: Expansão estratégica total para Luanda, blindando a burocracia angolana contra perdas de papel.'
  }
];

interface HuamboDematerializationLineChartProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function HuamboDematerializationLineChart({ playAudioClick }: HuamboDematerializationLineChartProps) {
  const [showProjection, setShowProjection] = useState<boolean>(true);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState<number>(5); // Default to Month 6 (Escala Plena)

  const visibleData = useMemo(() => {
    return showProjection ? HUAMBO_CHART_DATA : HUAMBO_CHART_DATA.filter(item => !item.isProjected);
  }, [showProjection]);

  // Ensure index remains safe within bounds when toggle changes visibleData size
  const safeIdx = selectedMonthIdx >= visibleData.length ? visibleData.length - 1 : selectedMonthIdx;
  const activeMilestone = visibleData[safeIdx] || visibleData[0];

  const handleMonthClick = (index: number) => {
    setSelectedMonthIdx(index);
    if (playAudioClick) playAudioClick('click');
  };

  const handleToggleProjection = () => {
    setShowProjection(!showProjection);
    setSelectedMonthIdx(5); // Reset focus back to Month 6 when toggling
    if (playAudioClick) playAudioClick('click');
  };

  // Redesigned premium custom tooltip matching dark slate aesthetic
  const CustomLineTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#05070c]/98 border border-white/10 p-3.5 rounded-xl shadow-2xl backdrop-blur-md text-[11px] font-mono w-64">
          <p className="text-[#FFB800] font-semibold mb-1.5 border-b border-white/5 pb-1 uppercase tracking-wider text-xs flex items-center justify-between">
            <span>{label}</span>
            {label.includes('(P)') && (
              <span className="text-[8px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded uppercase font-bold">
                Projeção
              </span>
            )}
          </p>
          {payload.map((item: any, idx: number) => {
            const isRate = item.name.includes('%');
            
            // Skip redundant matching projections on intersection Month 6 (Mês 6)
            if (label === 'Mês 6' && item.name.startsWith('Projeção')) {
              return null;
            }

            return (
              <p key={idx} className="flex items-center justify-between gap-1.5 mt-1" style={{ color: item.color }}>
                <span className="flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                  <span>{item.name}:</span>
                </span>
                <strong className="text-slate-100">
                  {isRate ? `${item.value}%` : `${item.value.toFixed(1)}K resmas`}
                </strong>
              </p>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="bg-gradient-to-b from-[#0a0f1d] to-[#04060a] border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden w-full space-y-6 mt-8"
      id="huambo-dematerialization-linear-module"
    >
      {/* Visual Accent */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#FFB800]/25 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1.5px,transparent_1.5px),linear-gradient(to_bottom,#05070A_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-10 pointer-events-none" />

      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-amber-500 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> CRONOGRAMA DE EFICIÊNCIA PROVINCIAL • HUAMBO
          </span>
          <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
            Curva de Desmaterialização & Projeção 12 Meses
          </h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-2xl">
            Acompanhamento linear do declínio dos processos em papel e ascensão dos registos digitais unificados fiduciários com projeção de tendência de economia sustentável.
          </p>
        </div>

        {/* Toggle and Summary Badge */}
        <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={handleToggleProjection}
            className={`px-3 py-1.5 rounded-xl text-[10px] font-mono font-bold tracking-wide border transition-all cursor-pointer flex items-center gap-1.5 ${
              showProjection 
                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' 
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{showProjection ? 'Desativar Projeção' : 'Mapear Projeção Futura'}</span>
          </button>

          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl font-mono text-emerald-400 text-xs shadow-md shadow-emerald-900/5">
            <Leaf className="w-4 h-4 text-emerald-400" />
            <span>Meta: <strong className="text-white">{showProjection ? '~450K' : '~125K'}</strong> resmas</span>
          </div>
        </div>
      </div>

      {/* Interactive Main Body Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10">
        
        {/* Left Side: Interactive Progress Stepper for Milestones */}
        <div className="lg:col-span-4 space-y-3 shrink-0">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold mb-1">
            Marcos Mensais de Progressão
          </div>

          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {visibleData.map((data, idx) => {
              const isSelected = selectedMonthIdx === idx;
              const rate = data.dematerializationRate ?? data.rateProjected ?? 0;
              return (
                <button
                  key={idx}
                  onClick={() => handleMonthClick(idx)}
                  className={`w-full text-left p-3 rounded-xl border transition-all duration-300 relative overflow-hidden block cursor-pointer ${
                    isSelected
                      ? 'bg-white/[0.03] border-[#FFB800]/30 shadow-lg'
                      : 'bg-[#05070a]/40 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-mono text-slate-400 flex items-center gap-1.5">
                      {data.month}
                      {data.isProjected && (
                        <span className="text-[7.5px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1 rounded uppercase font-bold">PROJ</span>
                      )}
                    </span>
                    <span className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                      rate >= 97 
                        ? 'text-emerald-450 bg-emerald-500/10 text-emerald-400' 
                        : rate > 50
                        ? 'text-sky-400 bg-sky-500/10'
                        : 'text-[#FFB800] bg-amber-500/10'
                    }`}>
                      {rate}% DIGITAL
                    </span>
                  </div>

                  <h5 className="text-sm font-sans font-semibold mt-1 text-slate-200">
                    {data.milestoneName}
                  </h5>
                </button>
              );
            })}
          </div>
        </div>

        {/* Center/Right Side: Line Chart visualization */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-black/40 border border-white/5 p-4 rounded-2xl h-[320px] sm:h-[360px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={visibleData}
                margin={{ top: 20, right: 15, left: -20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
                <XAxis 
                  dataKey="month" 
                  stroke="#64748b" 
                  fontSize={9} 
                  tickLine={false} 
                  axisLine={false}
                />
                
                {/* Left YAxis - Percentage rate */}
                <YAxis 
                  yAxisId="left"
                  stroke="rgba(255, 184, 0, 0.5)" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 100]}
                  tickFormatter={(val) => `${val}%`}
                />

                {/* Right YAxis - Paper avoided in Thousands */}
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="rgba(0, 102, 255, 0.5)" 
                  fontSize={8} 
                  tickLine={false} 
                  axisLine={false}
                  domain={[0, 500]}
                  tickFormatter={(val) => `${val}K`}
                />

                <Tooltip content={<CustomLineTooltip />} />
                <Legend 
                  verticalAlign="top" 
                  height={36} 
                  iconType="circle"
                  wrapperStyle={{ fontSize: '10px', fontFamily: 'monospace', textTransform: 'uppercase' }}
                />
                
                {/* Sincronização Ativa Rate line */}
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="dematerializationRate" 
                  name="Sincronização Ativa (%)" 
                  stroke="#FFB800" 
                  strokeWidth={3}
                  activeDot={{ r: 6 }}
                  dot={{ r: 3, stroke: "#05070a", strokeWidth: 1.5 }}
                  connectNulls={true}
                />

                {/* Paper avoided line */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="paperAvoided" 
                  name="Folhas Evitadas (K/resmas)" 
                  stroke="#0066FF" 
                  strokeWidth={2.5}
                  activeDot={{ r: 5 }}
                  dot={{ r: 2.5 }}
                  connectNulls={true}
                />

                {/* Projected Rate line */}
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="rateProjected" 
                  name="Projeção Sincronização (%)" 
                  stroke="#FFB800" 
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 3, stroke: "#05070a", strokeWidth: 1 }}
                  connectNulls={true}
                />

                {/* Projected Paper line */}
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="paperProjected" 
                  name="Projeção Folhas Evitadas (K)" 
                  stroke="#0066FF" 
                  strokeWidth={1.5}
                  strokeDasharray="4 4"
                  dot={{ r: 2 }}
                  connectNulls={true}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Detailed analysis of active milestone */}
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedMonthIdx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="bg-white/[0.01]/10 border border-white/5 p-5 rounded-2xl space-y-3"
            >
              <div className="flex items-center gap-2 justify-between">
                <span className="text-[10px] font-mono text-slate-500 uppercase flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-[#FFB800]" /> DETALHE DA META DO {activeMilestone.month}
                </span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/10 uppercase">
                  {activeMilestone.activeSyncs} Secretarias Sincronizadas
                </span>
              </div>

              <div>
                <h5 className="text-base font-sans font-semibold text-slate-100 flex items-center gap-2">
                  <span>{activeMilestone.milestoneName}</span>
                  {activeMilestone.isProjected && (
                    <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-mono uppercase font-bold">
                      Impacto Projetado
                    </span>
                  )}
                </h5>
                <p className="text-xs text-slate-300 leading-relaxed font-sans mt-1">
                  {activeMilestone.milestoneDesc}
                </p>
              </div>

              {/* Dynamic Metric bar indicator */}
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-3 bg-[#05070a] rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Foco de Desmaterialização</span>
                  <span className="text-base font-sans font-bold text-slate-200 block mt-0.5">
                    {activeMilestone.dematerializationRate ?? activeMilestone.rateProjected}% Eficiente
                  </span>
                </div>
                <div className="p-3 bg-[#05070a] rounded-xl border border-white/5">
                  <span className="text-[9px] font-mono text-slate-500 uppercase block">Resmas Evitadas (Acumulado)</span>
                  <span className="text-base font-sans font-bold text-amber-400 block mt-0.5">
                    {(activeMilestone.paperAvoided ?? activeMilestone.paperProjected ?? 0).toFixed(1)}K Unidades
                  </span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

      </div>

      {/* Sidenote showing projection standard */}
      <div className="flex items-center justify-between text-[10px] font-mono text-slate-500 border-t border-white/5 pt-4">
        <span>● PROVÍNCIA DO HUAMBO - PROGRAMA DE ACELERAÇÃO DE ADMINISTRAÇÃO DIRETA</span>
        <span>ATUALIZADO JUNHO 2026 • MODELO PROJETIVO DE CURVAS LINEARES</span>
      </div>
    </motion.div>
  );
}
