import React, { createContext, useContext, useState, useEffect } from 'react';

export type Language = 'pt' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Comprehensive dictionary translating key UI phrases, section names, descriptions, buttons and tooltips
const dictionary: Record<string, string> = {
  // Navigation / Sections
  'Início': 'Home',
  'O Problema': 'The Problem',
  'A Visão': 'The Vision',
  'A Ficha Única': 'Sovereign Record (FUC)',
  'Foco Educação': 'Education Focus',
  'Jornada Aluno': 'Student Journey',
  'Capacidades': 'Capabilities',
  'Demonstração': 'Live Demo',
  'Estatísticas': 'Live Dashboard',
  'Arquitetura': 'Architecture',
  'Proposta Piloto': 'Pilot Proposals',
  'Perguntas Estratégicas': 'Strategic Q&A',
  'Conclusão': 'Conclusion',

  // Header Details & Settings
  'Sist. Integrado Local de Angola': "Angola's Local Integrated System",
  'Estatal': 'State-Owned',
  'PILOTO CONDUZIDO': 'MANUAL AP',
  'PILOTO: ATIVO': 'AUTOPILOT: ACTIVE',
  'MODO OFFLINE': 'OFFLINE MODE',
  'SISTEMA ONLINE': 'SYSTEM ONLINE',
  'CACHE-INDEXEDDB': 'CACHE-INDEXEDDB',
  'ANG-SECURE': 'ANG-SECURE',
  'Acessibilidade Visual': 'Visual Accessibility',
  'Alto Contraste': 'High Contrast',
  'Fidelidade Extrita (WCAG)': 'Strict Contrast (WCAG)',
  'Modo Daltonismo (Cores)': 'Colorblind Mode',
  'Cores Normais': 'Normal Colors',
  'Cores Padrão': 'Default Colors',
  'Protanopia': 'Protanopia',
  'Deuteranopia': 'Deuteranopia',
  'Tritanopia': 'Tritanopia',
  'MODOS DE DALTONISMO (MOBILE)': 'COLORBLIND MODES (MOBILE)',
  'TEMA DE COR': 'COLOR THEME',
  'ESTILO CLARO': 'LIGHT MODE',
  'ESTILO ESCURO': 'DARK MODE',
  'NOTAS DE APRESENTADOR': 'PRESENTER NOTES',
  'BUSCA GLOBAL (CTRL+K)': 'GLOBAL SEARCH (CTRL+K)',
  'ABRIR': 'OPEN',
  'RELATÓRIO EXECUTIVO (A4/PDF)': 'EXECUTIVE REPORT (A4/PDF)',
  'AUTOPLAY DE APRESENTAÇÃO': 'AUTOPLAY PRESENTATION',
  'SIMULAÇÃO DE CORTE': 'INTERNET SIMULATOR',
  'SUPORTE LOCALTOWN': 'LOCAL CACHE',
  'Ativa': 'Active',
  'Mais...': 'More...',

  // Hero Section / Brand values
  'Estado Digital Soberano': 'Sovereign Digital State',
  'Sistema Integrado Local de Angola': 'Angola Local Integrated System',
  'Uma plataforma nacional robusta para conectar e interoperar cidadãos, instituições locais e serviços públicos na República de Angola.': 'A robust national platform to connect and interoperate citizens, local institutions, and public services within the Republic of Angola.',
  'Princípio Constitucional': 'Constitutional Principle',
  'O cidadão fornece os dados uma única vez.': 'The citizen provides data only once.',
  'Explorar o Futuro do Estado': 'Explore the Future of State',
  'Solicitar Piloto Operacional': 'Request Operational Pilot',
  'Soberania Digital e Desmaterialização Estatal': 'Digital Sovereignty & State Dematerialization',
  'O barramento federal soberano que unifica o registo civil, a educação nacional e a administração do território de Angola com interoperação segura em tempo real.': 'The sovereign federal bus that unifies civil registries, national education, and Angola territory administration with secure real-time interoperability.',
  'CONECTANDO MUNICÍPIOS EXPRESSEMENTE': 'EXPRESSLY CONECTING MUNICIPALITIES',
  'Explorar o SILA': 'Explore SILA',
  'Ler Plano Executivo': 'Read Executive Plan',
  'o cidadão fornece os dados uma única vez': 'the citizen provides data only once',
  'TECNOLOGIA DE PONTA': 'CUTTING EDGE TECH',
  'SEM DEPENDÊNCIA EXTERNA': 'NO EXTERNAL LOCK-IN',
  'PRIVACIDADE CONSTITUCIONAL': 'CONSTITUTIONAL PRIVACY',

  // Section Headers & Titles
  'O Desafio da Burocracia': 'The Challenge of Bureaucracy',
  'As perdas invisíveis na governação de dados públicos angolanos': 'Invisibles leaks in Angolan public data governance',
  'A Visão Unificada SILA': 'The Unified SILA Vision',
  'Desmaterialização sob soberania tecnológica nacional': 'Dematerialization under national technological sovereignty',
  'Ficha Única do Cidadão (FUC)': 'Sole Citizen Record (FUC)',
  'Um portfólio digital seguro, integrado e imutável por toda a vida': 'A secure, integrated, and lifetime-immutable digital portfolio',
  'Soberania de Dados na Educação': 'Data Sovereignty in National Education',
  'Matrículas limpas, eliminação de pautas fantasma e segurança operacional': 'Clean enrolments, ghost school list elimination, and operational security',
  'O Percurso Digital de': 'Firsthand Digital Journey of',
  'Interação assistida da infância à maioridade académica': 'Assisted lifecycle interaction from childhood to academic adulthood',
  'Capacidades Tecnológicas SILA': 'SILA Technological Capabilities',
  'Módulos robustos de segurança e auditabilidade centralizada': 'Robust safety and centralized auditability modules',
  'SILA Vision & Demostração': 'SILA Vision & Demo Showcase',
  'Interatividade multissensorial com simulação de fluxos': 'Multisensory interactivity with real-time flow simulation',
  'Painel Executivo SILA Ledger': 'SILA Ledger Executive Dashboard',
  'Economias de papel, tintas e horas de trabalho no plano nacional': 'Paper, ink, and operational hours saved on a national scale',
  'Arquitetura de Interoperabilidade': 'Interoperability Architecture',
  'O Barramento de Integração de Dados Federais SILA': 'The SILA Federal Data Integration Bus',
  'Proposta de Implementação Piloto': 'Implementation Pilot Proposals',
  'Huambo e Luanda liderando a desmaterialização estatal no 1º Semestre': 'Huambo and Luanda leading state dematerialization in the first semester',
  'Perguntas Frequentes & Estratégias': 'Frequently Asked Questions & Strategy',
  'Esclarecimento técnico direto sobre soberania de bases de dados': 'Direct technical clarification on Database Sovereignty',
  'Declaração Final de Soberania': 'Final Declaration of Digital Sovereignty',
  'Aprovado pelo Gabinete Técnico do MAT Angola': 'Approved by the MAT Angola Technical Cabinet',

  // Problem Section
  'Dados Fragmentados': 'Fragmented Data',
  'Bases de dados isoladas por província e ministério sem comunicação mútua.': 'Databases isolated by province and ministry without mutual communication.',
  'Processos Manuais': 'Manual Processes',
  'Do fluxo de matrícula e emissão de certificados civis e escolares assenta em papel.': 'Of the enrolment workflow and certificate issuing relies on paper.',
  'Duplicação Crítica': 'Critical Duplication',
  'Vezes em que o cidadão precisa fornecer os mesmos documentos a instituições do Estado.': 'Times a citizen needs to present the same paperwork to State agencies.',
  'Interoperabilidade Zero': 'Zero Interoperability',
  'Incapacidade técnica dos sistemas escolares falarem com o registo civil nacional.': 'Technical inability of school databases to talk back to national civil registry.',

  // Pilot proposals / CSV Section
  'FILTRAR PROJEÇÃO': 'FILTER PROJECTION',
  'EXPORTAR CSV': 'EXPORT CSV',
  'Todos Setores': 'All Sectors',
  'Educação': 'Education',
  'Saúde': 'Health',
  'Administração': 'Administration',
  'Alerta de Eficiência Notável': 'Notable Efficiency Alert',
  'SUPEROU 80% DA META!': 'EXCEEDED 80% OF REVENUE TARGET!',
  'Disparar Brilhos': 'Burst Confetti',
  'Filtrar Projeção de Economia por Setor': 'Filter Economics Projection by Sector',
  'Previsão acumulada de economia pública baseada em otimização do barramento': 'Accumulated public savings forecasting based on bus optimization',

  // Save Buttons / General Buttons
  'Simulador: Conexão Cortada. Clique para restabelecer.': 'Simulator: Connection cut. Click to restore link.',
  'Simulador: Ligado à Internet. Clique para cortar e testar cache IndexedDB.': 'Simulator: Connected. Click to cut and test IndexedDB cache.',
  'Parar Piloto Automático': 'Stop Autopilot',
  'Ativar Piloto Automático (Apresentação)': 'Activate Autopilot (Presentation)',
  'Salvar Notas': 'Save Notes',
  'Pesquisa Avançada': 'Advanced Search',
  'Pesquise tópicos...': 'Search themes...',
  'Fechar': 'Close',

  // MAT meeting
  'Agendar Sessão Técnica de Alinhamento com o MAT': 'Schedule Technical MAT Alignment Session',
  'Escolha uma data e horário para alinhar o piloto SILA com a coordenação nacional.': 'Pick a date and slot to align the SILA pilot with national coordination.',
  'Agendar Reunião': 'Schedule Meeting',
  'Reunião agendada com sucesso!': 'Meeting successfully scheduled!',
  'Data da Reunião': 'Meeting Date',
  'Hora': 'Hour',
  'Nome do Responsável': 'Official Name',
  'Departamento/Setor': 'Department/Sector',

  // Presenter notes fallback
  "Apresentação de abertura. Destacar a visão de soberania tecnológica, a integração nacional e o lema 'o cidadão fornece os dados uma única vez'. Ideal para captar de imediato o interesse do Gabinete Presidencial e do MAT.": "Opening address. Highlight technological sovereignty, national integration, and the motto 'citizens provide data once'. Best to grab Presidential Cabinet and MAT interest.",
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    // Preserve language choice across refreshes
    const saved = localStorage.getItem('sila-lang');
    return (saved as Language) || 'pt';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('sila-lang', lang);
  };

  // Translation helper function
  const t = (text: string): string => {
    if (language === 'pt') return text;
    
    // Exact dictionary match
    if (dictionary[text]) {
      return dictionary[text];
    }

    // Fallback checks or dynamic translation rules can be placed here if needed
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
