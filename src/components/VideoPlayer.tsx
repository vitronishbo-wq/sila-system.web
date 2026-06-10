import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Film, Sparkles, Tv, ExternalLink } from 'lucide-react';

interface VideoPlayerProps {
  playAudioClick?: () => void;
}

interface DemoVideo {
  id: string;
  youtubeId: string;
  title: string;
  duration: string;
  description: string;
  theme: 'blue' | 'amber';
  tagline: string;
}

const VIDEOS_DATA: DemoVideo[] = [
  {
    id: 'general',
    youtubeId: '7TgrwMqKBKw', // ID extraído do seu link do YouTube
    title: 'SILA Geral – Visão do Estado',
    duration: '03:00',
    description: 'Apresentação macro da infraestrutura nacional de Estado Digital, abrangendo a filosofia de dados desfragmentados e interoperabilidade federativa sob o lema "O cidadão fornece os dados uma única vez".',
    theme: 'blue',
    tagline: 'A revolução digital na Governação Angolana.',
  },
  {
    id: 'education',
    youtubeId: '7TgrwMqKBKw', // Substitua aqui pelo ID do segundo vídeo quando o tiver
    title: 'SILA Educação – O Piloto do Huambo',
    duration: '03:00',
    description: 'Demostração prática do fluxo de matrículas integradas, pautas digitais, bilhetes biométricos interligados e as métricas do piloto operacional consolidado no planalto central angolano.',
    theme: 'amber',
    tagline: 'O portal letivo sem papéis centrado no estudante.',
  },
];

export default function VideoPlayer({ playAudioClick }: VideoPlayerProps) {
  const [selectedVid, setSelectedVid] = useState<DemoVideo>(VIDEOS_DATA[0]);

  // Selector handler
  const handleSelectVideo = (vid: DemoVideo) => {
    setSelectedVid(vid);
    if (playAudioClick) playAudioClick();
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

      {/* Cinematic YouTube Player View */}
      <div className="lg:col-span-8 bg-[#05070A] rounded-2xl border border-white/10 p-1 bg-gradient-to-br from-[#05070A] via-[#05070A] to-blue-950/5 shadow-2xl relative flex flex-col justify-between">
        <div className="p-3 bg-[#05070A] rounded-t-xl border-b border-white/5 flex justify-between items-center text-[10px] sm:text-xs">
          <div className="flex items-center gap-2">
            <Tv className="w-4 h-4 text-blue-500 animate-pulse" />
            <span className="font-mono text-slate-400 font-semibold uppercase">
              {selectedVid.tagline}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-white/[0.02] px-2 py-0.5 rounded border border-white/5 text-[9px] font-mono text-emerald-400">
              <Sparkles className="w-3 h-3 text-emerald-400" />
              TRANSMISSÃO OPERATIVA
            </div>
            <span className="font-mono text-slate-600 bg-white/[0.01] px-2 py-0.5 rounded border border-white/5">
              4K UHD STREAM
            </span>
          </div>
        </div>

        {/* Real Dynamic YouTube Iframe Container */}
        <div className="relative aspect-video bg-black flex flex-col items-center justify-center overflow-hidden group">
          {/* Neon radial backdrop shine behind the player */}
          <div className={`absolute w-[400px] h-[400px] rounded-full blur-[110px] opacity-10 pointer-events-none transition-all duration-700 ${
            selectedVid.theme === 'blue' ? 'bg-blue-500' : 'bg-amber-500'
          }`}></div>

          <AnimatePresence mode="wait">
            <motion.div
              key={selectedVid.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full h-full z-10"
            >
              <iframe
                className="w-full h-full border-0"
                src={`https://www.youtube.com/embed/${selectedVid.youtubeId}?rel=0&modestbranding=1&showinfo=0&autoplay=0`}
                title={selectedVid.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Player Description Meta Infobar */}
        <div className="p-4 bg-[#05070A] rounded-b-xl border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5 max-w-xl">
            <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest block">
              SINOPSE EXECUTIVA ATIVA
            </span>
            <p className="text-xs text-slate-400 font-sans leading-relaxed">
              {selectedVid.description}
            </p>
          </div>

          <div className="flex items-center sm:justify-end gap-3 shrink-0">
            <a 
              href={`https://youtu.be/${selectedVid.youtubeId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-[10px] font-mono text-slate-500 hover:text-slate-300 border border-white/5 hover:border-white/10 bg-white/[0.01] px-2.5 py-1.5 rounded-lg transition-all"
            >
              <span>Abrir original</span>
              <ExternalLink className="w-3 h-3" />
            </a>
            <span className="text-[10px] font-mono text-slate-500">
              Codec: <span className="text-emerald-400 font-bold">HEVC-10bit (H.265)</span>
            </span>
          </div>
        </div>
      </div>

    </div>
  );
}
