import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  HelpCircle, ChevronDown, ChevronUp, BookOpen, MessageSquare, Shield, Globe, Award, 
  Search, X, Sparkles, Scale, Coins, Database, Check, Landmark, ArrowRight
} from 'lucide-react';

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category: 'Segurança & Soberania' | 'Infraestrutura & Conexão' | 'Educação & Integração' | 'Legal & Orçamento';
  iconName: 'shield' | 'globe' | 'award' | 'book' | 'scale' | 'coins' | 'database';
  tags: string[];
}

const FAQ_DATA: FaqItem[] = [
  {
    id: 'faq-soberania',
    category: 'Segurança & Soberania',
    iconName: 'shield',
    question: 'Como é garantida de forma absoluta a soberania tecnológica e a imunidade contra falhas de fornecedores externos?',
    answer: 'Toda a infraestrutura informática e de comunicações do SILA é alojada de forma soberana em centros de dados públicos redundantes do Estado Angolano, geridos diretamente pelo MAT em Luanda e com réplicas seguras no Huambo, sem subcontratação de custódia de dados ou chaves criptográficas a corporações externas. O barramento de dados corre sob protocolos ultra-seguros TLS 1.3 de ponta-a-ponta e criptografia em repouso AES-256 baseada em módulos de segurança HSM (Hardware Security Module) locais. Isto garante que somente as entidades do Estado Angolano legalmente autorizadas consigam interagir com a Ficha Única do Cidadão (FUC), e toda e qualquer mutação de dados gera logs imutáveis e auditáveis contra adulterações.',
    tags: ['criptografia', 'soberania', 'hsm', 'segurança', 'fuc', 'redes', 'dados']
  },
  {
    id: 'faq-conectividade',
    category: 'Infraestrutura & Conexão',
    iconName: 'globe',
    question: 'Como funciona a tecnologia de sincronização híbrida (on/off) em municípios sem cobertura estável de redes?',
    answer: 'O SILA foi concebido de raiz respeitando a realidade geográfica de Angola. Cada polo descentralizado, incluindo escolas em localidades isoladas, corre uma base de dados SQLite local hiper-otimizada a funcionar como buffer offline resiliente. Quando o canal de telecomunicações (seja fibra, satélite Angosat-2 ou feixe micro-ondas) fica indisponível, os operadores efetuam as matrículas, registo de faltas e avaliações letivas normalmente de modo local. O sistema consolida as transações em pacotes binários compactos com assinaturas digitais locais. Assim que o gateway reconeta de forma temporária ou periódica (seja 3G, satélite ou mesmo pen drive rádio-frequência), o mecanismo Delta-Sync reconcilia a informação com o nó central do Huambo de forma automática e resolve conflitos cronológicos através de carimbos de tempo unificados.',
    tags: ['offline', 'sincronização', 'delta-sync', 'satélite', 'angosat-2', 'huambo', 'redes']
  },
  {
    id: 'faq-cadastro',
    category: 'Educação & Integração',
    iconName: 'database',
    question: 'Qual o verdadeiro impacto prático da unificação cadastral entre o MAT e o MED no combate a estudantes fictícios?',
    answer: 'Anteriormente, o planeamento de alocações orçamentais dependia de relatórios anuais em papel preenchidos autonomamente em cada círculo escolar, o que abria margem para duplicações intencionais ou desvios de subvenções sob a forma de "alunos fantasma". O SILA erradica esta vulnerabilidade ligando nativamente as bases de dados civis do MAT (via Balcão Único BUAP) ao sistema pedagógico do MED. No instante em que é solicitada a matrícula de um aluno, a plataforma consulta instantaneamente a Ficha Única do Cidadão (FUC), certificando a unicidade civil do aluno. Isto blinda o tesouro provincial e assegura que as verbas destinadas à merenda escolar, fardas e material de apoio técnico sejam canalizados rigorosamente para crianças reais identificadas por biométrica.',
    tags: ['matrícula', 'buap', 'estudantes', 'falso', 'combate à fraude', 'fuc', 'finanças']
  },
  {
    id: 'faq-protecao-dados',
    category: 'Legal & Orçamento',
    iconName: 'scale',
    question: 'Como é assegurado o cumprimento estrito da Lei da Proteção de Dados de Carácter Pessoal de Angola (Lei nº 22/11)?',
    answer: 'O tratamento de dados no SILA obedece escrupulosamente à Lei nº 22/11 que regula a Proteção de Dados de Carácter Pessoal em Angola. Todos os dados biométricos, identidades civis e estatísticas de menores do Huambo sob processamento técnico contam com mascaramento lógico (pseudonimização) nas camadas intermédias de transporte de rede. Os dados pertencem única e exclusivamente aos estudantes e aos seus encarregados de educação válidos civilmente. É terminantemente proibida por portaria do MAT qualquer transferência ou exportação transfronteiriça de dados de cidadãos angolanos. O sistema garante o direito de retificação imediata direto nos balcões oficiais integrados.',
    tags: ['lei 22/11', 'privacidade', 'rgpd', 'legislação', 'estudantes', 'menores']
  },
  {
    id: 'faq-economia',
    category: 'Legal & Orçamento',
    iconName: 'coins',
    question: 'De que forma a desmaterialização total do papel e dos dossiers gera fundos líquidos redirecionáveis para as escolas?',
    answer: 'O processo tradicional e burocrático de registar, emitir cartões, carimbar cadastros de notas e validar transferências obriga a província do Huambo a desbaratar fortunas com a aquisição de papel físico, consumíveis de impressão, manutenção de arquivos analógicos vulneráveis e despesas substanciais de transporte e logística. Com a digitalização soberana do SILA, a pegada de papel cai {((455 - 67)/455 * 100).toFixed(0)}%, comprimindo o encargo financeiro da província de 455M AOA para apenas 67M AOA anuais. A verba remanescente de 388 milhões de Kwanzas poupados é gerida sob dotação direta que reverte nativamente no reforço da alimentação escolar local e na conectividade fotovoltaica administrativa e técnica das escolas primárias rurais.',
    tags: ['economia', 'kwanzas', 'orçamento', 'sustentabilidade', 'papel', 'eficiência']
  },
  {
    id: 'faq-sem-documento',
    category: 'Educação & Integração',
    iconName: 'award',
    question: 'Como é feito o acolhimento de alunos rurais que ainda não possuem certidão de nascimento ou bilhete de identidade?',
    answer: 'O SILA foi programado para atuar como um autêntico indutor de cidadania gratuita e inclusiva. Sempre que uma criança se apresenta para matrícula e o encarregado reporta a falta de registo civil primário, a escola oficial inicia um fluxo integrado que comunica diretamente com os BUAPs móveis (Balcão Único) do MAT na província do Huambo. É gerado um identificador provisório biometricamente amparado pela Ficha Única do Cidadão (FUC), que autoriza de forma plena a integração escolar do menor e evita a sua exclusão pedagógica. Paralelamente, uma brigada do MAT encarrega-se de formalizar o registo definitivo de nascimento do menor e de emitir a cédula nacional sem encargos para a família.',
    tags: ['inclusão', 'identidade', 'buap', 'cédula', 'sem registo', 'cidadania', 'criança']
  },
  {
    id: 'faq-saude',
    category: 'Educação & Integração',
    iconName: 'book',
    question: 'O ecossistema do SILA inclui também dados de saúde e vacinação dos estudantes na mesma ficha unificada?',
    answer: 'Sim. A visão estratégica do SILA enquanto pilar do Estado Ativo Angolano reside exatamente na multissetorialidade biográfica coordenada. Integrado em plena sintonia com as brigadas provinciais de vacinação e triagem pediátrica do Ministério da Saúde (MINSA), a Ficha Única do Cidadão (FUC) do estudante possui uma secção clínica encriptada. Através desta secção, registam-se dados sobre a imunização básica, testes de acuidade visual que prejudiquem a literacia infantil e dados nutricionais. Com isso, os diretores escolares e delegações públicas locais têm acesso automatizado a mapas estatísticos epidemiológicos para conter preventivamente surtos de malária ou direcionar regimes suplementares calóricos personalizados.',
    tags: ['saúde', 'vacinas', 'minsa', 'pediatria', 'fuc', 'nutrição', 'multi-setorial']
  },
  {
    id: 'faq-escala-tempo',
    category: 'Infraestrutura & Conexão',
    iconName: 'globe',
    question: 'Por que motivo a Província do Huambo foi selecionada para o Nó Piloto e qual o horizonte de escala para Luanda?',
    answer: 'O Huambo foi estrategicamente eleito devido às suas caraterísticas ricas em diversidade demográfica e geográfica: constitui uma província robusta que intercala e agrega polos administrativos amplamente digitais (fibra urbana) com territórios rurais expostos a severos desafios logísticos de comunicação, constituindo o laboratório de stress sistémico ideal. A implantação no Huambo decorre em 90 dias com o objetivo de cadastrar 205.000 alunos de ponta-a-ponta em 11 municípios. Com a chancela de estabilidade técnica adquirida, a infraestrutura migra para a Fase 2 e 3 incluindo províncias de alta densidade como Luanda e Benguela, prevendo-se o suporte escalável de 4,5 milhões de utilizadores móveis e integrados.',
    tags: ['escala', 'luanda', 'huambo', 'planeamento', 'fase-piloto', 'cronograma']
  }
];

// Busca Rápida interface and sub-component definition
interface BuscaRapidaProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  categories: string[];
  totalResults: number;
  totalItems: number;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

function BuscaRapida({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  categories,
  totalResults,
  totalItems,
  playAudioClick
}: BuscaRapidaProps) {
  const suggestedTerms = ['Lei 22/11', 'BUAP', 'offline', 'Huambo', 'fraude', 'merenda'];

  return (
    <div className="bg-gradient-to-b from-[#090d16] to-[#04060a]/90 border border-white/10 p-5 rounded-2xl space-y-4 max-w-4xl relative z-10 shadow-2xl">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 rotate-12" /> Busca Rápida de Regulamentos
        </span>
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[8.5px] font-mono text-emerald-400 uppercase font-bold tracking-wide">Filtro Ativo</span>
        </div>
      </div>

      {/* Search Input Box */}
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
          <Search className="w-4 h-4 text-[#FFB800]" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Digite palavras-chave, decretos ou conceitos..."
          className="w-full pl-10 pr-10 py-3 rounded-xl bg-[#020305]/95 border border-white/10 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#FFB800]/50 focus:ring-1 focus:ring-[#FFB800]/10 transition-all font-sans"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              playAudioClick?.('click');
            }}
            className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-500 hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Suggested Search Terms */}
      <div className="flex flex-wrap items-center gap-1.5 text-[10px] font-mono">
        <span className="text-slate-500 font-bold mr-1 uppercase text-[9px] tracking-wider">Sugestões:</span>
        {suggestedTerms.map((term) => (
          <button
            key={term}
            type="button"
            onClick={() => {
              setSearchQuery(term);
              playAudioClick?.('activation');
            }}
            className="px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 hover:text-white hover:bg-white/10 transition-colors cursor-pointer text-[9.5px]"
          >
            "{term}"
          </button>
        ))}
      </div>

      <div className="border-t border-white/5 pt-3 space-y-3">
        {/* Category Pills line */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wider mr-2 font-bold select-none h-fit">
            Filtrar Categoria:
          </span>
          <div className="flex flex-wrap gap-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    playAudioClick?.('click');
                  }}
                  className={`px-3 py-1 rounded-lg text-[9.5px] font-mono tracking-wide transition-all duration-200 cursor-pointer border ${
                    isSelected 
                      ? 'bg-[#FFB800] text-black font-semibold border-[#FFB800] shadow-md shadow-[#FFB800]/5' 
                      : 'bg-white/[0.02] text-slate-400 border-white/5 hover:border-white/10 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Small results indicator */}
        <div className="flex items-center justify-between text-[9px] font-mono text-slate-500 pt-1 border-t border-white/[0.03]">
          <span className="flex items-center gap-1">
            <span className="w-1 h-1 rounded-full bg-blue-500" />
            Mecanismo de Pesquisa Indexada SILA
          </span>
          <span>
            {totalResults === totalItems 
              ? `${totalItems} perguntas listadas` 
              : `${totalResults} de ${totalItems} correspondências encontradas`}
          </span>
        </div>
      </div>
    </div>
  );
}

interface StrategicFaqProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function StrategicFaq({ playAudioClick }: StrategicFaqProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');

  const categories = useMemo(() => {
    return ['Todos', 'Segurança & Soberania', 'Infraestrutura & Conexão', 'Educação & Integração', 'Legal & Orçamento'];
  }, []);

  // Filter FAQ items dynamically based on search query AND category selector
  const filteredFaq = useMemo(() => {
    return FAQ_DATA.filter(item => {
      // Category filter check
      const matchesCategory = selectedCategory === 'Todos' || item.category === selectedCategory;
      
      // Search text query check (matches question, answer, tags or category text)
      if (!searchQuery.trim()) return matchesCategory;
      
      const query = searchQuery.toLowerCase().trim();
      const matchesText = 
        item.question.toLowerCase().includes(query) ||
        item.answer.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.tags.some(tag => tag.toLowerCase().includes(query));

      return matchesCategory && matchesText;
    });
  }, [searchQuery, selectedCategory]);

  const toggleItem = (index: number) => {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      playAudioClick?.('click');
    } else {
      setExpandedIndex(index);
      playAudioClick?.('activation');
    }
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setExpandedIndex(null); // Collapse open accordions on filter switch
    playAudioClick?.('click');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    playAudioClick?.('click');
  };

  // Utility to structurally highlight matched text inside questions or answers
  const renderHighlightedText = (text: string, search: string) => {
    if (!search.trim()) return text;
    const regex = new RegExp(`(${search.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) => 
      regex.test(part) 
        ? <mark key={i} className="bg-amber-500/30 text-amber-200 rounded px-0.5 border-b border-amber-500/50 font-semibold">{part}</mark> 
        : part
    );
  };

  const iconMap = {
    shield: <Shield className="w-4 h-4 text-emerald-400" />,
    globe: <Globe className="w-4 h-4 text-cyan-400" />,
    award: <Award className="w-4 h-4 text-amber-400" />,
    book: <BookOpen className="w-4 h-4 text-violet-400" />,
    scale: <Scale className="w-4 h-4 text-rose-400" />,
    coins: <Coins className="w-4 h-4 text-[#FFB800]" />,
    database: <Database className="w-4 h-4 text-blue-400" />
  };

  return (
    <div className="w-full space-y-8 py-10" id="strategic-faq-dashboard">
      
      {/* Grid Headline Intro */}
      <div className="max-w-4xl">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#FFB800]/5 border border-[#FFB800]/10 text-[10px] font-mono font-bold tracking-wider text-[#FFB800] uppercase mb-3">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Esclarecimentos Oficiais de Operações e Regulamento</span>
        </div>
        <h4 className="text-2xl sm:text-3xl font-sans font-medium text-slate-100 tracking-tight leading-tight">
          Perguntas Estratégicas & Respostas
        </h4>
        <p className="text-sm text-slate-400 mt-2 font-sans max-w-3xl leading-relaxed">
          Análise aprofundada dos mecanismos regulatórios, técnicos e administrativos que regulam o SILA. Submetido aos normativos de soberania nacional e interoperabilidade entre o MAT e Ministério da Educação (MED).
        </p>
      </div>

      {/* Busca Rápida de Regulamentos subcomponent integration */}
      <BuscaRapida
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
        totalResults={filteredFaq.length}
        totalItems={FAQ_DATA.length}
        playAudioClick={playAudioClick}
      />

      {/* Accordion List container */}
      <div className="space-y-3.5 max-w-4xl relative z-10">
        <AnimatePresence mode="popLayout">
          {filteredFaq.length > 0 ? (
            filteredFaq.map((item, index) => {
              // Find index in main FAQ_DATA to uniquely manage expanded state if sorted
              const isExpanded = expandedIndex === index;
              return (
                <motion.div
                  key={item.id}
                  layout="position"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                  id={`faq-item-${item.id}`}
                  className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                    isExpanded 
                      ? 'bg-gradient-to-r from-white/[0.03] to-blue-950/5 border-blue-500/20 shadow-lg shadow-blue-950/10' 
                      : 'bg-[#030508]/60 border-white/5 hover:border-white/10 hover:bg-white/[0.01]'
                  }`}
                >
                  {/* Trigger Button bar */}
                  <button
                    onClick={() => toggleItem(index)}
                    onMouseEnter={() => playAudioClick?.('hover')}
                    className="w-full flex items-center justify-between text-left p-4 sm:p-5 gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-start gap-3.5">
                      <div className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 border transition-all duration-300 ${
                        isExpanded 
                          ? 'bg-blue-600/10 border-blue-500/30' 
                          : 'bg-white/[0.02] border-white/10'
                      }`}>
                        {iconMap[item.iconName] || <HelpCircle className="w-4 h-4 text-slate-400" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[9px] font-mono tracking-wider font-bold text-slate-500 uppercase block">
                            {item.category}
                          </span>
                          <span className="text-[8.5px] font-mono px-1.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/10 text-blue-400">
                            FUC-MAT
                          </span>
                        </div>
                        <span className="text-xs sm:text-[13.5px] font-sans font-semibold text-slate-100 leading-snug block transition-colors group-hover:text-white">
                          {renderHighlightedText(item.question, searchQuery)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="shrink-0 p-1.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-blue-400" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {/* Collapsed/Expanded panel containing translated rich answer */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.24, ease: 'easeOut' }}
                      >
                        <div className="px-4 pb-5 pt-1 sm:px-5 sm:pb-6 ml-0 sm:ml-[52px] border-t border-white/[0.02]">
                          <div className="p-4 rounded-xl bg-[#010306]/90 border border-white/5 space-y-4">
                            <p className="text-xs sm:text-[12.5px] text-slate-300 font-sans leading-relaxed">
                              {renderHighlightedText(item.answer, searchQuery)}
                            </p>

                            {/* Tags under each answer */}
                            <div className="flex flex-wrap items-center gap-1.5 pt-1.5 border-t border-white/5">
                              <span className="text-[9px] font-mono text-slate-500 uppercase font-bold mr-1 block">Tópicos:</span>
                              {item.tags.map((tag) => (
                                <button
                                  key={tag}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setSearchQuery(tag);
                                    if (playAudioClick) playAudioClick('click');
                                  }}
                                  className="text-[9px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-400 hover:text-white hover:border-white/10 transition-colors cursor-pointer"
                                >
                                  #{tag}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          ) : (
            <motion.div 
              key="no-results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-950/20 border border-white/5 rounded-2xl p-10 text-center space-y-4 max-w-4xl"
            >
              <HelpCircle className="w-10 h-10 text-slate-600 mx-auto animate-bounce" />
              <div>
                <h5 className="text-sm font-sans font-bold text-slate-200">Não encontramos correspondências para "{searchQuery}"</h5>
                <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                  Tente ajustar a sua pesquisa ou examine as outras categorias disponíveis através dos botões de filtro rápido acima.
                </p>
              </div>
              <button
                onClick={handleClearSearch}
                className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono text-[10.5px] rounded-lg tracking-wider transition-all"
              >
                Limpar Campo de Pesquisa
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Helpful CTA Section Footer under FAQ */}
      <div className="bg-[#05070a]/30 border border-white/5 p-6 rounded-2xl max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-[#FFB800] shrink-0">
            <Landmark className="w-4 h-4" />
          </div>
          <div>
            <h5 className="text-xs font-sans font-bold text-slate-200">Ainda possui dúvidas de âmbito operacional ou regulatório?</h5>
            <p className="text-[10.5px] text-slate-400 font-sans mt-0.5">Consulte as ordens de serviço municipais ou submeta uma nota ao secretariado técnico provincial.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <button
            onClick={() => {
              setSelectedCategory('Todos');
              setSearchQuery('');
              setExpandedIndex(null);
              if (playAudioClick) playAudioClick('click');
            }}
            className="text-[10px] font-mono text-slate-400 hover:text-white underline cursor-pointer"
          >
            Resetar Filtros
          </button>
          
          <span className="text-slate-600 font-mono text-xs">|</span>
          
          <button
            onClick={() => {
              if (playAudioClick) playAudioClick('click');
              alert("SILA Portal de Atendimento Governamental - Canal de Suporte Rápido Ativo (Apenas Demonstrativo)");
            }}
            className="flex items-center gap-1 bg-white/5 hover:bg-white/10 border border-white/10 px-3.5 py-2 rounded-xl text-[10px] font-mono font-bold tracking-wider text-white transition-all cursor-pointer whitespace-nowrap"
          >
            <span>SUPORTE MAT</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  );
}
