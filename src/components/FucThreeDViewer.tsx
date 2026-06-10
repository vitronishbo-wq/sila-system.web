import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RotateCw, Move, Radio, Compass, ToggleLeft, ToggleRight } from 'lucide-react';

interface FucThreeDViewerProps {
  playAudioClick?: (type?: 'hover' | 'activation' | 'click') => void;
}

export default function FucThreeDViewer({ playAudioClick }: FucThreeDViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isOrbiting, setIsOrbiting] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  // Orbital rotations
  const rotationXRef = useRef<number>(0.5);
  const rotationYRef = useRef<number>(0.6);
  const isDraggingRef = useRef<boolean>(false);
  const lastMouseXRef = useRef<number>(0);
  const lastMouseYRef = useRef<number>(0);

  // Satellite node descriptions for user interaction
  const NODES_DATA = [
    { name: 'Core FUC (Central)', color: [0.0, 0.7, 1.0, 1.0], x: 0, y: 0, z: 0, size: 10, info: 'Ficha Única – Repositório Soberano' },
    { name: 'SILA Educação', color: [1.0, 0.72, 0.0, 1.0], x: 1.5, y: 1.0, z: 0.8, size: 7, info: 'MED – Historial Escolar & Diplomas' },
    { name: 'MINSA Saúde', color: [0.06, 0.72, 0.5, 1.0], x: -1.7, y: 0.5, z: 1.2, size: 7, info: 'MINSA – Vacinas & Saúde' },
    { name: 'DNDH Registo Civil', color: [0.85, 0.46, 0.02, 1.0], x: 0.8, y: -1.6, z: -1.0, size: 7, info: 'MINJUSDH – Certidões & BI' },
    { name: 'MASFAMU Coesão', color: [0.92, 0.28, 0.6, 1.0], x: -1.2, y: -1.2, z: 0.9, size: 7, info: 'Proteção Social & Subsídios' },
    { name: 'AGT Finanças', color: [0.54, 0.36, 0.96, 1.0], x: -0.5, y: 1.7, z: -1.4, size: 7, info: 'Segurança Social & NIF Ativo' },
    { name: 'MAT Governação', color: [0.75, 0.86, 1.0, 1.0], x: 1.4, y: -0.8, z: 1.6, size: 7, info: 'Território & Infraestruturas' },
  ];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Get WebGL context
    const gl = canvas.getContext('webgl', { antialias: true, alpha: true }) || 
               canvas.getContext('experimental-webgl', { antialias: true, alpha: true }) as WebGLRenderingContext | null;

    if (!gl) {
      console.warn('WebGL not supported');
      return;
    }

    // Set up viewport size & canvas sizing
    const resizeCanvas = () => {
      const rect = containerRef.current?.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = (rect?.width || 450) * dpr;
      canvas.height = (rect?.height || 360) * dpr;
      canvas.style.width = '100%';
      canvas.style.height = '100%';
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Simple Shaders
    const vsSource = `
      attribute vec3 position;
      attribute vec4 color;
      varying vec4 vColor;
      uniform mat4 uProjection;
      uniform mat4 uModelView;
      uniform float uPointSize;

      void main() {
        gl_Position = uProjection * uModelView * vec4(position, 1.0);
        gl_PointSize = uPointSize;
        vColor = color;
      }
    `;

    const fsSource = `
      precision mediump float;
      varying vec4 vColor;
      uniform bool uIsLine;

      void main() {
        if (uIsLine) {
          gl_FragColor = vColor;
        } else {
          // Circular glow for points
          vec2 temp = gl_PointCoord - vec2(0.5);
          float dist = dot(temp, temp);
          if (dist > 0.25) {
            discard;
          }
          // radial falloff glow
          float alpha = (1.0 - dist * 4.0) * vColor.a;
          gl_FragColor = vec4(vColor.rgb, alpha);
        }
      }
    `;

    // Shader compiler helper
    const compileShader = (source: string, type: number) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error('Shader compilation error:', gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vs = compileShader(vsSource, gl.VERTEX_SHADER);
    const fs = compileShader(fsSource, gl.FRAGMENT_SHADER);
    if (!vs || !fs) return;

    // Link shader program
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Error linking program:', gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Uniforms and Attributes locations
    const positionLoc = gl.getAttribLocation(program, 'position');
    const colorLoc = gl.getAttribLocation(program, 'color');
    const projectionLoc = gl.getUniformLocation(program, 'uProjection');
    const modelViewLoc = gl.getUniformLocation(program, 'uModelView');
    const pointSizeLoc = gl.getUniformLocation(program, 'uPointSize');
    const isLineLoc = gl.getUniformLocation(program, 'uIsLine');

    // Simple perspective projection builder
    const createPerspectiveMatrix = (fovy: number, aspect: number, near: number, far: number) => {
      const f = 1.0 / Math.tan(fovy / 2);
      const nf = 1 / (near - far);
      return [
        f / aspect, 0, 0, 0,
        0, f, 0, 0,
        0, 0, (far + near) * nf, -1,
        0, 0, 2 * far * near * nf, 0
      ];
    };

    // Matrix multiplication helper
    const multiplyMatrices = (a: number[], b: number[]) => {
      const out = new Array(16);
      for (let i = 0; i < 4; i++) {
        for (let j = 0; j < 4; j++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += a[i * 4 + k] * b[k * 4 + j];
          }
          out[i * 4 + j] = sum;
        }
      }
      return out;
    };

    // Vector data preparation
    // Points, connections, orbital rings
    const nodes = NODES_DATA;

    let pointsVertices: number[] = [];
    let pointsColors: number[] = [];

    let lineVertices: number[] = [];
    let lineColors: number[] = [];

    // Core mesh (glowing concentric orbits)
    const addOrbitVertices = (radius: number, color: number[], count = 64) => {
      const startIdx = lineVertices.length / 3;
      for (let i = 0; i <= count; i++) {
        const theta = (i / count) * Math.PI * 2;
        lineVertices.push(radius * Math.cos(theta), 0, radius * Math.sin(theta));
        lineColors.push(...color);
      }
      return startIdx;
    };

    const orbit1Start = lineVertices.length / 3;
    if (showWireframe) {
      addOrbitVertices(1.2, [0.0, 0.4, 0.8, 0.15], 40);
      addOrbitVertices(1.8, [0.0, 0.5, 0.6, 0.10], 45);
      addOrbitVertices(2.2, [0.1, 0.3, 0.5, 0.08], 50);
    }

    // Populate node points
    nodes.forEach(node => {
      pointsVertices.push(node.x, node.y, node.z);
      pointsColors.push(...node.color);

      // Lines connecting to core (0,0,0)
      if (node.x !== 0 || node.y !== 0 || node.z !== 0) {
        lineVertices.push(0, 0, 0);
        lineColors.push(0.0, 0.6, 1.0, 0.25); // center start color alpha
        lineVertices.push(node.x, node.y, node.z);
        // fade to node color
        lineColors.push(...node.color);
      }
    });

    // Node points Buffers
    const pointsPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsPositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsVertices), gl.STATIC_DRAW);

    const pointsColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pointsColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(pointsColors), gl.STATIC_DRAW);

    // Line Buffers
    const linePositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineVertices), gl.STATIC_DRAW);

    const lineColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lineColors), gl.STATIC_DRAW);

    // Flowing digital particles
    interface Particle {
      nodeIdx: number;
      progress: number;
      speed: number;
      color: number[];
    }
    const particlesRef = useRef<Particle[]>(
      nodes.filter(n => n.x !== 0).map((n, i) => ({
        nodeIdx: i + 1, // Skip core
        progress: Math.random(),
        speed: 0.005 + Math.random() * 0.008,
        color: n.color
      }))
    );

    // Render loop
    let animationId: number;

    const render = () => {
      if (!canvas) return;

      // GL Clears
      gl.clearColor(0.005, 0.007, 0.012, 0.0);
      gl.clearDepth(1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.depthFunc(gl.LEQUAL);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE); // Additive blending for glow

      // Rotate camera
      if (isOrbiting && !isDraggingRef.current) {
        rotationYRef.current += 0.004;
        rotationXRef.current = 0.4 + Math.sin(Date.now() * 0.0003) * 0.15;
      }

      // Create model view matrix
      const rx = rotationXRef.current;
      const ry = rotationYRef.current;

      const cosX = Math.cos(rx);
      const sinX = Math.sin(rx);
      const cosY = Math.cos(ry);
      const sinY = Math.sin(ry);

      // Rotation matrix around X, then Y, then translated back in Z
      const rotX = [
        1, 0, 0, 0,
        0, cosX, sinX, 0,
        0, -sinX, cosX, 0,
        0, 0, 0, 1
      ];

      const rotY = [
        cosY, 0, -sinY, 0,
        0, 1, 0, 0,
        sinY, 0, cosY, 0,
        0, 0, 0, 1
      ];

      let modelView = multiplyMatrices(rotY, rotX);
      // Translate camera back
      modelView[14] = -5.0; 

      // Perspective projection
      const aspect = canvas.width / canvas.height;
      const projection = createPerspectiveMatrix((45 * Math.PI) / 180, aspect, 0.1, 100.0);

      gl.uniformMatrix4fv(projectionLoc, false, new Float32Array(projection));
      gl.uniformMatrix4fv(modelViewLoc, false, new Float32Array(modelView));

      // 1. Draw connection lines and orbit rings
      gl.uniform1i(isLineLoc, 1);
      gl.bindBuffer(gl.ARRAY_BUFFER, linePositionBuffer);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, lineColorBuffer);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorLoc);

      // Draw orbit rings
      if (showWireframe) {
        gl.drawArrays(gl.LINE_STRIP, 0, 41);
        gl.drawArrays(gl.LINE_STRIP, 41, 46);
        gl.drawArrays(gl.LINE_STRIP, 87, 51);
      }

      // Draw lines connecting outer satellites to central core
      const connectionLinesStart = showWireframe ? 138 : 0;
      gl.drawArrays(gl.LINES, connectionLinesStart, (lineVertices.length - (showWireframe ? 414 : 0)) / 3);

      // 2. Update and Draw flowing data particles (represented as temporary buffers)
      gl.uniform1i(isLineLoc, 0);
      gl.uniform1f(pointSizeLoc, 4.0);
      const activeParticles = particlesRef.current;
      const particlePositions: number[] = [];
      const particleColors: number[] = [];

      activeParticles.forEach(p => {
        p.progress += p.speed;
        if (p.progress > 1.0) {
          p.progress = 0.0;
        }
        const targetNode = nodes[p.nodeIdx];
        // Stream flows from node, so points go towards core (0,0,0) or reversed
        // Let's stream towards center core: x = node.x * (1 - progress)
        const px = targetNode.x * (1.0 - p.progress);
        const py = targetNode.y * (1.0 - p.progress);
        const pz = targetNode.z * (1.0 - p.progress);
        particlePositions.push(px, py, pz);
        particleColors.push(p.color[0], p.color[1], p.color[2], 0.85); // High flow visibility
      });

      const particlePositionBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, particlePositionBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particlePositions), gl.STREAM_DRAW);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

      const particleColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, particleColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(particleColors), gl.STREAM_DRAW);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorLoc);

      gl.drawArrays(gl.POINTS, 0, activeParticles.length);
      gl.deleteBuffer(particlePositionBuffer);
      gl.deleteBuffer(particleColorBuffer);

      // 3. Draw static nodes (glowing point clusters)
      gl.bindBuffer(gl.ARRAY_BUFFER, pointsPositionBuffer);
      gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(positionLoc);

      gl.bindBuffer(gl.ARRAY_BUFFER, pointsColorBuffer);
      gl.vertexAttribPointer(colorLoc, 4, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(colorLoc);

      // Draw large nodes
      nodes.forEach((node, i) => {
        // Point Size multiplier based on node importance
        gl.uniform1f(pointSizeLoc, node.size * (window.devicePixelRatio || 1) * 1.5);
        gl.drawArrays(gl.POINTS, i, 1);
      });

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    // Cleanups
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resizeCanvas);
      gl.deleteBuffer(pointsPositionBuffer);
      gl.deleteBuffer(pointsColorBuffer);
      gl.deleteBuffer(linePositionBuffer);
      gl.deleteBuffer(lineColorBuffer);
      gl.deleteProgram(program);
    };
  }, [showWireframe, isOrbiting]);

  // Handle Dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    isDraggingRef.current = true;
    lastMouseXRef.current = e.clientX;
    lastMouseYRef.current = e.clientY;
    if (playAudioClick) playAudioClick('click');
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current) return;
    const deltaX = e.clientX - lastMouseXRef.current;
    const deltaY = e.clientY - lastMouseYRef.current;

    rotationYRef.current += deltaX * 0.007;
    rotationXRef.current += deltaY * 0.007;

    lastMouseXRef.current = e.clientX;
    lastMouseYRef.current = e.clientY;
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  return (
    <div className="flex flex-col h-full bg-[#03060b]/40 rounded-2xl border border-white/5 overflow-hidden">
      {/* Top action header info */}
      <div className="px-4 py-3 border-b border-white/5 flex items-center justify-between no-print bg-[#05080c]/50">
        <span className="text-[10px] font-mono font-semibold text-sky-400 flex items-center gap-1.5 uppercase">
          <Radio className="w-3.5 h-3.5 text-sky-400 animate-pulse" /> Nodes 3D WebGL Space
        </span>
        <div className="flex items-center gap-2">
          {/* Controls */}
          <button
            onClick={() => {
              setIsOrbiting(!isOrbiting);
              if (playAudioClick) playAudioClick('click');
            }}
            className={`p-1 rounded text-[10px] font-mono border transition-all ${
              isOrbiting ? 'border-sky-500/30 text-sky-400 bg-sky-500/10' : 'border-white/10 text-slate-400 bg-transparent'
            }`}
            title="Auto-Rotação orbital"
          >
            <RotateCw className={`w-3 h-3 ${isOrbiting ? 'animate-spin-slow' : ''}`} />
          </button>
          
          <button
            onClick={() => {
              setShowWireframe(!showWireframe);
              if (playAudioClick) playAudioClick('click');
            }}
            className={`p-1 rounded text-[10px] font-mono border transition-all flex items-center gap-1.5 ${
              showWireframe ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' : 'border-white/10 text-slate-400 bg-transparent'
            }`}
            title="Mostrar anéis de órbita do Estado"
          >
            <Compass className="w-3 h-3" />
            <span className="text-[9px] font-mono">Grelhas</span>
          </button>
        </div>
      </div>

      {/* Render Stage Container */}
      <div 
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        className="relative flex-1 min-h-[300px] cursor-grab active:cursor-grabbing overflow-hidden"
      >
        <canvas ref={canvasRef} className="absolute inset-0 block" />

        {/* Floating guide cue */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur border border-white/5 px-2 py-1 rounded text-[9px] font-mono text-slate-400 flex items-center gap-1.5 pointer-events-none select-none">
          <Move className="w-3 h-3 text-sky-400 animate-pulse" /> Arraste para orbitar o fluxo em 3D
        </div>

        {/* Live Satellite index readout HUD */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 pointer-events-none select-none">
          {NODES_DATA.map((node) => (
            <div 
              key={node.name}
              onMouseEnter={() => setHoveredNode(node.name)}
              onMouseLeave={() => setHoveredNode(null)}
              className="px-2 py-0.5 rounded bg-black/50 border border-white/5 flex items-center gap-1.5 text-[8px] font-mono text-slate-300 w-32 cursor-pointer pointer-events-auto hover:bg-slate-900 transition-colors"
            >
              <span 
                className="w-1.5 h-1.5 rounded-full shrink-0" 
                style={{ backgroundColor: `rgba(${node.color[0]*255}, ${node.color[1]*255}, ${node.color[2]*255}, 1)` }}
              />
              <span className="truncate">{node.name.replace(' (Central)', '')}</span>
            </div>
          ))}
        </div>

        {/* Floating node metadata inspect box */}
        <div className="absolute bottom-2.5 right-2.5 max-w-[180px] bg-[#05070c]/90 border border-white/10 p-2 rounded-xl backdrop-blur select-none pointer-events-none">
          <span className="text-[8px] font-mono text-slate-500 uppercase block tracking-wider">Metadados de Trânsito</span>
          <span className="text-[10px] font-sans font-semibold text-slate-200 mt-0.5 block">Norteador SILA 1.0</span>
          <p className="text-[9px] text-[#FFB800] mt-0.5 font-mono leading-none leading-normal">
            Barramento unificado ligando bases do Huambo ao core fiduciário.
          </p>
        </div>

        <AnimatePresence>
          {hoveredNode && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute top-3 left-3 max-w-[180px] bg-sky-950/90 border border-sky-500/30 p-2 rounded-lg backdrop-blur text-[10px] font-sans"
            >
              <strong className="text-sky-300 block font-semibold">{hoveredNode}</strong>
              <p className="text-slate-200 text-[9px] mt-0.5">
                {NODES_DATA.find(n => n.name === hoveredNode)?.info}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Info panel */}
      <div className="bg-[#05080c]/30 px-4 py-3 border-t border-white/5 text-[11px] text-slate-400 flex flex-col sm:flex-row justify-between gap-1">
        <span>● Tecnologia WebGL 1.0 (Zero dependências externas)</span>
        <span className="text-slate-500 font-mono">Estável • Aceleração Gráfica Ativa</span>
      </div>
    </div>
  );
}
