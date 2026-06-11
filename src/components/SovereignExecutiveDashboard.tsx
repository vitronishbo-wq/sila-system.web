import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area, Legend, LineChart, Line
} from 'recharts';
import { 
  TrendingUp, Users, School, LayoutGrid, RefreshCw, Layers, ShieldCheck, 
  Database, Zap, Flame, Globe, AlertCircle, Play, Sliders, Leaf
} from 'lucide-react';

interface SovereignExecutiveDashboardProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  isOffline?: boolean;
}

// Fixed mock historical data for Recharts
const MONTHLY_HISTORICAL_DATA = [
  { month: 'Jan', cidadaos: 320000, matriculas: 110000, economiaKz: 42 },
  { month: 'Fev', cidadaos: 480000, matriculas: 180000, economiaKz: 68 },
  { month: 'Mar', cidadaos: 690000, matriculas: 240000, economiaKz: 95 },
  { month: 'Abr', cidadaos: 890000, matriculas: 310000, economiaKz: 121 },
  { month: 'Mai', cidadaos: 1120000, matriculas: 420000, economiaKz: 164 },
  { month: 'Jun (Atual)', cidadaos: 1248390, matriculas: 483921, economiaKz: 198 }
];

// Province level breakdown
const PROVINCE_DISTRIBUTION_DATA = [
  { name: 'Luanda', escolas: 620, cadastrados: 490000, matriculas: 192000, meta: 550000 },
  { name: 'Huambo', escolas: 310, cadastrados: 210000, matriculas: 810000, meta: 250000 },
  { name: 'Benguela', escolas: 290, cadastrados: 195000, matriculas: 75000, meta: 220000 },
  { name: 'Cabinda', escolas: 140, cadastrados: 98000, matriculas: 38000, meta: 110000 },
  { name: 'Huíla', escolas: 282, cadastrados: 165000, matriculas: 68000, meta: 190000 },
  { name: 'Uíge', escolas: 200, cadastrados: 90390, matriculas: 30921, meta: 120000 }
];

// Efficiency comparison data (Manual vs SILA)
const EFFICIENCY_METRICS = [
  { item: 'Validação Certidão', manual: 600, sila: 3 }, // in minutes (10h vs 3s)
  { item: 'Emissão de Matrícula', manual: 1440, sila: 8 }, // in minutes (24h vs 8s)
  { item: 'Auditabilidade / Fraude', manual: 10080, sila: 1 }, // in minutes (7 days vs 1s)
  { item: 'Consolidação Nacional', manual: 43200, sila: 2 } // in minutes (30 days vs 2s)
];

// CO2 emissions in kg of CO2 equivalent (Traditional vs SILA paperless & local-first networks)
const CO2_EMISSIONS_DATA = [
  { item: 'Circulação', tradicional: 540, sila: 12 }, // direct transport of administrative files
  { item: 'Papelada', tradicional: 290, sila: 10 },    // process tree-to-pulp emission of files
  { item: 'Armazenamento', tradicional: 180, sila: 22 },  // energy/air of physical vaults vs green servers
  { item: 'Deslocamento', tradicional: 720, sila: 0 }    // family transit reduced by local-first networks
];

// Paper & Ink Cartridge economic savings data in Million Kwanzas (M AOA) for Huambo & Luanda
const PAPER_INK_SAVINGS_DATA = [
  { item: 'Huambo Papel', Tradicional: 120, SILA: 15, Poupança: 105 },
  { item: 'Huambo Tinta', Tradicional: 85, SILA: 10, Poupança: 75 },
  { item: 'Luanda Papel', Tradicional: 580, SILA: 45, Poupança: 535 },
  { item: 'Luanda Tinta', Tradicional: 420, SILA: 35, Poupança: 385 }
];

export default function SovereignExecutiveDashboard({
  playAudioClick,
  isOffline = false
}: SovereignExecutiveDashboardProps) {
  
  // Dynamic Simulation stats (SILA Live State Engine):
  const [liveCitizens, setLiveCitizens] = useState(1248390);
  const [liveMatriculas, setLiveMatriculas] = useState(483921);
  const [syncQueue, setSyncQueue] = useState<number>(0);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Agora mesmo');
  const [selectedProvinceTab, setSelectedProvinceTab] = useState<'all' | 'high' | 'communal'>('all');
  const [simSpeed, setSimSpeed] = useState<number>(3000); // ms per simulated citizen integration
  const [isSimulatingLoad, setIsSimulatingLoad] = useState(true);
  const [comparisonMetric, setComparisonMetric] = useState<'Kz' | 'Time' | 'CO2'>('Time');
  const [kwanzaSubTab, setKwanzaSubTab] = useState<'paperInk' | 'hist'>('paperInk');

  // Background Sync and Stateful Data for MAT Auto-Refresh
  const [historicalData, setHistoricalData] = useState(MONTHLY_HISTORICAL_DATA);
  const [provinceData, setProvinceData] = useState(PROVINCE_DISTRIBUTION_DATA);
  const [isBackgroundSyncEnabled, setIsBackgroundSyncEnabled] = useState(true);
  const [bgSyncCountdown, setBgSyncCountdown] = useState(30);
  const [isBgSyncing, setIsBgSyncing] = useState(false);
  const [showSyncToast, setShowSyncToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Trigger sound effect auxiliary
  const triggerSound = (type: 'hover' | 'activation' | 'click') => {
    if (playAudioClick) playAudioClick(type);
  };

  // Real-time ticking engine: simulates live citizens and enrollments being processed.
  useEffect(() => {
    if (!isSimulatingLoad) return;

    const interval = setInterval(() => {
      const citizenIncrement = Math.floor(Math.random() * 3) + 1;
      const matriculasIncrement = Math.random() > 0.4 ? Math.floor(Math.random() * 2) + 1 : 0;

      if (isOffline) {
        // If offline simulated, increments go into local queue cache
        setSyncQueue(prev => prev + citizenIncrement);
      } else {
        // If online, they immediately persist to the simulated central ledger
        setLiveCitizens(prev => prev + citizenIncrement);
        setLiveMatriculas(prev => prev + matriculasIncrement);
        if (syncQueue > 0) {
          // Flush queue to central ledger upon being online
          setLiveCitizens(prev => prev + syncQueue);
          setSyncQueue(0);
          setLastSyncTime(new Date().toLocaleTimeString('pt-AO'));
        }
      }
    }, simSpeed);

    return () => clearInterval(interval);
  }, [isOffline, simSpeed, isSimulatingLoad, syncQueue]);

  // 30 seconds countdown background synchronizer to check if MAT has published new dematerialization data
  useEffect(() => {
    if (!isBackgroundSyncEnabled) return;

    const countdownTimer = setInterval(() => {
      setBgSyncCountdown(prev => {
        if (prev <= 1) {
          // Start the silent check process
          setIsBgSyncing(true);

          // Hold validation spinner for 2 seconds to simulate network overhead
          setTimeout(() => {
            setIsBgSyncing(false);

            // Generate randomized new dematerialized batches published by MAT
            const newFucs = Math.floor(Math.random() * 65) + 35; // 35-100 new citizen profiles
            const newMatriculas = Math.floor(Math.random() * 25) + 8; // 8-33 new school registrations

            // 1. Update overall counters
            setLiveCitizens(c => c + newFucs);
            setLiveMatriculas(m => m + newMatriculas);
            setLastSyncTime(new Date().toLocaleTimeString('pt-AO'));

            // 2. Refresh the custom AreaChart (historicalData state) in June
            setHistoricalData(curr => curr.map(item => {
              if (item.month.includes('Jun')) {
                return {
                  ...item,
                  cidadaos: item.cidadaos + newFucs,
                  matriculas: item.matriculas + newMatriculas,
                  economiaKz: Number((item.economiaKz + (newFucs * 0.12)).toFixed(1))
                };
              }
              return item;
            }));

            // 3. Update BarChart (provinceData state) by splitting registrations between Luanda & Huambo
            setProvinceData(curr => curr.map(prov => {
              if (prov.name === 'Huambo') {
                return {
                  ...prov,
                  cadastrados: prov.cadastrados + Math.floor(newFucs * 0.4),
                  matriculas: prov.matriculas + Math.floor(newMatriculas * 0.4)
                };
              } else if (prov.name === 'Luanda') {
                return {
                  ...prov,
                  cadastrados: prov.cadastrados + Math.floor(newFucs * 0.6),
                  matriculas: prov.matriculas + Math.floor(newMatriculas * 0.6)
                };
              }
              return prov;
            }));

            // 4. Set the silent notification toast details
            setToastMessage(`SILA Sincronia: +${newFucs} Cidadãos desmaterializados e +${newMatriculas} Matrículas ativas homologadas no sistema central pelo MAT.`);
            setShowSyncToast(true);

            // Play a highly silent/subtle notification sound (or trigger sound click if set)
            if (playAudioClick) playAudioClick('hover');

            // Automatically dismisses toast after 5 seconds
            setTimeout(() => {
              setShowSyncToast(false);
            }, 5500);

          }, 2000);

          return 30; // Reset countdown to 30
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownTimer);
  }, [isBackgroundSyncEnabled, playAudioClick]);

  // Flush local cache manually (SILA sync trigger simulation)
  const handleForceSync = () => {
    triggerSound('activation');
    if (syncQueue > 0) {
      setLiveCitizens(prev => prev + syncQueue);
      setSyncQueue(0);
      setLastSyncTime(new Date().toLocaleTimeString('pt-AO'));
    }
  };

  // Generate dynamic chart data based on active filters (using our reactive state 'provinceData')
  const filteredProvinceData = useMemo(() => {
    if (selectedProvinceTab === 'all') return provinceData;
    if (selectedProvinceTab === 'high') {
      return provinceData.filter(p => p.cadastrados > 150000);
    }
    // 'communal' / smaller regions focus
    return provinceData.filter(p => p.cadastrados < 150000);
  }, [selectedProvinceTab, provinceData]);

  // Custom tooltip for Kwanza Paper/Ink Savings
  const CustomKzTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length >= 2) {
      const trad = payload[0].value;
      const sila = payload[1].value;
      const savings = payload[0].payload?.Poupança !== undefined ? payload[0].payload.Poupança : (trad - sila);
      return (
        <div className="bg-[#090d14]/95 border border-white/10 p-2.5 rounded-xl shadow-xl text-[10px] font-mono whitespace-nowrap">
          <p className="text-slate-200 font-semibold mb-1 border-b border-white/5 pb-1 uppercase tracking-wider">{label}</p>
          <p className="text-rose-455 flex items-center gap-1.5 font-bold text-rose-400">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Tradicional: <span>{trad} M AOA</span>
          </p>
          <p className="text-emerald-455 flex items-center gap-1.5 font-bold text-emerald-400 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SILA Opt: <span>{sila} M AOA</span>
          </p>
          <p className="text-[#FFB800] border-t border-white/5 pt-1 mt-1 font-bold flex items-center gap-1.5">
            Poupança: <span>{savings} M AOA</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div 
      className="p-6 sm:p-8 bg-[#05070A]/85 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden"
      role="region"
      aria-label="Painel de Controle de Estatísticas Executivas e Métricas do SILA"
    >
      {/* Sincronização em Segundo Plano (Background Sync Status Alert Overlay Toast) */}
      <AnimatePresence>
        {showSyncToast && (
          <motion.div
            initial={{ opacity: 0, y: -45, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -25, scale: 0.96 }}
            transition={{ type: "spring", stiffness: 220, damping: 22 }}
            className="absolute top-4 left-4 right-4 sm:left-auto sm:right-6 sm:w-[380px] bg-[#070a10]/95 border border-emerald-500/30 rounded-2xl p-4 shadow-[0_12px_40px_rgba(0,0,0,0.85),0_0_20px_rgba(16,185,129,0.15)] z-50 overflow-hidden backdrop-blur-md"
          >
            {/* Pulsating green accent strip */}
            <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 animate-[pulse_2.5s_infinite]" />
            
            <div className="flex items-start gap-3">
              <div className="w-8.5 h-8.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <RefreshCw className="w-4 h-4 animate-[spin_4s_linear_infinite]" />
              </div>
              <div className="flex-1 space-y-1 select-none text-left">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono font-extrabold uppercase tracking-widest text-[#FFB800] bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.05]">
                    Sincronização em Segundo Plano
                  </span>
                  <span className="text-[8px] font-mono text-slate-500">
                    Agora mesmo
                  </span>
                </div>
                <h5 className="text-[11.5px] font-bold text-white font-sans leading-snug">
                  Métricas Sincronizadas (MAT Offline)
                </h5>
                <p className="text-[10px] text-slate-300 leading-relaxed font-sans">
                  {toastMessage}
                </p>
                <div className="text-[8px] font-mono text-slate-500 pt-1 border-t border-white/5 flex justify-between items-center bg-white/[0.01] px-1 rounded">
                  <span>ATUALIZADO AUTOMATICAMENTE</span>
                  <span>STATUS: 200 OK</span>
                </div>
              </div>
              
              <button 
                type="button"
                onClick={() => setShowSyncToast(false)}
                className="text-slate-500 hover:text-slate-300 transition-colors text-sm font-mono font-bold leading-none p-1 cursor-pointer"
              >
                ×
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Decorative Top glow beam */}
      <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent"></div>

      {/* Header section with status widgets */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-6 border-b border-white/10 gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-emerald-500 rounded-full" />
            <span className="text-[10px] font-mono text-blue-400 font-bold uppercase tracking-widest leading-none">
              Módulo Governativo SILA
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1">
            Painel Executivo de Estatísticas em Tempo Real
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Acompanhe o ritmo de saneamento cadastral e emissão de Fichas Únicas do Cidadão (FUC) em regime federativo nacional de Angola.
          </p>
        </div>

        {/* Real-Time Live Status Ledger State bar & Background Sync controllers */}
        <div className="flex flex-wrap items-center gap-3 bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-2.5 text-[11px] font-mono select-none">
          {/* SILA Ledger State */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <div className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isOffline ? 'bg-amber-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isOffline ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
            </div>
            <span className="text-slate-200">SILA Ledger:</span>
            <span className={isOffline ? 'text-amber-500 font-bold' : 'text-emerald-400 font-bold'}>
              {isOffline ? 'OFFLINE CACHE' : 'MAT CENTRAL CLOUD'}
            </span>
          </div>

          {/* Background Sync Counter & Active Toggle */}
          <div className="flex items-center gap-2 pr-3 border-r border-white/10">
            <span className="text-slate-400">Autoresync MAT:</span>
            <span className={`flex items-center gap-1.5 font-bold transition-colors ${isBgSyncing ? 'text-emerald-400' : 'text-sky-400'}`}>
              <RefreshCw className={`w-3 h-3 ${isBgSyncing ? 'animate-spin' : ''}`} />
              <span>{isBgSyncing ? 'A sincronizar...' : `${bgSyncCountdown}s`}</span>
            </span>
            <button
              type="button"
              onClick={() => {
                setIsBackgroundSyncEnabled(!isBackgroundSyncEnabled);
                triggerSound('click');
              }}
              className={`ml-1.5 px-2 py-0.5 rounded-[5px] text-[8.5px] uppercase tracking-wider font-extrabold cursor-pointer border transition-all duration-200 ${
                isBackgroundSyncEnabled 
                  ? 'bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border-sky-500/30 font-bold' 
                  : 'bg-white/5 hover:bg-white/10 text-slate-500 border-white/5'
              }`}
              title={isBackgroundSyncEnabled ? "Pausar Sincronização em Segundo Plano" : "Ativar Sincronização em Segundo Plano"}
            >
              {isBackgroundSyncEnabled ? "● AUTO-ATIVO" : "⏸ PAUSADO"}
            </button>
          </div>

          {/* Last Sync Details */}
          <div className="flex items-center gap-2">
            <span className="text-slate-500">Última Sincronização:</span>
            <span className="text-blue-400 font-bold">{lastSyncTime}</span>
          </div>
        </div>
      </div>

      {/* Grid of KPI Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        
        {/* KPI 1: Citizens Integrated */}
        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group hover:border-[#FFB800]/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFB800]/2 pointer-events-none rounded-br-2xl blur-md"></div>
          <div className="flex items-center justify-between">
            <div className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">
              Cidadãos Integrados
            </div>
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-[#FFB800]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              {liveCitizens.toLocaleString('pt-AO')}
            </span>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" /> Live
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Fichas Únicas ativas no banco nacional.
          </p>
        </div>

        {/* KPI 2: Active Schools */}
        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group hover:border-blue-500/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/2 pointer-events-none rounded-br-2xl blur-md"></div>
          <div className="flex items-center justify-between">
            <div className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">
              Escolas Ativas (SILA OS)
            </div>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <School className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              1.842
            </span>
            <span className="text-[10px] text-slate-400">100% Piloto</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Unidades integradas à malha civil do MAT.
          </p>
        </div>

        {/* KPI 3: Total Enrollments */}
        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group hover:border-cyan-400/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-cyan-400/2 pointer-events-none rounded-br-2xl blur-md"></div>
          <div className="flex items-center justify-between">
            <div className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">
              Processos de Matrícula
            </div>
            <div className="p-1.5 rounded-lg bg-cyan-400/10 text-cyan-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-bold font-mono tracking-tight text-white">
              {liveMatriculas.toLocaleString('pt-AO')}
            </span>
            <span className="text-[10px] text-[#FFB800]">+232/dia</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Inscritos validados sem atestados de papel.
          </p>
        </div>

        {/* KPI 4: Offline Synchronization Queue status */}
        <div className="p-5 rounded-2xl bg-white/[0.01] border border-white/5 relative group hover:border-emerald-400/20 transition-all duration-300">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-400/2 pointer-events-none rounded-br-2xl blur-md"></div>
          <div className="flex items-center justify-between">
            <div className="text-slate-500 text-[10px] uppercase font-mono tracking-widest">
              Fila de Sincronização Local
            </div>
            <div className={`p-1.5 rounded-lg ${syncQueue > 0 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-400'}`}>
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between">
            <span className={`text-2xl sm:text-3xl font-bold font-mono tracking-tight ${syncQueue > 0 ? 'text-amber-400 animate-pulse' : 'text-emerald-400'}`}>
              {syncQueue} <span className="text-xs text-slate-400 normal-case font-sans">docs</span>
            </span>
            {syncQueue > 0 && (
              <button
                onClick={handleForceSync}
                onMouseEnter={() => triggerSound('hover')}
                className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-[9px] font-mono tracking-wider transition-all"
                title="Forçar sincronização manual da fila"
              >
                SINCRONIZAR
              </button>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            {isOffline 
              ? 'Local cache crescendo offline na comuna.' 
              : 'Nenhum registro pendente em cache local.'}
          </p>
        </div>

      </div>

      {/* Main Charts & interactive widgets Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left main: Historical Chart */}
        <div className="lg:col-span-8 bg-white/[0.005] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/5">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-blue-400" />
                Histórico Geral de Integração & Crescimento FUC
              </h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Evolução mensal cumulativa de cidadãos e matrículas validadas sob SILA.
              </p>
            </div>

            {/* Custom chart legend indicators */}
            <div className="flex items-center gap-4 text-[10px] font-mono text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-blue-500"></span>
                Cidadãos (Fichas)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                Matrículas Escolares
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 w-full no-print">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={historicalData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCidadaos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMatriculas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                <XAxis 
                  dataKey="month" 
                  stroke="rgba(255,255,255,0.3)" 
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.3)" 
                  tickFormatter={(val) => `${val/1000}k`}
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                  tickLine={false}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#090d14', 
                    borderRadius: '12px', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    color: '#fff'
                  }} 
                  labelClassName="text-slate-400 font-bold"
                />
                <Area 
                  name="Cidadãos"
                  type="monotone" 
                  dataKey="cidadaos" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorCidadaos)" 
                />
                <Area 
                  name="Matrículas"
                  type="monotone" 
                  dataKey="matriculas" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorMatriculas)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right side panel: High-impact economic / execution efficiency comparison */}
        <div className="lg:col-span-4 bg-white/[0.005] border border-white/5 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <div>
              <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
                Eficiência Coletiva
              </h4>
              <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                Impacto imediato operacional.
              </p>
            </div>

            {/* Toggle state comparing time reduction, economic benefit, or ecological CO2 offset */}
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-[9px] font-mono no-print">
              <button
                type="button"
                onClick={() => { setComparisonMetric('Time'); triggerSound('hover'); }}
                className={`px-2 py-1 rounded-md font-bold transition-all ${comparisonMetric === 'Time' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                TEMPO
              </button>
              <button
                type="button"
                onClick={() => { setComparisonMetric('Kz'); triggerSound('hover'); }}
                className={`px-2 py-1 rounded-md font-bold transition-all ${comparisonMetric === 'Kz' ? 'bg-gradient-to-r from-blue-500 to-indigo-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                KWANZA
              </button>
              <button
                type="button"
                onClick={() => { setComparisonMetric('CO2'); triggerSound('hover'); }}
                className={`px-2 py-1 rounded-md font-bold transition-all ${comparisonMetric === 'CO2' ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white' : 'text-slate-400 hover:text-slate-200'}`}
              >
                CO₂ ECO
              </button>
            </div>
          </div>

          {comparisonMetric === 'Time' ? (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Minutos despendidos em canais burocráticos tradicionais comparados à validação instantânea via FUC SILA.
              </p>
              
              <div className="space-y-3 pt-2 font-mono text-[10px]">
                {EFFICIENCY_METRICS.map((metric, idx) => {
                  const percentOfManual = Math.max(1, Math.round((metric.sila / metric.manual) * 100));
                  return (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-slate-300">
                        <span className="font-semibold block truncate max-w-[140px] sm:max-w-none">{metric.item}</span>
                        <div className="flex gap-2">
                          <span className="text-[#FFB800]">{metric.manual >= 60 ? `${metric.manual/60}h` : `${metric.manual}m`} tradicional</span>
                          <span className="text-emerald-400 font-bold">&gt; {metric.sila}s SILA</span>
                        </div>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden flex relative">
                        {/* Red manual path filler */}
                        <div className="bg-rose-500/20 h-full rounded-l" style={{ width: '85%' }} />
                        {/* Emerald fast SILA path indicator */}
                        <div className="bg-emerald-400 h-full rounded-r transition-all" style={{ width: '15%' }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10 text-center">
                <span className="text-[11px] text-blue-400 font-mono font-bold leading-tight">
                  TEMPO MÉDIO DE ESPERA GLOBAL: -99.98%
                </span>
              </div>
            </div>
          ) : comparisonMetric === 'Kz' ? (
            <div className="space-y-4">
              {/* Inner mini sub-tabs to toggle between Papel/Tinteiro comparative bar chart & Histórico Geral line chart */}
              <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-[9px] font-mono no-print">
                <button
                  type="button"
                  onClick={() => { setKwanzaSubTab('paperInk'); triggerSound('click'); }}
                  className={`flex-1 py-1 rounded-md font-bold transition-all ${kwanzaSubTab === 'paperInk' ? 'bg-[#FFB800] text-black shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  PAPEL & TINTA SAVINGS
                </button>
                <button
                  type="button"
                  onClick={() => { setKwanzaSubTab('hist'); triggerSound('click'); }}
                  className={`flex-1 py-1 rounded-md font-bold transition-all ${kwanzaSubTab === 'hist' ? 'bg-[#FFB800] text-black shadow' : 'text-slate-400 hover:text-slate-200'}`}
                >
                  HISTÓRICO ACUMULADO
                </button>
              </div>

              {kwanzaSubTab === 'paperInk' ? (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Custos anuais diretos com papelada e tinteiros de impressão no modelo Tradicional vs. SILA Digital (em milhões de Kwanzas AOA) no Huambo e Luanda.
                  </p>

                  {/* Comparative horizontal or vertical bar chart */}
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={PAPER_INK_SAVINGS_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barGap={4}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="item" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 7, fontFamily: 'monospace' }} />
                        <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 8, fontFamily: 'monospace' }} />
                        <Tooltip content={<CustomKzTooltip />} />
                        <Bar name="Tradicional" dataKey="Tradicional" fill="rgba(244, 63, 94, 0.4)" stroke="rgba(244, 63, 94, 0.7)" strokeWidth={1} radius={[2, 2, 0, 0]} />
                        <Bar name="SILA Opt" dataKey="SILA" fill="#10b981" stroke="#10b981" strokeWidth={1} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center text-[9px] font-mono leading-tight">
                    <div className="p-2 rounded-xl bg-orange-500/5 border border-orange-500/10">
                      <span className="text-slate-500 block mb-0.5">POUPANÇA HUAMBO:</span>
                      <span className="text-xs font-bold text-slate-200">180M AOA / Ano</span>
                    </div>
                    <div className="p-2 rounded-xl bg-emerald-500/5 border border-emerald-500/10">
                      <span className="text-slate-500 block mb-0.5">POUPANÇA LUANDA:</span>
                      <span className="text-xs font-bold text-emerald-400">920M AOA / Ano</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Poupança acumulada estimada em milhões de Kwanzas (Kz) devido à abolição de papel selado, emolumentos e logística física de arquivos municipais.
                  </p>

                  {/* Economic chart Recharts */}
                  <div className="h-44 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={historicalData} margin={{ top: 5, right: 5, left: -25, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                        <XAxis dataKey="month" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                        <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                        <Tooltip contentStyle={{ backgroundColor: '#090d14', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace' }} />
                        <Line type="monotone" dataKey="economiaKz" name="Milhões de Kz" stroke="#FFB800" strokeWidth={2} dot={{ fill: '#FFB800', r: 3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center font-mono">
                    <span className="text-[10px] text-emerald-400 font-bold block">
                      ECONOMIA ATUAL ACUMULADA:
                    </span>
                    <span className="text-lg font-bold text-slate-100 block mt-0.5">
                      198.000.000 Kz
                    </span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Redução de emissões de CO₂ (kg CO₂eq) com a digitalização de processos burocráticos e eliminação de deslocações físicas de cidadãos e malhas de circulação interna.
              </p>

              {/* CO2 Chart Recharts */}
              <div className="h-44 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={CO2_EMISSIONS_DATA} margin={{ top: 5, right: 5, left: -25, bottom: 5 }} barGap={5}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                    <XAxis dataKey="item" stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 8, fontFamily: 'monospace' }} />
                    <YAxis stroke="rgba(255,255,255,0.15)" tick={{ fontSize: 8, fontFamily: 'monospace' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#090d14', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace' }} />
                    <Bar name="Tradicional" dataKey="tradicional" fill="rgba(244, 63, 94, 0.45)" stroke="rgba(244, 63, 94, 0.7)" strokeWidth={1} radius={[2, 2, 0, 0]} />
                    <Bar name="SILA Verde" dataKey="sila" fill="#10b981" stroke="#10b981" strokeWidth={1} radius={[2, 2, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/10 text-center font-mono">
                <span className="text-[10px] text-emerald-400 font-bold block flex items-center justify-center gap-1">
                  <Leaf className="w-3.5 h-3.5" /> PEGADA DE CO₂ EVITADA:
                </span>
                <span className="text-sm font-bold text-slate-100 block mt-0.5">
                  Poupança de 1.686 kg de CO₂eq / Ano
                </span>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Territorial Breakdown Map bar chart and Provincial Controls */}
      <div className="mt-8 pt-6 border-t border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-cyan-400" />
              Saneamento Territorial por Província
            </h4>
            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
              Percentagem de alcance de dados de registo civil contra metas estimadas por circunscrição.
            </p>
          </div>

          {/* Interactive filter buttons for Recharts bar chart */}
          <div className="flex flex-wrap items-center gap-2 text-[10px] font-mono no-print">
            <span className="text-slate-500 uppercase text-[9px] mr-1 block">Filtrar:</span>
            {[
              { id: 'all', label: 'TODAS PROVÍNCIAS' },
              { id: 'high', label: 'ALTA DENSIDADE (&gt;150k)' },
              { id: 'communal', label: 'COMUNAL E INTERIOR (&lt;150k)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setSelectedProvinceTab(tab.id as any); triggerSound('click'); }}
                className={`px-3 py-1.5 rounded-lg border transition-all ${
                  selectedProvinceTab === tab.id
                    ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 font-bold'
                    : 'bg-white/[0.01] hover:bg-white/[0.03] text-slate-400 border-white/5'
                }`}
                dangerouslySetInnerHTML={{ __html: tab.label }}
              />
            ))}
          </div>
        </div>

        {/* Territory analysis chart */}
        <div className="h-64 sm:h-72 w-full no-print">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={filteredProvinceData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
              <XAxis 
                dataKey="name" 
                stroke="rgba(255,255,255,0.3)" 
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <YAxis 
                stroke="rgba(255,255,255,0.3)" 
                tickFormatter={(val) => val >= 1000 ? `${val/1000}k` : val}
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10, fontFamily: 'monospace' }}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#090d14', 
                  borderRadius: '12px', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  fontFamily: 'monospace',
                  fontSize: '11px',
                  color: '#fff'
                }}
              />
              <Bar 
                name="Meta Estabilização"
                dataKey="meta" 
                fill="rgba(255,255,255,0.05)" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                name="Auditados (FUC)"
                dataKey="cadastrados" 
                fill="#3b82f6" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
              <Bar 
                name="Escolas Integradas"
                dataKey="escolas" 
                fill="#FFB800" 
                radius={[4, 4, 0, 0]} 
                maxBarSize={40}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Interactive simulation controllers at the bottom to play with the live figures */}
      <div className="mt-8 p-4 bg-white/[0.01] border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 no-print sm:font-mono text-xs">
        <div className="flex items-center gap-3.5 flex-wrap justify-center sm:justify-start">
          <span className="flex items-center gap-1.5 text-slate-400">
            <Sliders className="w-4 h-4 text-blue-500 animate-spin-slow" />
            SIMULADOR DE CARGA DO LEDGER:
          </span>
          <button
            onClick={() => { setIsSimulatingLoad(!isSimulatingLoad); triggerSound('activation'); }}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all flex items-center gap-1.5 ${
              isSimulatingLoad 
                ? 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/25' 
                : 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/25'
            }`}
          >
            <Play className={`w-3 h-3 ${isSimulatingLoad ? 'fill-emerald-400' : ''}`} />
            {isSimulatingLoad ? 'TICKATIVADO' : 'PAUSADO'}
          </button>

          {/* Speed governor */}
          {isSimulatingLoad && (
            <div className="flex items-center gap-2">
              <span className="text-slate-500 text-[10px]">VELOCIDADE DE INJEÇÃO:</span>
              <div className="flex bg-neutral-900 border border-white/10 rounded-lg p-0.5">
                {[
                  { speed: 5000, label: 'Lenta' },
                  { speed: 3000, label: 'Média' },
                  { speed: 800, label: 'Nuvem Alta' }
                ].map((item) => (
                  <button
                    key={item.speed}
                    onClick={() => { setSimSpeed(item.speed); triggerSound('click'); }}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold ${
                      simSpeed === item.speed 
                        ? 'bg-blue-500 text-white' 
                        : 'text-slate-400 hover:text-slate-300'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-[10px] text-slate-500 flex items-center gap-1.5 select-none">
          <AlertCircle className="w-3.5 h-3.5 text-slate-400" />
          <span>Controles de simulação restritos para decisores.</span>
        </div>
      </div>

    </div>
  );
}
