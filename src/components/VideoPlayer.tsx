import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, RotateCcw, Volume2, Maximize2, MonitorPlay, Film, Sparkles, Tv } from 'lucide-react';

interface VideoPlayerProps {
  playAudioClick?: () => void;
}

interface DemoVideo {
  id: string;
  title: string;
  duration: string;
  durationSec: number;
  description: string;
  theme: 'blue' | 'amber';
  tagline: string;
  youtubeId?: string;
}

const VIDEOS_DATA: DemoVideo[] = [
  {
    id: 'general',
    title: 'SILA Geral – Visão do Estado',
    duration: '03:00',
    durationSec: 180,
    description: 'Apresentação macro da infraestrutura nacional de Estado Digital, abrangendo a filosofia de dados desfragmentados e interoperabilidade federativa sob o lema "O cidadão fornece os dados uma única vez".',
    theme: 'blue',
    tagline: 'A revolução digital na Governação Angolana.',
    youtubeId: '7TgrwMqKBKw'
  },
  {
    id: 'education',
    title: 'SILA Educação – O Piloto do Huambo',
    duration: '03:00',
    durationSec: 180,
    description: 'Demostração prática do fluxo de matrículas integradas, pautas digitais, bilhetes biométricos interligados e as métricas do piloto operacional consolidado no planalto central angolano.',
    theme: 'amber',
    tagline: 'O portal letivo sem papéis centrado no estudante.',
  },
];

export default function VideoPlayer({ playAudioClick }: VideoPlayerProps) {
  const [selectedVid, setSelectedVid] = useState<DemoVideo>(VIDEOS_DATA[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(35); // simulated initial progress
  const [soundBars, setSoundBars] = useState<number[]>(Array.from({ length: 28 }, () => Math.random() * 40));
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const audioWaveRef = useRef<NodeJS.Timeout | null>(null);

  // Selector handler
  const handleSelectVideo = (vid: DemoVideo) => {
    setSelectedVid(vid);
    setIsPlaying(false);
    setProgress(0);
    if (playAudioClick) playAudioClick();
  };

  // Toggle Play State
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (playAudioClick) playAudioClick();
  };

  // Simulate progress when video is "playing"
  useEffect(() => {
    if (isPlaying) {
      progressIntervalRef.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 0.5;
        });
      }, 500);

      // Animate the sound wave visualizers
      audioWaveRef.current = setInterval(() => {
        setSoundBars(Array.from({ length: 28 }, () => Math.random() * 50 + 10));
      }, 100);
    } else {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (audioWaveRef.current) clearInterval(audioWaveRef.current);
      // reset sound bars
      setSoundBars(Array.from({ length: 28 }, () => Math.random() * 8 + 4));
    }

    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (audioWaveRef.current) clearInterval(audioWaveRef.current);
    };
  }, [isPlaying]);

  // Format Elapsed Time string
  const getElapsedFormatted = () => {
    const totalSec = selectedVid.durationSec;
    const elapsedSec = Math.floor((progress / 100) * totalSec);
    const m = Math.floor(elapsedSec / 60);
    const s = elapsedSec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div id="executive-theater-demostrativo" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch relative z-10">
      
      {/* Selector side */}
      <div className="lg:col-span-4 flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div>
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-500 mb-1.5 block font-bold">
              Teatro de Demonstração
            </span>
            <h3 className="text-2xl font-sans font-medium text-slate-100 tracking-tight">
              Sessões Práticas em Alta Definição
            </h3>
            <p className="text-xs text-slate-400 mt-2">
              Selecione o vídeo demonstrativo para assistir à modelagem de interface e simular o player de apresentação.
            </p>
          </div>

          <div className="space-y-3">
            {VIDEOS_DATA.map((vid) => {
              const isSelected = selectedVid.id === vid.id;
              return (
                <button
                  key={vid.id}
                  onClick={() => handleSelectVideo(vid)}
                  className={`w-full text-left p-4 rounded-xl border transition-all duration-300 relative overflow-hidden block ${
                    isSelected
                      ? vid.theme === 'blue'
                        ? 'bg-blue-600/10 border-blue-500/80 shadow-lg shadow-blue-950/20'
                        : 'bg-amber-600/10 border-amber-500/80 shadow-lg shadow-amber-950/20'
                      : 'bg-white/[0.01] border-white/5 hover:border-white/10 hover:bg-white/[0.02]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg bg-slate-950 border ${
                      isSelected 
                        ? vid.theme === 'blue' ? 'border-blue-500/30 text-blue-400' : 'border-amber-500/30 text-amber-500'
                        : 'border-slate-900 text-slate-500'
                    }`}>
                      <Film className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wider">
                        DEMO • {vid.duration} MINUTOS
                      </span>
                      <span className={`text-sm font-sans font-medium block truncate ${
                        isSelected ? 'text-slate-100' : 'text-slate-300'
                      }`}>
                        {vid.title}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Informative advice on production integration */}
        <div className="p-4 bg-[#05070A] rounded-xl border border-white/5 text-xs">
          <span className="text-[#FFB800] uppercase font-mono text-[9px] tracking-widest font-bold block mb-1">
            Nota de Integração Produtiva
          </span>
          <p className="text-slate-400 leading-relaxed">
            Esta área de visualização está encapsulada e homologada para receber screencasts reais em alta fidelidade e tutoriais de utilização ministerial via CDN.
          </p>
        </div>
      </div>

      {/* Cinematic mock player view */}
      <div className="lg:col-span-8 bg-[#05070A] rounded-2xl border border-white/10 p-1 bg-gradient-to-br from-[#05070A] via-[#05070A] to-blue-950/5 shadow-2xl relative flex flex-col justify-between">
        <div className="p-3 bg-[#05070A] rounded-t-xl border-b border-white/5 flex justify-between items-center text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="font-mono text-slate-400 font-semibold uppercase">
              {selectedVid.tagline}
            </span>
          </div>
          <span className="font-mono text-slate-600 bg-white/[0.01] px-2 py-0.5 rounded border border-white/5">
            4K UHD STREAM
          </span>
        </div>

        {/* Visual Screen with splash / waveform */}
        <div className="relative aspect-video bg-[#05070A] flex flex-col items-center justify-center p-6 select-none overflow-hidden group">
          {/* Neon radial backdrop shine */}
          <div className={`absolute w-[400px] h-[400px] rounded-full blur-[110px] opacity-15 pointer-events-none transition-all duration-700 ${
            selectedVid.theme === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
          }`}></div>

          {/* Floating particle sparkle */}
          {isPlaying && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-white/[0.01] px-2.5 py-1 rounded border border-white/10 text-[9px] font-mono text-emerald-400">
              <Sparkles className="w-3.5 h-3.5 animate-spin-slow" />
              TRANSMISSÃO OPERATIVA
            </div>
          )}

          {/* Main Visual: Splash Card or Simulated Waveform */}
          <AnimatePresence mode="wait">
            {!isPlaying ? (
              <motion.div
                key="splash"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="text-center space-y-4 z-10"
              >
                {/* Big play medallion */}
                <button
                  onClick={togglePlay}
                  className={`mx-auto w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ring-4 pointer-events-auto ${
                    selectedVid.theme === 'blue'
                      ? 'bg-blue-600 hover:bg-blue-500 ring-blue-500/20'
                      : 'bg-amber-500 hover:bg-amber-400 ring-amber-500/20'
                  }`}
                >
                  <Play className="w-6 h-6 text-white translate-x-0.5" />
                </button>
                <div>
                  <h4 className="text-xs font-mono uppercase tracking-widest text-slate-500">
                    Clique para iniciar simulação
                  </h4>
                  <p className="text-sm font-sans font-medium text-slate-200 mt-1 max-w-md">
                    {selectedVid.title}
                  </p>
                </div>
              </motion.div>
            ) : selectedVid.youtubeId ? (
              <motion.div
                key="youtube-playback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 w-full h-full z-10"
              >
                <iframe
                  className="w-full h-full border-0"
                  src={`https://www.youtube.com/embed/${selectedVid.youtubeId}?autoplay=1&rel=0&modestbranding=1&controls=1`}
                  title={selectedVid.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            ) : (
              <motion.div
                key="active-playback"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="w-full h-full flex flex-col items-center justify-between z-10 p-4"
              >
                {/* Simulated Waveform Header */}
                <div className="text-center mt-4">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block">
                    REPRODUZINDO AUDITORIA EXECUTIVA
                  </span>
                  <p className="text-xs text-slate-300 font-sans mt-1">
                    {selectedVid.description}
                  </p>
                </div>

                {/* Animated Audio Frequencies Waveform */}
                <div className="flex items-end justify-center gap-1 h-24 w-full px-12 select-none">
                  {soundBars.map((barHeight, idx) => (
                    <motion.div
                      key={idx}
                      style={{ height: `${barHeight}%` }}
                      className={`w-1.5 sm:w-2 min-h-[4px] rounded-full transition-all duration-100 ${
                        selectedVid.theme === 'blue' ? 'bg-blue-500/70' : 'bg-amber-500/70'
                      }`}
                    />
                  ))}
                </div>

                {/* Micro Log */}
                <div className="text-[9px] font-mono text-slate-500 bg-[#05070A] px-3 py-1.5 rounded-lg border border-white/5 text-center">
                  CODEC: AAC-LC 192KBPS STEREO • VIDEO ENCODER: HEVC-10bit
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Player Controls Bar */}
        <div className="p-4 bg-[#05070A] rounded-b-xl border-t border-white/5 space-y-3">
          {/* Time & Progress track */}
          <div className="space-y-1">
            <div className="relative h-1 bg-white/5 rounded-full cursor-pointer">
              <div
                className={`absolute left-0 top-0 h-full rounded-full transition-all duration-300 ${
                  selectedVid.theme === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
                }`}
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
              <span>{getElapsedFormatted()}</span>
              <span>{selectedVid.duration}</span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center justify-between pointer-events-auto">
            <div className="flex items-center gap-4">
              <button
                onClick={togglePlay}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title={isPlaying ? 'Pausar' : 'Reproduzir'}
              >
                {isPlaying ? <Pause className="w-4 h-4 text-amber-500" /> : <Play className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setProgress(0)}
                className="text-slate-400 hover:text-slate-200 transition-colors"
                title="Reiniciar"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
              <div className="hidden sm:flex items-center gap-1.5 text-slate-500 hover:text-slate-400 transition-colors">
                <Volume2 className="w-4 h-4" />
                <span className="text-[9px] font-mono">EXECUÇÃO INTERNA MOCK</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-mono text-slate-500">
                Qualidade: <span className="text-emerald-400 font-bold">AUTO (4K)</span>
              </span>
              <Maximize2 className="w-4 h-4 text-slate-400 hover:text-slate-200 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
