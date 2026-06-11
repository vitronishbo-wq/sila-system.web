import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Briefcase, FileCheck, HelpCircle, GraduationCap, Server, 
  Users, Users2, ShieldAlert, ArrowRight, ShieldCheck, CheckCircle, 
  Workflow, Database, Landmark, RefreshCw, KeyRound, Globe, History, QrCode
} from 'lucide-react';

interface Protocol {
  code: string;
  title: string;
  objective: string;
  dataExchanged: string[];
  responsibilities: {
    med: string;
    mat: string;
  };
  securityLevel: 'Crítico' | 'Sensivel' | 'Padrão';
}

interface TimelineStep {
  weeks: string;
  milestone: string;
  description: string;
  actions: string[];
  owner: 'Equipa SILA' | 'MAT x MED' | 'Província Huambo';
  status: 'Pendente' | 'Em execução' | 'Pronto';
}

const PROTOCOLS_DATA: Protocol[] = [
  {
    code: 'PCD-MED-MAT-01',
    title: 'Protocolo de Sincronização Cadastral de Matrícula Única',
    objective: 'Vinculação imediata do Número de Identificação Único (NIU) proveniente do Registo Civil como a Chave Primária Universal para todas as matrículas no sistema de ensino.',
    dataExchanged: ['NIU (Número de Identificação Único)', 'Filiação Estrita', 'Data de Nascimento Nativa', 'Coordenadas Geográficas de Residência'],
    responsibilities: {
      med: 'Carregamento do inventário de vagas e aceitação eletrónica da vaga assistida pelo encarregado de educação.',
      mat: 'Fornecimento da API cifrada de leitura civil e georreferenciamento do agregado familiar por município.'
    },
    securityLevel: 'Crítico'
  },
  {
    code: 'PAED-SILA-02',
    title: 'Protocolo de Emissão Fiduciária e Assinatura Digital de Diplomas',
    objective: 'Eliminação definitiva de filas para autenticação de habilitações e diplomas escolares através de chaves criptográficas partilhadas.',
    dataExchanged: ['Média Final Curricular', 'Chave Pública da Delegação Provincial', 'Código QR de Validação Governamental'],
    responsibilities: {
      med: 'Lançamento obrigatório das notas finais pelos professores no SILA e aposição do selo digital homologador.',
      mat: 'Fornecimento da infraestrutura de hospedagem soberana e auditoria civil contra identidades duplicadas.'
    },
    securityLevel: 'Crítico'
  },
  {
    code: 'PIOB-MED-MINFIN-03',
    title: 'Protocolo de Mapeamento Geográfico e Rácio de Vagas Ativas',
    objective: 'Cruzamento preditivo da taxa de natalidade das maternidades do Huambo com a capacidade de ocupação escolar nas 11 Administrações Municipais.',
    dataExchanged: ['Registo de Recém-Nascidos com GPS', 'Capacidade Atômica das Escolas', 'Rácio de Deserção Letiva Preventiva'],
    responsibilities: {
      med: 'Mapeamento periódico de salas de aula físicas, carteiras disponíveis e contratação de docentes locais.',
      mat: 'Previsão com 4 anos de antecedência da procura escolar no Huambo através dos dados cruzados de nascimento na FUC.'
    },
    securityLevel: 'Sensivel'
  },
  {
    code: 'PPEI-NACIONAL-04',
    title: 'Protocolo de Portabilidade Escolar e Dossiê Académico Rápido',
    objective: 'Assegurar que a transferência de um aluno de uma província piloto para qualquer outra região do país ocorra de forma digital em menos de 20 segundos.',
    dataExchanged: ['Historial de Frequência Curricular', 'Registo de Saúde Escolar Unificado', 'Ficha Pedagógica e Observações do Docente'],
    responsibilities: {
      med: 'Exportação eletrónica imediata do dossiê através do Módulo Administrativo Escolar.',
      mat: 'Sincronização redundante com o Core do Cidadão para atualização de dados de morada civil.'
    },
    securityLevel: 'Sensivel'
  }
];

const TIMELINE_STEPS: TimelineStep[] = [
  {
    weeks: 'Semanas 1 - 4',
    milestone: 'Diagnóstico & Alinhamento Institucional',
    description: 'Constituição da comissão interministerial bilateral (MAT x MED) e levantamento estrutural de todas as 420 escolas piloto da província do Huambo.',
    actions: [
      'Assinatura do acordo de cooperação técnica pelo Governador Provincial do Huambo e Diretor do MED.',
      'Auditoria de conectividade e energia elétrica nas sedes dos 11 municípios do Huambo.',
      'Criação das credenciais criptográficas iniciais de administrador para as Delegações Municipais.'
    ],
    owner: 'MAT x MED',
    status: 'Pronto'
  },
  {
    weeks: 'Semanas 5 - 8',
    milestone: 'Implantação de Servidores e Banco de Dados Sandbox',
    description: 'Instalação local do nó de réplica SILA com espelhamento inicial descentralizado e importação das bases de dados legadas.',
    actions: [
      'Migração e normalização de 125.000 registos de alunos baseados em planilhas PDF/Excel antigas para a infraFUC.',
      'Configuração das rotas seguras de comunicação direta com a delegação de Identificação Civil do Huambo.',
      'Primeiro teste de esforço de busca em lote com mais de 10.000 consultas simultâneas.'
    ],
    owner: 'Equipa SILA',
    status: 'Em execução'
  },
  {
    weeks: 'Semanas 9 - 13',
    milestone: 'Ensaios de Campo e Integração da Maternidade Geral',
    description: 'Ativação do canal de transmissão direta na Maternidade Geral do Huambo e testes de simulação de matrícula guiada por SMS aos encarregados.',
    actions: [
      'Conexão do sistema de registo interno da maternidade com o banco de dados principal do SILA.',
      'Emissão de 500 Bilhetes de Identidade simulados com reaproveitamento estrito de dados nativos.',
      'Envio piloto de notificações a 100 famílias do Huambo sinalizando a vaga escolar de proximidade.'
    ],
    owner: 'Província Huambo',
    status: 'Pendente'
  },
  {
    weeks: 'Semanas 14 - 18',
    milestone: 'Formação Intensiva de Diretores e Professores',
    description: 'Treino prático hands-on de mais de 4.300 professores e agentes escolares locais sobre o uso do Diário Digital SILA.',
    actions: [
      'Desenvolvimento de kits de formação em ambiente offline para escolas com limitações pontuais de rede.',
      'Certificação de 11 multiplicadores municipais dedicados ao suporte técnico contínuo aos administradores de escola.',
      'Validação de competências no uso de envio biométrico e gestão de faltas unificadas.'
    ],
    owner: 'MAT x MED',
    status: 'Pendente'
  },
  {
    weeks: 'Semanas 19 - 24',
    milestone: 'Operação Assistida e Transições em Tempo Real',
    description: 'Lançamento pleno do sistema em toda a província, acompanhamento direto de incidentes em ambiente de produção e abertura oficial do portal de portabilidade.',
    actions: [
      'Execução das matrículas do novo ano letivo sem que nenhum pai precise apresentar fotocópias físicas.',
      'Rastreio em tempo real de assiduidade escolar através dos painéis do SILA do Huambo.',
      'Emissão dos primeiros diplomas digitais oficiais assinados pelo governo provincial.'
    ],
    owner: 'Equipa SILA',
    status: 'Pendente'
  }
];

export default function PilotProtocolVisualizer() {
  const [activeTab, setActiveTab] = useState<'timeline' | 'protocols'>('timeline');
  const [selectedTimelineIdx, setSelectedTimelineIdx] = useState<number>(0);
  const [selectedProtocolIdx, setSelectedProtocolIdx] = useState<number>(0);

  const selectedTimelineStep = TIMELINE_STEPS[selectedTimelineIdx];
  const selectedProtocol = PROTOCOLS_DATA[selectedProtocolIdx];

  return (
    <div 
      id="sila-pilot-end-to-end-protocols-visualizer"
      className="bg-gradient-to-b from-[#0a0f1d] to-[#04060a] border border-white/5 rounded-3xl p-6 sm:p-8 relative overflow-hidden w-full space-y-6 mt-12"
    >
      {/* Accent strip */}
      <div className="absolute top-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1.5px,transparent_1.5px),linear-gradient(to_bottom,#05070A_1.5px,transparent_1.5px)] bg-[size:30px_30px] opacity-[0.07] pointer-events-none" />

      {/* Header and description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-5">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-blue-400 font-bold tracking-widest uppercase flex items-center gap-1.5">
            <Workflow className="w-3.5 h-3.5" /> ACELERAÇÃO AUTÁRQUICA E COOPERAÇÃO INTERMINISTERIAL
          </span>
          <h3 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
            Plano Estruturado & Protocolos de Interconexão (MED x MAT)
          </h3>
          <p className="text-xs text-slate-400 font-sans max-w-2xl leading-relaxed">
            Mapeamento lógico de ponta a ponta sobre a execução técnica do piloto nacional no Huambo, juntamente com os protocolos normativos acordados com o Ministério da Educação.
          </p>
        </div>

        {/* Tab selector */}
        <div className="flex bg-[#05070a] border border-white/10 p-1 rounded-xl self-start sm:self-auto shrink-0">
          <button
            onClick={() => setActiveTab('timeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'timeline' 
                ? 'bg-blue-600 font-semibold text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Cronograma Ponta a Ponta
          </button>
          <button
            onClick={() => setActiveTab('protocols')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono tracking-wider transition-all duration-200 cursor-pointer ${
              activeTab === 'protocols' 
                ? 'bg-[#FFB800] text-black font-semibold shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Protocolos com o MED
          </button>
        </div>
      </div>

      {/* Interactive Main Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Navigation List based on current tab */}
        <div className="lg:col-span-5 space-y-3 shrink-0">
          <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest font-bold">
            {activeTab === 'timeline' ? 'Fases do Desenvolvimento Provincial' : 'Acordos Técnicos de Cooperação'}
          </div>

          <div className="space-y-2">
            {activeTab === 'timeline' ? (
              TIMELINE_STEPS.map((step, idx) => {
                const isSelected = selectedTimelineIdx === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedTimelineIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden block cursor-pointer ${
                      isSelected
                        ? 'bg-blue-600/[0.04] border-blue-500/40 shadow-lg'
                        : 'bg-[#05070a]/40 border-white/5 hover:border-[#FFB800]/20 hover:bg-white/[0.01]'
                    }`}
                  >
                    {/* Tiny Indicator bullet */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-blue-500"></div>
                    )}
                    
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-slate-500">
                        {step.weeks}
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold ${
                        step.status === 'Pronto' 
                          ? 'text-emerald-400 bg-emerald-500/10' 
                          : step.status === 'Em execução'
                          ? 'text-amber-400 bg-amber-500/10 animate-pulse'
                          : 'text-slate-400 bg-slate-500/10'
                      }`}>
                        {step.status === 'Pronto' ? 'CONCLUÍDO' : step.status === 'Em execução' ? 'EM EXECUÇÃO' : 'PLANEADO'}
                      </span>
                    </div>

                    <h4 className={`text-sm font-sans font-semibold mt-1 transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {step.milestone}
                    </h4>

                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      Responsável: <strong className="text-slate-300">{step.owner}</strong>
                    </span>
                  </button>
                );
              })
            ) : (
              PROTOCOLS_DATA.map((protocol, idx) => {
                const isSelected = selectedProtocolIdx === idx;
                return (
                  <button
                    key={protocol.code}
                    onClick={() => setSelectedProtocolIdx(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden block cursor-pointer ${
                      isSelected
                        ? 'bg-amber-500/[0.04] border-amber-500/40 shadow-lg'
                        : 'bg-[#05070a]/40 border-white/5 hover:border-blue-500/20 hover:bg-white/[0.01]'
                    }`}
                  >
                    {/* Tiny Indicator bullet */}
                    {isSelected && (
                      <div className="absolute top-0 bottom-0 left-0 w-1 bg-amber-500"></div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-mono text-[#FFB800] tracking-wider font-bold">
                        {protocol.code}
                      </span>
                      <span className={`text-[8px] font-mono px-2 py-0.5 rounded font-bold ${
                        protocol.securityLevel === 'Crítico' 
                          ? 'text-rose-400 bg-rose-500/15 border border-rose-500/10' 
                          : 'text-sky-400 bg-sky-500/10'
                      }`}>
                        {protocol.securityLevel}
                      </span>
                    </div>

                    <h4 className={`text-sm font-sans font-semibold mt-1.5 transition-colors ${
                      isSelected ? 'text-white' : 'text-slate-300'
                    }`}>
                      {protocol.title}
                    </h4>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Side: Detailed HUD containing detailed actions, requirements and workflows */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {activeTab === 'timeline' ? (
              <motion.div
                key={`timeline-hud-${selectedTimelineIdx}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-black/30 border border-white/5 p-5 sm:p-7 rounded-2xl space-y-6 self-stretch min-h-[440px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Phase ID Header */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
                        <Server className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest">Cronograma de Ativação</span>
                        <h4 className="text-base font-sans font-bold text-slate-100">{selectedTimelineStep.weeks}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Execução Provincial</span>
                      <span className="text-xs font-mono text-[#FFB800]">{selectedTimelineStep.owner}</span>
                    </div>
                  </div>

                  {/* Core Goal with beautiful typography */}
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FFB800] uppercase font-bold tracking-wider flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Marco Crítico de Sucesso
                    </span>
                    <h5 className="text-lg font-sans font-semibold text-slate-200 tracking-tight leading-tight">
                      {selectedTimelineStep.milestone}
                    </h5>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {selectedTimelineStep.description}
                    </p>
                  </div>

                  {/* Action Steps checklist */}
                  <div className="bg-[#05070a]/60 border border-white/5 rounded-xl p-4 space-y-3">
                    <span className="text-[9.5px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                      Ações Técnicas e Regulamentares End-to-End
                    </span>

                    <div className="space-y-2.5">
                      {selectedTimelineStep.actions.map((action, i) => (
                        <div key={i} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[10px] font-mono text-blue-400 shrink-0 mt-0.5 font-bold">
                            {i + 1}
                          </div>
                          <p className="text-xs font-sans text-slate-300 leading-relaxed">
                            {action}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Sidenote representation */}
                <div className="flex items-center gap-2 text-[9.5px] font-mono text-slate-500 border-t border-white/5 pt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-500" />
                  <span>SILA CORE MOTORIZED SECURITY FRAMEWORK • EXCLUSIVE HUAMBO PILOT PROPOSAL</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key={`protocol-hud-${selectedProtocolIdx}`}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.25 }}
                className="bg-black/30 border border-white/5 p-5 sm:p-7 rounded-2xl space-y-5 self-stretch min-h-[440px] flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Protocol code head */}
                  <div className="flex items-center justify-between border-b border-white/5 pb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-[#FFB800]/10 border border-[#FFB800]/20 flex items-center justify-center text-[#FFB800]">
                        <FileCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="text-[9.5px] font-mono text-slate-500 uppercase tracking-widest">Protocolo de Operação Bilateral</span>
                        <h4 className="text-xs font-mono text-orange-400 font-bold">{selectedProtocol.code}</h4>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[9px] font-mono text-slate-500 uppercase block">Nível de Segurança</span>
                      <span className="text-xs font-mono text-rose-500 font-extrabold uppercase">{selectedProtocol.securityLevel}</span>
                    </div>
                  </div>

                  {/* Objective and title */}
                  <div className="space-y-1.5">
                    <h5 className="text-base font-sans font-bold text-slate-200 tracking-tight">
                      {selectedProtocol.title}
                    </h5>
                    <p className="text-xs text-slate-400 font-sans leading-relaxed">
                      {selectedProtocol.objective}
                    </p>
                  </div>

                  {/* Horizontal Matrix: Responsibilities */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3.5 bg-blue-600/[0.02] border border-blue-500/10 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono text-blue-400 uppercase font-bold flex items-center gap-1">
                        <GraduationCap className="w-3.5 h-3.5" /> MED (Educação)
                      </span>
                      <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                        {selectedProtocol.responsibilities.med}
                      </p>
                    </div>

                    <div className="p-3.5 bg-orange-600/[0.01]/10 border border-[#FFB800]/10 rounded-xl space-y-1.5">
                      <span className="text-[10px] font-mono text-[#FFB800] uppercase font-bold flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5" /> MAT (Administração Territorial)
                      </span>
                      <p className="text-[11px] font-sans text-slate-300 leading-relaxed">
                        {selectedProtocol.responsibilities.mat}
                      </p>
                    </div>
                  </div>

                  {/* Data Exchanged List */}
                  <div className="bg-[#05070a]/60 border border-white/5 rounded-xl p-4 space-y-2">
                    <span className="text-[9.5px] font-mono text-slate-400 uppercase flex items-center gap-1 font-bold">
                      <Database className="w-3.5 h-3.5 text-blue-500" /> Fluxo de Dados e Variáveis Transacionadas
                    </span>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedProtocol.dataExchanged.map((data, index) => (
                        <span 
                          key={index}
                          className="bg-white/[0.02] border border-white/5 text-[10px] font-mono px-2.5 py-1 rounded text-slate-300"
                        >
                          {data}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Secure sync signature notice */}
                <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 border-t border-white/5 pt-4">
                  <span className="flex items-center gap-1">
                    <KeyRound className="w-3.5 h-3.5 text-[#FFB800]" /> CHAVES GOVERNAMENTAIS ASSINADAS ELETRONICAMENTE
                  </span>
                  <span>JUNHO 2026</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>

      {/* Histórico de Revisão Técnica e Assinatura Digital MAT */}
      <div className="bg-[#05070a]/50 border border-white/5 rounded-2xl p-4 sm:p-5 space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 rounded-full blur-xl pointer-events-none" />
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">Histórico de Revisões Regulamentares</h4>
              <p className="text-[10px] text-slate-500 font-sans">Rastreamento de atualizações normativas e assinaturas digitais aplicadas pelo MAT</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto shrink-0">
            <div className="flex items-center gap-2 bg-[#FFB800]/5 border border-[#FFB800]/10 px-2.5 py-1 rounded-lg">
              <QrCode className="w-3.5 h-3.5 text-[#FFB800]" />
              <span className="text-[9px] font-mono text-slate-300">Selo de Autenticidade MAT: <strong className="text-amber-400">CERT-MAT-2026-X89</strong></span>
            </div>

            {/* Custom Interactive digital signature badge with tooltip */}
            <div className="relative inline-block group">
              <div className="flex items-center gap-2 bg-emerald-500/5 hover:bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg cursor-help transition-all">
                <FileCheck className="w-3.5 h-3.5 text-emerald-400 animate-[pulse_2s_infinite]" />
                <span className="text-[9px] font-mono text-emerald-400 font-semibold uppercase tracking-wider flex items-center gap-1 leading-none select-none">
                  Assinatura Digital
                </span>
              </div>
              
              {/* Tooltip Content */}
              <div className="absolute right-0 bottom-full mb-2 w-72 bg-[#0c101a] border border-emerald-500/30 rounded-xl p-3.5 shadow-[0_4px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(16,185,129,0.15)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none text-left leading-relaxed">
                <div className="flex items-center gap-1.5 border-b border-emerald-500/10 pb-2 mb-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span className="text-[10px] font-mono font-bold tracking-wider text-emerald-400 uppercase">
                    Validade ICP-Angola Ativa
                  </span>
                </div>
                <div className="space-y-1.5 text-[10px] font-sans text-slate-300">
                  <p>
                    Este protocolo possui <strong className="text-white">validade jurídica plena e absoluta</strong> em todo o território nacional.
                  </p>
                  <p>
                    Assinado eletronicamente com criptografia de alta segurança e chaves públicas qualificadas em estrita conformidade com as normas regulamentares do <strong className="text-white">ICP-Angola</strong> (Decreto Presidencial de Angola / INFOSI), garantindo integridade e não-repúdio.
                  </p>
                  <div className="flex items-center justify-between text-[8px] font-mono text-emerald-500 pt-1.5 border-t border-[#22c55e]/10">
                    <span>PADRÃO: x509 V3 SMIME</span>
                    <span>ESTADO: VÁLIDO & SEGURO</span>
                  </div>
                </div>
                {/* Pointer Arrow */}
                <div className="absolute top-full right-8 -mt-[1px] border-[5px] border-transparent border-t-[#0c101a]" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Revision Card 1 */}
          <div className="bg-[#020305]/60 hover:bg-[#020305]/95 border border-white/5 hover:border-blue-500/20 p-3 rounded-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-blue-400 bg-blue-950/40 px-1.5 py-0.5 rounded font-bold">Rev. 1.0</span>
              <span className="text-[9px] font-mono text-slate-500">12 Out 2025</span>
            </div>
            <h5 className="text-[11.5px] font-semibold text-slate-200 mt-1.5 font-sans">Acordo de Conexão Inicial</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">Homologação mútua do rácio de preenchimento pautal e provisionamento do Sandbox local no Huambo.</p>
            <div className="mt-3.5 border-t border-white/5 pt-2 flex items-center justify-between gap-1 text-[8.5px] font-mono text-emerald-400">
              <span className="flex items-center gap-1 leading-none"><KeyRound className="w-3 h-3 text-emerald-500 shrink-0" /> MAT ID: 89A2-BC11</span>
              <span className="text-slate-500 font-bold uppercase text-[7.5px] tracking-wider leading-none">Arquivado</span>
            </div>
          </div>

          {/* Revision Card 2 */}
          <div className="bg-[#020305]/60 hover:bg-[#020305]/95 border border-white/5 hover:border-blue-500/20 p-3 rounded-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-amber-400 bg-amber-950/40 px-1.5 py-0.5 rounded font-bold">Rev. 1.1</span>
              <span className="text-[9px] font-mono text-slate-500">18 Jan 2026</span>
            </div>
            <h5 className="text-[11.5px] font-semibold text-slate-200 mt-1.5 font-sans">Ajuste de Diretrizes de BI</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">Parâmetros de proteção de identidade alinhados com o novo Regulamento de Proteção de Dados de Angola.</p>
            <div className="mt-3.5 border-t border-white/5 pt-2 flex items-center justify-between gap-1 text-[8.5px] font-mono text-emerald-400">
              <span className="flex items-center gap-1 leading-none"><KeyRound className="w-3 h-3 text-emerald-500 shrink-0" /> MAT ID: C90F-8812</span>
              <span className="text-slate-500 font-bold uppercase text-[7.5px] tracking-wider leading-none">Homologado</span>
            </div>
          </div>

          {/* Revision Card 3 */}
          <div className="bg-[#020305]/60 hover:bg-[#020305]/95 border border-white/5 hover:border-[#FFB800]/20 p-3 rounded-xl transition-all duration-300">
            <div className="flex items-center justify-between">
              <span className="text-[8.5px] font-mono text-[#FFB800] bg-amber-950/50 px-1.5 py-0.5 rounded font-bold">Rev. 2.0 (Atual)</span>
              <span className="text-[9px] font-mono text-slate-500">11 Jun 2026</span>
            </div>
            <h5 className="text-[11.5px] font-semibold text-slate-200 mt-1.5 font-sans">Assinatura Digital Soberana</h5>
            <p className="text-[10px] text-slate-400 mt-1 leading-normal">Sinfonia de chaves fiduciárias imutáveis que selam a conformidade civil e acadêmica integrados na FUC.</p>
            <div className="mt-3.5 border-t border-white/5 pt-2 flex items-center justify-between gap-1 text-[8.5px] font-mono text-emerald-400">
              <span className="flex items-center gap-1 leading-none"><KeyRound className="w-3 h-3 text-emerald-500 shrink-0" /> MAT ID: FF99-0012</span>
              <span className="text-emerald-500 font-bold uppercase text-[7.5px] tracking-wider leading-none">Sincronizado</span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary diagram highlighting integrated structure */}
      <div className="border-t border-white/5 pt-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping shrink-0" />
          <p className="text-[10px] font-mono text-slate-400">
            Sincronização Ativa com <strong className="text-white">FUC Core de Angola</strong> • Ligação fiduciária certificada em alta segurança
          </p>
        </div>

        {/* Small protocol certification notice badge */}
        <div className="flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-lg">
          <Globe className="w-3.5 h-3.5 text-blue-400" />
          <span className="text-[9.5px] font-mono text-blue-300 uppercase">SILA Standard Interoperability Protocol</span>
        </div>
      </div>
    </div>
  );
}
