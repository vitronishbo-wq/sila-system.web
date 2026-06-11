/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useTransform, useMotionValue } from 'motion/react';
import { 
  ChevronDown, ShieldCheck, Mail, Send, Sparkles, Building2, Phone,
  User, CheckCircle, Smartphone, ExternalLink, Bookmark, Info, HelpCircle,
  FileText, Share2, Loader2
} from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

// Register ScrollTrigger for client-side environments
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

import Header from './components/Header';
import AngolaMap from './components/AngolaMap';
import TimelineLife from './components/TimelineLife';
import StudentJourney from './components/StudentJourney';
import CapabilitiesGrid from './components/CapabilitiesGrid';
import VideoPlayer from './components/VideoPlayer';
import SilaVisionPlayer from './components/SilaVisionPlayer';
import PilotProposals from './components/PilotProposals';
import InteroperabilityArchitecture from './components/InteroperabilityArchitecture';
import MinisterialIntegrationGuide from './components/MinisterialIntegrationGuide';
import NetworkBackground from './components/NetworkBackground';
import ComparativeSplitScreen from './components/ComparativeSplitScreen';
import StrategicFaq from './components/StrategicFaq';
import SovereignTooltip from './components/SovereignTooltip';
import SovereignQuickJump from './components/SovereignQuickJump';
import SovereignSearchPalette from './components/SovereignSearchPalette';
import SilaArViewer from './components/SilaArViewer';
import SovereignSectionMinimap from './components/SovereignSectionMinimap';
import SovereignKeyTakeaway from './components/SovereignKeyTakeaway';
import SovereignExecutiveDashboard from './components/SovereignExecutiveDashboard';
import SovereignSustainabilityReport from './components/SovereignSustainabilityReport';
import BureaucracySaverWidget from './components/BureaucracySaverWidget';
import GovernmentEfficiencyCalculator from './components/GovernmentEfficiencyCalculator';
import DigitalMaturityChart from './components/DigitalMaturityChart';
import ProblemaContent from './components/ProblemaContent';
import HuamboDematerializationLineChart from './components/HuamboDematerializationLineChart';
import PilotProtocolVisualizer from './components/PilotProtocolVisualizer';
import MATMeetingScheduler from './components/MATMeetingScheduler';
import { useLanguage } from './context/LanguageContext';

import { PROBLEM_METRICS, FUC_MILESTONES, EDUCATION_CAPABILITIES } from './data/silaData';
import { FucMilestone, EducationCapability } from './types';
import { seedIndexedDB, fetchFucMilestonesCached, fetchCapabilitiesCached } from './lib/indexedDB';

interface ParallaxContentProps {
  children: React.ReactNode;
  className?: string;
  offset?: number;
}

function ParallaxContent({ children, className = '', offset = 30 }: ParallaxContentProps) {
  const outerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: outerRef,
    offset: ["start end", "end start"]
  });
  
  // Transform scroll progress to vertical floating movement
  const yTranslate = useTransform(scrollYProgress, [0, 1], [-offset, offset]);
  // Smooth transit using a spring so it floats elegantly
  const y = useSpring(yTranslate, { stiffness: 90, damping: 25, mass: 0.5 });

  return (
    <div ref={outerRef} className="relative w-full h-full">
      <motion.div style={{ y }} className={className}>
        {children}
      </motion.div>
    </div>
  );
}

const PRESENTER_NOTES: Record<string, string> = {
  hero: "Apresentação de abertura. Destacar a visão de soberania tecnológica, a integração nacional e o lema 'o cidadão fornece os dados uma única vez'. Ideal para captar de imediato o interesse do Gabinete Presidencial e do MAT.",
  problema: "Evidenciar com rigor as perdas financeiras por duplicação de dados, burocracia desnecessária e falta de comunicação síncrona interministerial. Apresentar as métricas de desperdício em milhões e tempo gasto.",
  visao: "Explicar como o SILA conecta os municípios, administrações provinciais e o Ministério da Administração do Território (MAT) num único barramento federado e instantâneo.",
  fuc: "Explicar em detalhe o portfólio digital da Ficha Única do Cidadão (FUC) como o portal de soberania e identidade do cidadão angolano. Abordar a imutabilidade, privacidade constitucional e eliminação de duplicados na rede.",
  educacao: "Abordar o primeiro caso de uso prático: a Educação Nacional. Apresentar dados reais de matrículas limpas, eliminação de pautas fantasma e simplificação no controlo de propinas provinciais.",
  jornada: "Seguir atentamente o caminho interativo d'O Aluno Carlos Chilombo da sua infância à maioridade académica. Explicar como a FUC e o barramento do SILA realizam as validações eletrónicas em segundos.",
  capacidades: "Descrever em profundidade as ferramentas tecnológicas prontas e ativas na plataforma: as auditorias criptográficas de dados, as comunicações seguras e o rastreamento georreferenciado.",
  demonstracao: "Apresentar o teaser multimédia e as ondas acústicas interativas do reprodutor SILA Vision 2026. Mostrar a eficácia em tempo real da desmaterialização e emissão de documentos virtuais.",
  arquitetura: "Visualização do diagrama tecnológico federal. Detalhar o nó principal CORE FUC e a sincronização bidirecional em tempo real com as secretarias estatais da educação, saúde, finanças e justiça de Angola.",
  piloto: "Apresentar a proposta firme e estruturada para ativação do piloto nas províncias do Huambo e Luanda no 1º Semestre de 2026. Detalhar o planeamento de equipe local e os indicadores de sucesso esperados.",
  faq: "Abordagem proativa sobre os aspetos de soberania operacional de dados descentralizados, resiliência do barramento a falhas na infraestrutura de rede de internet e o custo de licenciamento proprietário zero.",
  conclusao: "Discurso formal de encerramento da delegação técnica. Reiterar o apelo imediato à aprovação do piloto em prol da soberania digital do MAT e o início da revolução desgovernamental."
};

// List of slide sections for presenter navigation
const SECTIONS = [
  { id: 'hero', title: 'Início' },
  { id: 'problema', title: 'O Problema' },
  { id: 'visao', title: 'A Visão' },
  { id: 'fuc', title: 'A Ficha Única' },
  { id: 'educacao', title: 'Foco Educação' },
  { id: 'jornada', title: 'Jornada Aluno' },
  { id: 'capacidades', title: 'Capacidades' },
  { id: 'demonstracao', title: 'Demonstração' },
  { id: 'dashboard', title: 'Estatísticas' },
  { id: 'arquitetura', title: 'Arquitetura' },
  { id: 'piloto', title: 'Proposta Piloto' },
  { id: 'faq', title: 'Perguntas Estratégicas' },
  { id: 'conclusao', title: 'Conclusão' },
];

const CINEMATIC_SECTION_VARIANTS = {
  initial: { opacity: 0, filter: "blur(16px)", y: 20 },
  animate: { opacity: 1, filter: "blur(0px)", y: 0 },
  exit: { opacity: 0, filter: "blur(16px)", y: -20 }
};

const CINEMATIC_SECTION_TRANSITION = {
  duration: 0.65,
  ease: [0.22, 1, 0.36, 1]
};

export default function App() {
  const { language, t } = useLanguage();
  const [activeSection, setActiveSection] = useState('hero');
  const activeIdx = SECTIONS.findIndex((s) => s.id === activeSection);
  const slideProgress = useMotionValue(0);

  useEffect(() => {
    slideProgress.set(activeIdx / (SECTIONS.length - 1 || 1));
  }, [activeIdx, slideProgress]);

  const scaleX = useSpring(slideProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });
  const [isMuted, setIsMuted] = useState(true);
  const [isAutoplay, setIsAutoplay] = useState(false);
  
  // Theme and Accessibiliy settings for executive view
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [daltonism, setDaltonism] = useState<'none' | 'protanopia' | 'deuteranopia' | 'tritanopia'>('none');
  const [showPresenterNotes, setShowPresenterNotes] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isArOpen, setIsArOpen] = useState(false);

  // Sync theme with document class list
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('theme-light');
      document.body.classList.remove('theme-dark');
    } else {
      document.body.classList.add('theme-dark');
      document.body.classList.remove('theme-light');
    }
  }, [theme]);

  // Sync high contrast with document class list
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Sync daltonism with document class list
  useEffect(() => {
    document.body.classList.remove('protanopia', 'deuteranopia', 'tritanopia');
    if (daltonism !== 'none') {
      document.body.classList.add(daltonism);
    }
  }, [daltonism]);
  
  // Local Database Cached lists of SILA assets
  const [fucMilestones, setFucMilestones] = useState<FucMilestone[]>(FUC_MILESTONES);
  const [educationCapabilities, setEducationCapabilities] = useState<EducationCapability[]>(EDUCATION_CAPABILITIES);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // Network and Resilient Offline simulator triggers
  const [isOfflineSimulated, setIsOfflineSimulated] = useState(false);
  const [isSystemOffline, setIsSystemOffline] = useState(typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const isOffline = isSystemOffline || isOfflineSimulated;

  // Lead submission form states
  const [showContactModal, setShowContactModal] = useState(false);
  const [modalType, setModalType] = useState<'piloto' | 'contacto'>('contacto');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', title: '', govOrgan: '', email: '', phone: '' });
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);
  const [showWhatsAppConfirmApp, setShowWhatsAppConfirmApp] = useState(false);
  const [sendingWhatsAppApp, setSendingWhatsAppApp] = useState(false);

  // Connection changes listener & local DB sync
  useEffect(() => {
    const handleConnectivityChange = () => {
      const offline = !navigator.onLine;
      setIsSystemOffline(offline);
      setToast({
        message: offline
          ? 'SILA: Sem ligação à Internet. Ativado modo de portabilidade resistente via cache local IndexedDB.'
          : 'SILA: Ligação à Internet restabelecida. Sincronização direta com a Central MAT reativada.',
        type: 'info'
      });
      playChime('activation');
    };

    window.addEventListener('online', handleConnectivityChange);
    window.addEventListener('offline', handleConnectivityChange);

    return () => {
      window.removeEventListener('online', handleConnectivityChange);
      window.removeEventListener('offline', handleConnectivityChange);
    };
  }, []);

  // Initialization and seeding of Sila local database Cache
  useEffect(() => {
    const seedAndLoadLocalCache = async () => {
      try {
        setIsLoadingData(true);
        await seedIndexedDB();
        const cachedMilestones = await fetchFucMilestonesCached();
        const cachedCapabilities = await fetchCapabilitiesCached();
        
        if (cachedMilestones && cachedMilestones.length > 0) {
          setFucMilestones(cachedMilestones);
        }
        if (cachedCapabilities && cachedCapabilities.length > 0) {
          setEducationCapabilities(cachedCapabilities);
        }
        
        console.log('[SILA Cache] Successfully loaded and primed IndexedDB store stores.');
      } catch (err) {
        console.error('[SILA Cache Error] Failed to seed/load cache stores:', err);
      } finally {
        // Dynamic feedback timeout to let users appreciate the high-fidelity skeleton states
        setTimeout(() => {
          setIsLoadingData(false);
        }, 1200);
      }
    };

    seedAndLoadLocalCache();
  }, []);

  // Auto-clear toast notification
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Hook GSAP with ScrollTrigger to gain absolute control over 'Problema' and 'Arquitetura' transitions
  useGSAP(() => {
    if (activeSection === 'problema' || activeSection === 'arquitetura') {
      const handleTriggerRefresh = () => {
        ScrollTrigger.refresh();
      };
      // Allow DOM repaint and layouts to settle
      const timer = setTimeout(() => {
        handleTriggerRefresh();

        if (activeSection === 'problema') {
          // Staggered millimetric scrub on individual problem cards
          gsap.fromTo('#problema .gsap-problem-card',
            { opacity: 0, y: 60, scale: 0.95, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              stagger: 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: '#problema',
                start: 'top 80%',
                end: 'bottom 45%',
                scrub: 1,
              }
            }
          );
        }

        if (activeSection === 'arquitetura') {
          // Interoperability schema and 3D visualizer high-precision scrub-bound flow controls
          gsap.fromTo('#arquitetura .gsap-arch-viewer',
            { opacity: 0.3, y: 40, scale: 0.98, filter: "blur(4px)" },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              filter: "blur(0px)",
              ease: "sine.out",
              scrollTrigger: {
                trigger: '#arquitetura',
                start: 'top 90%',
                end: 'bottom 50%',
                scrub: 1,
              }
            }
          );

          gsap.fromTo('#arquitetura .gsap-arch-ctrl',
            { opacity: 0.3, y: 50 },
            {
              opacity: 1,
              y: 0,
              ease: "power2.out",
              scrollTrigger: {
                trigger: '#arquitetura',
                start: 'top 85%',
                end: 'bottom 50%',
                scrub: 1.2,
              }
            }
          );
        }
      }, 150);

      window.addEventListener('resize', handleTriggerRefresh);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('resize', handleTriggerRefresh);
      };
    }
  }, [activeSection]);



  // Procedural client-side audio synth with multiple high-fidelity sound profiles
  const playChime = (type: 'hover' | 'activation' | 'click' = 'click') => {
    if (isMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const destination = ctx.destination;

      if (type === 'hover') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.05);
        
        gain.gain.setValueAtTime(0.012, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.06);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.06);
      } else if (type === 'activation') {
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        const gain2 = ctx.createGain();
        
        osc1.connect(gain1);
        gain1.connect(destination);
        osc2.connect(gain2);
        gain2.connect(destination);
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(329.63, ctx.currentTime);
        osc1.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.25);
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(415.30, ctx.currentTime);
        osc2.frequency.exponentialRampToValueAtTime(830.61, ctx.currentTime + 0.25);
        
        gain1.gain.setValueAtTime(0.04, ctx.currentTime);
        gain1.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        
        gain2.gain.setValueAtTime(0.02, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.3);
        
        osc1.start();
        osc2.start();
        osc1.stop(ctx.currentTime + 0.3);
        osc2.stop(ctx.currentTime + 0.3);
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(destination);
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(980, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(1400, ctx.currentTime + 0.12);
        
        gain.gain.setValueAtTime(0.04, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);
        
        osc.start();
        osc.stop(ctx.currentTime + 0.15);
      }
    } catch (e) {
      // Ignored if browser plays block unsought audioContext start
    }
  };

  // Keyboard presentation shortcuts for high-level officials (atalhos)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }

      const currentIdx = SECTIONS.findIndex(s => s.id === activeSection);
      if (e.key === 'ArrowRight' || e.key === 'PageDown' || e.key === 'ArrowDown') {
        if (currentIdx < SECTIONS.length - 1) {
          e.preventDefault();
          handleNavigate(SECTIONS[currentIdx + 1].id);
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || e.key === 'ArrowUp') {
        if (currentIdx > 0) {
          e.preventDefault();
          handleNavigate(SECTIONS[currentIdx - 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSection]);

  // Presenter Autoplay (Automatic scroll storytelling)
  useEffect(() => {
    let autoplayInterval: NodeJS.Timeout | null = null;
    
    if (isAutoplay) {
      autoplayInterval = setInterval(() => {
        const currentIdx = SECTIONS.findIndex((s) => s.id === activeSection);
        const nextIdx = (currentIdx + 1) % SECTIONS.length;
        const nextId = SECTIONS[nextIdx].id;
        handleNavigate(nextId);
      }, 16000); // 16 seconds per main presentation screen
    }

    return () => {
      if (autoplayInterval) clearInterval(autoplayInterval);
    };
  }, [isAutoplay, activeSection]);

  const handleNavigate = (sectionId: string) => {
    setActiveSection(sectionId);
    playChime('click');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleOpenContactModal = (type: 'piloto' | 'contacto') => {
    setModalType(type);
    setShowContactModal(true);
    setFormSubmitted(false);
    playChime('activation');
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate high-fidelity secure submission database lock
    setFormSubmitted(true);
    playChime('activation');

    // Preserve metadata for the post-modal toast notification
    const submittedGovOrgan = formData.govOrgan;
    const isPilot = modalType === 'piloto';

    setTimeout(() => {
      setShowContactModal(false);
      setFormData({ name: '', title: '', govOrgan: '', email: '', phone: '' });
      
      // Trigger floating success notification
      setToast({
        message: isPilot 
          ? `Solicitação de Piloto para o Huambo registada para o órgão "${submittedGovOrgan}". O MAT já está a processar a requisição.`
          : `Mensagem de contacto enviada com sucesso! Aguarde o contacto oficial da assessoria do SILA.`,
        type: 'success'
      });
      playChime('activation');
    }, 2500);
  };

  return (
    <div className="bg-[#05070A] text-slate-100 min-h-screen font-sans selection:bg-blue-500/30 overflow-x-hidden antialiased">
      {/* Subtle background canvas generating data particles that connect */}
      <NetworkBackground />

      {/* Fixed page scroll progress bar using framer-motion useScroll */}
      <motion.div
        id="scroll-progress-indicator"
        className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-blue-500 via-[#FFB800] to-amber-500 z-[100] origin-left"
        style={{ scaleX }}
      />

      {/* Dynamic slide presentation indicators for high-level officials on scroll right margin */}
      <div className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3.5 bg-[#05070A]/40 p-3 rounded-full border border-white/5 backdrop-blur-sm">
        {SECTIONS.map((sec) => (
          <button
            key={sec.id}
            onClick={() => handleNavigate(sec.id)}
            onMouseEnter={() => playChime('hover')}
            className="group relative flex items-center justify-center"
            title={t(sec.title)}
          >
            <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
              activeSection === sec.id 
                ? 'bg-amber-500 ring-4 ring-amber-500/10 scale-125' 
                : 'bg-[#05070A]/20 bg-slate-700 hover:bg-slate-400'
            }`} />
            {/* Hover floating label */}
            <span className="absolute right-6 bg-[#05070A] border border-white/10 text-slate-300 text-[10px] px-2 py-1 rounded-md font-sans tracking-wide opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-300 whitespace-nowrap">
              {t(sec.title)}
            </span>
          </button>
        ))}
      </div>

      {/* Structured e-State Header Controls */}
      <Header
        activeSection={activeSection}
        onNavigate={handleNavigate}
        sections={SECTIONS}
        onShowToast={setToast}
        isMuted={isMuted}
        onToggleMute={() => {
          setIsMuted(!isMuted);
          // Auto-triggers playChime internally after change if unmuting
          if (isMuted) {
            setTimeout(() => playChime('activation'), 50);
          }
        }}
        isAutoplay={isAutoplay}
        onToggleAutoplay={() => {
          setIsAutoplay(!isAutoplay);
          playChime('activation');
        }}
        playAudioClick={playChime}
        isOffline={isOffline}
        onToggleOffline={() => {
          setIsOfflineSimulated(!isOfflineSimulated);
          // Notify the user about the simulated status switch
          setToast({
            message: !isOfflineSimulated 
              ? 'Simulador SILA: Conexão cortada! Agora o sistema obtém e exibe dados exclusivamente a partir do cache local do IndexedDB.'
              : 'Simulador SILA: Conexão restabelecida! Sincronização direta com a Central MAT ativa.',
            type: 'info'
          });
          playChime('activation');
        }}
        theme={theme}
        onToggleTheme={() => {
          const next = theme === 'dark' ? 'light' : 'dark';
          setTheme(next);
          setToast({
            message: `Tema SILA alterado para o modo ${next === 'dark' ? 'Escuro Executivo' : 'Claro Presidencial'}.`,
            type: 'info'
          });
          playChime('click');
        }}
        highContrast={highContrast}
        onToggleHighContrast={() => {
          const next = !highContrast;
          setHighContrast(next);
          setToast({
            message: next
              ? 'Modo de Contraste de Alta Fidelidade ATIVO para conformidade de acessibilidade.'
              : 'Modo de Contraste de Alta Fidelidade DESATIVADO.',
            type: 'info'
          });
          playChime('activation');
        }}
        daltonism={daltonism}
        onChangeDaltonism={(mode) => {
          setDaltonism(mode);
          setToast({
            message: mode === 'none'
              ? 'Filtro de daltonismo desativado (Cores Padrão SILA).'
              : `Filtro de daltonismo para "${mode.toUpperCase()}" ativado com sucesso.`,
            type: 'info'
          });
          playChime('activation');
        }}
        showPresenterNotes={showPresenterNotes}
        onTogglePresenterNotes={() => {
          setShowPresenterNotes(!showPresenterNotes);
          playChime('activation');
        }}
        onOpenSearch={() => {
          setIsSearchOpen(true);
        }}
      />

      {/* SECTION MAIN FRAME CONTAINER */}
      <main className="relative pt-20 overflow-hidden min-h-[92vh]">
        <AnimatePresence mode="wait">
          {activeSection === 'hero' && (
            <motion.section
              key="hero"
              id="hero"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden after:absolute after:bottom-0 after:left-0 after:right-0 after:h-24 after:bg-gradient-to-t after:from-[#05070A] after:to-transparent w-full"
            >
              {/* Futuristic ambient radial spotlight backdrop */}
              <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/3 w-[600px] h-[600px] bg-blue-600/10 blur-[130px] rounded-full pointer-events-none"></div>
              <div className="absolute bottom-1/4 right-10 w-[420px] h-[420px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none"></div>

              <ParallaxContent className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
                {/* Title & Callouts */}
                <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
                  <div className="inline-flex items-center gap-2 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20 text-xs text-slate-200">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                    <span className="font-mono uppercase tracking-widest font-semibold text-amber-400">
                      {t('Estado Digital Soberano')}
                    </span>
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                  </div>

                  <div className="space-y-4">
                    <h1 className="text-5xl sm:text-7xl font-sans font-bold tracking-tight text-white leading-[0.9] select-none">
                      SILA
                    </h1>
                    <h2 className="text-2xl sm:text-4xl font-display font-medium text-slate-100 leading-tight">
                      {t('Sistema Integrado Local de Angola')}
                    </h2>
                    <p className="text-base sm:text-lg text-slate-400 max-w-xl mx-auto lg:mx-0 font-sans leading-relaxed">
                      {t('Uma plataforma nacional robusta para conectar e interoperar cidadãos, instituições locais e serviços públicos na República de Angola.')}
                    </p>
                  </div>

                  {/* Central Pillar Flagship message */}
                  <div className="bg-gradient-to-b from-white/5 to-transparent p-6 border border-white/10 rounded-2xl max-w-md mx-auto lg:mx-0 text-left relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-xl"></div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-amber-500 block mb-1">
                      {t('Princípio Constitucional')}
                    </span>
                    <p className="text-sm font-sans font-semibold text-slate-200 leading-relaxed italic">
                      "{t('O cidadão fornece os dados uma única vez.')}"
                    </p>
                  </div>

                  {/* Action and Presenter triggers */}
                  <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                    <button
                      onClick={() => handleNavigate('problema')}
                      onMouseEnter={() => playChime('hover')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-sm rounded-xl font-medium shadow-xl shadow-blue-900/20 hover:shadow-blue-900/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer group"
                    >
                      {t('Explorar o Futuro do Estado')}
                      <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => handleOpenContactModal('piloto')}
                      onMouseEnter={() => playChime('hover')}
                      className="w-full sm:w-auto px-6 py-3.5 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:text-white border border-white/10 rounded-xl text-sm font-medium transition-all duration-300"
                    >
                      {t('Solicitar Piloto Operacional')}
                    </button>
                  </div>
                </div>

                {/* High Impact Geographic Map on Hero background (interactive right column) */}
                <div className="lg:col-span-6 relative aspect-square max-w-[480px] mx-auto w-full">
                  <AngolaMap playAudioClick={playChime} />
                </div>

                <SovereignKeyTakeaway sectionId="hero" className="mt-12" />
                
                <SovereignQuickJump currentSectionId="hero" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'problema' && (
            <motion.section
              key="problema"
              id="problema"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <div className="max-w-7xl mx-auto">
                <ProblemaContent 
                  playAudioClick={playChime}
                  onNavigate={handleNavigate}
                  sections={SECTIONS}
                />
              </div>
            </motion.section>
          )}

          {activeSection === 'visao' && (
            <motion.section
              key="visao"
              id="visao"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 flex flex-col items-center justify-center w-full"
            >
              {/* Subtle gold spotlight accent */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] bg-[#FFB800]/5 blur-[120px] rounded-full pointer-events-none"></div>

              <ParallaxContent className="max-w-4xl text-center space-y-8 relative z-10 select-none">
                <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-2 block font-bold">
                  O Paradigma Soberano do Estado
                </span>
                
                <h2 className="text-4xl sm:text-6xl font-display font-medium tracking-tight text-white leading-tight">
                  Um cidadão.<br />
                  Uma identidade.<br />
                  Uma única relação com o Estado.
                </h2>

                <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto font-sans leading-relaxed">
                  O SILA converge os dados dispersos de Educação, Saúde, Justiça, Proteção Social e Finanças para um núcleo unificado. O Estado serve o cidadão de forma ativa e integrada, em vez de exigir que este carregue papéis entre pastas.
                </p>

                <button
                  onClick={() => handleNavigate('fuc')}
                  onMouseEnter={() => playChime('hover')}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-xs text-slate-200 font-mono tracking-wide hover:text-white hover:border-white/20 transition-colors"
                >
                  Conhecer a Ficha Única (FUC)
                  <ChevronDown className="w-3.5 h-3.5 text-blue-500" />
                </button>

                <SovereignKeyTakeaway sectionId="visao" className="mt-8 text-left max-w-2xl mx-auto" />
                
                <SovereignQuickJump currentSectionId="visao" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'fuc' && (
            <motion.section
              key="fuc"
              id="fuc"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <div className="relative">
                  {/* Data provenance notification badge */}
                  <div className="absolute right-0 -top-8 flex items-center gap-1.5 px-2 py-1 rounded bg-[#05070A]/80 border border-white/5 font-mono text-[9px] text-slate-400 select-none">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500/80'}`} />
                    <span>Origem de dados: {isOffline ? 'Portabilidade Local (IndexedDB Cache)' : 'Servidor Central SILA'}</span>
                  </div>
                  <TimelineLife playAudioClick={playChime} milestones={fucMilestones} isLoading={isLoadingData} />
                </div>

                <SovereignKeyTakeaway sectionId="fuc" className="mt-12" />
                
                <SovereignQuickJump currentSectionId="fuc" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'educacao' && (
            <motion.section
              key="educacao"
              id="educacao"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                
                {/* Left side text */}
                <div className="lg:col-span-5 space-y-6">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1.5 block font-bold">
                    Vetores de Impacto Tático
                  </span>
                  <h3 className="text-3xl sm:text-4xl font-sans font-medium text-slate-100 tracking-tight leading-none">
                    Educação como Primeiro Piloto Nacional
                  </h3>
                  
                  <div className="space-y-4 text-sm text-slate-400 font-sans leading-relaxed">
                    <p>
                      A educação é a base com maior volume de interações diárias do país. Integrando o Módulo de Educação, criamos a base biométrica e cadastral do cidadão angolano desde a infância.
                    </p>
                    <p>
                      Quando saneamos as matrículas, criamos raízes fiduciárias sólidas para a emissão automática de Bilhetes de Identidade e cruzamento futuro com as vacinas da Saúde.
                    </p>
                  </div>

                  {/* Quick stats panel */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/[0.01] p-4 rounded-xl border border-white/5">
                      <span className="text-xs text-slate-500 block">Capacidade Técnica</span>
                      <span className="text-lg font-sans font-semibold text-slate-100 mt-1 block">Escalabilidade</span>
                    </div>
                    <div className="bg-white/[0.01] p-4 rounded-xl border border-white/10">
                      <span className="text-xs text-slate-500 block">Validação Central</span>
                      <span className="text-lg font-sans font-semibold text-[#FFB800] mt-1 block">MAT Homologado</span>
                    </div>
                  </div>
                </div>

                {/* Right side graphical statistics display */}
                <div className="lg:col-span-7 bg-[#05070A]/30 p-6 rounded-2xl border border-white/5 grid grid-cols-2 gap-4">
                  <div className="bg-white/[0.01] p-5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block">Saneamento Escolar</span>
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-slate-100">12.000+</span>
                    <p className="text-[11px] text-slate-400 font-sans">Escolas primárias e secundárias catalogadas por geolocalização no SILA.</p>
                  </div>
                  <div className="bg-white/[0.01] p-5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block">Foco Alunos</span>
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-slate-100">4.5M+</span>
                    <p className="text-[11px] text-slate-400 font-sans">Estudantes cobertos pela <SovereignTooltip term="FUC" explanation="Ficha Única do Cidadão – repositório único unificado de informação para eliminar falsificações de matrículas e propinas provinciais.">Ficha Única (FUC)</SovereignTooltip> eliminando duplicidades pautais.</p>
                  </div>
                  <div className="bg-white/[0.01] p-5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block">Cadastro Professores</span>
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-slate-100">150K+</span>
                    <p className="text-[11px] text-slate-400 font-sans">Docentes provinciais integrados com validação automática de habilitações.</p>
                  </div>
                  <div className="bg-white/[0.01] p-5 rounded-xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-blue-400 block">Certificados Emitidos</span>
                    <span className="text-2xl sm:text-3xl font-sans font-bold text-amber-500">Livre</span>
                    <p className="text-[11px] text-slate-400 font-sans">De papel fiduciário e cartórios, emitidos por assinatura do ICP-Angola.</p>
                  </div>
                </div>

                <SovereignKeyTakeaway sectionId="educacao" className="lg:col-span-12 mt-4" />

                <SovereignQuickJump currentSectionId="educacao" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'jornada' && (
            <motion.section
              key="jornada"
              id="jornada"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <StudentJourney playAudioClick={playChime} isAutoplayGlobal={isAutoplay} />
                <SovereignKeyTakeaway sectionId="jornada" className="mt-12" />
                <SovereignQuickJump currentSectionId="jornada" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

        {/* SECTION 6: CAPACIDADES DO MÓDULO */}
          {activeSection === 'capacidades' && (
            <motion.section
              key="capacidades"
              id="capacidades"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <div className="relative">
                  {/* Data provenance notification badge */}
                  <div className="absolute right-0 -top-8 flex items-center gap-1.5 px-2 py-1 rounded bg-[#05070A]/80 border border-white/5 font-mono text-[9px] text-slate-400 select-none z-20">
                    <span className={`w-1.5 h-1.5 rounded-full ${isOffline ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500/80'}`} />
                    <span>Origem das capacidades: {isOffline ? 'Cache Integrada (IndexedDB)' : 'Repositório Central SILA'}</span>
                  </div>
                  <CapabilitiesGrid playAudioClick={playChime} capabilities={educationCapabilities} isLoading={isLoadingData} />
                </div>

                <SovereignKeyTakeaway sectionId="capacidades" className="mt-12" />
                
                <SovereignQuickJump currentSectionId="capacidades" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'demonstracao' && (
            <motion.section
              key="demonstracao"
              id="demonstracao"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <VideoPlayer playAudioClick={playChime} />
                <SilaVisionPlayer playAudioClick={playChime} />
                <SovereignKeyTakeaway sectionId="demonstracao" className="mt-12" />
                <SovereignQuickJump currentSectionId="demonstracao" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'dashboard' && (
            <motion.section
              key="dashboard"
              id="dashboard"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <SovereignExecutiveDashboard playAudioClick={playChime} isOffline={isOffline} />
                <div className="mt-12">
                  <SovereignSustainabilityReport playAudioClick={playChime} />
                </div>
                <SovereignQuickJump currentSectionId="dashboard" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'arquitetura' && (
            <motion.section
              key="arquitetura"
              id="arquitetura"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <div className="max-w-3xl mb-8">
                  <span className="text-[10px] uppercase font-mono tracking-widest text-[#FFB800] mb-1.5 block font-bold">
                    <SovereignTooltip term="Interoperabilidade" explanation="A capacidade segura de conectar e sincronizar instantaneamente os silos de dados de diferentes ministérios de Angola num único barramento soberano.">Interoperabilidade</SovereignTooltip> do Estado
                  </span>
                  <h3 className="text-3xl font-sans font-medium text-slate-100 tracking-tight leading-none">
                    A Arquitetura de Interoperabilidade Soberana
                  </h3>
                  <p className="text-sm text-slate-400 mt-2 font-sans">
                    O SILA é o tecido unificador. Representação geométrica de como satélites provinciais e ministeriais consolidam logs immutable diretamente na <SovereignTooltip term="FUC" explanation="Ficha Única do Cidadão – o repositório centralizado de identidade soberana que armazena todas as evoluções digitais do cidadão no Estado angolano.">FUC</SovereignTooltip> do cidadão.
                  </p>
                </div>
                
                <InteroperabilityArchitecture playAudioClick={playChime} onOpenAr={() => setIsArOpen(true)} />
                <div className="mt-12">
                  <MinisterialIntegrationGuide playAudioClick={playChime} />
                </div>
                <MATMeetingScheduler playAudioClick={playChime} />
                <SovereignKeyTakeaway sectionId="arquitetura" className="mt-12" />
                <SovereignQuickJump currentSectionId="arquitetura" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'piloto' && (
            <motion.section
              key="piloto"
              id="piloto"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <PilotProposals playAudioClick={playChime} />
                <DigitalMaturityChart playAudioClick={playChime} />
                <HuamboDematerializationLineChart playAudioClick={playChime} />
                <PilotProtocolVisualizer />
                <SovereignKeyTakeaway sectionId="piloto" className="mt-12" />
                <SovereignQuickJump currentSectionId="piloto" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'faq' && (
            <motion.section
              key="faq"
              id="faq"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-24 px-4 sm:px-6 lg:px-8 border-t border-white/5 w-full"
            >
              <ParallaxContent className="max-w-7xl mx-auto">
                <StrategicFaq playAudioClick={playChime} />
                <SovereignKeyTakeaway sectionId="faq" className="mt-12" />
                <SovereignQuickJump currentSectionId="faq" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

          {activeSection === 'conclusao' && (
            <motion.section
              key="conclusao"
              id="conclusao"
              variants={CINEMATIC_SECTION_VARIANTS}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={CINEMATIC_SECTION_TRANSITION}
              className="relative py-32 px-4 sm:px-6 lg:px-8 border-t border-white/5 bg-[#05070A] flex items-center justify-center after:absolute after:bottom-0 after:left-0 after:right-0 after:h-2 w-full opacity-100"
            >
              {/* Symmetrical glowing orbs */}
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[380px] h-[380px] bg-blue-500/5 blur-[120px] rounded-full pointer-events-none"></div>
              <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[380px] h-[380px] bg-[#FFB800]/5 blur-[120px] rounded-full pointer-events-none"></div>

              <ParallaxContent className="max-w-4xl text-center space-y-8 relative z-10 animate-duration-1000">
                <span className="text-[10px] uppercase font-mono tracking-widest text-blue-500 mb-1.5 block font-bold animate-pulse">
                  Conclusão Estratégica
                </span>

                <h2 className="text-4xl sm:text-5xl font-display font-medium tracking-tight text-white leading-tight">
                  Preparando Angola para uma nova geração de serviços públicos.
                </h2>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto font-sans leading-relaxed">
                  O SILA está pronto e homologado para inaugurar o piloto operacional focado na Educação na Província do Huambo, estabelecendo a fundação da Ficha Única para a Administração Pública nacional.
                </p>

                {/* Structured action deck */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                  <button
                    onClick={() => handleOpenContactModal('piloto')}
                    onMouseEnter={() => playChime('hover')}
                    className="w-full sm:w-auto px-6 py-4 bg-gradient-to-r from-blue-600 to-blue-850 hover:from-blue-500 hover:to-blue-750 text-white text-sm rounded-xl font-medium shadow-xl shadow-blue-950/20 hover:scale-[1.01] transition-all duration-300 cursor-pointer"
                  >
                    Solicitar Piloto (Huambo)
                  </button>
                  <button
                    onClick={() => handleNavigate('demonstracao')}
                    onMouseEnter={() => playChime('hover')}
                    className="w-full sm:w-auto px-6 py-4 bg-white/[0.02] hover:bg-white/[0.05] text-slate-300 hover:text-white border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                  >
                    Explorar Demonstração Teatral
                  </button>
                  <button
                    onClick={() => handleOpenContactModal('contacto')}
                    onMouseEnter={() => playChime('hover')}
                    className="w-full sm:w-auto px-6 py-4 bg-white/[0.02] hover:bg-white/[0.05] text-[#FFB800] hover:text-amber-400 border border-white/10 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer"
                  >
                    Contactar Equipa MAT
                  </button>
                </div>

                <SovereignKeyTakeaway sectionId="conclusao" className="mt-8 text-left max-w-2xl mx-auto" />
                
                {/* Direct Contacts Deck */}
                <div id="contactos-diretos" className="mt-14 pt-8 border-t border-white/5 w-full grid grid-cols-1 md:grid-cols-2 gap-4 text-left font-sans">
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-[#FFB800] uppercase tracking-widest block font-bold">Canais Directos de Atendimento</span>
                    <p className="text-xs text-slate-400">Entre em contacto com o nosso corpo especializado por via telemática para esclarecer dúvidas.</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-start md:justify-end gap-3 font-mono text-[10px]">
                    <a
                      href="https://wa.me/244948323383"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-emerald-500/10 bg-emerald-500/5 hover:bg-emerald-500/10 text-emerald-400 hover:text-emerald-300 transition-all cursor-pointer"
                    >
                      <Smartphone className="w-4 h-4 shrink-0 text-emerald-500" />
                      <span>WhatsApp: +244 948 323 383</span>
                    </a>
                    <a
                      href="mailto:inf@vitronis.co.ao"
                      className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-blue-500/10 bg-blue-500/5 hover:bg-blue-500/10 text-blue-400 hover:text-blue-300 transition-all cursor-pointer"
                    >
                      <Mail className="w-4 h-4 shrink-0 text-blue-500" />
                      <span>E-mail: inf@vitronis.co.ao</span>
                    </a>
                  </div>
                </div>

                {/* Soft government footer credentials representation */}
                <div className="mt-8 pt-8 border-t border-white/5 w-full flex flex-col md:flex-row items-center justify-between gap-4 text-left font-mono">
                  <div className="text-[10px] text-slate-600 space-y-1 text-center md:text-left">
                    <p>REPÚBLICA DE ANGOLA • MINISTÉRIO DA ADMINISTRAÇÃO DO TERRITÓRIO (MAT)</p>
                    <p>SILA: SISTEMA INTEGRADO LOCAL DE ANGOLA © 2026 • TODOS OS DIREITOS RESERVADOS</p>
                  </div>
                  
                  {/* SILA OS Technical Widget */}
                  <div className="flex items-center gap-3 bg-white/[0.02] border border-white/10 px-3.5 py-2 rounded-xl text-[10px] text-slate-400 no-print select-none">
                    <div className="flex items-center gap-1.5 border-r border-white/10 pr-3">
                      <span className="text-[9px] bg-blue-600/10 text-blue-400 px-1.5 py-0.5 rounded border border-blue-500/10 font-bold uppercase tracking-wider">
                         SILA OS
                      </span>
                      <span className="text-slate-200 font-bold">v2.6-LTS</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full relative flex">
                        {isOffline ? (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                          </>
                        ) : (
                          <>
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </>
                        )}
                      </span>
                      <span className="font-semibold text-[9px] uppercase tracking-wider">
                        {isOffline ? (
                          <span className="text-amber-500">OFFLINE (LOCAL CACHE)</span>
                        ) : (
                          <span className="text-emerald-400">SINCRONIZADO (MAT CLOUD)</span>
                        )}
                      </span>
                    </div>
                  </div>
                </div>
                
                <SovereignQuickJump currentSectionId="conclusao" sections={SECTIONS} onNavigate={handleNavigate} playAudioClick={playChime} />
              </ParallaxContent>
            </motion.section>
          )}

        </AnimatePresence>
      </main>

      {/* LEAD CONTACT POPUP MOCKUP MODAL */}
      <AnimatePresence>
        {showContactModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            
            {/* Dark Mask */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowContactModal(false)}
              className="absolute inset-0 bg-[#05070A]/85 backdrop-blur-sm"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-md bg-[#05070A] rounded-2xl border border-white/10 p-6 sm:p-8 relative z-10 overflow-hidden bg-gradient-to-b from-[#05070A] to-slate-950/20 shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 blur-2xl"></div>

              {/* Success State Cover */}
              <AnimatePresence>
                {formSubmitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#05070A] flex flex-col items-center justify-center text-center p-6 z-20"
                  >
                    <div className="w-14 h-14 bg-emerald-500/10 border border-emerald-500/30 rounded-full flex items-center justify-center mb-4 text-emerald-400">
                      <CheckCircle className="w-8 h-8 animate-bounce" />
                    </div>
                    <span className="text-[9px] font-mono text-amber-500 uppercase tracking-widest block mb-1">
                      Conexão Governamental Ativada
                    </span>
                    <h3 className="text-lg font-sans font-semibold text-slate-100">
                      Solicitação Registada com Sucesso
                    </h3>
                    <p className="text-xs text-slate-400 mt-2 max-w-xs">
                      Os dados foram criptografados e enviados à Central Operativa SILA MAT. Um especialista entrará em contacto oficial.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Title Header */}
              <div className="mb-6 relative">
                <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block mb-1 font-bold font-semibold text-amber-500 uppercase">
                  {modalType === 'piloto' ? 'REQUISIÇÃO SOBERANA' : 'CANAL MAT DIRECTO'}
                </span>
                <h3 className="text-xl font-sans font-medium text-slate-100">
                  {modalType === 'piloto' ? 'Agendar Piloto Huambo' : 'Contacto de Assessoria'}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Insira as credenciais civis para habilitar a ponte de comunicação oficial.
                </p>
              </div>

              {/* Direct channels for Quick Contact */}
              {modalType === 'contacto' && (
                <div className="mb-6 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <a
                      href="https://wa.me/244948323383"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-col items-center justify-center p-3 bg-emerald-500/10 hover:bg-emerald-500/15 border border-emerald-500/20 hover:border-emerald-500/30 rounded-xl text-center transition-all cursor-pointer group"
                    >
                      <Smartphone className="w-5 h-5 text-emerald-400 group-hover:scale-110 transition-transform mb-1 shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-emerald-400 uppercase tracking-widest">WhatsApp</span>
                      <span className="text-[9px] text-slate-300 font-mono mt-0.5 font-medium">+244 948 323 383</span>
                    </a>
                    <a
                      href="mailto:inf@vitronis.co.ao"
                      className="flex flex-col items-center justify-center p-3 bg-blue-500/10 hover:bg-blue-500/15 border border-blue-500/20 hover:border-blue-500/30 rounded-xl text-center transition-all cursor-pointer group overflow-hidden"
                    >
                      <Mail className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform mb-1 shrink-0" />
                      <span className="text-[10px] font-mono font-bold text-blue-400 uppercase tracking-widest">E-mail</span>
                      <span className="text-[9px] text-slate-300 font-mono mt-0.5 font-medium truncate max-w-full">inf@vitronis.co.ao</span>
                    </a>
                  </div>
                  
                  <div className="relative flex py-2 items-center">
                    <span className="flex-grow border-t border-white/5"></span>
                    <span className="flex-shrink mx-4 text-slate-500 text-[8px] font-mono uppercase tracking-wider">OU REGISTAR REQUISIÇÃO OFICIAL</span>
                    <span className="flex-grow border-t border-white/5"></span>
                  </div>
                </div>
              )}

              {/* Form elements */}
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Nome Completo do Solicitante
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      required
                      type="text"
                      placeholder="Ex: Dr. Silvano Manuel"
                      className="w-full bg-[#05070A]/80 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Cargo / Função Executiva
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      required
                      type="text"
                      placeholder="Ex: Diretor de Educação Provincial"
                      className="w-full bg-[#05070A]/80 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                    Órgão Estatal / Instituição
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600" />
                    <input
                      required
                      type="text"
                      placeholder="Ex: Governo Provincial do Huambo"
                      className="w-full bg-[#05070A]/80 border border-white/10 rounded-lg py-2.5 pl-10 pr-4 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                      value={formData.govOrgan}
                      onChange={(e) => setFormData({ ...formData, govOrgan: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Email Corporativo
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      <input
                        required
                        type="email"
                        placeholder="nome@gov.ao"
                        className="w-full bg-[#05070A]/80 border border-white/10 rounded-lg py-2 pl-8.5 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-mono text-slate-500 uppercase tracking-wider block">
                      Telefone Privado
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-600" />
                      <input
                        required
                        type="tel"
                        placeholder="+244 9xx xxx xxx"
                        className="w-full bg-[#05070A]/80 border border-white/10 rounded-lg py-2 pl-8.5 pr-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>
                </div>

                {/* Secure Badge Info */}
                <div className="p-3 bg-blue-950/20 rounded-lg border border-blue-900/40 text-[9px] font-mono text-slate-500 flex items-center gap-1.5 pt-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  Sessão blindada por criptografia de dados governamentais angolana.
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2.5 pt-2">
                  <div className="flex gap-3">
                    <button
                      type="button"
                      onClick={() => setShowContactModal(false)}
                      onMouseEnter={() => playChime && playChime('hover')}
                      className="flex-1 py-2.5 border border-white/10 hover:border-white/20 hover:bg-white/[0.02] bg-transparent text-slate-400 hover:text-slate-200 text-xs rounded-xl font-medium transition-colors"
                    >
                      Retroceder
                    </button>
                    <button
                      type="submit"
                      onMouseEnter={() => playChime && playChime('hover')}
                      className="flex-1 py-2.5 bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 shadow-md transition-transform hover:scale-[1.01]"
                    >
                      <Send className="w-3.5 h-3.5" />
                      Submeter Requisição
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowWhatsAppConfirmApp(true);
                      if (playChime) playChime('activation');
                    }}
                    className="w-full py-2.5 bg-[#121c16] hover:bg-emerald-500/10 border border-emerald-500/20 hover:border-emerald-500/30 text-emerald-400 text-xs rounded-xl font-medium flex items-center justify-center gap-1.5 shadow-md transition-all cursor-pointer"
                  >
                    <Smartphone className="w-3.5 h-3.5 shrink-0" />
                    Sincronizar com WhatsApp
                  </button>
                </div>
              </form>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WHATSAPP CONTACT CONFIRMATION MODAL */}
      <AnimatePresence>
        {showWhatsAppConfirmApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm no-print">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[#0c0f16] border border-[#22c55e]/20 rounded-2xl max-w-lg w-full p-6 text-left shadow-[0_0_50px_rgba(34,197,94,0.15)] relative overflow-hidden font-sans"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-[#22c55e]/[0.02] rounded-full blur-2xl"></div>

              <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-400 shrink-0">
                  <Smartphone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-mono tracking-widest text-emerald-400 uppercase font-semibold">
                    Envio de Protocolo via WhatsApp API
                  </h4>
                  <p className="text-[10px] text-slate-400">Canal Seguro Certificado MAT • Sincronização SFP</p>
                </div>
              </div>

              {/* Simulated PDF Preview Box */}
              <div className="bg-[#05070a]/75 border border-white/5 rounded-xl p-4 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/20 rounded-lg flex flex-col items-center justify-center text-rose-500 shrink-0 font-mono text-[9px] font-bold">
                    <FileText className="w-6 h-6 text-rose-500 mb-0.5" />
                    PDF
                  </div>
                  <div className="space-y-1 overflow-hidden flex-1 select-none">
                    <span className="text-xs font-sans text-white font-medium block truncate">
                      SILA-Protocolo-Soberano_Atendimento_2026.pdf
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 block">
                      TAMANHO: 1.28 MB • AUTENTICADO POR ASSINATURA DIGITAL
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-y-3.5 gap-x-4 text-[10px] border-t border-white/5 pt-3.5">
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Destinatário Oficial:</span>
                    <span className="text-slate-200 font-mono font-semibold">+244 948 323 383 (SILA Central)</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Objetivos de Interoperabilidade:</span>
                    <span className="text-slate-200 font-semibold block truncate">MED-MAT Huambo-Luanda</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Solicitante:</span>
                    <span className="text-slate-200 font-semibold block truncate">
                      {formData.name || 'Representante Provincial'}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-500 block leading-none mb-1">Órgão / Cargo:</span>
                    <span className="text-slate-100 font-semibold block truncate">
                      {formData.govOrgan || 'SILA Local'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 bg-emerald-500/5 rounded-xl border border-emerald-500/10 text-[10px] text-slate-400 leading-relaxed font-sans">
                <strong>Procedimento Técnico:</strong> Ao confirmar o envio, o sistema compilará os dados fiduciários em uma mensagem assinada criptograficamente com referência securitária em anexo, direcionando para a API do WhatsApp com o destinatário <strong>+244 948 323 383</strong>.
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  disabled={sendingWhatsAppApp}
                  onClick={() => {
                    setShowWhatsAppConfirmApp(false);
                    if (playChime) playChime('click');
                  }}
                  className="flex-1 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] text-slate-300 hover:text-white border border-white/10 rounded-lg text-xs font-semibold tracking-wide transition-colors cursor-pointer text-center disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={sendingWhatsAppApp}
                  onClick={async () => {
                    if (playChime) playChime('activation');
                    setSendingWhatsAppApp(true);
                    
                    // Simulate encryption and compilation process nicely
                    await new Promise((resolve) => setTimeout(resolve, 1200));
                    
                    const msgText = `📝 *SILA - PROTOCOLO DE INTEROPERABILIDADE SOBERANA PACTO* \n` +
                                    `*Documento:* SILA-Protocolo-Soberano_Atendimento_2026.pdf\n` +
                                    `*Ambiente:* Ministério da Administração do Território (MAT)\n` +
                                    `*Destinatário:* +244948323383 (SILA Central)\n` +
                                    `*Solicitante:* ${formData.name || 'Representante Provincial'} (${formData.title || 'SILA Local'})\n` +
                                    `*Órgão:* ${formData.govOrgan || 'Governo Provincial'}\n` +
                                    `*Email Privado/Telf:* ${formData.email || 'Não especificado'} / ${formData.phone || 'Não especificado'}\n` +
                                    `*Hash Criptográfico:* SHA-256 (3b8fa31ca415ee8d9c223c6f499afdb8c028a3915f013d2983792cbdb3a2e7c)\n\n` +
                                    `Olá! Estou a partilhar e a sincronizar o protocolo técnico oficial do SILA integrado com os meus detalhes de contacto. Favor validar em anexo o PDF do documento.\n\n` +
                                    `Aceda ao Portal Técnico Ativo: ${window.location.origin}`;
                    
                    window.open(`https://wa.me/244948323383?text=${encodeURIComponent(msgText)}`, '_blank');
                    setSendingWhatsAppApp(false);
                    setShowWhatsAppConfirmApp(false);
                  }}
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold tracking-wide shadow-lg cursor-pointer text-center flex items-center justify-center gap-1.5"
                >
                  {sendingWhatsAppApp ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>A Compilar PDF...</span>
                    </>
                  ) : (
                    <>
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Confirmar e Enviar</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* SOVEREIGN TOAST NOTIFICATION SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(4px)" }}
            animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: 20, scale: 0.95, filter: "blur(4px)" }}
            transition={{ type: 'spring', stiffness: 380, damping: 26 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm bg-gradient-to-b from-[#0a0f1d]/98 to-[#05070a]/98 border border-blue-500/20 p-4 pb-5 rounded-xl shadow-[0_0_50px_-5px_rgba(59,130,246,0.25)] backdrop-blur-lg flex items-start gap-3 w-[calc(100%-2rem)] sm:w-85 overflow-hidden select-none"
          >
            {/* Holographic scanning ambient ray */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-500/[0.03] to-transparent -skew-x-12 animate-pulse pointer-events-none" />
            
            {/* Corner cyber-decals */}
            <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#FFB800]/40 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#FFB800]/40 rounded-bl" />

            <div className="relative shrink-0 mt-0.5">
              {/* Pulsing circular anchor ring */}
              <div className="absolute -inset-1.5 bg-emerald-500/20 rounded-full animate-ping opacity-60" />
              <div className="p-2.5 bg-emerald-500/10 rounded-lg border border-emerald-500/30 text-emerald-400 relative z-10 shadow-lg shadow-emerald-950/40">
                <CheckCircle className="w-4.5 h-4.5" />
              </div>
            </div>

            <div className="flex-1 space-y-0.5 relative z-10">
              <div className="flex items-center gap-1.5">
                <span className="text-[9px] font-mono text-[#FFB800] font-bold tracking-widest uppercase">
                  SILA SYSTEM • NOTIFICAÇÃO OFICIAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
              </div>
              <p className="text-xs text-slate-100 font-sans font-medium leading-relaxed tracking-wide">
                {toast.message}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">
                  MAT Central Operativa
                </span>
                <span className="w-1 h-3 border-l border-white/10" />
                <span className="text-[9px] font-mono text-blue-400 font-semibold uppercase tracking-wider">
                  Sessão Protegida • {toast.type === 'success' ? 'TRANSMISSÃO OK' : 'SINC_OK'}
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                setToast(null);
                playChime('click');
              }}
              onMouseEnter={() => playChime('hover')}
              className="text-slate-500 hover:text-slate-300 text-base font-mono p-1 leading-none transition-all duration-200 hover:scale-110 active:scale-90 relative z-10 cursor-pointer"
              title="Fechar Transmissão"
            >
              ×
            </button>

            {/* Seamless 5-second dynamic countdown duration bar */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-slate-800/40 w-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5.0, ease: "linear" }}
                className="h-full bg-gradient-to-r from-blue-500 via-[#FFB800] to-emerald-400 shadow-[0_0_10px_#10b981]"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FLOATING PRESENTER NOTES PANEL */}
      <AnimatePresence>
        {showPresenterNotes && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-6 z-[120] max-w-sm w-[calc(100vw-2rem)] sm:w-80 bg-[#05070a]/95 border border-blue-500/30 p-4 rounded-xl shadow-2xl backdrop-blur-md flex flex-col gap-3"
          >
            {/* Header of presenter board */}
            <div className="flex items-center justify-between border-b border-white/5 pb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                <span className="text-[10px] font-mono text-[#FFB800] font-bold uppercase tracking-widest">
                  Cartão do Apresentador
                </span>
              </div>
              <button
                onClick={() => {
                  setShowPresenterNotes(false);
                  playChime('click');
                }}
                className="text-slate-400 hover:text-white hover:bg-white/5 px-2 py-0.5 rounded text-[10px] font-mono transition-colors"
                title="Ocultar Notas"
              >
                Ocultar
              </button>
            </div>

            {/* Content info */}
            <div className="space-y-1">
              <span className="text-[9px] font-mono text-blue-400 uppercase tracking-wider block font-bold leading-none">
                Slide Atual: {String(SECTIONS.findIndex((s) => s.id === activeSection) + 1).padStart(2, '0')} • {SECTIONS.find((s) => s.id === activeSection)?.title}
              </span>
              <p className="text-xs text-slate-200 font-sans leading-relaxed italic pt-1">
                "{PRESENTER_NOTES[activeSection] || 'Nenhuma nota de rodapé definida para este slide de apresentação.'}"
              </p>
            </div>

            {/* Quick advance / reverse tools */}
            <div className="flex items-center justify-between border-t border-white/5 pt-2 text-[9px] font-mono">
              <span className="text-slate-500 font-medium select-none uppercase">SILA PALESTRA MAT</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    const idx = SECTIONS.findIndex(s => s.id === activeSection);
                    if (idx > 0) {
                      handleNavigate(SECTIONS[idx - 1].id);
                    }
                  }}
                  disabled={SECTIONS.findIndex(s => s.id === activeSection) === 0}
                  className="text-slate-300 hover:text-white disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 px-1 disabled:text-slate-600 font-bold"
                >
                  &larr; Anterior
                </button>
                <span className="text-slate-700">|</span>
                <button
                  onClick={() => {
                    const idx = SECTIONS.findIndex(s => s.id === activeSection);
                    if (idx < SECTIONS.length - 1) {
                      handleNavigate(SECTIONS[idx + 1].id);
                    }
                  }}
                  disabled={SECTIONS.findIndex(s => s.id === activeSection) === SECTIONS.length - 1}
                  className="text-blue-400 hover:text-blue-300 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 px-1 disabled:text-slate-600 font-bold"
                >
                  Próximo &rarr;
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SOVEREIGN ACCESSIBILITY DALTONISM SVG MATRICES */}
      <svg style={{ position: 'absolute', width: 0, height: 0, pointerEvents: 'none', left: -9999 }} aria-hidden="true">
        <defs>
          <filter id="protanopia-filter">
            <feColorMatrix type="matrix" values="0.567, 0.433, 0,     0, 0
                                                 0.558, 0.442, 0,     0, 0
                                                 0,     0.242, 0.758, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
          <filter id="deuteranopia-filter">
            <feColorMatrix type="matrix" values="0.625, 0.375, 0,   0, 0
                                                 0.7,   0.3,   0,   0, 0
                                                 0,     0.3,   0.7, 0, 0
                                                 0,     0,     0,   1, 0" />
          </filter>
          <filter id="tritanopia-filter">
            <feColorMatrix type="matrix" values="0.95,  0.05,  0,     0, 0
                                                 0,     0.433, 0.567, 0, 0
                                                 0,     0.475, 0.525, 0, 0
                                                 0,     0,     0,     1, 0" />
          </filter>
        </defs>
      </svg>

      {/* SOVEREIGN GLOBAL SEARCH CONTROLLER */}
      <SovereignSearchPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onNavigate={handleNavigate}
        playAudioClick={playChime}
      />

      {/* SOVEREIGN SPATIAL INTERACTIVE AR COMPONENT */}
      <SilaArViewer
        isOpen={isArOpen}
        onClose={() => setIsArOpen(false)}
        playAudioClick={playChime}
      />

      {/* SOVEREIGN COMPACT DYNAMIC SECTION MINIMAP */}
      <SovereignSectionMinimap
        activeSection={activeSection}
        sections={SECTIONS}
        onNavigate={handleNavigate}
        playAudioClick={playChime}
      />

      {/* SOVEREIGN REAL-TIME BUREAUCRACY SAVED WIDGET */}
      <BureaucracySaverWidget playAudioClick={playChime} />

    </div>
  );
}
