import { useNavigate } from "react-router";
import { motion } from "motion/react";
import { Terminal, Shield, Cpu, Activity,Code2, ChevronRight, Globe, Lock } from "lucide-react";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-bg-main text-white flex flex-col font-sans relative overflow-hidden">
      {/* Structural Grid Overlay */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
           style={{ backgroundImage: `linear-gradient(var(--color-border-grid) 1px, transparent 1px), linear-gradient(90deg, var(--color-border-grid) 1px, transparent 1px)`, backgroundSize: '60px 60px' }} />

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-12 py-8 border-b border-border-grid bg-bg-main/80 backdrop-blur-md">
        <div className="flex items-center gap-4">
          
            {/* <Shield className="w-6 h-6 text-white" /> */}
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <Code2 className="w-5 h-5" />
            </div>
        
          <div className="flex flex-col">
            <span className="text-2xl font-black tracking-tighter leading-none">BUG<span className="text-accent-red">BATTLE</span></span>
          </div>
        </div>
        <div className="flex items-center gap-8 font-mono text-[10px] text-text-dim uppercase font-bold tracking-widest md:flex">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
          </div>
          
        </div>
      </header>

      {/* Main Hero */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent-red/10 border border-accent-red/20 text-accent-red text-[10px] font-black uppercase tracking-[0.3em] mb-8 rounded">
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
            DEPLOY YOUR <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-white via-white to-accent-red">SOLUTION.</span>
          </h1>
          
          <p className="text-text-dim text-lg md:text-xl font-medium max-w-2xl mx-auto mb-10 leading-relaxed">
            The ultimate playground for high-stakes debugging. 
            Identify defects, secure the stack, and rise in the global rankings.
          </p>

          <button 
            onClick={() => navigate("/home")}
            className="group relative px-5 py-5 bg-red-500 text-white flex items-center gap-4 font-black uppercase tracking-[0.2em] hover:scale-105 hover:bg-blue-600 active:scale-95 transition-all shadow-[0_20px_50px_rgba(220,38,38,0.3)] mx-auto rounded-2xl cursor-pointer"
          >
            Enter Battles
            {/* <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" /> */}
          </button>
        </motion.div>
      </main>

      {/* Data Rail */}
      {/* <div className="relative z-10 border-t border-border-grid bg-bg-surface/50 py-10 px-12 grid grid-cols-2 lg:grid-cols-4 gap-12">
        <div className="space-y-4">
          <div className="col-header flex items-center gap-2 italic text-[11px] opacity-50 uppercase tracking-widest font-serif font-medium">
             <Activity className="w-3 h-3" />
             Live Traffic
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter">
            2.4k <span className="text-xs text-text-dim font-bold">req/s</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="col-header flex items-center gap-2 italic text-[11px] opacity-50 uppercase tracking-widest font-serif font-medium">
             <Globe className="w-3 h-3" />
             Active Arenas
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter">
            142 <span className="text-xs text-text-dim font-bold">nodes</span>
          </div>
        </div>
        <div className="space-y-4">
          <div className="col-header flex items-center gap-2 italic text-[11px] opacity-50 uppercase tracking-widest font-serif font-medium">
             <Terminal className="w-3 h-3" />
             Patch Rate
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter text-green-500">
            94.2%
          </div>
        </div>
        <div className="space-y-4">
          <div className="col-header flex items-center gap-2 italic text-[11px] opacity-50 uppercase tracking-widest font-serif font-medium">
             <Cpu className="w-3 h-3" />
             Compute Load
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter">
            12% <span className="text-xs text-text-dim font-bold">IDLE</span>
          </div>
        </div>
      </div> */}

      {/* Subtle Terminal Scan Line */}
      <motion.div 
        animate={{ y: ["0%", "100%"] }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-px bg-white/5 z-0"
      />
    </div>
  );
}
