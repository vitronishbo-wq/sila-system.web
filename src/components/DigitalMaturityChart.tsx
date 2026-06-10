import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AreaChart, Area, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, BarChart3, Share2, Shield, Calendar, Users, Cpu, FileSignature } from 'lucide-react';

interface MaturityDataPoint {
  week: string;
  digitalEnrollments: number; // Percentage (%)
  physicalDocuments: number;  // Thousands of sheets avoided
  activeRegisters: number;    // Absolute active fiduciaries
}

interface MunicipalityProjection {
  name: string;
  description: string;
  targetStudents: string;
  data: MaturityDataPoint[];
}

const DATA_PROJECTIONS: Record<string, MunicipalityProjection> = {
  huambo: {
    name: 'Huambo (Sede)',
    description: 'Polo Metropolitano Administrativo - Escolas piloto centrais, incluindo os maiores liceus e colégios técnicos da sede.',
    targetStudents: '45.000 alunos',
    data: [
      { week: 'Semana 1', digitalEnrollments: 12, physicalDocuments: 3.5, activeRegisters: 4500 },
      { week: 'Semana 2', digitalEnrollments: 28, physicalDocuments: 8.2, activeRegisters: 11000 },
      { week: 'Semana 3', digitalEnrollments: 45, physicalDocuments: 14.0, activeRegisters: 18500 },
      { week: 'Semana 4', digitalEnrollments: 62, physicalDocuments: 21.3, activeRegisters: 26000 },
      { week: 'Mês 2 (In.)', digitalEnrollments: 74, physicalDocuments: 28.5, activeRegisters: 32000 },
      { week: 'Mês 2 (Fin.)', digitalEnrollments: 85, physicalDocuments: 35.1, activeRegisters: 38000 },
      { week: 'Mês 3 (In.)', digitalEnrollments: 91, physicalDocuments: 41.2, activeRegisters: 41500 },
      { week: 'Mês 3 (Fin.)', digitalEnrollments: 96, physicalDocuments: 44.8, activeRegisters: 44500 },
    ]
  },
  caala: {
    name: 'Caála',
    description: 'Polo Secundário e Residencial - Foco na desmaterialização de transferências inter-municipais rápidas.',
    targetStudents: '22.000 alunos',
    data: [
      { week: 'Semana 1', digitalEnrollments: 8, physicalDocuments: 1.2, activeRegisters: 1600 },
      { week: 'Semana 2', digitalEnrollments: 20, physicalDocuments: 3.8, activeRegisters: 4200 },
      { week: 'Semana 3', digitalEnrollments: 38, physicalDocuments: 7.2, activeRegisters: 8000 },
      { week: 'Semana 4', digitalEnrollments: 55, physicalDocuments: 11.0, activeRegisters: 11800 },
      { week: 'Mês 2 (In.)', digitalEnrollments: 69, physicalDocuments: 14.8, activeRegisters: 15100 },
      { week: 'Mês 2 (Fin.)', digitalEnrollments: 81, physicalDocuments: 18.2, activeRegisters: 17800 },
      { week: 'Mês 3 (In.)', digitalEnrollments: 89, physicalDocuments: 20.1, activeRegisters: 19900 },
      { week: 'Mês 3 (Fin.)', digitalEnrollments: 94, physicalDocuments: 21.6, activeRegisters: 21500 },
    ]
  },
  bailundo: {
    name: 'Bailundo',
    description: 'Polo Regional e Tradicional - Rede de escolas do ensino primário e secundário de pendor histórico.',
    targetStudents: '18.000 alunos',
    data: [
      { week: 'Semana 1', digitalEnrollments: 5, physicalDocuments: 0.8, activeRegisters: 900 },
      { week: 'Semana 2', digitalEnrollments: 14, physicalDocuments: 2.2, activeRegisters: 2400 },
      { week: 'Semana 3', digitalEnrollments: 30, physicalDocuments: 4.8, activeRegisters: 5100 },
      { week: 'Semana 4', digitalEnrollments: 48, physicalDocuments: 8.5, activeRegisters: 8500 },
      { week: 'Mês 2 (In.)', digitalEnrollments: 62, physicalDocuments: 11.2, activeRegisters: 11000 },
      { week: 'Mês 2 (Fin.)', digitalEnrollments: 78, physicalDocuments: 13.9, activeRegisters: 14200 },
      { week: 'Mês 3 (In.)', digitalEnrollments: 87, physicalDocuments: 15.8, activeRegisters: 16100 },
      { week: 'Mês 3 (Fin.)', digitalEnrollments: 93, physicalDocuments: 17.5, activeRegisters: 17600 },
    ]
  }
};

interface DigitalMaturityChartProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function DigitalMaturityChart({ playAudioClick }: DigitalMaturityChartProps) {
  const [selectedMunicipality, setSelectedMunicipality] = useState<string>('huambo');
  const [displayMetric, setDisplayMetric] = useState<'percent' | 'paper' | 'registers'>('percent');

  const currentProjection = DATA_PROJECTIONS[selectedMunicipality];

  const handleMunicipalityChange = (key: string) => {
    setSelectedMunicipality(key);
    if (playAudioClick) playAudioClick('click');
  };

  const handleMetricChange = (metric: 'percent' | 'paper' | 'registers') => {
    setDisplayMetric(metric);
    if (playAudioClick) playAudioClick('activation');
  };

  // Custom tooltips styling for dark premium aesthetic
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#05070c]/95 border border-white/10 p-3 rounded-xl shadow-lg backdrop-blur-md text-[11px] font-mono">
          <p className="text-slate-400 font-semibold mb-1 border-b border-white/5 pb-1 uppercase tracking-wider">{label}</p>
          {payload.map((item: any, idx: number) => {
            let valueStr = '';
            if (item.name.includes('%')) {
              valueStr = `${item.value}% dos alunos`;
            } else if (item.name.includes('Papel')) {
              valueStr = `${item.value.toFixed(1)} mil resmas poupadas`;
            } else {
              valueStr = `${item.value.toLocaleString('pt-PT')} Registos Fiduciários`;
            }
            return (
              <p key={idx} className="flex items-center gap-1.5 mt-1" style={{ color: item.color }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{valueStr}</strong></span>
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
      className="bg-gradient-to-b from-[#0a0f1d] to-[#04060a] border border-white/5 p-6 sm:p-8 rounded-3xl relative overflow-hidden w-full space-y-6 mt-12"
      id="digital-maturity-chart-section"
    >
      {/* Decorative top strip */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />

      {/* Grid details */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1.5px,transparent_1.5px),linear-gradient(to_bottom,#05070A_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-15 pointer-events-none" />

      {/* Header of Visualizer */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-5 relative z-10">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-sky-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <TrendingUp className="w-3.5 h-3.5" /> PROJEÇÃO DE IMPACTO OPERACIONAL (PILOTO)
          </span>
          <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
            Curva de Maturidade Digital e Desmaterialização
          </h4>
          <p className="text-xs text-slate-400 font-sans leading-relaxed max-w-2xl">
            Simulação da substituição de formulários de papel por registos seguros na fiduciária FUC. Estabilidade e soberania fiduciária ao longo de 90 dias de projeto piloto no Huambo.
          </p>
        </div>

        {/* Municipality Button Selection Toggles */}
        <div className="flex bg-[#05070a] border border-white/10 p-1 rounded-xl items-center no-print gap-1 self-start sm:self-auto">
          {Object.keys(DATA_PROJECTIONS).map((key) => {
            const mun = DATA_PROJECTIONS[key];
            const isSelected = selectedMunicipality === key;
            return (
              <button
                key={key}
                onClick={() => handleMunicipalityChange(key)}
                className={`px-3 py-1.5 text-[10px] font-mono rounded-lg transition-all cursor-pointer truncate ${
                  isSelected 
                    ? 'bg-blue-600/25 text-blue-400 border border-blue-500/20 font-bold' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                }`}
              >
                {mun.name}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Stats Row showing specific target context */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white/[0.01]/10 border border-white/5 p-4 rounded-2xl relative z-10 backdrop-blur-sm">
        <div className="space-y-1">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Foco Território</span>
          <p className="text-xs font-semibold text-slate-200 font-sans italic">{currentProjection.description}</p>
        </div>
        <div className="space-y-1 sm:border-l sm:border-white/5 sm:pl-4">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Meta de Alunos Conectados</span>
          <p className="text-sm font-black text-amber-400 font-mono flex items-center gap-1.5 uppercase">
            <Users className="w-3.5 h-3.5 text-[#FFB800]" /> {currentProjection.targetStudents}
          </p>
        </div>
        <div className="space-y-1 sm:border-l sm:border-white/5 sm:pl-4">
          <span className="text-[9px] font-mono text-slate-500 uppercase block">Substituição de Ficheiros</span>
          <p className="text-sm font-black text-emerald-400 font-mono flex items-center gap-1.5 uppercase">
            <FileSignature className="w-3.5 h-3.5 text-emerald-400" /> +95% Desmaterializado
          </p>
        </div>
      </div>

      {/* Graph Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Metric Selector Rail (Left column inside chart module) */}
        <div className="lg:col-span-3 flex lg:flex-col gap-2.5 overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 shrink-0 select-none">
          
          <button
            onClick={() => handleMetricChange('percent')}
            className={`flex-1 text-left p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer block ${
              displayMetric === 'percent'
                ? 'bg-blue-600/10 border-blue-500/20 text-blue-400'
                : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-blue-400" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Taxa Digital</span>
            </div>
            <h5 className="text-[13px] font-sans font-semibold mt-1 tracking-tight">Matrículas 100% Online</h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-sans">
              Proporção de matrículas efetuadas sem necessidade de entrega física de fichas.
            </p>
          </button>

          <button
            onClick={() => handleMetricChange('paper')}
            className={`flex-1 text-left p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer block ${
              displayMetric === 'paper'
                ? 'bg-amber-600/10 border-amber-500/20 text-amber-400'
                : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2">
              <FileSignature className="w-4 h-4 text-amber-400" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Resmas Evitadas</span>
            </div>
            <h5 className="text-[13px] font-sans font-semibold mt-1 tracking-tight">Papel de Dossier Evitado</h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-sans">
              Milhares de folhas de papel oficial, chancelas e fotocópias poupadas pela FUC.
            </p>
          </button>

          <button
            onClick={() => handleMetricChange('registers')}
            className={`flex-1 text-left p-3.5 rounded-xl border transition-all duration-300 relative cursor-pointer block ${
              displayMetric === 'registers'
                ? 'bg-emerald-600/10 border-emerald-500/20 text-emerald-400'
                : 'bg-white/[0.01] border-white/5 text-slate-400 hover:border-white/10 hover:bg-white/[0.02]'
            }`}
          >
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" />
              <span className="text-[9px] font-mono font-bold tracking-widest uppercase">Registos Fiduciários</span>
            </div>
            <h5 className="text-[13px] font-sans font-semibold mt-1 tracking-tight">Registos Ativos FUC</h5>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-normal font-sans">
              Número de identidades estudantis asseguradas no barramento soberano do Huambo.
            </p>
          </button>
        </div>

        {/* Dynamic Chart Container */}
        <div className="lg:col-span-9 bg-black/40 border border-white/5 p-4 rounded-2xl h-[310px] sm:h-[350px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={currentProjection.data}
              margin={{ top: 20, right: 10, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorDigital" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorPaper" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorRegisters" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" />
              
              <XAxis 
                dataKey="week" 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
              />
              
              <YAxis 
                stroke="#64748b" 
                fontSize={9} 
                tickLine={false} 
                axisLine={false}
                domain={displayMetric === 'percent' ? [0, 100] : ['auto', 'auto']}
              />
              
              <Tooltip content={<CustomTooltip />} />
              
              {displayMetric === 'percent' && (
                <Area 
                  type="monotone" 
                  dataKey="digitalEnrollments" 
                  name="Taxa Digital (%)" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDigital)" 
                />
              )}

              {displayMetric === 'paper' && (
                <Area 
                  type="monotone" 
                  dataKey="physicalDocuments" 
                  name="Folhas Evitadas (Mil)" 
                  stroke="#f59e0b" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorPaper)" 
                />
              )}

              {displayMetric === 'registers' && (
                <Area 
                  type="monotone" 
                  dataKey="activeRegisters" 
                  name="Registos Únicos Ativos" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorRegisters)" 
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* Sidenote foot signature feedback */}
      <p className="text-[10px] text-slate-500 font-mono uppercase text-center sm:text-right">
        ● Previsão com margem de segurança operacional baseada no censo MAT 2025 de Huambo.
      </p>
    </motion.div>
  );
}
