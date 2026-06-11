import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { PILOT_PHASES } from '../data/silaData';
import { PilotPhase } from '../types';
import { 
  Shield, Calendar, Users, Map, CheckCircle2, Circle, TrendingUp, Compass, 
  FileText, ChevronDown, ChevronUp, MapPin, Landmark, Cpu, Database, 
  AlertCircle, FileSpreadsheet, KeyRound, Download, Check, Info, FileSignature, HelpCircle,
  TrendingDown, Coins, Percent, ArrowRight, LayoutGrid, Activity, Award, Sparkles
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import PilotProtocolVisualizer from './PilotProtocolVisualizer';
import SovereignTooltip from './SovereignTooltip';

interface PilotProposalsProps {
  playAudioClick?: () => void;
}

interface MunicipalityData {
  name: string;
  schools: number;
  students: number;
  techStatus: string;
  connectivity: 'Fibra Óptica' | 'VSAT Satélite' | 'Micro-ondas' | 'Angosat-2' | 'Offline Sync';
  riskLevel: 'Baixo' | 'Moderado' | 'Contingenciado';
  notes: string;
}

const HUAMBO_MUNICIPALITIES: MunicipalityData[] = [
  { name: 'Huambo (Sede)', schools: 124, students: 41200, techStatus: 'Fibra Óptica Ativa & Servidores Locais Redundantes', connectivity: 'Fibra Óptica', riskLevel: 'Baixo', notes: 'Polo principal de operações e monitorização provincial em tempo real.' },
  { name: 'Caála', schools: 68, students: 22100, techStatus: 'Ligação Micro-ondas Estável de Alta Capacidade', connectivity: 'Micro-ondas', riskLevel: 'Baixo', notes: 'Sincronização imediata ligada ao anel de fibra da sede.' },
  { name: 'Bailundo', schools: 82, students: 26500, techStatus: 'Antena de Banda Larga e Satélite dedicada', connectivity: 'VSAT Satélite', riskLevel: 'Moderado', notes: 'Grande densidade de matrículas assistidas com assistência móvel.' },
  { name: 'Ekunha', schools: 24, students: 6800, techStatus: 'Cache Offline Local com upload agendado', connectivity: 'Offline Sync', riskLevel: 'Contingenciado', notes: 'Utiliza motores locais SQLite que consolidam dados via rádio USB pendular.' },
  { name: 'Longonjo', schools: 30, students: 8200, techStatus: 'Cisterna móvel de dados e ligação Angosat-2', connectivity: 'Angosat-2', riskLevel: 'Moderado', notes: 'Sinergia com o sector de Geodésia nacional.' },
  { name: 'Ukuma', schools: 22, students: 5900, techStatus: 'Gateway de rede Mesh e sincronização noturna', connectivity: 'Offline Sync', riskLevel: 'Contingenciado', notes: 'Baixa latência para envio do diário escolar simplificado.' },
  { name: 'Chinjenje', schools: 15, students: 3400, techStatus: 'Banda estreita e concentradores de energia solar', connectivity: 'Micro-ondas', riskLevel: 'Contingenciado', notes: 'Suporte energético garante funcionamento do SILA nas salas administrativas.' },
  { name: 'Chicala-Choloanga', schools: 31, students: 9100, techStatus: 'Interligação de rádio ponto-a-ponto', connectivity: 'Micro-ondas', riskLevel: 'Moderado', notes: 'Monitoramento escolar interligador via sede provincial.' },
  { name: 'Catchiungo', schools: 35, students: 10300, techStatus: 'Antena VSAT de dupla portadora e painéis fotovoltaicos', connectivity: 'VSAT Satélite', riskLevel: 'Moderado', notes: 'Frequência de atualização de dados de 6 em 6 horas.' },
  { name: 'Mungo', schools: 28, students: 7800, techStatus: 'Lançamento piloto de antenas de curto alcance', connectivity: 'VSAT Satélite', riskLevel: 'Moderado', notes: 'Garante zero papel desde o primeiro dia de aulas.' },
  { name: 'Londuimbali', schools: 31, students: 8900, techStatus: 'Feixe terrestre de rádio e backhaul redundante', connectivity: 'Angosat-2', riskLevel: 'Moderado', notes: 'Ligação limpa para sincronização célere de diplomas.' }
];

const MINISTERIAL_CLAUSES = [
  {
    target: 'Homologação Estatutária com GEPE-MED',
    description: 'Os dados recolhidos pelo SILA no Huambo alimentam nativamente e de forma automatizada o Gabinete de Estudos, Planeamento e Estatística (GEPE) do MED, revogando o preenchimento manual de inquéritos anuais em papel.',
    legalBasis: 'Decreto Presidencial de Simplificação Administrativa para Educação Angola'
  },
  {
    target: 'Soberania Pedagógica e Assinatura Estatal',
    description: 'A atribuição de notas, cadernetas e certificados emitidos no Huambo possui validade executiva imediata com assinatura digital qualificada pela Delegação Provincial, dispensando autenticação de cartórios.',
    legalBasis: 'Regulamento Geral do Sistema de Avaliação Letiva'
  },
  {
    target: 'Salvaguarda de Identidade e RGPD Juvenil',
    description: 'Alojamento centralizado no Centro de Dados Soberano, gerido pela infraestrutura nacional de telecomunicações do MAT. Proibido qualquer tráfego de metadados escolares fora da rede pública angolana.',
    legalBasis: 'Lei da Proteção de Dados de Carácter Pessoal em Angola (Lei nº 22/11)'
  },
  {
    target: 'Plano de Resiliência Energética e Conectividade',
    description: 'A equipa técnica do SILA garante a distribuição de hardware pré-carregado com buffers criptográficos para o MED. Isso permite que mesmo sem qualquer acesso à internet, o sistema escolar funcione por até 30 dias de forma totalmente isolada.',
    legalBasis: 'Protocolo de Contingência de Acesso Digital e Inclusão Escolar'
  }
];

interface OperationalSavingsData {
  category: string;
  traditionalCost: number; // M AOA (Milhões de Kwanzas)
  silaCost: number; // M AOA (Milhões de Kwanzas)
  details: string;
  sector: 'Educação' | 'Saúde' | 'Administração';
}

const SAVINGS_PROJECTIONS_DATA: Record<'huambo' | 'luanda', {
  provinceName: string;
  currency: string;
  description: string;
  items: OperationalSavingsData[];
}> = {
  huambo: {
    provinceName: 'Província do Huambo (Nó Piloto)',
    currency: 'Milhões de Kwanza (M AOA)',
    description: 'Impacto direto no polo centralizador do Huambo unificando as áreas de educação, saúde e administração com o sistema SILA.',
    items: [
      { category: 'Cadernetas & Manuais', traditionalCost: 120, silaCost: 15, details: 'Impressão física e dossiers de registro acadêmico unificados.', sector: 'Educação' },
      { category: 'Rastreio de Merendas', traditionalCost: 110, silaCost: 12, details: 'Auditoria eletrônica contra desvios e estudantes fictícios.', sector: 'Educação' },
      { category: 'Triagem de Notas', traditionalCost: 60, silaCost: 8, details: 'Lançamento letivo imediato fiduciário sem trâmites de papel.', sector: 'Educação' },
      { category: 'Prontuários de Saúde', traditionalCost: 90, silaCost: 10, details: 'Fichas clínicas e históricos de vacinação descentralizados.', sector: 'Saúde' },
      { category: 'Faturamento Hospitalar', traditionalCost: 75, silaCost: 15, details: 'Controle de suprimentos médicos e guias do Ministério da Saúde.', sector: 'Saúde' },
      { category: 'Auditoria de Óbitos', traditionalCost: 50, silaCost: 5, details: 'Comunicação instantânea com o registro civil para óbitos e nascimentos.', sector: 'Saúde' },
      { category: 'Logística de Ofício', traditionalCost: 95, silaCost: 18, details: 'Envios por estafetas e correio físico de pareceres municipais.', sector: 'Administração' },
      { category: 'Papel Timbrado Selado', traditionalCost: 65, silaCost: 8, details: 'Selagem, arquivamento físico e taxas consulares desmaterializadas.', sector: 'Administração' }
    ]
  },
  luanda: {
    provinceName: 'Província de Luanda (Escalabilidade)',
    currency: 'Milhões de Kwanza (M AOA)',
    description: 'Projeção para a escala de alta densidade integrando os principais subsetores da saúde, educação e governos municipais.',
    items: [
      { category: 'Cadernetas & Manuais', traditionalCost: 580, silaCost: 45, details: 'Processos de emissão escolar eletrônica a nível metropolitano.', sector: 'Educação' },
      { category: 'Rastreio de Merendas', traditionalCost: 450, silaCost: 40, details: 'Logística antifraude sistêmica para mais de 1,2M de alunos.', sector: 'Educação' },
      { category: 'Triagem de Notas', traditionalCost: 310, silaCost: 30, details: 'Automatização integrada de diplomas e transição curricular.', sector: 'Educação' },
      { category: 'Prontuários de Saúde', traditionalCost: 490, silaCost: 55, details: 'Interconexão de bases clínicas hospitalares das administrações.', sector: 'Saúde' },
      { category: 'Faturamento Hospitalar', traditionalCost: 380, silaCost: 45, details: 'Guia tributária hospitalar e auditorias médicas simplificadas.', sector: 'Saúde' },
      { category: 'Auditoria de Óbitos', traditionalCost: 210, silaCost: 20, details: 'Cruzamento unificado de fichas clínicas e banco civil em Luanda.', sector: 'Saúde' },
      { category: 'Logística de Ofício', traditionalCost: 410, silaCost: 55, details: 'Correios e malotes físicos mitigados por canais de fibra dedicados.', sector: 'Administração' },
      { category: 'Papel Timbrado Selado', traditionalCost: 360, silaCost: 40, details: 'Certificados, carimbos notariais digitais e guias automatizadas.', sector: 'Administração' }
    ]
  }
};

export default function PilotProposals({ playAudioClick }: PilotProposalsProps) {
  const [selectedPhase, setSelectedPhase] = useState<PilotPhase>(PILOT_PHASES[0]);
  const [showOfficialProtocol, setShowOfficialProtocol] = useState<boolean>(false);
  const [burstCount, setBurstCount] = useState<number>(0);
  
  // Interactive sub-tabs for the deep dive
  const [pilotSubTab, setPilotSubTab] = useState<'overview' | 'municipalities' | 'med-protocols' | 'savings'>('overview');
  
  // Savings Province Selection
  const [selectedSavingsProvince, setSelectedSavingsProvince] = useState<'huambo' | 'luanda'>('huambo');

  // Sector Filter Selection: all | Educação | Saúde | Administração
  const [selectedSector, setSelectedSector] = useState<'all' | 'Educação' | 'Saúde' | 'Administração'>('all');
  
  // Municipality details selector
  const [selectedMuniIdx, setSelectedMuniIdx] = useState<number>(0);
  const selectedMuni = HUAMBO_MUNICIPALITIES[selectedMuniIdx];

  // Derived savings indicators based on selected province and active sector filter
  const rawSavingsItems = SAVINGS_PROJECTIONS_DATA[selectedSavingsProvince].items;
  const filteredSavingsItems = selectedSector === 'all'
    ? rawSavingsItems
    : rawSavingsItems.filter(item => item.sector === selectedSector);

  const totalTraditional = filteredSavingsItems.reduce((acc, item) => acc + item.traditionalCost, 0);
  const totalSila = filteredSavingsItems.reduce((acc, item) => acc + item.silaCost, 0);
  const netEconomy = totalTraditional - totalSila;
  const economyPercent = totalTraditional > 0 ? ((netEconomy / totalTraditional) * 100).toFixed(0) : '0';

  // Derived Goal progress for Huambo & Luanda
  const savingsTarget = selectedSavingsProvince === 'huambo' ? 500 : 2500;
  const goalPercentVal = (netEconomy / savingsTarget) * 100;
  const goalPercentStr = goalPercentVal.toFixed(1);
  const progressWidth = Math.min(100, Math.max(0, goalPercentVal));

  const handlePhaseChange = (phase: PilotPhase) => {
    setSelectedPhase(phase);
    if (playAudioClick) playAudioClick();
  };

  const handleToggleProtocol = () => {
    setShowOfficialProtocol(!showOfficialProtocol);
    if (playAudioClick) playAudioClick();
  };

  const handleExportCSV = () => {
    if (playAudioClick) playAudioClick();

    const hbe = SAVINGS_PROJECTIONS_DATA.huambo.items.map(item => ({
      province: 'Huambo',
      category: item.category,
      sector: item.sector,
      traditional: item.traditionalCost,
      sila: item.silaCost,
      economy: item.traditionalCost - item.silaCost,
      details: item.details
    }));

    const lda = SAVINGS_PROJECTIONS_DATA.luanda.items.map(item => ({
      province: 'Luanda',
      category: item.category,
      sector: item.sector,
      traditional: item.traditionalCost,
      sila: item.silaCost,
      economy: item.traditionalCost - item.silaCost,
      details: item.details
    }));

    const records = [...hbe, ...lda];
    const headers = ['Província', 'Categoria', 'Setor', 'Custo Tradicional (M AOA)', 'Custo SILA (M AOA)', 'Economia Líquida (M AOA)', 'Detalhes'];
    
    const csvRows = [
      headers.join(','),
      ...records.map(r => [
        `"${r.province}"`,
        `"${r.category}"`,
        `"${r.sector}"`,
        r.traditional,
        r.sila,
        r.economy,
        `"${r.details.replace(/"/g, '""')}"`
      ].join(','))
    ];

    const csvContent = csvRows.join('\n');
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SILA_Metricas_Economia_Huambo_Luanda_2026.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const CustomSavingsTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#05070c]/95 border border-white/10 p-3 rounded-xl shadow-lg backdrop-blur-md text-[11px] font-mono select-none">
          <p className="text-slate-400 font-semibold mb-1 border-b border-white/5 pb-1 uppercase tracking-wider">{label}</p>
          <p className="text-rose-400 font-sans flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
            Tradicional: <strong>{payload[0].value} M AOA</strong>
          </p>
          <p className="text-emerald-400 font-sans flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            SILA Soberano: <strong>{payload[1].value} M AOA</strong>
          </p>
          <p className="text-[#FFB800] font-sans flex items-center gap-1.5 mt-1 border-t border-white/5 pt-1 font-bold">
            Poupança: <strong>{(payload[0].value - payload[1].value).toFixed(0)} M AOA</strong>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8 w-full transition-all duration-500 ease-out transform hover:scale-[1.01] origin-center" id="government-pilot-proposals-container">
      
      {/* Title block */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/5 pb-6">
        <div>
          <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1.5 block font-bold">
            Ficha de Desenvolvimento e Governação Provincial
          </span>
          <h2 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight">
            Nó de Ativação Piloto (MAT × MED)
          </h2>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Consulte o planeamento rigoroso, a cobertura infraestrutural do Huambo e os protocolos oficiais celebrados com o Ministério da Educação (MED) para garantir a transição digital ponta a ponta sem ruídos.
          </p>
        </div>

        {/* Sub-tab interactive selectors */}
        <div className="flex flex-wrap bg-[#05070a] border border-white/10 p-1 rounded-xl shrink-0 gap-1 md:gap-0">
          <button
            onClick={() => { setPilotSubTab('overview'); if (playAudioClick) playAudioClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              pilotSubTab === 'overview' 
                ? 'bg-blue-600 font-semibold text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Fases Globais
          </button>
          <button
            onClick={() => { setPilotSubTab('municipalities'); if (playAudioClick) playAudioClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              pilotSubTab === 'municipalities' 
                ? 'bg-blue-600 font-semibold text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            11 Municípios Huambo
          </button>
          <button
            onClick={() => { setPilotSubTab('med-protocols'); if (playAudioClick) playAudioClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              pilotSubTab === 'med-protocols' 
                ? 'bg-[#FFB800] text-black font-semibold' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Protocolos MED
          </button>
          <button
            onClick={() => { setPilotSubTab('savings'); if (playAudioClick) playAudioClick(); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              pilotSubTab === 'savings' 
                ? 'bg-emerald-600 font-semibold text-white' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Economia de Recursos
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {pilotSubTab === 'overview' && (
          <motion.div 
            key="overview-panels"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start relative z-10"
          >
            {/* Left side: Professional Interactive Phase Stepper */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-[#05070a]/40 border border-white/5 p-4 rounded-xl">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] block mb-1">
                  Enquadramento Estratégico
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  A ativação nacional do SILA inicia-se no Huambo como modelo fiduciário estrito antes de avançar para as províncias costeiras e o resto de Angola.
                </p>
              </div>

              {/* Phase buttons stacked */}
              <div className="space-y-2.5">
                {PILOT_PHASES.map((phase) => {
                  const isSelected = selectedPhase.id === phase.id;
                  const isReady = phase.status === 'Pronto';
                  return (
                    <button
                      key={phase.id}
                      onClick={() => handlePhaseChange(phase)}
                      className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden block cursor-pointer ${
                        isSelected
                          ? 'bg-white/[0.02] border-white/20 shadow-lg'
                          : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                      }`}
                    >
                      {/* Visual side accent on selected */}
                      {isSelected && (
                        <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500"></div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
                          {phase.phase} • {phase.timeline}
                        </span>
                        {isReady ? (
                          <span className="text-[9px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded uppercase">
                            PRONTO A INICIAR
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-0.5 rounded uppercase">
                            PLANEADO
                          </span>
                        )}
                      </div>
                      
                      <h4 className={`text-base font-sans font-semibold mt-1 transition-colors ${
                        isSelected ? 'text-slate-100' : 'text-slate-300'
                      }`}>
                        {phase.title}
                      </h4>
                      
                      <span className="text-xs text-slate-400 block mt-0.5 font-sans">
                        Polo: {phase.locationName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right side: Phase detailed HUD with beautiful cards */}
            <div className="lg:col-span-8 bg-white/[0.01] p-6 sm:p-8 rounded-2xl border border-white/5 bg-gradient-to-br from-[#05070A] via-[#05070A]/30 to-blue-950/5 shadow-2xl relative overflow-hidden">
              <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

              <div className="space-y-6">
                {/* Visual Header */}
                <div className="border-b border-white/5 pb-5">
                  <div className="flex items-center gap-2 text-xs font-mono text-[#FFB800] tracking-wider mb-1">
                    <Compass className="w-4 h-4 animate-spin-slow" />
                    CONTEÚDO DE MODELAGEM TERRITORIAL DA {selectedPhase.phase}
                  </div>
                  <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 italic">
                    {selectedPhase.title}
                  </h4>
                  <p className="text-sm text-slate-300 mt-2 font-sans leading-relaxed">
                    {selectedPhase.scope}
                  </p>
                </div>

                {/* Structured Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {selectedPhase.metrics.map((metric, idx) => (
                    <div key={idx} className="bg-[#05070A] p-4 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">
                        {metric.label}
                      </span>
                      <span className="text-lg sm:text-2xl font-sans font-bold text-slate-200 mt-1 block">
                        {metric.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Strategic Phase Goal Cards */}
                <div className="bg-blue-600/[0.02] p-5 rounded-xl border border-blue-500/10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-blue-400 font-bold uppercase tracking-wider flex items-center gap-2">
                      <Shield className="w-4 h-4 text-amber-500" />
                      LINHAS SOBERANAS DO ESTADO
                    </span>
                    <span className="text-[9px] font-mono text-slate-500">
                      MED × MAT COORDENAÇÃO
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans text-slate-300 leading-relaxed">
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-white/[0.02] rounded border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#FFB800] font-mono text-[9px] font-bold">1</div>
                      <p>
                        <strong className="text-slate-200">Sincronização Cadastral Estrita:</strong> Sincronizar bases civis nos primeiros 90 dias, mitigando identidades fictícias e garantindo zero duplicação escolar no ato da matrícula.
                      </p>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-5 h-5 bg-white/[0.02] rounded border border-white/10 flex items-center justify-center shrink-0 mt-0.5 text-[#FFB800] font-mono text-[9px] font-bold">2</div>
                      <p>
                        <strong className="text-slate-200">Auditabilidade Descentralizada:</strong> Rastreio transparente de orçamentos por aluno inscrito direto do MAT ao órgão financeiro municipal, combatendo a ociosidade infraestrutural.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visual indicator showing progress roadmap bar */}
                <div className="space-y-2 pt-2">
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                    <span>ESTADO DO PILOTO NACIONAL</span>
                    <span>FASE ATUAL: {selectedPhase.id === 1 ? '75% SEGURO (NÓ HUAMBO)' : selectedPhase.id === 2 ? 'PLANEAMENTO LOGÍSTICO BÁSICO' : 'ESCALAÇÃO PREVISTA'}</span>
                  </div>
                  <div className="h-2 bg-[#05070A] rounded-full overflow-hidden flex">
                    <div 
                      className={`h-full transition-all duration-700 ${
                        selectedPhase.id >= 1 ? 'bg-gradient-to-r from-blue-600 to-amber-500' : 'bg-slate-800'
                      }`}
                      style={{ width: selectedPhase.id === 3 ? '100%' : selectedPhase.id === 2 ? '65%' : '35%' }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 11 Huambo Municipalities detail tab */}
        {pilotSubTab === 'municipalities' && (
          <motion.div 
            key="municipalities-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* List of 11 Municipalities on the left */}
            <div className="lg:col-span-5 space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block font-bold mb-2">
                Municípios do Huambo sob Cobertura (Fase 1)
              </span>

              <div className="space-y-1.5">
                {HUAMBO_MUNICIPALITIES.map((muni, idx) => {
                  const isSelected = selectedMuniIdx === idx;
                  return (
                    <button
                      key={muni.name}
                      onClick={() => setSelectedMuniIdx(idx)}
                      className={`w-full text-left p-3 rounded-lg border flex items-center justify-between transition-all duration-200 cursor-pointer ${
                        isSelected 
                          ? 'bg-blue-600/10 border-blue-500/50 text-white' 
                          : 'bg-[#05070a]/40 border-white/5 hover:border-white/10 hover:bg-[#05070a]/80 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className={`w-3.5 h-3.5 ${isSelected ? 'text-[#FFB800]' : 'text-slate-500'}`} />
                        <span className={`text-xs font-sans font-medium ${isSelected ? 'text-white' : 'text-slate-300'}`}>
                          {muni.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono bg-white/5 border border-white/5 px-1.5 py-0.5 rounded text-slate-300">
                          {muni.schools} esc.
                        </span>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          muni.riskLevel === 'Baixo' 
                            ? 'bg-emerald-500' 
                            : muni.riskLevel === 'Moderado' 
                            ? 'bg-[#FFB800]' 
                            : 'bg-rose-500'
                        }`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Municipality detailed HUD */}
            <div className="lg:col-span-7 bg-[#05070a]/50 p-6 rounded-2xl border border-white/5 space-y-6 flex flex-col justify-between min-h-[420px]">
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-white/5 pb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-xl bg-blue-600/10 flex items-center justify-center text-[#FFB800] border border-blue-500/20">
                      <Map className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] font-mono text-slate-500 block uppercase">Foco Municipal Sila</span>
                      <h3 className="text-lg font-sans font-bold text-slate-100">{selectedMuni.name}</h3>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono px-2.5 py-1 rounded font-bold border ${
                    selectedMuni.riskLevel === 'Baixo' 
                      ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                      : selectedMuni.riskLevel === 'Moderado'
                      ? 'text-amber-400 bg-amber-500/10 border-amber-500/20'
                      : 'text-rose-400 bg-rose-500/10 border-rose-500/20'
                  }`}>
                    RISCO INFRAESTRUTURAL: {selectedMuni.riskLevel.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#020305]/80 p-3.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">CENSO ESCOLAR ESTIMADO</span>
                    <span className="text-xl font-sans font-bold text-white">{selectedMuni.students.toLocaleString('pt-PT')} alunos</span>
                    <p className="text-[10px] text-slate-500 font-sans mt-1">Candidatos a vaga unificada garantida.</p>
                  </div>
                  <div className="bg-[#020305]/80 p-3.5 rounded-xl border border-white/5">
                    <span className="text-[10px] font-mono text-slate-400 block mb-1">MÉTODO DE CONECTIVIDADE</span>
                    <span className="text-xl font-sans font-bold text-[#FFB800] flex items-center gap-1">
                      <Cpu className="w-4 h-4 inline" /> {selectedMuni.connectivity}
                    </span>
                    <p className="text-[10px] text-slate-500 font-sans mt-1">{selectedMuni.techStatus}</p>
                  </div>
                </div>

                <div className="bg-white/[0.01] border border-white/5 p-4 rounded-xl">
                  <span className="text-[10.5px] font-mono text-blue-400 uppercase tracking-wider block mb-1.5 font-bold">
                    Nota Técnica de Operabilidade
                  </span>
                  <p className="text-xs text-slate-300 font-sans leading-relaxed">
                    {selectedMuni.notes}
                  </p>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 flex items-center gap-3 text-[10px] font-mono text-slate-500">
                <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Régula e assegura sincronização transparente por buffer seguro com o Huambo Central (FUC).</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* MED protocols list tab */}
        {pilotSubTab === 'med-protocols' && (
          <motion.div 
            key="med-protocols-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6"
          >
            <div className="bg-amber-500/5 border border-[#FFB800]/20 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFB800]/10 border border-[#FFB800]/30 flex items-center justify-center text-[#FFB800] shrink-0">
                  <Landmark className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-slate-100">Cooperação e Vinculação Estatal de Legitimidade</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-0.5">
                    Para garantir que o SILA não seja apenas mais uma aplicação isolada, foram formalizados 4 protocolos de operação mútua imperativa com o Ministério de Tutela na Educação.
                  </p>
                </div>
              </div>

              <span className="text-[10px] font-mono bg-amber-500/10 border border-[#FFB800]/30 text-[#FFB800] px-3 py-1 rounded-full uppercase shrink-0 font-bold">
                Acordado Bilateralmente
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {MINISTERIAL_CLAUSES.map((clause, idx) => (
                <div 
                  key={idx} 
                  className="bg-[#05070a]/40 border border-white/5 p-5 rounded-xl space-y-3 hover:border-amber-500/20 transition-all duration-300 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-blue-600/5 rounded-bl-full pointer-events-none" />
                  
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[10px] font-mono font-bold text-blue-400">
                      {idx + 1}
                    </span>
                    <h5 className="text-xs font-mono text-[#FFB800] uppercase font-bold tracking-wider">
                      {clause.target}
                    </h5>
                  </div>

                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {clause.description}
                  </p>

                  <div className="flex items-center gap-1.5 text-[9.5px] font-mono text-slate-500 bg-[#020305]/60 px-2 py-1 rounded w-fit">
                    <FileSignature className="w-3.5 h-3.5 text-blue-500" />
                    <span>Reserva Legal: {clause.legalBasis}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Savings projection tab */}
        {pilotSubTab === 'savings' && (
          <motion.div
            key="savings-view"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-6 w-full"
          >
            {/* Context/Intro Header card */}
            <div className="bg-emerald-950/25 border border-emerald-500/15 p-5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-sans font-bold text-slate-100">Projeção de Eficiência e Economia Operacional (AOA)</h4>
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl mt-0.5">
                    Análise comparativa quantificando a redução de custos de processamento e verificação documental após a implantação soberana do SILA.
                  </p>
                </div>
              </div>

              {/* Province Selector within Savings View */}
              <div className="flex bg-[#020305] border border-white/10 p-1 rounded-xl shrink-0 gap-1 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => { setSelectedSavingsProvince('huambo'); if (playAudioClick) playAudioClick(); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedSavingsProvince === 'huambo'
                      ? 'bg-emerald-600 font-semibold text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Huambo (Piloto)
                </button>
                <button
                  type="button"
                  onClick={() => { setSelectedSavingsProvince('luanda'); if (playAudioClick) playAudioClick(); }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer ${
                    selectedSavingsProvince === 'luanda'
                      ? 'bg-emerald-600 font-semibold text-white'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  Luanda (Projeção)
                </button>
              </div>
            </div>

            {/* Filtro por Setor Controller Bar */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 rounded-2xl bg-[#05070a]/40 border border-white/5">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] font-bold block">
                  Filtrar Projeção de Economia por Setor
                </span>
                <p className="text-xs text-slate-400">
                  Refine a visualização dos indicadores econômicos focados especificamente nos setores integrados.
                </p>
              </div>

              {/* Selector buttons Group */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
                <div className="flex flex-wrap bg-[#020305]/80 border border-white/10 p-1 rounded-xl gap-1 select-none flex-1 sm:flex-initial">
                  <button
                    type="button"
                    onClick={() => { setSelectedSector('all'); if (playAudioClick) playAudioClick(); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                      selectedSector === 'all'
                        ? 'bg-blue-600 font-semibold text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                    Todos Setores
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedSector('Educação'); if (playAudioClick) playAudioClick(); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                      selectedSector === 'Educação'
                        ? 'bg-blue-600 font-semibold text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Landmark className="w-3.5 h-3.5" />
                    Educação
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedSector('Saúde'); if (playAudioClick) playAudioClick(); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                      selectedSector === 'Saúde'
                        ? 'bg-[#FFB800] text-black font-semibold'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Activity className="w-3.5 h-3.5" />
                    Saúde
                  </button>
                  <button
                    type="button"
                    onClick={() => { setSelectedSector('Administração'); if (playAudioClick) playAudioClick(); }}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider transition-all duration-200 cursor-pointer flex items-center justify-center gap-1.5 flex-1 sm:flex-initial ${
                      selectedSector === 'Administração'
                        ? 'bg-emerald-600 font-semibold text-white'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" />
                    Administração
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3.5 py-1.5 bg-emerald-500/10 hover:bg-emerald-500/20 active:scale-95 border border-emerald-500/20 hover:border-emerald-500/40 rounded-xl text-[10px] font-mono font-bold text-emerald-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  title="Exportar dados brutos das projeções offline em formato CSV"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>EXPORTAR CSV</span>
                </button>
              </div>
            </div>

            {/* Top Cards for Big Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-[#05070a]/90 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Custo Tradicional Anual</span>
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-rose-400">
                    {totalTraditional} M AOA
                  </span>
                </div>
                <p className="text-[10.5px] text-slate-500 font-sans mt-3">
                  Pelo modelo tradicional cobrindo as despesas desnecessárias de papelada, impressão e burocracia logística.
                </p>
              </div>

              <div className="bg-[#05070a]/90 p-5 rounded-2xl border border-white/5 flex flex-col justify-between hover:border-white/10 transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-500/5 rounded-bl-full pointer-events-none" />
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Custo Otimizado SILA</span>
                  <span className="text-2xl sm:text-3xl font-sans font-bold text-emerald-400">
                    {totalSila} M AOA
                  </span>
                </div>
                <p className="text-[10.5px] text-emerald-400/80 font-sans mt-3 font-semibold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> Servidores unificados fiduciários e barramento local digital.
                </p>
              </div>

              <div className="bg-emerald-950/10 p-5 rounded-2xl border border-emerald-500/20 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                <div>
                  <span className="text-[10px] uppercase font-mono text-emerald-400 block mb-1 font-bold">Economia Líquida Estimada</span>
                  <span className="text-2xl sm:text-3xl font-sans font-black text-[#FFB800] flex items-center gap-1">
                    {netEconomy} M AOA
                  </span>
                </div>
                <p className="text-[10.5px] text-[#FFB800] font-sans mt-3 font-semibold">
                  Equivale a uma redução de {economyPercent}% das despesas operacionais simuladas selecionadas!
                </p>
              </div>
            </div>

            {/* PROGRESSO DA META (SAVINGS PROGRESS GOAL INDICATOR) */}
            <div className="bg-[#05070a]/90 border border-emerald-500/15 p-5 rounded-2xl relative overflow-hidden backdrop-blur-sm shadow-[0_4px_30px_rgba(16,185,129,0.05)] w-full">
              <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 select-none">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5 shrink-0" />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-mono text-emerald-400 tracking-wider block font-bold leading-none mb-1">
                      Progresso da Meta de Poupança Soberana
                    </span>
                    <h5 className="text-xs font-sans font-semibold text-slate-100">
                      Nó de Ativação {selectedSavingsProvince === 'huambo' ? 'Huambo' : 'Luanda'} • Meta de Economia {selectedSector !== 'all' ? `(${selectedSector})` : ''}
                    </h5>
                  </div>
                </div>

                <div className="text-left sm:text-right font-mono">
                  <span className="text-[9px] text-slate-500 block leading-tight">STATUS DO PARÂMETRO</span>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${goalPercentVal >= 100 ? 'text-emerald-400' : 'text-[#FFB800]'}`}>
                    {goalPercentVal >= 100 ? '✓ Meta Superada' : '⟳ Planeamento Ativo'}
                  </span>
                </div>
              </div>

              {/* Progress Bar with detailed indicators */}
              <div className="space-y-3 font-sans">
                <div className="flex justify-between items-end text-xs gap-3">
                  <div className="space-y-0.5">
                    <span className="text-slate-500 text-[10px] block leading-none">Economia Líquida Alcançada:</span>
                    <span className="text-base sm:text-lg font-bold text-white font-mono">{netEconomy} M AOA</span>
                  </div>

                  <div className="text-center shrink-0">
                    <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-[11px] font-mono shadow-sm">
                      {goalPercentStr}% da Meta
                    </span>
                  </div>

                  <div className="text-right space-y-0.5">
                    <span className="text-slate-500 text-[10px] block leading-none">Meta Projetada para o Piloto:</span>
                    <span className="text-base sm:text-lg font-bold text-[#FFB800] font-mono">{savingsTarget} M AOA</span>
                  </div>
                </div>

                {/* Progress bar line */}
                <div className="h-4 bg-[#020305] border border-white/5 rounded-full overflow-hidden p-0.5 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${progressWidth}%` }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                    className={`h-full rounded-full bg-gradient-to-r ${
                      goalPercentVal >= 100 
                        ? 'from-emerald-600 via-emerald-500 to-[#FFB800]' 
                        : 'from-blue-600 via-blue-500 to-emerald-500'
                    } relative`}
                  >
                    {/* Subtle animated shine effect */}
                    <div className="absolute inset-0 bg-white/5 opacity-50 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:16px_16px] animate-[pulse_2s_infinite]" />
                  </motion.div>
                </div>

                <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                  <span>MARCO ZERO (0 M AOA)</span>
                  <span className="hidden sm:inline text-slate-400 select-none">SILA Sincronia Estrita Integrada</span>
                  <span>META MÁXIMA ({savingsTarget} M AOA)</span>
                </div>

                {/* ALERTA DE EFICIÊNCIA (EFFICIENCY CELEBRATION ALERT WHEN >= 80%) */}
                <AnimatePresence>
                  {goalPercentVal >= 80 && (
                    <motion.div
                      initial={{ opacity: 0, y: 15, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.98 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                      className="mt-5 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative overflow-hidden backdrop-blur-sm shadow-[0_0_25px_rgba(16,185,129,0.12)] flex flex-col md:flex-row items-center gap-4 text-left"
                    >
                      {/* Confetti Container Overlay */}
                      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
                        {Array.from({ length: 24 }).map((_, i) => {
                          // Generate pseudo-random coordinates based on index and manual bursts
                          const randX = ((i * 39 + burstCount * 23) % 100);
                          const randSize = ((i * 11) % 9) + 5; // 5 to 13px
                          const randDelay = ((i * 7) % 20) / 10; // 0s to 2s
                          const randDuration = ((i * 13) % 15) / 5 + 2.5; // 2.5s to 5.5s
                          const colorArray = ['#10b981', '#3b82f6', '#ffb800', '#ec4899', '#f43f5e', '#a855f7'];
                          const randColor = colorArray[(i + burstCount) % colorArray.length];
                          const randShape = i % 3 === 0 ? 'rect' : i % 3 === 1 ? 'circle' : 'triangle';
                          
                          return (
                            <motion.div
                              key={`confetti-${i}-${burstCount}`}
                              initial={{ y: 220, x: `${randX}%`, opacity: 1, rotate: 0, scale: 0.8 }}
                              animate={{ 
                                y: -40, 
                                x: `${randX + ((i % 2 === 0 ? 12 : -12) * Math.sin(i))}%`, 
                                opacity: [0, 1, 1, 0.4, 0], 
                                rotate: 360 + (i * 45),
                                scale: [0.8, 1.2, 1, 0.9, 0.6]
                              }}
                              transition={{ 
                                duration: randDuration, 
                                delay: randDelay, 
                                ease: "easeOut",
                                repeat: Infinity,
                                repeatDelay: 0.3
                              }}
                              style={{
                                position: 'absolute',
                                width: `${randSize}px`,
                                height: `${randSize}px`,
                                backgroundColor: randShape === 'triangle' ? 'transparent' : randColor,
                                borderRadius: randShape === 'circle' ? '50%' : '2px',
                                borderLeft: randShape === 'triangle' ? `${randSize / 2}px solid transparent` : undefined,
                                borderRight: randShape === 'triangle' ? `${randSize / 2}px solid transparent` : undefined,
                                borderBottom: randShape === 'triangle' ? `${randSize}px solid ${randColor}` : undefined,
                              }}
                            />
                          );
                        })}
                      </div>

                      {/* Active glowing backdrop pulse */}
                      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-amber-500/5 to-emerald-500/5 bg-[length:200%_auto] animate-[pulse_4s_infinite] pointer-events-none" />

                      {/* Main content illustration / Badge */}
                      <div className="relative z-10 w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-emerald-500/20">
                        <Award className="w-5.5 h-5.5 animate-[bounce_2.5s_infinite]" />
                      </div>

                      {/* Descriptions */}
                      <div className="relative z-10 flex-1 space-y-1 select-none">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9.5px] font-mono font-extrabold uppercase tracking-widest text-[#FFB800] bg-white/[0.04] px-2 py-0.5 rounded border border-white/[0.06] flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-[#FFB800]" /> Alerta de Eficiência Notável
                          </span>
                          <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded">
                            SUPEROU 80% DA META! ({goalPercentStr}%)
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-100 font-sans">
                          Impacto de Economia Provada no Nó {selectedSavingsProvince === 'huambo' ? 'Huambo' : 'Luanda'}
                        </p>
                        <p className="text-[10.5px] text-slate-300 leading-relaxed max-w-xl">
                          A otimização de custo soberano do barramento de dados SILA alcançou altos patamares de excelência operacional com conformidade fiscal e estabilização de despesas no plano nacional.
                        </p>
                      </div>

                      {/* Interactive Button */}
                      <div className="relative z-10 self-stretch flex items-center justify-center shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setBurstCount(prev => prev + 1);
                            if (playAudioClick) playAudioClick();
                          }}
                          className="px-3 py-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/30 text-emerald-300 hover:text-white rounded-lg text-[9px] font-mono font-semibold transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                          <span>Disparar Brilhos</span>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Chart + Details Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Column: Recharts clustered bar chart representing traditional vs optimized cost */}
              <div className="lg:col-span-7 bg-[#05070a]/50 border border-white/5 p-5 rounded-2xl h-[340px] flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1px,transparent_1px),linear-gradient(to_bottom,#05070A_1px,transparent_1px)] bg-[size:25px_25px] opacity-10 pointer-events-none" />
                <div className="relative z-10">
                  <span className="text-[10px] uppercase font-mono text-[#FFB800] block mb-1 font-bold">
                    PREVISÃO COMPARATIVA OPERACIONAL POR CATEGORIA
                  </span>
                  <p className="text-xs text-slate-400 leading-none">
                    Valores em Milhões de Kwanzas (M AOA) - Custo Anual Estimado {selectedSector !== 'all' ? `• Setor: ${selectedSector}` : ''}
                  </p>
                </div>

                <div className="w-full h-[220px] relative z-10 pt-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={filteredSavingsItems}
                      margin={{ top: 15, right: 10, left: -25, bottom: 0 }}
                      barGap={6}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                      <XAxis 
                        dataKey="category" 
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
                      />
                      <Tooltip content={<CustomSavingsTooltip />} cursor={{ fill: 'rgba(255,255,255,0.01)' }} />
                      <Bar name="Tradicional" dataKey="traditionalCost" fill="#ef4444" radius={[4, 4, 0, 0]}>
                        {
                          filteredSavingsItems.map((entry, index) => (
                            <Cell key={`cell-trad-${index}`} fill="rgba(239, 68, 68, 0.4)" stroke="rgba(239, 68, 68, 0.7)" strokeWidth={1} />
                          ))
                        }
                      </Bar>
                      <Bar name="SILA Soberano" dataKey="silaCost" fill="#10b981" radius={[4, 4, 0, 0]}>
                        {
                          filteredSavingsItems.map((entry, index) => (
                            <Cell key={`cell-sila-${index}`} fill="rgba(16, 185, 129, 0.85)" stroke="#10b981" strokeWidth={1.5} />
                          ))
                        }
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div className="flex items-center justify-center gap-6 text-[10px] font-mono mt-1 border-t border-white/5 pt-2 relative z-10">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-1.5 rounded bg-rose-500/40 border border-rose-500/70" />
                    <span>Processamento Tradicional (Papel)</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <span className="w-3 h-1.5 rounded bg-emerald-500" />
                    <span>SILA Soberano (Digital Autônomo)</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Detailed list with source explanations */}
              <div className="lg:col-span-5 bg-[#05070a]/30 border border-white/5 p-5 rounded-2xl flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-mono text-slate-500 block">ENQUADRAMENTO GEOGRÁFICO</span>
                  <h4 className="text-sm font-sans font-semibold text-slate-200 mt-0.5 leading-tight">
                    Fontes de Otimização {selectedSector !== 'all' ? `em ${selectedSector}` : 'Gerais'}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1 font-sans">
                    {SAVINGS_PROJECTIONS_DATA[selectedSavingsProvince].description}
                  </p>
                </div>

                <div className="space-y-3 my-4 max-h-[190px] overflow-y-auto pr-1">
                  {filteredSavingsItems.map((item, idx) => {
                    const economyValue = item.traditionalCost - item.silaCost;
                    const percentSaved = ((economyValue / item.traditionalCost) * 100).toFixed(0);
                    return (
                      <div key={idx} className="bg-[#020305]/60 p-2.5 rounded-xl border border-white/5 flex items-center justify-between gap-3">
                        <div className="space-y-0.5 min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[11.5px] font-sans font-bold text-slate-200 block truncate leading-tight">
                              {item.category}
                            </span>
                            <span className={`text-[7.5px] font-mono px-1 rounded uppercase font-bold border ${
                              item.sector === 'Educação'
                                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                                : item.sector === 'Saúde'
                                ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                              {item.sector.substring(0, 3)}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-sans block truncate leading-none">
                            {item.details}
                          </span>
                        </div>

                        <div className="text-right shrink-0">
                          <span className="text-[11.5px] font-mono text-emerald-400 font-bold block">
                            -{economyValue} M Kz
                          </span>
                          <span className="text-[9px] font-mono text-slate-500 block uppercase">
                            {percentSaved}% Poupança
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-400 bg-[#020305]/40 p-2.5 rounded-xl border border-white/5">
                  <Database className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>A economia gerada retorna diretamente para o repasse municipal de merenda e infraestrutura escolar técnica básica.</span>
                </div>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button to toggle official protocol details */}
      <div className="flex flex-col sm:flex-row justify-center items-center gap-3 pt-4 relative z-10 w-full border-t border-white/5">
        <SovereignTooltip 
          term="Protocolo Oficial de Implantação" 
          explanation="Documento jurídico fiduciário celebrado entre o Governo do Huambo e o MED que legisla as etapas de governança para o alcance da eficácia plena do SILA."
          variant="clean"
          playAudioClick={playAudioClick ? () => playAudioClick() : undefined}
        >
          <button
            onClick={handleToggleProtocol}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border font-mono text-xs font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer ${
              showOfficialProtocol
                ? 'bg-[#FFB800] text-black border-[#FFB800] hover:bg-[#e0a200]'
                : 'bg-white/[0.02] text-slate-200 border-white/10 hover:border-white/20 hover:bg-white/[0.04]'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>{showOfficialProtocol ? 'OCULTAR CRONOGRAMA DE IMPLANTAÇÃO' : 'VER CRONOGRAMA INTEGRAL DE IMPLANTAÇÃO'}</span>
            {showOfficialProtocol ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </SovereignTooltip>

        <button
          onClick={() => {
            if (playAudioClick) playAudioClick();
            window.print();
          }}
          className="flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border border-blue-500/20 bg-blue-500/10 hover:bg-blue-500/20 text-[#60a5fa] hover:text-white font-mono text-xs font-semibold tracking-wider transition-all duration-300 shadow-md cursor-pointer shrink-0"
        >
          <FileSignature className="w-4 h-4 text-blue-400" />
          <span>EXPORTAR PROTOCOLO</span>
        </button>

        <a 
          href="#sila-pilot-end-to-end-protocols-visualizer"
          className="text-slate-400 hover:text-white font-mono text-[11px] underline flex items-center gap-1 transition-colors"
          onClick={() => setShowOfficialProtocol(true)}
        >
          Ir direto ao Cronograma Semanal <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
        </a>
      </div>

      {/* Embedded Protocol Roadmap Section */}
      <AnimatePresence>
        {showOfficialProtocol && (
          <motion.div
            initial={{ opacity: 0, height: 0, y: 20 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -20 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
            className="overflow-hidden w-full pt-2"
          >
            <PilotProtocolVisualizer />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Printable official dossier hidden in browser, but rendered professionally during window.print() */}
      <div id="sila-print-dossier" className="hidden">
        <style>
          {`
            @media print {
              body * {
                visibility: hidden;
              }
              #sila-print-dossier, #sila-print-dossier * {
                visibility: visible;
              }
              #sila-print-dossier {
                position: absolute;
                left: 0;
                top: 0;
                width: 100%;
                color: #1a202c !important;
                background-color: #ffffff !important;
                font-family: system-ui, -apple-system, sans-serif !important;
                padding: 40px !important;
                box-sizing: border-box;
              }
              .no-print {
                display: none !important;
              }
              .border-print {
                border: 1px solid #cbd5e0 !important;
              }
              .header-print {
                border-bottom: 3px double #1a202c !important;
                padding-bottom: 20px !important;
                margin-bottom: 30px !important;
              }
              .page-break {
                page-break-before: always;
              }
            }
          `}
        </style>

        <div className="header-print text-center space-y-2">
          <div className="text-sm font-bold tracking-wider text-slate-800 uppercase">República de Angola</div>
          <div className="text-xs font-semibold text-slate-600 uppercase">Governo Provincial do Huambo & Governo Provincial de Luanda</div>
          <div className="text-xl font-bold text-slate-900 uppercase tracking-tight mt-2">Dossier de Pacto e Implantação de Interoperabilidade Soberana</div>
          <div className="text-md font-bold text-blue-700 tracking-wider">SILA — Sinfonia de Interoperabilidade e Lançamentos Administrativos</div>
          <div className="text-[10px] font-mono text-slate-500 block mt-2">Código do Documento: MAT-SILA-HB-LA-2026 • Emissão: 11 de Junho de 2026</div>
        </div>

        {/* Section 1: Intro */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900 uppercase">1. Enquadramento e Objetivos do Convênio</h2>
          <p className="text-xs text-slate-700 leading-relaxed">
            Este plano operacional estipula os parâmetros técnicos, de governança e de segurança estabelecidos entre o Ministério de tutela no Território (MAT) e o Ministério da Educação (MED) para a provisão da infraestrutura fiduciária digital <strong>SILA</strong>. O objetivo do sistema assenta na completa eliminação do suporte físico para certidões acadêmicas, cadernetas, mapas pautais e relatórios municipais, integrando-os de forma irreversível e imutável no barramento soberano nacional.
          </p>
        </div>

        {/* Section 2: Huambo municipal plan */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900 uppercase">2. Plano Operacional de Cobertura de Huambo (Nó Piloto)</h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            O Huambo atua como a província piloto pioneira de governança sem frestas. Abaixo detalham-se os 11 municípios credenciados de forma individual para o recebimento de chaves criptográficas de sincronização:
          </p>
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 font-bold">
                <th className="p-2 border border-slate-300">Município</th>
                <th className="p-2 border border-slate-300 text-center">Escolas Cobertas</th>
                <th className="p-2 border border-slate-300 text-center">Estudantes Assistidos</th>
                <th className="p-2 border border-slate-300">Tecnologia de Enlace</th>
                <th className="p-2 border border-slate-300">Risco / Contingência</th>
              </tr>
            </thead>
            <tbody>
              {HUAMBO_MUNICIPALITIES.map((muni, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-2 border border-slate-300 font-semibold">{muni.name}</td>
                  <td className="p-2 border border-slate-300 text-center">{muni.schools}</td>
                  <td className="p-2 border border-slate-300 text-center">{muni.students.toLocaleString('pt-AO')}</td>
                  <td className="p-2 border border-slate-300">{muni.connectivity}</td>
                  <td className="p-2 border border-slate-300">{muni.riskLevel} - {muni.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="page-break" />

        {/* Section 3: Cost-Benefit Comparative Projections */}
        <div className="space-y-4 mb-8 mt-10">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900 uppercase">3. Análise Multilateral de Eficiência Orçamentária e Economia Operacional</h2>
          <p className="text-xs text-slate-700 leading-relaxed mb-3">
            O SILA reprime o desperdício estatal mitigando a dotação para transportes físicos, papéis timbrados e preenchimento manual redundante. Segue o demonstrativo financeiro projetado para o Huambo e a escalabilidade fiduciária programada para a Província Metropolitana de Luanda:
          </p>
          
          <h3 className="text-xs font-bold text-slate-800 uppercase mt-4 mb-2">Demonstrativo Huambo (Impacto Local Inicial)</h3>
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 font-bold">
                <th className="p-2 border border-slate-300">Categoria de Despesa</th>
                <th className="p-2 border border-slate-300 text-right">Processo Tradicional (M AOA)</th>
                <th className="p-2 border border-slate-300 text-right">SILA Soberano (M AOA)</th>
                <th className="p-2 border border-slate-300 text-right">Economia Líquida (M AOA)</th>
                <th className="p-2 border border-slate-300">Setor do Impacto</th>
              </tr>
            </thead>
            <tbody>
              {SAVINGS_PROJECTIONS_DATA.huambo.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-2 border border-slate-300">{item.category}</td>
                  <td className="p-2 border border-slate-300 text-right">{item.traditionalCost} M AOA</td>
                  <td className="p-2 border border-slate-300 text-right">{item.silaCost} M AOA</td>
                  <td className="p-2 border border-slate-300 text-right font-semibold text-emerald-700">{(item.traditionalCost - item.silaCost)} M AOA</td>
                  <td className="p-2 border border-slate-300">{item.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 className="text-xs font-bold text-slate-800 uppercase mt-6 mb-2">Demonstrativo Luanda (Escalabilidade Metropolitana Estimada)</h3>
          <table className="w-full text-left text-[11px] border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 font-bold">
                <th className="p-2 border border-slate-300">Categoria de Despesa</th>
                <th className="p-2 border border-slate-300 text-right">Processo Tradicional (M AOA)</th>
                <th className="p-2 border border-slate-300 text-right">SILA Soberano (M AOA)</th>
                <th className="p-2 border border-slate-300 text-right">Economia Líquida (M AOA)</th>
                <th className="p-2 border border-slate-300">Setor do Impacto</th>
              </tr>
            </thead>
            <tbody>
              {SAVINGS_PROJECTIONS_DATA.luanda.items.map((item, index) => (
                <tr key={index} className="border-b border-slate-200">
                  <td className="p-2 border border-slate-300">{item.category}</td>
                  <td className="p-2 border border-slate-300 text-right">{item.traditionalCost} M AOA</td>
                  <td className="p-2 border border-slate-300 text-right">{item.silaCost} M AOA</td>
                  <td className="p-2 border border-slate-300 text-right font-semibold text-emerald-700">{(item.traditionalCost - item.silaCost)} M AOA</td>
                  <td className="p-2 border border-slate-300">{item.sector}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Section 4: Cooperation Clauses */}
        <div className="space-y-4 mb-8">
          <h2 className="text-lg font-bold border-b border-slate-300 pb-1 text-slate-900 uppercase">4. Cláusulas Normativas e do Acordo de Cooperação</h2>
          <div className="space-y-3">
            {MINISTERIAL_CLAUSES.map((clause, idx) => (
              <div key={idx} className="text-xs">
                <div className="font-bold text-slate-800">Cláusula {idx + 1}: {clause.target}</div>
                <p className="text-[11px] text-slate-600 mt-0.5 leading-normal">{clause.description}</p>
                <span className="text-[9px] font-mono text-slate-500 block italic">Enquadramento Legal: {clause.legalBasis}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Signature Blocks */}
        <div className="space-y-4 mt-12 border-t border-slate-300 pt-8">
          <h2 className="text-lg font-bold text-slate-900 uppercase text-center mb-6">5. Termos de Homologação e Assinatura Digital Soberana</h2>
          <div className="grid grid-cols-3 gap-6 text-center text-xs">
            <div className="space-y-8">
              <div className="h-10 flex items-end justify-center">
                <span className="text-[9px] font-mono text-slate-400 font-bold block bg-slate-50 border border-slate-200 p-1.5 rounded">
                  ASSINADO DIGITALMENTE<br/><span className="text-slate-600">MAT-ID: FF99-0012</span>
                </span>
              </div>
              <div className="border-t border-slate-400 pt-2 font-semibold">Representante MAT</div>
            </div>
            <div className="space-y-8">
              <div className="h-10 flex items-end justify-center">
                <span className="text-[9px] font-mono text-slate-400 font-bold block bg-slate-50 border border-slate-200 p-1.5 rounded">
                  ASSINADO DIGITALMENTE<br/><span className="text-slate-600">MED-ID: ACC-109D</span>
                </span>
              </div>
              <div className="border-t border-slate-400 pt-2 font-semibold">Representante MED</div>
            </div>
            <div className="space-y-8">
              <div className="h-10 flex items-end justify-center">
                <span className="text-[9px] font-mono text-slate-400 font-bold block bg-slate-50 border border-slate-200 p-1.5 rounded">
                  AUTORIZADO GOV-HB<br/><span className="text-slate-600">CERT-MAT-2026-X89</span>
                </span>
              </div>
              <div className="border-t border-slate-400 pt-2 font-semibold">Governador do Huambo</div>
            </div>
          </div>
          <div className="text-[9px] text-slate-400 text-center mt-6">
            O presente documento é classificado fiduciário, com integridade certificada pelo nó do barramento seguro do Estado de Angola.
          </div>
        </div>
      </div>
    </div>
  );
}

