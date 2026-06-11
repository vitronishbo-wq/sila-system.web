import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Network, Volume2, VolumeX, Menu, X, Play, Pause, MonitorCheck, Sun, Moon, Eye, Presentation, Search, Printer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeaderProps {
  activeSection: string;
  onNavigate: (sectionId: string) => void;
  sections: { id: string; title: string }[];
  isMuted: boolean;
  onToggleMute: () => void;
  isAutoplay: boolean;
  onToggleAutoplay: () => void;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
  isOffline: boolean;
  onToggleOffline?: () => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  highContrast: boolean;
  onToggleHighContrast: () => void;
  daltonism: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  onChangeDaltonism: (mode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void;
  showPresenterNotes: boolean;
  onTogglePresenterNotes: () => void;
  onOpenSearch: () => void;
  onShowToast?: (message: string, type: 'success' | 'info') => void;
}

export default function Header({
  activeSection,
  onNavigate,
  sections,
  isMuted,
  onToggleMute,
  isAutoplay,
  onToggleAutoplay,
  playAudioClick,
  isOffline,
  onToggleOffline,
  theme,
  onToggleTheme,
  highContrast,
  onToggleHighContrast,
  daltonism,
  onChangeDaltonism,
  showPresenterNotes,
  onTogglePresenterNotes,
  onOpenSearch,
  onShowToast,
}: HeaderProps) {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showAccessMenu, setShowAccessMenu] = useState(false);


  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      id="executive-header"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#05070A]/80 backdrop-blur-md border-b border-white/5' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Sovereign Logo */}
          <div className="flex items-center gap-3">
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-blue-900 p-[1.5px] shadow-lg shadow-blue-950/20">
              <div className="w-full h-full bg-[#05070A] rounded-lg flex items-center justify-center">
                <span className="text-amber-500 font-bold text-lg tracking-wider">S</span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-[#05070A] animate-ping"></div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 rounded-full border border-[#05070A]"></div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-100 tracking-wider text-base">SILA</span>
                <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-widest font-medium">
                  {t('Estatal')}
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono tracking-wide hidden sm:block">
                {t('Sist. Integrado Local de Angola')}
              </span>
            </div>
          </div>

          {/* Desktop Navigation for Presentation Sections */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#05070A]/60 p-1 rounded-full border border-white/5">
            {sections.slice(0, 6).map((section) => (
              <button
                key={section.id}
                onClick={() => onNavigate(section.id)}
                onMouseEnter={() => playAudioClick?.('hover')}
                className={`px-3 py-1.5 text-xs rounded-full transition-all duration-300 font-medium ${
                  activeSection === section.id
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-950'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {t(section.title)}
              </button>
            ))}
            {sections.length > 6 && (
              <div className="relative group px-2 text-slate-400 text-xs cursor-pointer font-medium hover:text-slate-200">
                <span>{t('Mais...')}</span>
                <div className="absolute right-0 top-full mt-2 w-48 bg-[#05070A] border border-white/10 rounded-lg shadow-2xl py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-all duration-300">
                  {sections.slice(6).map((section) => (
                    <button
                      key={section.id}
                      onClick={() => onNavigate(section.id)}
                      onMouseEnter={() => playAudioClick?.('hover')}
                      className={`w-full text-left px-4 py-2 text-xs transition-colors hover:bg-white/[0.04] ${
                        activeSection === section.id ? 'text-amber-500 font-semibold' : 'text-slate-400'
                      }`}
                    >
                      {t(section.title)}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </nav>

          {/* Executive Controls & Status */}
          <div className="hidden md:flex items-center gap-4">
            {/* Auto Play / Pilot button */}
            <button
              onClick={onToggleAutoplay}
              onMouseEnter={() => playAudioClick?.('hover')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all duration-300 font-mono ${
                isAutoplay
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
              title={isAutoplay ? t('Parar Piloto Automático') : t('Ativar Piloto Automático (Apresentação)')}
            >
              {isAutoplay ? (
                <>
                  <Pause className="w-3.5 h-3.5 animate-pulse" />
                  <span>{t('PILOTO: ATIVO')}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5" />
                  <span>{t('PILOTO CONDUZIDO')}</span>
                </>
              )}
            </button>

            {/* Mute Audio Simulation */}
            <button
              onClick={onToggleMute}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-colors"
              title={isMuted ? 'Ativar Efeitos Sonoros' : 'Mutar Efeitos Sonoros'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-500" />}
            </button>

            {/* Seletor de Idioma (Language Selector Button) */}
            <button
              onClick={() => {
                setLanguage(language === 'pt' ? 'en' : 'pt');
                playAudioClick?.('click');
                if (onShowToast) {
                  onShowToast(
                    language === 'pt' 
                      ? 'Display language updated to English!' 
                      : 'Idioma de exibição atualizado para Português!', 
                    'info'
                  );
                }
              }}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/10 text-xs font-mono font-bold hover:bg-white/[0.05] transition-all duration-300 flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200"
              title={language === 'pt' ? 'Switch to English' : 'Mudar para Português'}
            >
              <span className="text-[11px]">🌐</span>
              <span className={language === 'pt' ? 'text-amber-400' : 'text-slate-400'}>PT</span>
              <span className="text-slate-600">/</span>
              <span className={language === 'en' ? 'text-amber-400' : 'text-slate-400'}>EN</span>
            </button>

            {/* Alternador de Tema Claro/Escuro */}
            <button
              onClick={onToggleTheme}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-350"
              title={theme === 'dark' ? 'Mudar para Tema Claro' : 'Mudar para Tema Escuro'}
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-500" /> : <Moon className="w-4 h-4 text-violet-500" />}
            </button>

            {/* Busca Global (Ctrl+K) */}
            <button
               onClick={onOpenSearch}
               onMouseEnter={() => playAudioClick?.('hover')}
               className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-350 flex items-center gap-1.5 focus:outline-none"
               title="Pesquisar Apresentação (Ctrl+K)"
            >
              <Search className="w-4 h-4 text-blue-400" />
              <kbd className="hidden xl:inline text-[9px] font-mono text-slate-500 bg-white/5 border border-white/10 px-1 rounded">Ctrl K</kbd>
            </button>

            {/* Relatório Executivo (Print) */}
            <button
              onClick={() => {
                playAudioClick?.('click');
                if (onShowToast) {
                  onShowToast('Relatório Executivo SILA compilado com sucesso! Iniciando módulo de impressão estruturada.', 'success');
                }
                setTimeout(() => {
                  window.print();
                }, 400);
              }}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="p-2 rounded-lg bg-white/[0.02] border border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05] transition-all duration-350"
              title="Relatório Executivo (Imprimir / Gerar PDF)"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
            </button>

            {/* Nota de Apresentador */}
            <button
              onClick={onTogglePresenterNotes}
              onMouseEnter={() => playAudioClick?.('hover')}
              className={`p-2 rounded-lg border transition-all duration-300 ${
                showPresenterNotes
                  ? 'bg-blue-600/15 border-blue-500/40 text-blue-400 scale-105 shadow-sm shadow-blue-500/10'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
              title={showPresenterNotes ? 'Ocultar Notas de Apresentador' : 'Mostrar Notas de Apresentador'}
            >
              <Presentation className="w-4 h-4" />
            </button>

            {/* Painel de Acessibilidade Visual (Contraste & Daltonismo) */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowAccessMenu(!showAccessMenu);
                  playAudioClick?.('click');
                }}
                onMouseEnter={() => playAudioClick?.('hover')}
                className={`p-2 rounded-lg border transition-all duration-300 ${
                  highContrast || daltonism !== 'none'
                    ? 'bg-amber-500/15 border-amber-500/40 text-amber-500 scale-105 shadow-sm shadow-amber-500/10' 
                    : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
                }`}
                title="Painel de Acessibilidade Visual"
              >
                <Eye className="w-4 h-4" />
              </button>

              <AnimatePresence>
                {showAccessMenu && (
                  <>
                    <div 
                      className="fixed inset-0 z-40" 
                      onClick={() => setShowAccessMenu(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2.5 w-64 bg-[#0a0d14] border border-white/10 rounded-xl shadow-2xl p-4 z-50 space-y-3.5"
                    >
                      <div className="flex items-center justify-between border-b border-white/5 pb-2">
                        <span className="text-[10px] font-mono font-bold tracking-wider text-slate-400 uppercase">Acessibilidade Visual</span>
                        <div className="flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                          <span className="text-[8px] font-mono text-emerald-400 uppercase">Ativa</span>
                        </div>
                      </div>

                      {/* Contraste Section */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Alto Contraste</label>
                        <button
                          onClick={() => {
                            onToggleHighContrast();
                          }}
                          className={`w-full flex items-center justify-between p-2 rounded-lg text-[10px] font-mono transition-colors border ${
                            highContrast 
                              ? 'bg-amber-500/10 border-amber-500/30 text-amber-400 font-bold' 
                              : 'bg-white/[0.01] border-white/5 text-slate-400 hover:text-slate-200'
                          }`}
                        >
                          <span>Fidelidade Extrita (WCAG)</span>
                          <span className="text-[10px]">{highContrast ? 'ATIVO' : 'DESATIVO'}</span>
                        </button>
                      </div>

                      {/* Daltonismo Section */}
                      <div className="space-y-1.5">
                        <label className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block font-bold">Modo Daltonismo (Cores)</label>
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { value: 'none', label: 'Cores Normais' },
                            { value: 'protanopia', label: 'Protanopia' },
                            { value: 'deuteranopia', label: 'Deuteranopia' },
                            { value: 'tritanopia', label: 'Tritanopia' }
                          ].map((opt) => (
                            <button
                              key={opt.value}
                              onClick={() => {
                                onChangeDaltonism(opt.value as any);
                                playAudioClick?.('activation');
                              }}
                              className={`px-2 py-1.5 rounded text-[10px] text-left font-mono border transition-all ${
                                daltonism === opt.value
                                  ? 'bg-blue-600/15 border-blue-500/50 text-blue-400 font-bold'
                                  : 'bg-white/[0.01] border-white/5 text-slate-400 hover:bg-white/[0.04] hover:text-slate-200'
                              }`}
                            >
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="text-[8px] text-slate-500 leading-normal font-mono">
                        * Filtros em tempo real aplicados na camada global do barramento executivo do SILA.
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Interactive Network / Offline Cache Simulation Switch */}
            <button
              onClick={onToggleOffline}
              onMouseEnter={() => playAudioClick?.('hover')}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all duration-300 ${
                isOffline
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-400 hover:bg-rose-500/20'
                  : 'bg-white/[0.02] border-white/10 text-slate-400 hover:text-slate-200 hover:bg-white/[0.05]'
              }`}
              title={isOffline ? 'Simulador: Conexão Cortada. Clique para restabelecer.' : 'Simulador: Ligado à Internet. Clique para cortar e testar cache IndexedDB.'}
            >
              <div className={`w-2 h-2 rounded-full ${isOffline ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{isOffline ? 'MODO OFFLINE' : 'SISTEMA ONLINE'}</span>
            </button>

            {/* Sovereign State Security / Local Cache Status Badge */}
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all duration-300 ${
              isOffline 
                ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' 
                : 'bg-white/[0.02] border-white/10'
            }`}>
              <ShieldCheck className={`w-3.5 h-3.5 ${isOffline ? 'text-blue-400' : 'text-emerald-500'}`} />
              <span className="text-[10px] text-slate-300 font-mono tracking-wider">
                {isOffline ? 'CACHE-INDEXEDDB' : 'ANG-SECURE'}
              </span>
              <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-blue-400' : 'bg-emerald-500 animate-pulse'}`}></span>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={onToggleMute}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="p-1.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              onMouseEnter={() => playAudioClick?.('hover')}
              className="p-1.5 rounded-lg bg-white/[0.01] border border-white/5 text-slate-400 hover:text-slate-200 transition-colors"
            >
              {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-[#05070A]/95 border-b border-white/10 absolute top-full left-0 right-0 shadow-2xl py-4 overflow-hidden"
          >
            <div className="px-4 space-y-2">
              <div className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pb-1 border-b border-white/5">
                Navegação Executiva
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => {
                      onNavigate(section.id);
                      setIsOpen(false);
                    }}
                    onMouseEnter={() => playAudioClick?.('hover')}
                    className={`px-3 py-2 text-left text-xs rounded-lg transition-colors font-medium border ${
                      activeSection === section.id
                        ? 'bg-blue-600/10 text-white border-blue-500'
                        : 'text-slate-400 bg-white/[0.02] border-white/5'
                    }`}
                  >
                    {t(section.title)}
                  </button>
                ))}
              </div>

              <div className="pt-4 space-y-2 border-t border-white/5">
                {/* Mobile Language Switcher */}
                <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">IDIOMA / LANGUAGE</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('pt');
                        playAudioClick?.('click');
                      }}
                      className={`px-3 py-2 rounded text-xs font-mono border transition-all text-center ${
                        language === 'pt'
                          ? 'bg-blue-600/15 border-blue-500/50 text-blue-400 font-bold'
                          : 'bg-white/[0.02] border-white/5 text-slate-400'
                      }`}
                    >
                      🇵🇹 PORTUGUÊS (PT)
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        playAudioClick?.('click');
                      }}
                      className={`px-3 py-2 rounded text-xs font-mono border transition-all text-center ${
                        language === 'en'
                          ? 'bg-blue-600/15 border-blue-500/50 text-blue-400 font-bold'
                          : 'bg-white/[0.02] border-white/5 text-slate-400'
                      }`}
                    >
                      🇺🇸 ENGLISH (EN)
                    </button>
                  </div>
                </div>

                {/* Mobile Pilot Mode */}
                <button
                  onClick={() => {
                    onToggleAutoplay();
                    setIsOpen(false);
                  }}
                  onMouseEnter={() => playAudioClick?.('hover')}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    isAutoplay
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <MonitorCheck className="w-4 h-4" />
                    AUTOPLAY DE APRESENTAÇÃO
                  </span>
                  <span>{isAutoplay ? 'ATIVO' : 'DESATIVADO'}</span>
                </button>

                {/* Mobile Network / Offline Test Switch */}
                <button
                  onClick={() => {
                    onToggleOffline?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    isOffline
                      ? 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <div className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-rose-500 animate-pulse' : 'bg-emerald-500'}`} />
                    SIMULAÇÃO DE CORTE
                  </span>
                  <span>{isOffline ? 'MODO OFFLINE' : 'SISTEMA ONLINE'}</span>
                </button>

                {/* Mobile Theme Toggle */}
                <button
                  onClick={() => {
                    onToggleTheme();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    theme === 'light'
                      ? 'bg-violet-500/10 border-violet-500/30 text-violet-400'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    {theme === 'light' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-violet-400" />}
                    TEMA DE COR
                  </span>
                  <span>{theme === 'light' ? 'ESTILO CLARO' : 'ESTILO ESCURO'}</span>
                </button>

                {/* Mobile Presenter Notes Toggle */}
                <button
                  onClick={() => {
                    onTogglePresenterNotes();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    showPresenterNotes
                      ? 'bg-blue-600/15 border-blue-500/35 text-blue-400 font-bold'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Presentation className="w-4 h-4 text-blue-400" />
                    NOTAS DE APRESENTADOR
                  </span>
                  <span>{showPresenterNotes ? 'ATIVAS' : 'DESATIVADAS'}</span>
                </button>

                {/* Mobile Global Search Button */}
                <button
                  onClick={() => {
                    onOpenSearch();
                    setIsOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-white/[0.02] border-white/5 text-slate-400 text-xs font-mono hover:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Search className="w-4 h-4 text-blue-400" />
                    BUSCA GLOBAL (CTRL+K)
                  </span>
                  <span className="text-[10px] text-blue-500 font-bold">ABRIR</span>
                </button>

                {/* Mobile Print Executive Report Button */}
                <button
                  onClick={() => {
                    playAudioClick?.('click');
                    setIsOpen(false);
                    if (onShowToast) {
                      onShowToast('Relatório Executivo SILA compilado com sucesso! Iniciando módulo de impressão estruturada.', 'success');
                    }
                    setTimeout(() => {
                      window.print();
                    }, 450);
                  }}
                  className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg border bg-white/[0.02] border-white/5 text-slate-400 text-xs font-mono hover:text-slate-200 transition-colors"
                >
                  <span className="flex items-center gap-1.5">
                    <Printer className="w-4 h-4 text-emerald-400" />
                    RELATÓRIO EXECUTIVO (A4/PDF)
                  </span>
                  <span className="text-[10px] text-emerald-500 font-bold">PDF</span>
                </button>

                {/* Mobile High Contrast Toggle */}
                <button
                  onClick={() => {
                    onToggleHighContrast();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg border text-xs font-mono transition-colors ${
                    highContrast
                      ? 'bg-amber-500/15 border-amber-500/35 text-amber-500'
                      : 'bg-white/[0.02] border-white/5 text-slate-400'
                  }`}
                >
                  <span className="flex items-center gap-1.5">
                    <Eye className="w-4 h-4" />
                    CONTRASTE ACESSÍVEL
                  </span>
                  <span>{highContrast ? 'ATIVADO' : 'DESATIVADO'}</span>
                </button>

                {/* Mobile Daltonism selector list */}
                <div className="bg-white/[0.01] p-3 rounded-lg border border-white/5 space-y-2">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">MODOS DE DALTONISMO (MOBILE)</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { value: 'none', label: 'Cores Padrão' },
                      { value: 'protanopia', label: 'Protanopia' },
                      { value: 'deuteranopia', label: 'Deuteranopia' },
                      { value: 'tritanopia', label: 'Tritanopia' }
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                          onChangeDaltonism(opt.value as any);
                          playAudioClick?.('activation');
                        }}
                        className={`px-2 py-1.5 rounded text-[10px] font-mono border transition-all text-center ${
                          daltonism === opt.value
                            ? 'bg-blue-600/15 border-blue-500/50 text-blue-400'
                            : 'bg-white/[0.02] border-white/5 text-slate-400'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Secure / Cache Badge */}
                <div className={`flex items-center justify-between px-3 py-2.5 rounded-lg border transition-colors ${
                  isOffline ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-white/[0.02] border-white/5 text-slate-400'
                }`}>
                  <span className="text-[10px] font-mono">SUPORTE LOCALTOWN</span>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className={`w-3.5 h-3.5 ${isOffline ? 'text-blue-400' : 'text-emerald-500'}`} />
                    <span className={`text-[10px] font-mono tracking-wider font-bold uppercase`}>
                      {isOffline ? 'CACHE-IDB' : 'SECURE'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
