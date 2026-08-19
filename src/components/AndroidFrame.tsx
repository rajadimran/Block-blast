import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Battery, Smartphone, Maximize2, Minimize2 } from 'lucide-react';

interface AndroidFrameProps {
  children: React.ReactNode;
  enabled: boolean;
  onToggleFrame: () => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({ children, enabled, onToggleFrame }) => {
  const [time, setTime] = useState('10:45');

  useEffect(() => {
    const updateTime = () => {
      const d = new Date();
      const h = d.getHours().toString().padStart(2, '0');
      const m = d.getMinutes().toString().padStart(2, '0');
      setTime(`${h}:${m}`);
    };
    updateTime();
    const timer = setInterval(updateTime, 30000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex flex-col items-center justify-center p-0 md:p-4 selection:bg-cyan-500 selection:text-white">
      {/* Quick Frame Toggle floating pill for testing responsive / device mode on desktop */}
      <div className="hidden md:flex fixed top-3 right-4 z-50 items-center gap-2 bg-slate-900/90 backdrop-blur-md border border-slate-700/80 px-3 py-1.5 rounded-full shadow-lg text-xs font-semibold text-slate-300">
        <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
        <span>Android Device Mode</span>
        <button
          onClick={onToggleFrame}
          className="ml-1 px-2 py-0.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-md transition-colors flex items-center gap-1 cursor-pointer"
          title="Toggle Android Device Frame"
        >
          {enabled ? <Minimize2 className="w-3 h-3" /> : <Maximize2 className="w-3 h-3" />}
          <span>{enabled ? 'Fullscreen' : 'Phone Frame'}</span>
        </button>
      </div>

      {enabled ? (
        /* Realistic Android Smartphone Mockup */
        <div className="relative w-full max-w-[430px] h-[92vh] max-h-[890px] bg-slate-950 rounded-[48px] p-3 shadow-[0_0_60px_rgba(0,0,0,0.9),0_0_0_12px_#1e293b,0_0_0_14px_#0f172a] border-4 border-slate-700/50 flex flex-col overflow-hidden">
          {/* Top Notch & Camera Punch-hole */}
          <div className="absolute top-0 left-0 right-0 h-9 z-40 flex items-center justify-between px-7 text-xs font-semibold text-slate-300 select-none pointer-events-none">
            <span className="tracking-wide">{time}</span>
            {/* Center camera cutout */}
            <div className="w-4 h-4 bg-black rounded-full ring-2 ring-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-blue-950/60 rounded-full" />
            </div>
            {/* Status Icons */}
            <div className="flex items-center gap-1.5 text-slate-300">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <div className="flex items-center gap-0.5">
                <span className="text-[10px]">98%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>
          </div>

          {/* Screen Content Container */}
          <div className="w-full h-full rounded-[38px] overflow-hidden flex flex-col pt-8 pb-3 bg-slate-950 relative">
            {children}
          </div>

          {/* Android Gesture Bar */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-500/50 rounded-full pointer-events-none z-40" />
        </div>
      ) : (
        /* Fullscreen Mobile-First Responsive Web Container */
        <div className="w-full max-w-md h-[100dvh] flex flex-col overflow-hidden relative shadow-2xl bg-slate-950">
          {children}
        </div>
      )}
    </div>
  );
};
