import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, CornerDownLeft, Sparkles, FolderKanban, Milestone, X, Command } from 'lucide-react';

interface SearchItem {
  id: string;
  title: string;
  description: string;
  tags: string[];
}

const SEARCH_ITEMS: SearchItem[] = [
  {
    id: 'hero',
    title: 'Início',
    description: 'Soberania Tecnológica e Integração Nacional em Angola.',
    tags: ['inicio', 'home', 'abertura', 'mat', 'sila', 'soberania', 'apresentacao']
  },
  {
    id: 'problema',
    title: 'O Problema (Métricas de Desperdício)',
    description: 'Burocracia, dados desfragmentados e custos de duplicação cívica.',
    tags: ['problema', 'desperdicio', 'perda', 'duplicidade', 'burocracia', 'custos', 'milhoes']
  },
  {
    id: 'visao',
    title: 'A Visão do Ecossistema',
    description: 'Ligação federada de municípios e administração provincial.',
    tags: ['visao', 'unificador', 'tecido', 'provincial', 'municipal', 'estado digital']
  },
  {
    id: 'fuc',
    title: 'A Ficha Única do Cidadão (FUC)',
    description: 'Repositório soberano com portfólio digital seguro e imutável do cidadão.',
    tags: ['fuc', 'ficha unica', 'cidadao', 'bi', 'bilhete', 'identidade', 'registo', 'imutavel']
  },
  {
    id: 'educacao',
    title: 'Foco Educação Nacional',
    description: 'Controlo síncrono de matrículas, propinas e eliminação de pautas fantasma.',
    tags: ['educacao', 'ensino', 'escola', 'estudante', 'matriculas', 'propinas', 'pautas', 'alunos']
  },
  {
    id: 'jornada',
    title: 'Jornada do Aluno Carlos',
    description: 'Caminho interativo desmaterializado entre a infância e a maioridade académica.',
    tags: ['jornada', 'carlos', 'chilombo', 'aluno', 'vida', 'ensino primario', 'ensino medio']
  },
  {
    id: 'capacidades',
    title: 'Capacidades Tecnológicas',
    description: 'Segurança criptográfica, georreferenciação e governança de dados.',
    tags: ['capacidades', 'seguranca', 'criptografia', 'georeferenciacao', 'blockchain', 'tecnologia']
  },
  {
    id: 'demonstracao',
    title: 'Demonstração Interativa',
    description: 'Visualizador de áudio progressivo SILA Vision e reprodutor midiático.',
    tags: ['demonstracao', 'video', 'interativo', 'media', 'reprodutor', 'audio', 'teaser']
  },
  {
    id: 'arquitetura',
    title: 'Arquitetura de Interoperabilidade',
    description: 'Barramento seguro que interliga ministérios e administrações em tempo real.',
    tags: ['arquitetura', 'interoperabilidade', 'barramento', 'sincronizacao', 'nif', 'justica', 'financas']
  },
  {
    id: 'piloto',
    title: 'Proposta Piloto 2026',
    description: 'Ativação faseada no Huambo e Luanda com cronograma e metas claras.',
    tags: ['piloto', 'huambo', 'luanda', 'fase', 'proposta', 'cronograma', 'equipa']
  },
  {
    id: 'faq',
    title: 'Perguntas Estratégicas (FAQ)',
    description: 'Respostas detalhadas sobre segurança, offline e soberania nacional.',
    tags: ['faq', 'perguntas', 'respostas', 'seguranca', 'offline', 'custos', 'licensing', 'software livre']
  },
  {
    id: 'conclusao',
    title: 'Conclusão e Próximos Passos',
    description: 'Discurso final da equipa técnica sobre a revolução digital do MAT.',
    tags: ['conclusao', 'agradecimento', 'equipa', 'encerramento', 'aprovacao']
  }
];

interface SovereignSearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (sectionId: string) => void;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function SovereignSearchPalette({
  isOpen,
  onClose,
  onNavigate,
  playAudioClick,
}: SovereignSearchPaletteProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Search filter
  const filteredItems = SEARCH_ITEMS.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some((tag) => tag.toLowerCase().includes(q))
    );
  });

  // Handle Ctrl+K shortcut to toggle parent and ESC to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open handled by parent or by calling trigger since we listen globally
        }
      } else if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Handle input focus on open
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedIndex(0);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
      playAudioClick?.('activation');
    }
  }, [isOpen]);

  // Keep index in bound
  useEffect(() => {
    if (selectedIndex >= filteredItems.length) {
      setSelectedIndex(Math.max(0, filteredItems.length - 1));
    }
  }, [filteredItems, selectedIndex]);

  // Handle key navigation inside list
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (filteredItems.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredItems.length);
      playAudioClick?.('hover');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length);
      playAudioClick?.('hover');
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSelectItem(filteredItems[selectedIndex]);
    }
  };

  const handleSelectItem = (item: SearchItem) => {
    onNavigate(item.id);
    playAudioClick?.('click');
    onClose();
  };

  // Scroll active item into view
  useEffect(() => {
    if (listRef.current) {
      const activeEl = listRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] px-4">
          
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#020508]/85 backdrop-blur-md cursor-pointer"
          />

          {/* Search box container */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -15, scale: 0.98, filter: 'blur(8px)' }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative w-full max-w-xl bg-[#070b13] border border-blue-500/20 rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[500px]"
          >
            {/* Top light accent */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />

            {/* Input Wrap */}
            <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/5 relative bg-white/[0.01]">
              <Search className="w-5 h-5 text-blue-400 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                onKeyDown={handleInputKeyDown}
                placeholder="Pesquisar secção... (ex: FUC, Educação, Piloto)"
                className="w-full bg-transparent text-slate-100 placeholder-slate-500 text-sm focus:outline-none font-sans font-normal"
              />
              <button 
                onClick={onClose}
                className="p-1 text-slate-500 hover:text-slate-300 rounded hover:bg-white/5 transition-colors"
                title="Fechar (ESC)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List results */}
            <div 
              ref={listRef}
              className="flex-1 overflow-y-auto p-2 space-y-1 scrollbar-thin select-none"
            >
              {filteredItems.length > 0 ? (
                filteredItems.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <div
                      key={item.id}
                      onClick={() => handleSelectItem(item)}
                      onMouseEnter={() => {
                        setSelectedIndex(index);
                      }}
                      data-active={isSelected ? 'true' : 'false'}
                      className={`group flex items-center justify-between p-3 rounded-xl transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-600/10 border border-blue-500/30 text-white pl-4'
                          : 'border border-transparent text-slate-400 hover:text-slate-200 hover:bg-white/[0.01]'
                      }`}
                    >
                      <div className="flex flex-col gap-0.5">
                        <span className={`text-xs font-sans font-semibold flex items-center gap-1.5 ${
                          isSelected ? 'text-blue-400' : 'text-slate-300'
                        }`}>
                          <Sparkles className="w-3 h-3 text-blue-400/80" />
                          {item.title}
                        </span>
                        <span className="text-[10px] text-slate-500 font-sans leading-relaxed">
                          {item.description}
                        </span>
                      </div>

                      {/* Select/Enter indicators */}
                      {isSelected && (
                        <span className="flex items-center gap-1 text-[9px] font-mono text-slate-400 bg-white/5 py-1 px-1.5 rounded border border-white/5 uppercase">
                          Ir para
                          <CornerDownLeft className="w-3 h-3 text-blue-400" />
                        </span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="py-8 text-center flex flex-col items-center justify-center gap-2">
                  <span className="text-slate-500 text-xs font-mono">Sem resultados para "{searchQuery}"</span>
                  <span className="text-[10px] text-slate-600 font-sans max-w-xs leading-relaxed">
                    Tente outras palavras como "MAT", "Interoperabilidade", "Huambo" ou "Conclusão".
                  </span>
                </div>
              )}
            </div>

            {/* Custom Footer */}
            <div className="px-4 py-2 border-t border-white/5 bg-white/[0.01] flex items-center justify-between text-[9px] font-mono text-slate-500">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 px-1 bg-white/5 border border-white/10 rounded">
                  &uarr;&darr;
                </span>
                <span>Navegar</span>
                <span className="flex items-center gap-1 px-1 bg-white/5 border border-white/10 rounded">
                  Enter
                </span>
                <span>Selecionar</span>
              </div>
              <div className="flex items-center gap-1">
                <span>Atalho Global:</span>
                <span className="flex items-center gap-0.5 px-1 bg-white/5 border border-white/10 rounded font-semibold text-blue-500">
                  <Command className="w-2.5 h-2.5" />
                  K
                </span>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
