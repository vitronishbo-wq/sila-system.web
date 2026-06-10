import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Network, MapPin, Database, Award, HelpCircle } from 'lucide-react';
import { PROVINCES_DATA } from '../data/silaData';
import { Province } from '../types';

interface AngolaMapProps {
  onProvinceSelect?: (province: Province) => void;
  playAudioClick?: () => void;
}

export default function AngolaMap({ onProvinceSelect, playAudioClick }: AngolaMapProps) {
  const [selectedProvince, setSelectedProvince] = useState<Province>(PROVINCES_DATA[0]);
  const [hoveredProvince, setHoveredProvince] = useState<Province | null>(null);
  const [dataPackets, setDataPackets] = useState<{ id: number; pathIndex: number; progress: number }[]>([]);

  // Base SVG outline points for Angola (abstracted polygon to represent Angola's sovereign border with tech styling)
  const angolaBorderPoints = "25,12 36,10 42,12 45,6 55,8 60,15 58,22 68,24 82,23 88,32 85,42 90,52 82,65 72,72 65,85 58,92 48,88 40,94 30,95 24,96 18,92 19,85 22,80 16,75 14,64 22,54 18,48 20,38 25,32 20,24 25,15";

  // Define logical connection paths between nodes to draw active bezier data streams
  const connectionPaths = [
    { from: 'luanda', to: 'huambo' },
    { from: 'benguela', to: 'huambo' },
    { from: 'huila', to: 'huambo' },
    { from: 'cabinda', to: 'luanda' },
    { from: 'uige', to: 'luanda' },
    { from: 'moxico', to: 'huambo' },
    { from: 'namibe', to: 'huila' },
    { from: 'luanda', to: 'uige' },
    { from: 'huila', to: 'benguela' }
  ];

  // Animate dynamic data flows
  useEffect(() => {
    const interval = setInterval(() => {
      // Spawn new packet
      if (dataPackets.length < 15) {
        setDataPackets((prev) => [
          ...prev,
          {
            id: Math.random(),
            pathIndex: Math.floor(Math.random() * connectionPaths.length),
            progress: 0,
          },
        ]);
      }

      // Move packets forward
      setDataPackets((prev) =>
        prev
          .map((p) => ({ ...p, progress: p.progress + 2 }))
          .filter((p) => p.progress < 100)
      );
    }, 40);

    return () => clearInterval(interval);
  }, [dataPackets]);

  const handleSelectProvince = (prov: Province) => {
    setSelectedProvince(prov);
    if (playAudioClick) playAudioClick();
    if (onProvinceSelect) onProvinceSelect(prov);
  };

  // Find coordinates for province node by ID
  const getCoords = (id: string) => {
    const p = PROVINCES_DATA.find((x) => x.id === id);
    return p ? { x: p.x, y: p.y } : { x: 50, y: 50 };
  };

  return (
    <div id="angola-interactive-map" className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/[0.01] p-6 sm:p-8 rounded-3xl border border-white/5 backdrop-blur-sm shadow-2xl relative overflow-hidden">
      {/* Absolute Grid Accents */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#05070A_1px,transparent_1px),linear-gradient(to_bottom,#05070A_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none"></div>

      {/* Map Graphics Area */}
      <div className="lg:col-span-7 flex flex-col items-center justify-center relative min-h-[350px] sm:min-h-[480px]">
        {/* Radar Pulse Rings in Background */}
        <div className="absolute w-80 h-80 rounded-full border border-blue-500/10 animate-ping opacity-25"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full border border-amber-500/5 animate-pulse opacity-10"></div>

        {/* Dynamic Canvas SVG */}
        <svg
          viewBox="0 0 100 100"
          className="w-full max-w-[420px] filter drop-shadow-[0_10px_30px_rgba(29,78,216,0.15)] relative z-10"
        >
          {/* Abstract Country Fill Grid */}
          <polygon
            points={angolaBorderPoints}
            className="fill-[#05070A]/70 stroke-white/5 stroke-[0.4] transition-colors"
          />

          {/* Blueprint Inner Hex Lattice (represented by sub-strokes) */}
          <polygon
            points={angolaBorderPoints}
            className="fill-none stroke-blue-500/10 stroke-[0.8] stroke-dasharray-[2,2]"
          />

          {/* Underlay glowing halo on active province */}
          <circle
            cx={selectedProvince.x}
            cy={selectedProvince.y}
            r="4"
            className="fill-blue-500/20 stroke-blue-400/45 stroke-[0.2] animate-pulse"
          />

          {/* Connection Lines (High speed secure backbones) */}
          {connectionPaths.map((path, idx) => {
            const start = getCoords(path.from);
            const end = getCoords(path.to);
            // Midpoint control point for smooth curves
            const midX = (start.x + end.x) / 2 + (start.y - end.y) * 0.1;
            const midY = (start.y + end.y) / 2 - (start.x - end.x) * 0.1;

            return (
              <g key={`path-${idx}`}>
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  className="stroke-white/5 stroke-[0.3]"
                />
                <path
                  d={`M ${start.x} ${start.y} Q ${midX} ${midY} ${end.x} ${end.y}`}
                  fill="none"
                  className="stroke-blue-500/10 stroke-[0.3] stroke-dasharray-[1,10] animate-dash"
                />
              </g>
            );
          })}

          {/* Flying Data Particles along paths */}
          {dataPackets.map((pkt) => {
            const path = connectionPaths[pkt.pathIndex];
            if (!path) return null;
            const start = getCoords(path.from);
            const end = getCoords(path.to);

            // Simple linear interpolation along bezier curve mid-points
            const midX = (start.x + end.x) / 2 + (start.y - end.y) * 0.1;
            const midY = (start.y + end.y) / 2 - (start.x - end.x) * 0.1;

            const t = pkt.progress / 100;
            // Bezier formula: (1-t)^2*P0 + 2(1-t)t*P1 + t^2*P2
            const currX = (1 - t) * (1 - t) * start.x + 2 * (1 - t) * t * midX + t * t * end.x;
            const currY = (1 - t) * (1 - t) * start.y + 2 * (1 - t) * t * midY + t * t * end.y;

            return (
              <circle
                key={pkt.id}
                cx={currX}
                cy={currY}
                r="0.5"
                className="fill-amber-400 filter drop-shadow-[0_0_2px_#f59e0b]"
              />
            );
          })}

          {/* Draw Province Nodes */}
          {PROVINCES_DATA.map((prov) => {
            const isSel = selectedProvince.id === prov.id;
            const isGovPilot = prov.id === 'huambo';
            const isHovered = hoveredProvince?.id === prov.id;

            return (
              <g
                key={prov.id}
                className="cursor-pointer"
                onClick={() => handleSelectProvince(prov)}
                onMouseEnter={() => setHoveredProvince(prov)}
                onMouseLeave={() => setHoveredProvince(null)}
              >
                {/* Outermost interaction helper */}
                <circle
                  cx={prov.x}
                  cy={prov.y}
                  r="5"
                  className="fill-transparent stroke-none"
                />

                {/* Outer pulsing ring */}
                <circle
                  cx={prov.x}
                  cy={prov.y}
                  r={isSel ? '2.8' : isHovered ? '2.2' : '1.5'}
                  className={`transition-all duration-300 ${
                    isGovPilot
                      ? 'fill-none stroke-amber-500/40 stroke-[0.3]'
                      : 'fill-none stroke-blue-500/20 stroke-[0.2]'
                  }`}
                />

                {/* Node Center */}
                <circle
                  cx={prov.x}
                  cy={prov.y}
                  r={isSel ? '1.4' : '0.8'}
                  className={`transition-all duration-300 ${
                    isSel
                      ? isGovPilot
                        ? 'fill-amber-500 stroke-[#05070A] stroke-[0.3]'
                        : 'fill-blue-400 stroke-[#05070A] stroke-[0.3]'
                      : isGovPilot
                      ? 'fill-amber-500/80'
                      : 'fill-blue-600'
                  }`}
                />

                {/* Node Label (Optional, shown if hovered or selected for high-level readable reference) */}
                {(isSel || isHovered) && (
                  <text
                    x={prov.x}
                    y={prov.y - 3}
                    textAnchor="middle"
                    className="fill-white text-[2.5px] font-sans font-medium tracking-wide pointer-events-none"
                  >
                    {prov.name}
                  </text>
                )}
              </g>
            );
          })}
        </svg>

        {/* Map Legend */}
        <div className="absolute bottom-2 left-2 flex gap-4 bg-[#05070A] border border-white/5 p-2.5 rounded-xl text-[10px] font-mono select-none z-20">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-amber-500 rounded-full"></span>
            <span className="text-slate-300">Piloto (Huambo)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 bg-blue-600 rounded-full"></span>
            <span className="text-slate-300">Conectável</span>
          </div>
        </div>
      </div>

      {/* Side HUD Stats Panel */}
      <div className="lg:col-span-5 space-y-6 relative z-10 bg-[#05070A] p-6 rounded-2xl border border-white/5">
        <div className="border-b border-white/5 pb-4">
          <div className="text-[10px] uppercase font-mono tracking-widest text-blue-500 mb-1 flex items-center gap-1.5">
            <Network className="w-3 h-3 animate-pulse" />
            Vespertino de Rede Regional
          </div>
          <h3 className="text-xl font-sans font-medium text-slate-100 flex items-center justify-between">
            {selectedProvince.name}
            {selectedProvince.id === 'huambo' && (
              <span className="bg-amber-500/10 text-amber-400 text-[9px] px-2 py-0.5 rounded-full border border-amber-500/20 font-mono tracking-widest uppercase animate-pulse">
                Piloto MAT
              </span>
            )}
          </h3>
          <p className="text-xs text-slate-400 mt-1">Capital: {selectedProvince.capital} • Angola</p>
        </div>

        {/* Live Regional Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Unidades Escolares</span>
            <span className="text-xl font-sans font-semibold text-slate-200 mt-1 block">
              {selectedProvince.schools.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Alunos Estimados</span>
            <span className="text-xl font-sans font-semibold text-slate-200 mt-1 block">
              {selectedProvince.students.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Docentes Cadastrados</span>
            <span className="text-xl font-sans font-semibold text-slate-200 mt-1 block">
              {selectedProvince.teachers.toLocaleString()}
            </span>
          </div>
          <div className="bg-white/[0.01] p-3 rounded-xl border border-white/5 flex flex-col justify-center">
            <span className="text-[10px] text-slate-500 block uppercase font-mono">Integração SILA</span>
            <span className="text-xs font-mono font-medium text-emerald-400 mt-2 block flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
              {selectedProvince.id === 'huambo' ? '100% OPERATIVA' : 'PRONTO A ATIVAR'}
            </span>
          </div>
        </div>

        {/* Live diagnostics message Box */}
        <div className="bg-blue-600/[0.02] border border-blue-500/10 p-4 rounded-xl text-xs space-y-2">
          <div className="font-mono text-blue-400 font-semibold flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5" />
            DIAGNÓSTICO SOBERANO
          </div>
          <p className="text-slate-300 leading-relaxed">
            {selectedProvince.id === 'huambo'
              ? 'Mapeamento escolar georreferenciado e pautas digitais totalmente consolidadas. O Huambo lidera a implantação civil unificando registos das 11 administrações municipais com a Ficha Única.'
              : `Ativação do pipeline prevista na Expansão Global Fase 2. Infraestrutura básica de rede local avaliada em nível adequado para sincronização do Bilhete de Identidade à FUC.`}
          </p>
        </div>

        {/* Interaction callout */}
        <p className="text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1">
          <MapPin className="w-3 h-3 text-amber-500" />
          Clique nas outras províncias no mapa para inspecionar os polos digitais.
        </p>
      </div>
    </div>
  );
}
