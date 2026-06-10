import React from 'react';
import { motion } from 'motion/react';
import { 
  Sparkles, AlertTriangle, Lightbulb, Database, School, 
  Map, ShieldCheck, Play, Network, Rocket, HelpCircle, Target
} from 'lucide-react';

interface SovereignKeyTakeawayProps {
  sectionId: string;
  className?: string;
}

const TAKEAWAY_MAP: Record<string, {
  tag: string;
  title: string;
  impact: string;
  metric?: string;
  metricLabel?: string;
  icon: React.ComponentType<any>;
  colorClass: string;
  borderClass: string;
  bgGlow: string;
  ariaLabel: string;
}> = {
  hero: {
    tag: "ÂNCORA DO ESTADO DIGITAL",
    title: "Soberania de Dados Unificada",
    impact: "O SILA consolida os pilares de governação de Angola sob controle nacional absoluto, estabelecendo uma rede local resiliente a falhas e impermeável a interferências externas.",
    metric: "100%",
    metricLabel: "Soberania Nacional",
    icon: Sparkles,
    colorClass: "text-[#FFB800]",
    borderClass: "border-[#FFB800]/20",
    bgGlow: "bg-[#FFB800]/5",
    ariaLabel: "Destaque da Seção Início: Soberania de Dados Unificada do SILA"
  },
  problema: {
    tag: "DIAGNÓSTICO E CUSTO",
    title: "Vazamento Fiduciário Administrativo",
    impact: "Sistemas em silos geram desordem tributária e fraude cadastral. A desfragmentação atual atrasa os processos em até 14 dias para validações básicas de certidão civil.",
    metric: "03 Min",
    metricLabel: "Alvo de Saneamento",
    icon: AlertTriangle,
    colorClass: "text-rose-500",
    borderClass: "border-rose-500/20",
    bgGlow: "bg-rose-500/5",
    ariaLabel: "Destaque da Seção O Problema: Diagnóstico de Vazamento Fiduciário Administrativo"
  },
  visao: {
    tag: "PARADIGMA DA DESCENTRALIZAÇÃO",
    title: "Relação Ativa com o Cidadão",
    impact: "A visão descentralizada posiciona o Estado como prestador ativo: os dados viajam de modo assíncrono e integrado até ao cidadão, eliminando o tráfego manual de papéis entre balcões.",
    metric: "100%",
    metricLabel: "Interoperabilidade",
    icon: Lightbulb,
    colorClass: "text-amber-500",
    borderClass: "border-amber-500/20",
    bgGlow: "bg-amber-500/5",
    ariaLabel: "Destaque da Seção A Visão: Paradigma da Descentralização ativa com o cidadão"
  },
  fuc: {
    tag: "FICHA ÚNICA SÍNCRONA",
    title: "Token Criptográfico do Cidadão",
    impact: "A FUC une registos de nascimento, fichas médicas e registo de habilitações numa única estrutura descentralizada, atualizada instantaneamente pelas províncias.",
    metric: "Secu",
    metricLabel: "FUC Encriptada",
    icon: Database,
    colorClass: "text-cyan-400",
    borderClass: "border-cyan-400/20",
    bgGlow: "bg-cyan-400/5",
    ariaLabel: "Destaque da Seção A Ficha Única: Token Criptográfico Unificado do Cidadão"
  },
  educacao: {
    tag: "PILOTO TÁTICO",
    title: "Combate de Fraudes Biométricas",
    impact: "Como primeira âncora nacional, a Educação mapeia assiduidade e evita a duplicação ilícita de matrículas através de cruzamento de impressões digitais.",
    metric: "+82%",
    metricLabel: "Precisão de Cadastro",
    icon: School,
    colorClass: "text-[#FFB800]",
    borderClass: "border-[#FFB800]/20",
    bgGlow: "bg-[#FFB800]/5",
    ariaLabel: "Destaque da Seção Foco Educação: Combate de Fraudes Biométricas em Matrículas"
  },
  jornada: {
    tag: "MATRÍCULA DE SEGUNDOS",
    title: "Ciclo de Vida Académico Automatizado",
    impact: "A eliminação de certificados físicos e provas de vida manuais reduz o tempo médio de emissão de habilitações e diplomas escolares de semanas para meros segundos digitais.",
    metric: "< 10s",
    metricLabel: "Tempo de Emissão",
    icon: Map,
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/20",
    bgGlow: "bg-emerald-400/5",
    ariaLabel: "Destaque da Seção Jornada do Aluno: Ciclo de Vida Académico de menos de dez segundos"
  },
  capacidades: {
    tag: "RESILIÊNCIA DE OPERAÇÃO",
    title: "Auditoria Criptográfica Imutável",
    impact: "Implementação offline-first que garante conformidade de dados mesmo em zonas sem link de satélite estável. Dados são salvaguardados em cache segura.",
    metric: "99.9%",
    metricLabel: "Disponibilidade Local",
    icon: ShieldCheck,
    colorClass: "text-blue-500",
    borderClass: "border-blue-500/20",
    bgGlow: "bg-blue-500/5",
    ariaLabel: "Destaque da Seção Capacidades: Auditoria Criptográfica Imutável e Resiliência Local"
  },
  demonstracao: {
    tag: "SIMULAÇÃO EM TEMPO REAL",
    title: "Resiliência a Falhas Críticas",
    impact: "O módulo demonstrativo valida o poder do SILA sob interrupção de enlace com a nuvem central do MAT: as operações continuam locais e sincronizam ao reatar o link.",
    metric: "0ms",
    metricLabel: "Perda de Pacotes",
    icon: Play,
    colorClass: "text-purple-400",
    borderClass: "border-purple-400/20",
    bgGlow: "bg-purple-400/5",
    ariaLabel: "Destaque da Seção Demonstração: Resiliência a Falhas Críticas e Zero Perda de Dados"
  },
  arquitetura: {
    tag: "SILA HYBRID NODE",
    title: "Arquitetura Federada Nacional",
    impact: "Junção estratégica entre servidores físicos província-comuna com redundância em servidores de alta densidade do MAT para balanceamento ótimo de carga.",
    metric: "Node",
    metricLabel: "Arquitetura Híbrida",
    icon: Network,
    colorClass: "text-indigo-400",
    borderClass: "border-indigo-400/20",
    bgGlow: "bg-indigo-400/5",
    ariaLabel: "Destaque da Seção Arquitetura: Estrutura Federada com Redundância Ativa"
  },
  piloto: {
    tag: "CRONOGRAMA DE IMPLANTAÇÃO",
    title: "Metodologia Piloto Fracionada",
    impact: "Plano estruturado em 3 fases complementares: saneamento de dados escolares, comissionamento de rede local em comunas e consolidação de registros no MAT.",
    metric: "180d",
    metricLabel: "Fase de Estabilização",
    icon: Rocket,
    colorClass: "text-amber-500",
    borderClass: "border-amber-500/20",
    bgGlow: "bg-amber-500/5",
    ariaLabel: "Destaque da Seção Proposta Piloto: Cronograma de implantação em cento e oitenta dias"
  },
  faq: {
    tag: "MITIGAÇÃO DE RISCOS",
    title: "Respostas Diretas aos Decisores",
    impact: "Garantia de soberania jurídica. O SILA opera com software 100% autoral do MAT, eliminando dependências de fornecedores estrangeiros e protegendo a segurança interna.",
    metric: "Zero",
    metricLabel: "Burocracia Externa",
    icon: HelpCircle,
    colorClass: "text-blue-400",
    borderClass: "border-blue-400/20",
    bgGlow: "bg-blue-400/5",
    ariaLabel: "Destaque da Seção Perguntas Estratégicas: Mitigação de Riscos de Segurança"
  },
  conclusao: {
    tag: "FUTURO DO TERRITÓRIO",
    title: "Independência Digital Concreta",
    impact: "O SILA abre caminho para uma governação inteligente de base comunitária. Reduz desigualdades regionais conectando Angola de Cabinda ao Cunene de forma indelével.",
    metric: "SILA",
    metricLabel: "Angola Conectada",
    icon: Target,
    colorClass: "text-emerald-400",
    borderClass: "border-emerald-400/20",
    bgGlow: "bg-emerald-400/5",
    ariaLabel: "Destaque da Seção Conclusão: Futuro Federado e Independência Digital Concreta"
  }
};

export default function SovereignKeyTakeaway({ sectionId, className = "" }: SovereignKeyTakeawayProps) {
  const data = TAKEAWAY_MAP[sectionId];
  if (!data) return null;

  const IconComponent = data.icon;

  return (
    <motion.div
      role="region"
      aria-label={data.ariaLabel}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`relative w-full overflow-hidden rounded-2xl border ${data.borderClass} ${data.bgGlow} p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans select-none ${className}`}
    >
      {/* Background Micro Light Accent Pillar */}
      <div className="absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b from-blue-500 to-emerald-500 pointer-events-none" />

      <div className="flex items-start gap-3.5 flex-1 pl-1">
        {/* Rounded Hexagon Icon Wrapper */}
        <div className={`mt-0.5 p-2 rounded-xl bg-white/[0.03] border border-white/5 shrink-0 flex items-center justify-center ${data.colorClass}`}>
          <IconComponent className="w-5 h-5" aria-hidden="true" />
        </div>

        {/* Narrative columns */}
        <div className="space-y-1">
          {/* Tag heading */}
          <span className={`text-[9px] font-mono font-bold uppercase tracking-widest ${data.colorClass}`}>
            {data.tag}
          </span>
          {/* Takeaway Bold declaration */}
          <h4 className="text-sm font-medium text-slate-100 tracking-tight">
            {data.title}
          </h4>
          {/* Main screen reader content along with custom explanatory text for high visual impact */}
          <p className="text-xs text-slate-400 leading-relaxed font-normal">
            <span className="sr-only">Impacto Fundamental: </span>
            {data.impact}
          </p>
        </div>
      </div>

      {/* Numerical Impact Tag badge element (Sovereign Metrics style) */}
      {data.metric && (
        <div className="sm:border-l border-white/10 sm:pl-5 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center w-full sm:w-auto shrink-0 gap-1 pt-3 sm:pt-0 border-t border-dashed border-white/5 sm:border-t-0">
          <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
            {data.metricLabel}
          </span>
          <span className={`text-base font-bold font-mono tracking-tight leading-none ${data.colorClass}`}>
            {data.metric}
          </span>
        </div>
      )}
    </motion.div>
  );
}
