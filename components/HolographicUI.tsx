import React, { useState, useEffect } from 'react';
import { ShapeType, ShapeInfo } from '../types';
import { Activity, Cpu, Aperture, GitGraph, Sigma, Variable, Clock } from 'lucide-react';

interface HolographicUIProps {
  currentShapeInfo: ShapeInfo;
  nextShapeName: string;
  timeToNext: number;
}

const HolographicUI: React.FC<HolographicUIProps> = ({ currentShapeInfo, nextShapeName, timeToNext }) => {
  const [fps, setFps] = useState(60);
  
  // Mock FPS counter logic for visual fidelity
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.floor(58 + Math.random() * 5));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col justify-between p-6 md:p-10 z-10 text-cyan-400 font-mono selection:bg-cyan-900 selection:text-white overflow-hidden">
      
      {/* Top Bar */}
      <div className="flex justify-between items-start">
        <div className="bg-black/60 backdrop-blur-md border border-cyan-500/30 p-4 rounded-lg shadow-[0_0_15px_rgba(6,182,212,0.2)] pointer-events-auto">
            <div className="flex items-center gap-3 mb-2">
                <Aperture className="w-5 h-5 animate-spin-slow" />
                <h1 className="text-xl font-bold tracking-widest uppercase">Nebula.OS</h1>
            </div>
            <div className="h-px w-full bg-gradient-to-r from-cyan-500/50 to-transparent mb-2"></div>
            <div className="text-xs text-cyan-200/70 space-y-1">
                <p>STATUS: <span className="text-green-400 font-bold">RUNNING</span></p>
                <p>MODE: <span className="text-cyan-100">AUTO_SEQUENCE</span></p>
            </div>
        </div>

        <div className="flex flex-col items-end gap-2">
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 border border-cyan-500/30 rounded text-sm">
                <Activity className="w-4 h-4" />
                <span>{fps} FPS</span>
             </div>
             <div className="flex items-center gap-2 bg-black/60 backdrop-blur-sm px-3 py-1 border border-cyan-500/30 rounded text-sm">
                <Clock className="w-4 h-4" />
                <span>NEXT: {timeToNext}s</span>
             </div>
        </div>
      </div>

      {/* Center Area - Formula Display */}
      {/* Floating "in-world" UI look */}
      <div className="absolute top-1/4 right-10 max-w-md text-right hidden md:block">
          <div className="bg-black/40 backdrop-blur-sm border-r-4 border-cyan-500 p-6 rounded-l-xl transform transition-all duration-700 hover:bg-black/60">
             <h2 className="text-3xl font-bold text-white mb-1 shadow-cyan-glow">{currentShapeInfo.name}</h2>
             <p className="text-xs text-cyan-300 mb-4 uppercase tracking-widest opacity-70">{currentShapeInfo.desc}</p>
             
             <div className="relative bg-cyan-950/30 p-4 rounded border border-cyan-500/20 overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-cyan-500/50"></div>
                <div className="font-serif text-xl italic text-cyan-100 leading-relaxed tracking-wide drop-shadow-md break-words whitespace-pre-line">
                  {currentShapeInfo.formula}
                </div>
                <div className="absolute -bottom-4 -right-4 text-cyan-500/10 transform rotate-12">
                   <Sigma size={64} />
                </div>
             </div>
          </div>
      </div>

      {/* Bottom Bar */}
      <div className="flex justify-between items-end w-full">
        
        {/* Data Readout */}
        <div className="bg-black/60 backdrop-blur-sm border border-cyan-500/30 p-4 rounded-lg w-64 md:w-80">
            <h3 className="text-sm font-bold mb-2 flex items-center gap-2 text-cyan-300">
                <Variable className="w-4 h-4" />
                MATHEMATICAL PARAMETERS
            </h3>
            <div className="space-y-2 text-xs font-light text-cyan-100/80">
                <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                    <span>PARTICLE_COUNT</span>
                    <span className="font-mono">20,000</span>
                </div>
                <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                    <span>COORD_SYSTEM</span>
                    <span className="font-mono">CARTESIAN_3D</span>
                </div>
                <div className="flex justify-between border-b border-cyan-500/10 pb-1">
                    <span>NEXT_TRANSFORM</span>
                    <span className="font-mono text-cyan-400">{nextShapeName}</span>
                </div>
                
                {/* Progress Bar */}
                <div className="mt-3">
                    <div className="flex justify-between text-[10px] mb-1 opacity-70">
                        <span>SEQUENCE_PROGRESS</span>
                        <span>{Math.floor((10 - timeToNext) * 10)}%</span>
                    </div>
                    <div className="w-full bg-cyan-900/30 h-1.5 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyan-400 shadow-[0_0_10px_#22d3ee] transition-all duration-1000 linear"
                            style={{ width: `${(10 - timeToNext) * 10}%` }}
                        ></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Decorative Elements */}
        <div className="hidden md:flex flex-col items-end opacity-50 pointer-events-none">
            <GitGraph className="w-16 h-16 text-cyan-500/20 mb-2" />
            <div className="text-[10px] text-cyan-500/40 font-mono">
                SECURE CONNECTION<br/>
                ENCRYPTION: AES-256<br/>
                DATA_STREAM: ACTIVE
            </div>
        </div>
      </div>
      
      {/* Screen Effects */}
      <div className="absolute inset-0 pointer-events-none z-[-1]">
          {/* Scanlines */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none"></div>
          {/* Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.8)_100%)]"></div>
      </div>
    </div>
  );
};

export default HolographicUI;
