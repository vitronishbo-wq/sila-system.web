import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { HelpCircle, ChevronDown, ChevronUp, BookOpen, MessageSquare, Shield, Globe, Award } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
  category: string;
  iconName: 'shield' | 'globe' | 'award' | 'book';
}

const FAQ_DATA: FaqItem[] = [
  {
    category: 'SEGURANÇA & SOBERANIA',
    iconName: 'shield',
    question: 'Como garante o SILA a soberania e segurança dos dados nacionais de Angola?',
    answer: 'O SILA opera sob uma infraestrutura de barramento soberana e criptografada, gerida em conformidade com as diretrizes do Ministério da Administração do Território (MAT). Toda e qualquer atualização efetuada na Ficha Única do Cidadão (FUC) gera logs imutáveis e auditáveis, garantindo que o Estado mantém o controlo e propriedade absolutos sobre a informação, protegendo-a contra acessos externos ou fraudes de duplicação.'
  },
  {
    category: 'INFRAESTRUTURA & RESILIÊNCIA',
    iconName: 'globe',
    question: 'Como é gerida a conectividade de rede em regiões rurais ou de conectividade limitada em Angola?',
    answer: 'O sistema foi desenhado especificamente para a realidade infraestrutural do país. Através de tecnologia de portabilidade offline robusta (aproveitando nossa cache local sincronizada via IndexedDB localtown), os balcões e escolas rurais conseguem interagir com o SILA mesmo sem acesso constante à Internet. Uma vez detectada uma ligação segura estável, os dados em cache são sincronizados automaticamente com a central operativa por lotes incrementais.'
  },
  {
    category: 'DESENVOLVIMENTO & ESCALA',
    iconName: 'award',
    question: 'Qual é o plano de expansão do projeto SILA após a fase piloto na Província do Huambo?',
    answer: 'O Huambo serve como o epicentro piloto focado no setor da Educação. Após a consolidação e homologação completa das operações nesta província, daremos início à integração regional faseada em Benguela e Bié, expandindo subsequentemente para as restantes províncias de Angola. O ecossistema também incorporará progressivamente módulos dedicados à Saúde, Finanças Locais e Proteção Social.'
  },
  {
    category: 'OTIMIZAÇÃO FINANCEIRA',
    iconName: 'book',
    question: 'De que forma o SILA contribui para a redução de custos e otimização dos orçamentos públicos?',
    answer: 'Ao unificar dados dispersos e automatizar a verificação mútua de registos civis, propinas e benefícios governamentais, o SILA elimina de imediato as perdas com corrupção de identidades fictícias e desvios de subvenções. Reduz a burocracia documental em papel físico e evita que os cidadãos percam dias de trabalho em deslocações consecutivas entre repartições públicas.'
  }
];

interface StrategicFaqProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function StrategicFaq({ playAudioClick }: StrategicFaqProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleItem = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      playAudioClick?.('click');
    } else {
      setExpandedIndex(index);
      playAudioClick?.('activation');
    }
  };

  const iconMap = {
    shield: <Shield className="w-4 h-4 text-emerald-400" />,
    globe: <Globe className="w-4 h-4 text-cyan-400" />,
    award: <Award className="w-4 h-4 text-amber-400" />,
    book: <BookOpen className="w-4 h-4 text-violet-400" />,
  };

  return (
    <div className="w-full space-y-8 py-12">
      
      {/* Grid Headline Intro */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFB800]/5 border border-[#FFB800]/10 text-[10px] font-mono font-bold tracking-wider text-[#FFB800] uppercase mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Esclarecimentos do Conselho Executivo</span>
        </div>
        <h4 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
          Perguntas Estratégicas & Respostas
        </h4>
        <p className="text-sm text-slate-400 mt-2 font-sans max-w-2xl">
          Análise detalhada das diretrizes tecnológicas, regulatórias e estruturais que sustentam o Sistema Integrado Local de Angola como pilar do Estado Ativo.
        </p>
      </div>

      {/* Accordion List container */}
      <div className="space-y-3.5 max-w-4xl">
        {FAQ_DATA.map((item, index) => {
          const isOpen = expandedIndex === index;
          return (
            <div
              key={index}
              id={`faq-item-${index}`}
              className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                isOpen 
                  ? 'bg-white/[0.02] border-blue-500/30 shadow-lg shadow-blue-950/5' 
                  : 'bg-[#030508]/60 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
              }`}
            >
              {/* Trigger Button bar */}
              <button
                onClick={() => toggleItem(index)}
                onMouseEnter={() => playAudioClick?.('hover')}
                className="w-full flex items-center justify-between text-left p-4 sm:p-5 gap-4 cursor-pointer focus:outline-none"
              >
                <div className="flex items-start sm:items-center gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-white/[0.02] border border-white/10 flex items-center justify-center shrink-0 mt-0.5 sm:mt-0">
                    {iconMap[item.iconName]}
                  </div>
                  <div className="space-y-1">
                    <span className="text-[9px] font-mono tracking-wider font-bold text-slate-500 uppercase block">
                      {item.category}
                    </span>
                    <span className="text-xs sm:text-sm font-sans font-medium text-slate-100 group-hover:text-white transition-colors">
                      {item.question}
                    </span>
                  </div>
                </div>
                
                <div className="shrink-0 p-1.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Collapsed/Expanded panel containing translated rich answer */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: 'easeInOut' }}
                  >
                    <div className="px-4 pb-5 pt-1 sm:px-5 sm:pb-6 ml-0 sm:ml-12 border-t border-white/[0.02]">
                      <div className="p-4 rounded-lg bg-[#010306]/85 border border-white/5">
                        <p className="text-xs sm:text-xs text-slate-300 font-sans leading-relaxed">
                          {item.answer}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

    </div>
  );
}
