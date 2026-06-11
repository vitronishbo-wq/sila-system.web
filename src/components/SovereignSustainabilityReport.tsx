import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, Droplet, Zap, Trees, Landmark, Sliders, AlertCircle, 
  HelpCircle, Sparkles, Trash2, ArrowDown, Calculator, ShieldCheck 
} from 'lucide-react';
import { 
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, 
  CartesianGrid, Tooltip, BarChart, Bar, Cell 
} from 'recharts';
import SovereignTooltip from './SovereignTooltip';

interface SovereignSustainabilityReportProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  initialCitizensCount?: number;
}

export default function SovereignSustainabilityReport({ 
  playAudioClick,
  initialCitizensCount = 1248390 
}: SovereignSustainabilityReportProps) {
  
  // State for interactive calculations override
  const [pagesPerCivilProcess, setPagesPerCivilProcess] = useState<number>(4); // average sheets of paper per student/citizen dossier
  const [physicalCentresBypassed, setPhysicalCentresBypassed] = useState<number>(18); // Number of warehouse spaces/rooms bypassed
  const [activeYearsProj, setActiveYearsProj] = useState<number>(1); // Projection timeframe
  const [activeTab, setActiveTab] = useState<'total' | 'water' | 'energy'>('total');

  const triggerSound = (type: 'hover' | 'activation' | 'click' = 'click') => {
    if (playAudioClick) playAudioClick(type);
  };

  // Base constants derived from certified ecological lifecycles (LCA - Life Cycle Assessment):
  // 1 standard A4 paper sheet = 10 Litres of water consumed in tree-to-pulp manufacturing.
  // 1 standard A4 paper sheet = 0.005 kg of CO2 equivalent emissions in industrial cycle.
  // 1 standard A4 paper sheet = 0.08 kWh of electric energy consumed in refining & heavy high-capacity warehouse processing.
  // 
  // Physical Archive Centre Annual footprint (Air conditioning on 24/7 to control humidity, dehumidifiers, security lighting):
  // Average physical archive requires ~4,200 kWh per year per storage unit, plus associated maintenance.
  // SILA digital vault requires ~190 kWh per year per municipal node (distributed scale-to-zero compute).
  
  const calculatedMetrics = useMemo(() => {
    // Total processes in SILA
    const totalProcesses = initialCitizensCount;
    const totalSheetsSaved = totalProcesses * pagesPerCivilProcess * activeYearsProj;
    
    // 1. WATER SAVINGS (Recursos Hídricos)
    // 10 Liters of water per page
    const waterLitersSaved = totalSheetsSaved * 10;
    
    // 2. ELECTRICITY SAVINGS (Recursos Elétricos)
    // 0.08 kWh per sheet production + Physical warehouses HVAC/light power saved
    // Warehouse power: (4200 kWh - 190 kWh) = 4010 kWh saved per year per physical centre
    const warehouseEnergySaved = physicalCentresBypassed * 4010 * activeYearsProj;
    const paperManufacturingEnergySaved = totalSheetsSaved * 0.08;
    const totalEnergykWhSaved = warehouseEnergySaved + paperManufacturingEnergySaved;
    
    // 3. FOREST CONSERVATION (Trees saved)
    // 1 standard pine tree produces ~8,333 sheets of paper
    const treesSaved = Math.round(totalSheetsSaved / 8333);
    
    // 4. CARBON OFFSETS (CO2 saved)
    const co2KgSaved = totalSheetsSaved * 0.005 + (warehouseEnergySaved * 0.35); // 0.35 kg CO2 per grid kWh in Angola mix

    // Financial conversion (AOA) - average cost of water/power in commercial administrative scale plus paper cost
    const paperCostSavingsAOA = totalSheetsSaved * 25; // 25 Kz per printed sheet with toner etc.
    const waterCostSavingsAOA = (waterLitersSaved / 1000) * 850; // 850 Kz per m3 water commercial
    const energyCostSavingsAOA = totalEnergykWhSaved * 45; // 45 Kz per kWh commercial
    const totalFinancialSavingsKzAOA = paperCostSavingsAOA + waterCostSavingsAOA + energyCostSavingsAOA;

    return {
      totalSheetsSaved,
      waterLitersSaved,
      totalEnergykWhSaved,
      treesSaved,
      co2KgSaved,
      totalFinancialSavingsKzAOA,
      warehouseEnergySaved,
      paperManufacturingEnergySaved
    };
  }, [initialCitizensCount, pagesPerCivilProcess, physicalCentresBypassed, activeYearsProj]);

  // Generate projections for comparative visualization
  const projectionData = useMemo(() => {
    return Array.from({ length: 6 }, (_, index) => {
      const year = index + 1;
      const factor = year;
      const totalSheets = initialCitizensCount * pagesPerCivilProcess * factor;
      const waterSaved = totalSheets * 10;
      const energySaved = (physicalCentresBypassed * 4010 * factor) + (totalSheets * 0.08);
      return {
        name: `Ano ${year}`,
        'Água Economizada (Milhões Litros)': Math.round(waterSaved / 1000000 * 100) / 100,
        'Energia Economizada (MWh)': Math.round(energySaved / 1000 * 10) / 10,
        'Árvores Protegidas': Math.round(totalSheets / 8333)
      };
    });
  }, [initialCitizensCount, pagesPerCivilProcess, physicalCentresBypassed]);

  return (
    <div 
      className="bg-gradient-to-b from-[#060910] to-[#030407]/95 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 relative overflow-hidden" 
      id="sila-sustainability-report-container"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Title & Metadata Header section */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-emerald-500/15 border border-emerald-500/30 text-[9.5px] font-mono font-bold tracking-widest text-emerald-400 uppercase flex items-center gap-1">
              <Leaf className="w-3.5 h-3.5" /> Estatísticas Ecológicas Soberanas
            </span>
            <span className="text-[10px] font-mono text-slate-500">• Metas de Descarbonização de Angola</span>
          </div>
          <h4 className="text-lg font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Relatório de Sustentabilidade Ambiental
          </h4>
          <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
            A digitalização federada pelo SILA elimina o papel físico e a pesada pegada de climatização e refrigeração dos arquivos estatais provinciais. Veja abaixo a economia em tempo real de recursos hídricos e elétricos calculada diretamente sobre os <span className="text-emerald-400 font-mono font-bold">{initialCitizensCount.toLocaleString('pt-AO')}</span> cidadãos cadastrados.
          </p>
        </div>
      </div>

      {/* Grid: Primary Sustainability KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Water Resources */}
        <div className="p-4 bg-emerald-950/15 hover:bg-emerald-950/25 border border-emerald-500/10 hover:border-emerald-500/25 rounded-xl transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 pointer-events-none rounded-br-xl blur-lg transition-all group-hover:scale-125" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9.5px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Recúrsos Hídricos</span>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Poupança na produção do papel</p>
            </div>
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
              <Droplet className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-2xl font-bold font-mono text-emerald-400 block tracking-tight">
              {calculatedMetrics.waterLitersSaved.toLocaleString('pt-AO')} <span className="text-xs font-sans font-normal text-slate-400">L</span>
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 block pb-1 border-b border-white/5">
              ≈ {(calculatedMetrics.waterLitersSaved / 1000).toLocaleString('pt-AO', { maximumFractionDigits: 1 })} m³ de Água Pura
            </span>
            <p className="text-[9.5px] text-slate-400 font-sans leading-tight pt-1">
              Reflete a água de refino poupada ao reprimir <span className="text-white font-mono font-semibold">{calculatedMetrics.totalSheetsSaved.toLocaleString('pt-AO')}</span> páginas físicas de processos ordinários.
            </p>
          </div>
        </div>

        {/* Metric 2: Electricity Resources */}
        <div className="p-4 bg-blue-950/15 hover:bg-blue-950/25 border border-blue-500/10 hover:border-blue-500/25 rounded-xl transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-blue-500/5 pointer-events-none rounded-br-xl blur-lg transition-all group-hover:scale-125" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9.5px] font-mono text-blue-400 font-bold uppercase tracking-widest">Recursos Elétricos</span>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Centros de arquivo bypassados</p>
            </div>
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-400">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-2xl font-bold font-mono text-blue-400 block tracking-tight">
              {calculatedMetrics.totalEnergykWhSaved.toLocaleString('pt-AO', { maximumFractionDigits: 0 })} <span className="text-xs font-sans font-normal text-slate-400">kWh</span>
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 block pb-1 border-b border-white/5">
              ≈ {(calculatedMetrics.totalEnergykWhSaved / 1000).toLocaleString('pt-AO', { maximumFractionDigits: 1 })} MWh de Rede limpa
            </span>
            <p className="text-[9.5px] text-slate-400 font-sans leading-tight pt-1">
              Elimina eletricidade de refinação e climatização constante 24/7 de <span className="text-white font-mono font-semibold">{physicalCentresBypassed} salas físicas</span> de arquivo mortuário.
            </p>
          </div>
        </div>

        {/* Metric 3: Forest Preservation */}
        <div className="p-4 bg-teal-950/15 hover:bg-teal-950/25 border border-teal-500/10 hover:border-teal-500/25 rounded-xl transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-teal-500/5 pointer-events-none rounded-br-xl blur-lg transition-all group-hover:scale-125" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9.5px] font-mono text-teal-400 font-bold uppercase tracking-widest">Florestas Salvas</span>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Celulose de eucalipto evitada</p>
            </div>
            <div className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400">
              <Trees className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-2xl font-bold font-mono text-teal-300 block tracking-tight">
              {calculatedMetrics.treesSaved.toLocaleString('pt-AO')} <span className="text-xs font-sans font-normal text-slate-400">Árvores</span>
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 block pb-1 border-b border-white/5">
              Preservação ativa da biosfera
            </span>
            <p className="text-[9.5px] text-slate-400 font-sans leading-tight pt-1">
              Conversão fidedigna com base no rácio ecológico que poupa <span className="text-white">1 pinheiro adulto</span> para a cada 8.333 folhas de escritório suprimidas.
            </p>
          </div>
        </div>

        {/* Metric 4: Direct Financial Impact */}
        <div className="p-4 bg-amber-950/15 hover:bg-amber-950/25 border border-[#FFB800]/10 hover:border-[#FFB800]/25 rounded-xl transition-all duration-300 relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFB800]/5 pointer-events-none rounded-br-xl blur-lg transition-all group-hover:scale-125" />
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[9.5px] font-mono text-[#FFB800] font-bold uppercase tracking-widest">Impacto de Caixa</span>
              <p className="text-[10px] text-slate-500 font-sans mt-0.5">Economia pública direta</p>
            </div>
            <div className="p-1.5 rounded-lg bg-[#FFB800]/10 text-[#FFB800]">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 space-y-1">
            <span className="text-2xl font-bold font-mono text-[#FFB800] block tracking-tight">
              AOA {calculatedMetrics.totalFinancialSavingsKzAOA.toLocaleString('pt-AO', { maximumFractionDigits: 0 })}
            </span>
            <span className="text-[9.5px] font-mono text-slate-400 block pb-1 border-b border-white/5">
              Kz {(calculatedMetrics.totalFinancialSavingsKzAOA / 1000000).toLocaleString('pt-AO', { maximumFractionDigits: 2 })} Milhões Poupadinhos
            </span>
            <p className="text-[9.5px] text-slate-400 font-sans leading-tight pt-1">
              Valor cumulativo que regressa ao Orçamento Geral de Angola ao desonerar toners, papel resma, água e infraestrutura civil tributada.
            </p>
          </div>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Interactive Side: Simulation Dashboard and Parameters */}
        <div className="lg:col-span-5 bg-[#020305]/75 border border-white/5 rounded-xl p-4 sm:p-5 h-full space-y-5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-emerald-400" /> Parâmetros de Simulação
            </span>
            <span className="text-[9px] font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded-md font-bold">LCA Calculadora</span>
          </div>

          <p className="text-xs text-slate-400 leading-normal">
            Ajuste as estimativas operacionais reais para recalcular instantaneamente o benefício ecológico do SILA para o ecossistema angolano:
          </p>

          <div className="space-y-4 pt-1">
            {/* Control 1: Average pages per student registration portfolio */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Média de Papel por Cidadão/Dossier:
                </span>
                <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 px-2 py-0.5 rounded">
                  {pagesPerCivilProcess} folhas
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="15" 
                step="1"
                value={pagesPerCivilProcess} 
                onChange={(e) => {
                  setPagesPerCivilProcess(Number(e.target.value));
                  triggerSound('hover');
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-emerald-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Min: 1 Folha</span>
                <span>Max: 15 Folhas</span>
              </div>
            </div>

            {/* Control 2: Storage Rooms bypassed (climatized archives saved) */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Salas de Depósito Físico Evitadas:
                </span>
                <span className="text-blue-400 font-bold font-mono bg-blue-500/10 px-2 py-0.5 rounded">
                  {physicalCentresBypassed} unidades
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="45" 
                step="1"
                value={physicalCentresBypassed} 
                onChange={(e) => {
                  setPhysicalCentresBypassed(Number(e.target.value));
                  triggerSound('hover');
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-400"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Min: 1 Depósito</span>
                <span>Max: 45 Depósitos</span>
              </div>
            </div>

            {/* Control 3: Timeframe Projection */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-300 font-medium flex items-center gap-1">
                  Horizonte Temporal de Projeção:
                </span>
                <span className="text-[#FFB800] font-bold font-mono bg-[#FFB800]/10 px-2 py-0.5 rounded">
                  {activeYearsProj} {activeYearsProj === 1 ? 'Ano' : 'Anos'}
                </span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="10" 
                step="1"
                value={activeYearsProj} 
                onChange={(e) => {
                  setActiveYearsProj(Number(e.target.value));
                  triggerSound('hover');
                }}
                className="w-full h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-[#FFB800]"
              />
              <div className="flex justify-between text-[9px] text-slate-500 font-mono">
                <span>Min: 1 Ano</span>
                <span>Max: 10 Anos</span>
              </div>
            </div>
          </div>

          <div className="p-3 bg-[#05070a] border border-white/5 rounded-xl space-y-1.5 text-[10.5px] text-slate-400 font-sans">
            <span className="font-semibold text-slate-200 flex items-center gap-1 font-mono uppercase tracking-wider text-[9.5px]">
              <Calculator className="w-3.5 h-3.5 text-blue-400" /> Equações de Sustentabilidade
            </span>
            <p className="leading-relaxed">
              Consumo Hídrico Estimado: Pelo LCA, cada página A4 consome <strong className="text-emerald-400">10 Litros</strong> no processo floresta-papel. Centros físicos climatizados acumulam consumo de energia linear de ar-condicionado de precisão para evitar fungos nas folhas de arquivos estatais herméticos de Angola.
            </p>
          </div>
        </div>

        {/* Right Main Column: 3D-Like projection charts and detailed breakdowns */}
        <div className="lg:col-span-7 bg-[#020305]/95 border border-white/10 rounded-xl p-4 sm:p-5 space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <div>
                <h5 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Crescimento de Economia Verde e de Recursos</h5>
                <p className="text-[9.5px] text-slate-500 font-sans">Cálculo de economia exponencial ao longo de 6 anos</p>
              </div>
            </div>

            {/* Custom mini interactive tabs */}
            <div className="flex bg-white/5 border border-white/10 rounded-lg p-0.5 text-[9px] font-mono select-none">
              <button
                type="button"
                onClick={() => { setActiveTab('total'); triggerSound('click'); }}
                className={`px-2.5 py-1 rounded font-bold transition-all ${activeTab === 'total' ? 'bg-[#FFB800] text-black shadow' : 'text-slate-400'}`}
              >
                ÁREA TOTAL
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('water'); triggerSound('click'); }}
                className={`px-2.5 py-1 rounded font-bold transition-all ${activeTab === 'water' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400'}`}
              >
                HÍDRICA (Água)
              </button>
              <button
                type="button"
                onClick={() => { setActiveTab('energy'); triggerSound('click'); }}
                className={`px-2.5 py-1 rounded font-bold transition-all ${activeTab === 'energy' ? 'bg-blue-600 text-white shadow' : 'text-slate-400'}`}
              >
                ELÉTRICA (kWh)
              </button>
            </div>
          </div>

          {/* Area Chart representation */}
          <div className="h-64 sm:h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              {activeTab === 'total' ? (
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="totalColorTrees" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d14', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace', color: '#fff' }} />
                  <Area type="monotone" name="Árvores Protegidas Cumulativas" dataKey="Árvores Protegidas" stroke="#10b981" strokeWidth={2.5} fillOpacity={1} fill="url(#totalColorTrees)" />
                </AreaChart>
              ) : activeTab === 'water' ? (
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="waterColorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#14b8a6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tickFormatter={(val) => `${val}M L`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d14', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace', color: '#fff' }} />
                  <Area type="monotone" name="Milhões de Litros Poupatinhos" dataKey="Água Economizada (Milhões Litros)" stroke="#14b8a6" strokeWidth={2.5} fillOpacity={1} fill="url(#waterColorGrad)" />
                </AreaChart>
              ) : (
                <AreaChart data={projectionData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="energyColorGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
                  <XAxis dataKey="name" stroke="rgba(255,255,255,0.2)" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <YAxis stroke="rgba(255,255,255,0.2)" tickFormatter={(val) => `${val} MWh`} tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 9, fontFamily: 'monospace' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#090d14', border: '1px solid rgba(255,255,255,0.1)', fontSize: '10px', fontFamily: 'monospace', color: '#fff' }} />
                  <Area type="monotone" name="Energia Suprimida (MWh)" dataKey="Energia Economizada (MWh)" stroke="#3b82f6" strokeWidth={2.5} fillOpacity={1} fill="url(#energyColorGrad)" />
                </AreaChart>
              )}
            </ResponsiveContainer>
          </div>

          {/* Environmental takeaways and legacy text */}
          <div className="flex items-center gap-3 bg-[#05070a]/80 border border-white/5 rounded-xl p-3">
            <div className="p-2 rounded bg-emerald-500/10 text-emerald-400 shrink-0 h-fit">
              <Trees className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <span className="text-[9.5px] font-mono text-emerald-400 uppercase tracking-wider block">O Legado Ecológico SILA</span>
              <p className="text-[10.5px] text-slate-400 font-sans leading-normal">
                Ao migrar os servidores e a indexação de ficheiros para microsserviços integrados de alta densidade no MAT, Angola alinha as metas de modernização do Estado aos Objetivos de Desenvolvimento Sustentável (ODS) da ONU. Menos carros oficiais carregando malotes, menos consumo em ar de exaustão de silos físicos, maior soberania civil digital.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
