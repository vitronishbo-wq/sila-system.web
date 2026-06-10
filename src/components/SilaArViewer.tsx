import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, X, RefreshCw, Focus, Sparkles, AlertTriangle, 
  Settings, RotateCw, ZoomIn, ZoomOut, Database, HelpCircle, 
  ShieldCheck, Activity, Terminal, CheckCircle2, Sliders, Play, Volume2, VolumeX
} from 'lucide-react';

interface SilaArViewerProps {
  isOpen: boolean;
  onClose: () => void;
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function SilaArViewer({ isOpen, onClose, playAudioClick }: SilaArViewerProps) {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(true);
  const [isAnchored, setIsAnchored] = useState(false);
  const [rotationY, setRotationY] = useState(45);
  const [rotationX, setRotationX] = useState(20);
  const [scale, setScale] = useState(1.0);
  const [activeTab, setActiveTab] = useState<'visual' | 'telemetria' | 'dados'>('visual');
  const [trafficLevel, setTrafficLevel] = useState<number>(45);
  const [mockActive, setMockActive] = useState(false);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');

  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Drag interaction states for 3D orbital rot
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startY, setStartY] = useState(0);

  // Real-time telemetry generators
  const [telemetry, setTelemetry] = useState({
    fps: 60,
    ping: 12,
    blocks: 412290,
    hash: 'SILA-CORE-f8b2d49aa92c',
    status: 'ONLINE',
    surfaceConfidence: 0
  });

  // Start actual camera stream
  const startCamera = async (mode: 'environment' | 'user') => {
    try {
      setCameraError(null);
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      setMockActive(false);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn("Camera init failed, falling back to clean simulated demo:", err);
      setCameraError(
        "Acesso à câmara restringido ou não disponível neste dispositivo. " +
        "Ativando modo de simulação de alta fidelidade para demonstração executiva."
      );
      setMockActive(true);
    }
  };

  useEffect(() => {
    if (isOpen) {
      startCamera(facingMode);
      setIsScanning(true);
      setIsAnchored(false);
      setRotationX(20);
      setRotationY(45);
      setScale(1.0);

      // Automated scanning progress sequence
      const scanTimer = setTimeout(() => {
        setIsScanning(false);
        setIsAnchored(true);
        playAudioClick?.('activation');
      }, 3500);

      return () => {
        clearTimeout(scanTimer);
      };
    } else {
      // Clean up camera stream on close
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
      }
    }
  }, [isOpen, facingMode]);

  // Telemetry loop ticker
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        fps: Math.floor(prev.fps * 0.95 + (58 + Math.random() * 4) * 0.05),
        ping: Math.floor(10 + Math.random() * 5),
        blocks: prev.blocks + (Math.random() > 0.7 ? 1 : 0),
        hash: 'SILA-CORE-' + Math.random().toString(16).substring(2, 10).toUpperCase(),
        status: 'ONLINE',
        surfaceConfidence: isScanning ? Math.min(100, Math.floor(prev.surfaceConfidence + 12 + Math.random() * 8)) : 100
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, isScanning]);

  const switchCamera = () => {
    const nextMode = facingMode === 'environment' ? 'user' : 'environment';
    setFacingMode(nextMode);
    playAudioClick?.('click');
  };

  // Simple drag mechanics to orbit the 3D projection
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const deltaY = e.clientY - startY;
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-60, Math.min(60, prev - deltaY * 0.5)));
    setStartX(e.clientX);
    setStartY(e.clientY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      setStartX(e.touches[0].clientX);
      setStartY(e.touches[0].clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - startX;
    const deltaY = e.touches[0].clientY - startY;
    setRotationY(prev => prev + deltaX * 0.5);
    setRotationX(prev => Math.max(-60, Math.min(60, prev - deltaY * 0.5)));
    setStartX(e.touches[0].clientX);
    setStartY(e.touches[0].clientY);
  };

  // Sub-components: 3D Hologram rings
  const render3DHologram = () => {
    return (
      <div 
        className="relative w-72 h-72 sm:w-80 sm:h-80 transition-all duration-300 pointer-events-auto"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="w-full h-full relative cursor-grab active:cursor-grabbing preserve-3d"
          style={{
            transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg) scale(${scale})`,
            transformStyle: 'preserve-3d',
            transition: isDragging ? 'none' : 'transform 1s cubic-bezier(0.1, 0.8, 0.2, 1)',
          }}
        >
          {/* Main Core Central Sphere */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-blue-500/20 border-2 border-blue-400 flex items-center justify-center shadow-2xl shadow-blue-500/40"
            style={{ transform: 'translateZ(0px)' }}
          >
            <div className="absolute inset-1 rounded-full border border-dashed border-cyan-400 animate-spin-slow"></div>
            <Database className="w-6 h-6 text-cyan-400 animate-pulse" />
          </div>

          {/* Outer Ring 1 - Equator */}
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full border-2 border-dashed border-blue-500/35 flex items-center justify-center animate-spin-slow"
            style={{ 
              transform: 'rotateX(90deg) translateZ(0px)',
              transformStyle: 'preserve-3d'
            }}
          >
            {/* Tiny satellite data nodes on equator */}
            <div className="absolute top-0 w-3.5 h-3.5 rounded-full bg-amber-500 shadow-md shadow-amber-500/50 flex items-center justify-center text-[7px] text-black font-bold font-mono">
              MED
            </div>
            <div className="absolute bottom-0 w-3.5 h-3.5 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 flex items-center justify-center text-[7px] text-black font-bold font-mono">
              MS
            </div>
            <div className="absolute left-0 w-3.5 h-3.5 rounded-full bg-[#bfdbfe] shadow-md shadow-[#bfdbfe]/50 flex items-center justify-center text-[7px] text-black font-bold font-mono">
              MAT
            </div>
          </div>

          {/* Ring 2 - Vertical Orbital */}
          <div 
            className="absolute top-0 left-0 w-full h-full rounded-full border border-double border-cyan-400/30 flex items-center justify-center"
            style={{ 
              transform: 'rotateY(90deg) translateZ(0px)',
              animation: 'spin 12s linear infinite'
            }}
          >
            <div className="absolute top-0 w-3 h-3 rounded-full bg-indigo-500 shadow-md shadow-indigo-500/50"></div>
            <div className="absolute bottom-0 w-3 h-3 rounded-full bg-purple-500 shadow-md shadow-purple-500/50"></div>
          </div>

          {/* Diagonal Secondary Ring 3 */}
          <div 
            className="absolute top-4 left-4 right-4 bottom-4 rounded-full border border-white/10"
            style={{ 
              transform: 'rotateX(45deg) rotateY(45deg) translateZ(0px)',
              animation: 'spin 16s linear infinite reverse'
            }}
          />

          {/* Hologram Light Projection Pillar effect */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-96 bg-gradient-to-t from-blue-500/0 via-blue-500/10 to-blue-500/0 blur-md pointer-events-none"
            style={{ 
              transform: 'rotateX(90deg) translateZ(-80px)',
            }}
          />

          {/* Bottom surface circular base guide */}
          <div 
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-56 h-56 rounded-full border-2 border-emerald-500/25 bg-emerald-500/5 flex items-center justify-center"
            style={{ 
              transform: 'rotateX(90deg) translateZ(90px)',
            }}
          >
            <div className="absolute inset-2 rounded-full border border-dashed border-emerald-400/40 animate-ping" style={{ animationDuration: '3s' }}></div>
            <div className="absolute inset-8 rounded-full border border-white/5"></div>
            
            {/* Grid Coordinates radar guide */}
            <span className="text-[6px] font-mono text-emerald-400 absolute top-2 right-2">SILA-GRID-A4</span>
            <span className="text-[6px] font-mono text-emerald-400 absolute bottom-2 left-2">SURFACE VALID</span>
          </div>

        </div>
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[250] bg-black overflow-hidden flex flex-col md:flex-row font-sans">
          
          {/* Main Viewport Container */}
          <div 
            ref={containerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
            className="relative flex-1 bg-[#010103] flex items-center justify-center cursor-move"
          >
            {/* Real Hardware camera preview feed */}
            {!mockActive ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 w-full h-full object-cover opacity-60 scale-x-[-1] md:scale-x-1"
              />
            ) : (
              // Cybernetic simulated environment background if cam fails/denied
              <div className="absolute inset-0 bg-[#020508] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%_,rgba(30,58,138,0.2),rgba(0,0,0,0))] flex flex-col items-center justify-center overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px]"></div>
                
                {/* Floating cyber dots simulating point cloud depth landscape */}
                <div className="absolute top-1/4 left-1/4 w-1.5 h-1.5 rounded-full bg-blue-500/40 animate-pulse"></div>
                <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-blue-400/30 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                <div className="absolute bottom-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-emerald-500/40 animate-pulse" style={{ animationDelay: '1.2s' }}></div>
                <div className="absolute bottom-1/3 right-1/3 w-2 h-2 rounded-full bg-[#bfdbfe]/25 animate-pulse" style={{ animationDelay: '0.8s' }}></div>
              </div>
            )}

            {/* Immersive HUD Overlay layer */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none select-none">
              
              {/* Header Info */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10">
                  <div className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                  </div>
                  <div>
                    <span className="text-[10px] font-mono font-bold text-slate-100 uppercase tracking-widest block leading-tight">
                      SILA Holographic Spatial AR v1.2
                    </span>
                    <span className="text-[9px] font-mono text-slate-400 block mt-0.5 leading-none">
                      MAT • Ministério da Administração do Território
                    </span>
                  </div>
                </div>

                {/* Device Status indicators */}
                <div className="flex gap-2">
                  <span className="bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1.5 rounded-lg text-[9px] font-mono text-slate-300">
                    FEED: <span className={mockActive ? "text-amber-400" : "text-emerald-400"}>{mockActive ? "SIMULADO (DESK)" : "CÂMERA ATIVA"}</span>
                  </span>
                  <button
                    onClick={switchCamera}
                    className="pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded-lg text-slate-300 hover:text-white transition-all focus:outline-none"
                    title="Alternar Câmara"
                  >
                    <RefreshCw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={onClose}
                    className="pointer-events-auto bg-red-600 hover:bg-red-500 text-white backdrop-blur-md border border-red-500/25 p-2 rounded-lg transition-all focus:outline-none"
                    title="Fechar Espaço AR"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Central scanning state / Holographic placement alignment helper */}
              <div className="flex-1 flex flex-col items-center justify-center relative">
                {isScanning ? (
                  <div className="flex flex-col items-center gap-4">
                    {/* Retro sci-fi camera focal reticle */}
                    <div className="relative w-48 h-48 sm:w-56 sm:h-56 border border-blue-500/20 rounded-2xl flex items-center justify-center">
                      <div className="absolute top-0 left-0 w-6 h-6 border-t-2 border-l-2 border-blue-400 rounded-tl-lg"></div>
                      <div className="absolute top-0 right-0 w-6 h-6 border-t-2 border-r-2 border-blue-400 rounded-tr-lg"></div>
                      <div className="absolute bottom-0 left-0 w-6 h-6 border-b-2 border-l-2 border-blue-400 rounded-bl-lg"></div>
                      <div className="absolute bottom-0 right-0 w-6 h-6 border-b-2 border-r-2 border-blue-400 rounded-br-lg"></div>
                      
                      {/* Laser scanning bar */}
                      <motion.div 
                        initial={{ top: '10%' }}
                        animate={{ top: '85%' }}
                        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
                        className="absolute left-[5%] right-[5%] h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-lg shadow-cyan-400/50"
                      />
                      
                      <Focus className="w-8 h-8 text-blue-500 animate-pulse" />
                    </div>
                    
                    <div className="bg-black/80 backdrop-blur-md px-4 py-2 rounded-xl border border-blue-500/30 text-center max-w-xs">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-widest block animate-pulse">
                        Mapeando Superfície... {telemetry.surfaceConfidence}%
                      </span>
                      <p className="text-[9px] text-slate-400 mt-1">
                        Aponte para uma mesa sã ou chão plano. Mantenha o dispositivo estável.
                      </p>
                    </div>
                  </div>
                ) : (
                  /* Floating 3D projection model anchored */
                  <div className="flex flex-col items-center justify-center">
                    <AnimatePresence>
                      {isAnchored && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8, y: 30 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 1, ease: 'easeOut' }}
                          className="flex flex-col items-center"
                        >
                          {render3DHologram()}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                )}
              </div>

              {/* Bottom Telemetry HUD overlay strip */}
              <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[9px] font-mono">
                <div className="border-r border-white/10 pr-2">
                  <span className="text-slate-500 uppercase block">COORDENADAS SENSOR</span>
                  <span className="text-slate-200 block truncate font-bold">X: {rotationX.toFixed(1)}° | Y: {rotationY.toFixed(1)}°</span>
                </div>
                <div className="border-r border-white/10 pr-2 pl-0 sm:pl-2">
                  <span className="text-slate-500 uppercase block">CONFIANÇA MALHA</span>
                  <span className="text-emerald-400 block font-bold">100% EXCELENTE</span>
                </div>
                <div className="border-r border-white/10 pr-2 pl-0 sm:pl-2">
                  <span className="text-slate-500 uppercase block">TAXA FPS / LATÊNCIA</span>
                  <span className="text-indigo-400 block font-bold">{telemetry.fps} FPS / {telemetry.ping}ms</span>
                </div>
                <div className="pl-0 sm:pl-2">
                  <span className="text-slate-500 uppercase block">ASSINATURA CORE SHA</span>
                  <span className="text-amber-400 block truncate font-bold">{telemetry.hash}</span>
                </div>
              </div>

            </div>

          </div>

          {/* Interactive AR Sidebar Controller (Tablet/Desktop right layout or Mobile bottom) */}
          <div className="w-full md:w-80 bg-[#06080d] border-t md:border-t-0 md:border-l border-white/15 p-4 flex flex-col gap-4 overflow-y-auto max-h-[40vh] md:max-h-full">
            <div>
              <span className="text-[9px] font-mono uppercase tracking-widest text-[#FFB800] font-bold block">
                Painel do Operador
              </span>
              <h3 className="text-sm font-sans font-medium text-slate-100 mt-1">
                Visualização Holográfica
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Demonstre aos decisores presidenciais e do MAT a descentralização atómica do SILA conectando e consolidando a FUC de modo síncrono.
              </p>
            </div>

            {/* Warn message if camera is restricted */}
            {cameraError && (
              <div className="bg-amber-600/10 border border-amber-500/20 p-2.5 rounded-lg flex items-start gap-2 text-[10px] text-amber-500 line-clamp-3">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-500" />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Tab navigation tools */}
            <div className="flex bg-[#0a0f18] p-1 rounded-lg border border-white/5 text-[10px] font-mono">
              <button
                onClick={() => { setActiveTab('visual'); playAudioClick?.('hover'); }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'visual' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                VISUAL
              </button>
              <button
                onClick={() => { setActiveTab('telemetria'); playAudioClick?.('hover'); }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'telemetria' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                OPERAÇÕES
              </button>
              <button
                onClick={() => { setActiveTab('dados'); playAudioClick?.('hover'); }}
                className={`flex-1 py-1.5 rounded-md transition-colors ${
                  activeTab === 'dados' ? 'bg-blue-600/15 text-blue-400 border border-blue-500/20 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                FEDERAL
              </button>
            </div>

            {/* Dynamic Tab Contents */}
            <div className="flex-1 space-y-4">
              {activeTab === 'visual' && (
                <div className="space-y-4">
                  {/* Space sliders to scale and rotate */}
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
                      <span className="flex items-center gap-1"><Sliders className="w-3.5 h-3.5" /> ESCALA DO MODELO</span>
                      <span className="text-blue-400 font-bold">{Math.round(scale * 100)}%</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => { setScale(prev => Math.max(0.4, prev - 0.1)); playAudioClick?.('click'); }}
                        className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
                        title="Diminuir"
                      >
                        <ZoomOut className="w-4 h-4" />
                      </button>
                      <input
                        type="range"
                        min="0.4"
                        max="2.0"
                        step="0.1"
                        value={scale}
                        onChange={(e) => setScale(parseFloat(e.target.value))}
                        className="flex-1 accent-blue-500 h-1 bg-white/5 rounded-full outline-none"
                      />
                      <button
                        onClick={() => { setScale(prev => Math.min(2.0, prev + 0.1)); playAudioClick?.('click'); }}
                        className="p-1.5 rounded-lg border border-white/10 text-slate-300 hover:bg-white/5"
                        title="Aumentar"
                      >
                        <ZoomIn className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-300">
                      <span className="flex items-center gap-1"><RotateCw className="w-3.5 h-3.5" /> DESVIO ROTATIVO Y</span>
                      <span className="text-blue-400 font-bold">{Math.round(rotationY)}°</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="360"
                      value={rotationY}
                      onChange={(e) => setRotationY(parseInt(e.target.value))}
                      className="w-full accent-blue-500 h-1 bg-white/5 rounded-full outline-none"
                    />
                  </div>

                  <div className="p-3 bg-[#0a0f18] rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-slate-300 mb-1.5">
                      <HelpCircle className="w-4 h-4 text-indigo-400" />
                      COMO MANIPULAR EL MODELO?
                    </div>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      Pode arrastar o cursor ou deslizar o seu dedo diretamente no visor da câmara esquerda para rotacionar o holográfico em 3 dimensões de forma síncrona.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'telemetria' && (
                <div className="space-y-3 font-mono text-[10px]">
                  <div className="p-3 bg-[#0a0f18] rounded-xl border border-white/5 space-y-2">
                    <span className="text-slate-400 font-bold uppercase block text-[9px]">Consola Ativa do Nó Central</span>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ESTADO DA REDE</span>
                      <span className="text-emerald-400 font-bold flex items-center gap-1">🟢 SÍNCRONO</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">BLOCO DE HISTÓRIAS</span>
                      <span className="text-slate-200">#{telemetry.blocks}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">REGISTOS ATIVOS</span>
                      <span className="text-slate-200">12,651,772</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>SIMULAR TRÁFEGO SÍNCRONO</span>
                      <span className="text-amber-400 font-bold">{trafficLevel} Tx/s</span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="150"
                      value={trafficLevel}
                      onChange={(e) => setTrafficLevel(parseInt(e.target.value))}
                      className="w-full accent-amber-500 h-1 bg-white/5 rounded-full outline-none"
                    />
                    <div className="flex justify-between text-[8px] text-slate-500">
                      <span>MÍNIMO (ESTÁVEL)</span>
                      <span>MÁXIMO (STRESS-TEST)</span>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'dados' && (
                <div className="space-y-2.5 text-[10px] font-mono">
                  <div className="p-2.5 bg-[#0a0f18] border border-white/5 rounded-lg">
                    <div className="flex items-center gap-1.5 text-blue-400 font-bold text-[9px] uppercase">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Soberania de Confiança
                    </div>
                    <p className="text-[9px] text-slate-400 mt-1 leading-relaxed">
                      O modelo visualizado é a representação física federada de Angola. Os dados cifrados em pacotes viajam dos Ministérios até este CORE unificador garantindo dados imutáveis.
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-slate-500 text-[9px] block">NÓS FEDERADOS DETETADOS</span>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between p-1.5 bg-white/[0.01] border border-white/5 rounded">
                        <span className="text-emerald-400">● SILA-EDUCAÇÃO</span>
                        <span className="text-slate-500 text-[8px]">ATIVO</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 bg-white/[0.01] border border-white/5 rounded">
                        <span className="text-emerald-400">● MINSA-PORTUGUÊS</span>
                        <span className="text-slate-500 text-[8px]">ATIVO</span>
                      </div>
                      <div className="flex items-center justify-between p-1.5 bg-white/[0.01] border border-white/5 rounded">
                        <span className="text-amber-500">● AGT-FINANÇAS</span>
                        <span className="text-slate-500 text-[8px]">SINCRONIZANDO</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Demo Assist guides footer */}
            <div className="border-t border-white/10 pt-3 text-[10px] text-slate-500 font-mono">
              <div className="flex items-center gap-1.5">
                <Terminal className="w-3.5 h-3.5 text-blue-500" />
                <span>Modo de Operador Localizado</span>
              </div>
            </div>
          </div>

        </div>
      )}
    </AnimatePresence>
  );
}
