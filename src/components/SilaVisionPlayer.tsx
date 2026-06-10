import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, Maximize2, Sparkles, Film, Database, Loader2, CloudLightning, ShieldCheck, Lock } from 'lucide-react';

interface SilaVisionPlayerProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function SilaVisionPlayer({ playAudioClick }: SilaVisionPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [fetchProgress, setFetchProgress] = useState(0);
  const [fetchStep, setFetchStep] = useState<string>('');
  const [progress, setProgress] = useState(15); // simulated initial progress
  const [soundBars, setSoundBars] = useState<number[]>(Array.from({ length: 24 }, () => Math.random() * 30 + 5));
  
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioWaveRef = useRef<NodeJS.Timeout | null>(null);

  // Video specifications
  const videoTitle = 'SILA Vision 2026 – O Futuro da Governação';
  const videoDuration = '01:15';
  const videoDurationSec = 75;
  const videoDescription = 'Um vislumbre cinematográfico conciso da desburocratização nacional. O SILA interligando Ministérios, Administrações Municipais e Cidadãos num único fluxo soberano em menos de 10 segundos.';
  const tagline = 'O TEASER OFICIAL DO PRÓXIMO PARADIGMA DIGITAL';

  const fetchSteps = [
    'Conectando ao CDN Soberano (Luanda Core)...',
    'Chave de encriptação validada pelo barramento MAT...',
    'Buffering de alta velocidade (UHD 4K)...',
    'Concluído!'
  ];

  // Start direct video playback trigger
  const handlePlayTrigger = () => {
    if (playAudioClick) playAudioClick('click');
    if (progress === 100) {
      setProgress(0);
    }
    
    if (!isPlaying && progress === 0) {
      // Simulate secure CDN fetch
      setIsFetching(true);
      setFetchProgress(0);
      setFetchStep(fetchSteps[0]);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  // Simulate progress of CDN fetch
  useEffect(() => {
    let fetchTimer: NodeJS.Timeout | null = null;
    if (isFetching) {
      fetchTimer = setInterval(() => {
        setFetchProgress((prev) => {
          const next = prev + 10;
          if (next >= 100) {
            clearInterval(fetchTimer!);
            setIsFetching(false);
            setIsPlaying(true);
            if (playAudioClick) playAudioClick('activation');
            return 100;
          }
          
          // Update fetch steps
          if (next < 35) setFetchStep(fetchSteps[0]);
          else if (next < 70) setFetchStep(fetchSteps[1]);
          else setFetchStep(fetchSteps[2]);
          
          return next;
        });
      }, 200);
    }
    return () => {
      if (fetchTimer) clearInterval(fetchTimer);
    };
  }, [isFetching]);

  // Simulate progress of the video playing
  useEffect(() => {
    if (isPlaying && !isFetching) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 100;
          }
          return prev + 1.2; // faster progress for 1:15 video
        });
      }, 500);

      audioWaveRef.current = setInterval(() => {
        setSoundBars(Array.from({ length: 24 }, () => Math.random() * 65 + 15));
      }, 90);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (audioWaveRef.current) clearInterval(audioWaveRef.current);
      setSoundBars(Array.from({ length: 24 }, () => Math.random() * 8 + 4));
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (audioWaveRef.current) clearInterval(audioWaveRef.current);
    };
  }, [isPlaying, isFetching]);

  const getElapsedFormatted = () => {
    const elapsedSec = Math.floor((progress / 100) * videoDurationSec);
    const m = Math.floor(elapsedSec / 60);
    const s = elapsedSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full space-y-6 pt-12 border-t border-white/5">
      
      {/* Decorative subtitle row splitter */}
      <div className="flex items-center gap-4">
        <div className="h-px bg-gradient-to-r from-violet-500/30 to-transparent flex-1"></div>
        <span className="text-[10px] font-mono text-violet-400 uppercase tracking-widest font-bold">
          Teaser Promocional
        </span>
        <div className="h-px bg-gradient-to-l from-violet-500/30 to-transparent flex-1"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
        
        {/* Left Side: Editorial context */}
        <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div>
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-violet-500/10 border border-violet-500/20 text-[9px] font-mono text-violet-400 font-bold mb-2">
                <Database className="w-3 h-3 text-violet-400" />
                MÍDIA OFF-SITE RESTRITA
              </span>
              <h4 className="text-xl sm:text-2xl font-sans font-medium text-slate-100 tracking-tight">
                SILA Vision 2026 Promo
              </h4>
              <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                Um teaser dinâmico desenhado para resumir a visão estratégica do Estado em menos de 2 minutos. Demonstração voltada para decisores de alto escalão e audiências governamentais externas.
              </p>
            </div>

            <div className="p-4 bg-violet-950/10 border border-violet-500/10 rounded-xl space-y-2.5">
              <div className="flex items-center gap-2 text-[10px] font-mono text-violet-400 font-bold">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>INTEGRIDADE DE TRANSMISSÃO</span>
              </div>
              <p className="text-[11px] text-slate-300 leading-normal">
                Disponibilizado através de canais criptografados no barramento estadual do Ministério do MAT e do Gabinete Presidencial.
              </p>
            </div>
          </div>

          <div className="p-3 bg-white/[0.01] border border-white/5 rounded-lg text-[10px] text-slate-500 flex items-center justify-between">
            <span className="font-mono">PROMO DURATION: {videoDuration} SEC</span>
            <span className="font-mono text-violet-400">VIOLET-SHINE LAYOUT</span>
          </div>
        </div>

        {/* Right Side: Visual Cinematic Video Container */}
        <div className="lg:col-span-8 bg-[#05070A] rounded-2xl border border-white/10 p-1 bg-gradient-to-br from-[#05070A] via-[#05070A] to-violet-950/5 shadow-2xl relative flex flex-col justify-between">
          
          {/* Header of player */}
          <div className="p-3 bg-[#05070A] rounded-t-xl border-b border-white/5 flex justify-between items-center text-[10px] sm:text-xs">
            <div className="flex items-center gap-2">
              <Film className="w-4 h-4 text-violet-500 animate-pulse" />
              <span className="font-mono text-slate-400 font-semibold uppercase">
                {tagline}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-violet-400 bg-violet-500/5 px-2 py-0.5 rounded border border-violet-500/10">
              <Lock className="w-3 h-3 text-violet-400" />
              <span>SECURE PROTOCOL</span>
            </div>
          </div>

          {/* Dynamic player backdrop displaying loading states and waves */}
          <div className="relative aspect-video bg-[#030508] flex flex-col items-center justify-center p-6 select-none overflow-hidden group">
            {/* Neon purple center glow */}
            <div className="absolute w-[350px] h-[350px] rounded-full blur-[100px] opacity-10 bg-violet-600 pointer-events-none"></div>

            <AnimatePresence mode="wait">
              {isFetching ? (
                /* Dynamic secure fetch screen */
                <motion.div
                  key="fetching"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center space-y-4 z-10"
                >
                  <div className="relative w-12 h-12 mx-auto flex items-center justify-center">
                    <Loader2 className="w-8 h-8 text-violet-500 animate-spin" />
                    <CloudLightning className="w-4 h-4 text-violet-400 absolute" />
                  </div>
                  <div>
                    <span className="text-[10px] font-mono text-violet-400 tracking-wider block font-bold uppercase animate-pulse">
                      {fetchStep}
                    </span>
                    <div className="w-44 h-1 bg-white/5 rounded-full mx-auto mt-2 overflow-hidden">
                      <motion.div 
                        className="h-full bg-violet-500" 
                        initial={{ width: 0 }} 
                        animate={{ width: `${fetchProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                  </div>
                </motion.div>
              ) : !isPlaying ? (
                /* Cover Play screen */
                <motion.div
                  key="splash"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center space-y-4 z-10"
                >
                  <button
                    onClick={handlePlayTrigger}
                    className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-violet-600 hover:bg-violet-500 ring-4 ring-violet-500/20 transition-all duration-300 pointer-events-auto"
                  >
                    <Play className="w-6 h-6 text-white translate-x-0.5" />
                  </button>
                  <div>
                    <h4 className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold col-span-1">
                      Reproduzir SILA Vision Teaser
                    </h4>
                    <p className="text-sm font-sans font-medium text-slate-200 mt-1 max-w-sm">
                      {videoTitle}
                    </p>
                  </div>
                </motion.div>
              ) : (
                /* Active video simulation playback with gorgeous audio waves */
                <motion.div
                  key="playing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="w-full h-full flex flex-col items-center justify-between z-10 p-4"
                >
                  <div className="text-center mt-3">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[9px] font-mono text-emerald-400 uppercase tracking-widest mb-1 font-bold">
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      AUDITORIA CINEMÁTICA ATIVA
                    </div>
                    <p className="text-xs text-slate-300 font-sans mt-0.5 max-w-md">
                      {videoDescription}
                    </p>
                  </div>

                  {/* Sound Wave elements representation */}
                  <div className="flex items-end justify-center gap-1 h-24 w-full px-8">
                    {soundBars.map((barHeight, idx) => (
                      <motion.div
                        key={idx}
                        style={{ height: `${barHeight}%` }}
                        className="w-1.5 sm:w-2 min-h-[4px] rounded-full transition-all duration-100 bg-violet-500/75"
                      />
                    ))}
                  </div>

                  <div className="text-[8px] font-mono text-slate-500 bg-[#05070A] p-1 px-2.5 rounded border border-white/5">
                    CHAVE DE DECODIFICAÇÃO DE SINAL: SHA-256 ACCREDITED
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Player controls */}
          <div className="p-4 bg-[#05070A] rounded-b-xl border-t border-white/5 space-y-3">
            <div className="space-y-1">
              <div className="relative h-1 bg-white/5 rounded-full cursor-pointer">
                <div
                  className="absolute left-0 top-0 h-full rounded-full transition-all duration-300 bg-violet-500"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                <span>{getElapsedFormatted()}</span>
                <span>{videoDuration}</span>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayTrigger}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  title={isPlaying ? 'Pausar' : 'Reproduzir'}
                >
                  {isPlaying ? <Pause className="w-4 h-4 text-violet-400" /> : <Play className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => {
                    setProgress(0);
                    if (playAudioClick) playAudioClick('click');
                  }}
                  className="text-slate-400 hover:text-slate-200 transition-colors"
                  title="Reiniciar"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
                <div className="hidden sm:flex items-center gap-1.5 text-slate-500 hover:text-slate-400 transition-colors">
                  <Volume2 className="w-4 h-4" />
                  <span className="text-[9px] font-mono">SAÍDA AUDIO DINÂMICA</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-500">
                  Transmissão: <span className="text-violet-400 font-bold">SEGURA (MAT)</span>
                </span>
                <Maximize2 className="w-4 h-4 text-slate-400 hover:text-slate-200 cursor-pointer" />
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
