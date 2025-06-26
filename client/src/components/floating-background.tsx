export default function FloatingBackground() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 via-transparent to-purple-50/20" />
      
      {/* Currency-themed floating elements */}
      <div className="absolute w-20 h-20 bg-gradient-to-br from-blue-500/20 to-blue-600/10 rounded-full top-10 left-10 animate-float backdrop-blur-sm" style={{ animationDelay: '0s' }}>
        <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      <div className="absolute w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-600/10 rounded-full top-32 right-20 animate-float backdrop-blur-sm" style={{ animationDelay: '2s' }}>
        <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      <div className="absolute w-12 h-12 bg-gradient-to-br from-red-500/20 to-red-600/10 rounded-full bottom-20 left-1/4 animate-float backdrop-blur-sm" style={{ animationDelay: '4s' }}>
        <div className="absolute inset-1 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      <div className="absolute w-24 h-24 bg-gradient-to-br from-purple-500/15 to-purple-600/10 rounded-full bottom-32 right-10 animate-float backdrop-blur-sm" style={{ animationDelay: '1s' }}>
        <div className="absolute inset-3 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      <div className="absolute w-14 h-14 bg-gradient-to-br from-yellow-500/20 to-orange-500/10 rounded-full top-1/2 left-1/3 animate-float backdrop-blur-sm" style={{ animationDelay: '3s' }}>
        <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      <div className="absolute w-18 h-18 bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 rounded-full top-3/4 right-1/3 animate-float backdrop-blur-sm" style={{ animationDelay: '5s' }}>
        <div className="absolute inset-2 bg-white/20 rounded-full animate-pulse-gentle" />
      </div>
      
      {/* Additional smaller decorative elements */}
      <div className="absolute w-8 h-8 bg-cyan-400/15 rounded-full top-1/4 left-2/3 animate-float" style={{ animationDelay: '1.5s' }} />
      <div className="absolute w-6 h-6 bg-pink-400/15 rounded-full bottom-1/3 left-1/2 animate-float" style={{ animationDelay: '3.5s' }} />
      <div className="absolute w-10 h-10 bg-emerald-400/15 rounded-full top-2/3 left-1/6 animate-float" style={{ animationDelay: '2.5s' }} />
      
      {/* Subtle geometric shapes for fintech feel */}
      <div className="absolute top-1/4 right-1/4 w-16 h-16 border border-blue-200/30 rotate-45 animate-float" style={{ animationDelay: '4.5s' }} />
      <div className="absolute bottom-1/4 left-1/5 w-12 h-12 border border-green-200/30 rotate-12 animate-float" style={{ animationDelay: '6s' }} />
    </div>
  );
}
