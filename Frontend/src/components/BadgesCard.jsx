import React from 'react';
import { Award, Zap, Star } from 'lucide-react';

export default function BadgesCard({profile}) {
  return (
    <div className="bg-[#282828] rounded-xl p-5 shadow-sm flex flex-col gap-4 w-full h-full">
      <div className="flex items-center gap-2">
        <span className="text-neutral-400 font-medium text-[13px] block">Badges</span>
      </div>
      
      <div className="flex gap-6 mt-1 overflow-x-auto pb-2 scrollbar-hide flex-1 items-center">
       
       {
          profile?.problemSolved>=100 ?  
          <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(250,204,21,0.15)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#282828] rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 to-orange-500/10" />
               <Award className="text-yellow-500 relative z-10" size={32} />
            </div>
          </div>
          <span className="text-xs text-neutral-300 font-medium">100 Days</span>
        </div> :<></>
       }

        
        {
          profile?.problemSolved>=50 ? 
           <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(34,211,238,0.15)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#282828] rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/10 to-blue-500/10" />
               <Zap className="text-cyan-400 relative z-10" size={28} />
            </div>
          </div>
          <span className="text-xs text-neutral-300 font-medium">Fast Solver</span>
          </div> : <></>
        }

        {
          profile?.problemSolved>=20 ? 
          <div className="flex flex-col items-center gap-2.5 group cursor-pointer">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center p-[2px] shadow-[0_0_15px_rgba(52,211,153,0.15)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#282828] rounded-full flex items-center justify-center relative overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/10 to-green-500/10" />
               <Star className="text-emerald-400 relative z-10" fill="currentColor" size={26} />
            </div>
          </div>
          <span className="text-xs text-neutral-300 font-medium">Algorithm I</span>
          </div>:<></>
        }
        
      </div>
    </div>
  );
}
