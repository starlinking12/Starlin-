import { motion } from 'motion/react';

export default function Orbs() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Orb 1: Classic Blue */}
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] bg-blue-600/40 rounded-full blur-[80px] animate-float" 
           style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 70%)' }} />
      
      {/* Orb 2: Purple Mist */}
      <div className="absolute bottom-[-150px] right-[-50px] w-[500px] h-[500px] bg-purple-600/30 rounded-full blur-[80px] animate-float-delayed" 
           style={{ background: 'radial-gradient(circle, #8b5cf6 0%, transparent 70%)' }} />
      
      {/* Orb 3: Pink Accent */}
      <div className="absolute top-[40%] left-[60%] w-[300px] h-[300px] bg-pink-500/20 rounded-full blur-[80px] animate-float" 
           style={{ background: 'radial-gradient(circle, #ec4899 0%, transparent 70%)' }} />
    </div>
  );
}
