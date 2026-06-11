import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Building2, Terminal, Code2, Link, ShieldCheck, 
  ChevronRight, Copy, Check, Sparkles, BookOpen, 
  HelpCircle, Cpu, Network, ArrowRight 
} from 'lucide-react';
import SovereignTooltip from './SovereignTooltip';

interface Step {
  number: number;
  title: string;
  shortDesc: string;
  duration: string;
  icon: React.ComponentType<{ className?: string }>;
  details: string[];
}

interface MinistryConfig {
  id: string;
  name: string;
  acronym: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  endPoint: string;
  fields: { name: string; type: string; desc: string }[];
  payloadTemplate: string;
}

const INTEGRATION_STEPS: Step[] = [
  {
    number: 1,
    title: "Emissão de Chaves & Credenciamento",
    shortDesc: "Aprovação política e geração das chaves criptográficas sob a unificação do MAT.",
    duration: "2-3 dias úteis",
    icon: Building2,
    details: [
      "Submissão formal de pedido de convênio e credenciamento à Direção Geral do SILA",
      "Geração do par de chaves fiduciárias públicas assimétricas de 4096-bit assinadas",
      "Whitelist imediata do endereço IP nos gateways periféricos soberanos"
    ]
  },
  {
    number: 2,
    title: "Mapeamento de Interfaces para a FUC",
    shortDesc: "Correlação dos silos municipais com o padrão soberano da Ficha Única do Cidadão.",
    duration: "3-5 dias úteis",
    icon: Network,
    details: [
      "Alinhamento dos atributos municipais básicos com a chave primária imutável FUC",
      "Definição do modelo de atualização sincrona (para eventos críticos) vs asincrona",
      "Homologação do dicionário de metadados sob validação notarial integrada"
    ]
  },
  {
    number: 3,
    title: "Ativação no Barramento Seguro",
    shortDesc: "Ligação via API gRPC de alto desempenho com barramento seguro TLS (mTLS).",
    duration: "Instântanea",
    icon: Code2,
    details: [
      "Configuração do túnel IPSec seguro ou link dedicado de fibra interministerial",
      "Deploy do micro-serviço satélite SILA no datacenter central do ministério parceiro",
      "Validação das rotas de ping e integridade dos nós em conformidade mTLS"
    ]
  },
  {
    number: 4,
    title: "Homologação Simulada em Sandbox",
    shortDesc: "Execução automatizada de testes com validação criptográfica ponta a ponta.",
    duration: "1 dia útil",
    icon: ShieldCheck,
    details: [
      "Simulação de reconciliação de 1.000 registos de cidadãos angolanos fictícios",
      "Auditoria automática pautal validando a blindagem contra falsificação lógica",
      "Assinatura digital final do termo de conformidade e liberação do acesso em produção"
    ]
  }
];

const MINISTRY_PAYLOADS: MinistryConfig[] = [
  {
    id: 'minsa',
    name: 'Ministério da Saúde',
    acronym: 'MINSA',
    icon: ShieldCheck,
    color: '#10B981',
    endPoint: 'https://api.minsa.gov.ao/v2/sila-barramento',
    fields: [
      { name: "vacina_sarampon", type: "boolean", desc: "Registo biométrico do ciclo completo de vacinação do sarampon." },
      { name: "grupo_sanguineo", type: "string", desc: "Tipagem sanguínea fidedigna certificada por hospital público." },
      { name: "fuc_num_filiacao", type: "string", desc: "Conexão imutável de identificação civil nacional." }
    ],
    payloadTemplate: `{
  "orgao_emissor": "MINSA_REDE_PUBLICA",
  "data_evento": "2026-06-11T10:39:00Z",
  "payload": {
    "fuc_cidadao_id": "FUC-AO-449832-H",
    "vacinas": [
      { "id": "VAC-POLIO", "dose": 3, "data": "2025-11-20" },
      { "id": "VAC-SARAMPON", "dose": 2, "data": "2026-03-12" }
    ],
    "condicoes_cronicas": [],
    "grupo_sanguineo": "O-Positivo"
  },
  "assinatura_digital": "0x78F9A1B2...33CE"
}`
  },
  {
    id: 'minjusdh',
    name: 'Ministério da Justiça e Direitos Humanos',
    acronym: 'MINJUSDH',
    icon: Building2,
    color: '#FFB800',
    endPoint: 'https://api.minjusdh.gov.ao/v1/registo-civil/link',
    fields: [
      { name: "num_bi", type: "string", desc: "Número unificado do Bilhete de Identidade nacional." },
      { name: "estado_civil", type: "string", desc: "Validação cívica instantânea para trâmites patrimoniais." },
      { name: "certidao_nascimento", type: "string", desc: "Hash criptográfico do assento de nascimento físico digitalizado." }
    ],
    payloadTemplate: `{
  "orgao_emissor": "MINJUSDH_CIVIL_SLA",
  "data_evento": "2026-06-11T10:45:00Z",
  "payload": {
    "fuc_cidadao_id": "FUC-AO-449832-H",
    "num_bi": "009832120LA043",
    "filiacao": {
      "pai": "Manuel Antonio Silva",
      "mae": "Maria Joao Silva"
    },
    "estado_civil": "SOLTEIRO",
    "naturalidade": "Huambo"
  },
  "assinatura_digital": "0xAA880011...F2D1"
}`
  },
  {
    id: 'agt',
    name: 'Administração Geral Tributária',
    acronym: 'AGT / Finanças',
    icon: Cpu,
    color: '#8B5CF6',
    endPoint: 'https://api.agt.minfin.gov.ao/v3/interop-sila',
    fields: [
      { name: "nif_ativo", type: "string", desc: "Número de Identificação Fiscal associado à FUC do cidadão." },
      { name: "regularidade_fiscal", type: "boolean", desc: "Certificação de isenção ou regularidade de taxas estatais." },
      { name: "contribuicao_municipal", type: "number", desc: "Valores auferidos de impostos municipais prediais e trâmites." }
    ],
    payloadTemplate: `{
  "orgao_emissor": "AGT_MINFIN_SOBERANO",
  "data_evento": "2026-06-11T10:59:00Z",
  "payload": {
    "fuc_cidadao_id": "FUC-AO-449832-H",
    "nif_contribuinte": "5000492812",
    "status_tributario": "REGULARIZADO",
    "isencoes_aplicaveis": [
      { "id": "ISE_STUDENT_MED", "validade": "2027-01-01" }
    ]
  },
  "assinatura_digital": "0xBB559922...EA77"
}`
  }
];

interface MinisterialIntegrationGuideProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function MinisterialIntegrationGuide({ playAudioClick }: MinisterialIntegrationGuideProps) {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [activeMinId, setActiveMinId] = useState<string>('minsa');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  const selectedMinistry = MINISTRY_PAYLOADS.find(m => m.id === activeMinId) || MINISTRY_PAYLOADS[0];

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(selectedMinistry.payloadTemplate);
    setIsCopied(true);
    if (playAudioClick) playAudioClick('click');
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-gradient-to-b from-[#090d16] to-[#04060a]/90 border border-white/10 rounded-2xl p-5 sm:p-6 space-y-6 relative overflow-hidden" id="guia-integracao-ministerial-container">
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/5 rounded-full blur-2xl pointer-events-none" />
      
      {/* Header and conceptual introduction */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1 px-2 rounded bg-blue-500/15 border border-blue-500/30 text-[9.5px] font-mono font-bold tracking-widest text-[#FFB800] uppercase flex items-center gap-1">
              <Sparkles className="w-3 h-3 animate-pulse" /> Manual do Cidadão Soberano
            </span>
          </div>
          <h4 className="text-lg font-sans font-bold text-slate-100 tracking-tight flex items-center gap-2">
            Guia de Integração Ministerial <span className="text-xs font-mono font-normal text-slate-500">(SILA Interoperabilidade)</span>
          </h4>
          <p className="text-xs text-slate-400 max-w-4xl leading-relaxed">
            O SILA foi concebido para atuar como barramento de intercomunicação instantânea e segura do Estado Angolano. Siga as etapas regulatórias e aproveite os templates de payload homologados abaixo para unificar seu ministério com a chave nacional do cidadão.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Column: Interactive integration workflow steps */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-blue-400" /> Etapas do Credenciamento
            </span>
            <span className="text-[9px] font-mono text-slate-500">Padrão unificado MAT</span>
          </div>

          <div className="space-y-2.5">
            {INTEGRATION_STEPS.map((step) => {
              const isActive = activeStep === step.number;
              const StepIcon = step.icon;
              return (
                <button
                  key={step.number}
                  type="button"
                  onClick={() => {
                    setActiveStep(step.number);
                    if (playAudioClick) playAudioClick('click');
                  }}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all duration-300 relative overflow-hidden flex gap-3.5 cursor-pointer ${
                    isActive 
                      ? 'bg-blue-950/40 border-blue-500/40 shadow-lg shadow-blue-500/5' 
                      : 'bg-[#020305]/70 border-white/5 hover:border-white/10 hover:bg-[#020305]/95'
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#FFB800]" />
                  )}
                  
                  <div className={`p-2 rounded-lg shrink-0 h-fit ${
                    isActive ? 'bg-[#FFB800] text-black' : 'bg-white/5 text-slate-400'
                  }`}>
                    <StepIcon className="w-4 h-4" />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold uppercase ${
                        isActive ? 'text-[#FFB800]' : 'text-slate-500'
                      }`}>
                        Passo 0{step.number}
                      </span>
                      <span className="text-[8px] font-mono text-slate-500 bg-white/[0.04] px-1.5 py-0.2 rounded-full font-bold">
                        {step.duration}
                      </span>
                    </div>
                    <h5 className={`text-xs font-semibold leading-tight ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}>
                      {step.title}
                    </h5>
                    <p className="text-[11px] text-slate-400 leading-normal">
                      {step.shortDesc}
                    </p>

                    {/* Expandable details when active */}
                    <AnimatePresence>
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.25 }}
                          className="pt-2 border-t border-white/5 mt-2 space-y-1.5"
                        >
                          {step.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-1.5 text-[10.5px] text-slate-300">
                              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1 shrink-0" />
                              <span className="leading-snug">{detail}</span>
                            </div>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Code viewer & Live sandbox response previewer */}
        <div className="lg:col-span-7 bg-[#020305]/95 border border-white/10 rounded-2xl p-4 sm:p-5 relative space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
            <div className="flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-400" />
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">
                Mapeamento do Barramento de Produção
              </span>
            </div>

            {/* Ministry pill filter inside code sandbox */}
            <div className="flex gap-1">
              {MINISTRY_PAYLOADS.map((min) => {
                const isSelected = min.id === activeMinId;
                return (
                  <button
                    key={min.id}
                    type="button"
                    onClick={() => {
                      setActiveMinId(min.id);
                      if (playAudioClick) playAudioClick('click');
                    }}
                    className={`px-2 py-1 rounded text-[9px] font-mono tracking-wide transition-all border cursor-pointer ${
                      isSelected 
                        ? 'bg-blue-600 border-blue-500 font-semibold text-white shadow-sm' 
                        : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                    }`}
                  >
                    {min.acronym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ministry metadata summary */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#05070a]/85 p-3 rounded-xl border border-white/5">
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Endpoint Homologado</span>
              <span className="text-[10px] font-mono text-blue-400 select-all font-semibold truncate block">
                {selectedMinistry.endPoint}
              </span>
            </div>
            <div>
              <span className="text-[8.5px] font-mono text-slate-500 uppercase tracking-wider block">Enlace Regulamentar</span>
              <span className="text-[10.5px] text-slate-300 font-sans truncate block flex items-center gap-1">
                <selectedMinistry.icon className="w-3.5 h-3.5 text-slate-400" />
                Dicionário {selectedMinistry.acronym} &lt;-&gt; FUC
              </span>
            </div>
          </div>

          {/* Field mappings table */}
          <div>
            <span className="text-[9px] font-mono text-slate-500 uppercase block mb-1.5 font-bold">Esquema de Campos Mandatórios</span>
            <div className="space-y-1.5 max-h-[110px] overflow-y-auto pr-1">
              {selectedMinistry.fields.map((field) => (
                <div key={field.name} className="flex justify-between items-center text-[10px] font-mono p-1.5 rounded bg-white/[0.02] border border-white/5 hover:border-white/10 transition-colors">
                  <div className="truncate pr-2">
                    <span className="text-[#FFB800] font-bold">"{field.name}"</span>
                    <span className="text-slate-500 ml-1.5">({field.type})</span>
                  </div>
                  <span className="text-slate-400 text-[9.5px] text-right truncate max-w-[210px] sm:max-w-xs font-sans">
                    {field.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Playload template code viewer */}
          <div className="relative">
            <div className="absolute top-2 right-2 flex items-center gap-1.5 z-10">
              <span className="text-[8px] font-mono text-slate-500 uppercase">JSON Template</span>
              <button
                type="button"
                onClick={handleCopyPayload}
                className="p-1 px-2 rounded bg-white/5 hover:bg-white/10 text-slate-200 hover:text-white transition-colors cursor-pointer text-[9.5px] font-mono border border-white/10 flex items-center gap-1"
              >
                {isCopied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" /> Copiado!
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3" /> Copiar
                  </>
                )}
              </button>
            </div>
            
            <pre className="p-3.5 rounded-xl bg-[#010203] border border-white/5 text-[10px] font-mono text-emerald-400 overflow-x-auto max-h-[160px] leading-relaxed select-all">
              <code>{selectedMinistry.payloadTemplate}</code>
            </pre>
          </div>

          <div className="text-[9.5px] font-mono text-slate-500 bg-[#05070a]/60 p-2.5 rounded-lg flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>Gateway Ativo: Emulação fiduciária integrada mTLS 1.3 ativa para verificação cadastral instantânea.</span>
          </div>

        </div>

      </div>

    </div>
  );
}
