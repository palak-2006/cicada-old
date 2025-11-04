const BackgroundEffects = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 1 }}>
      {/* Animated glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-glow-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '1s' }} />
      <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-green-600/10 rounded-full blur-3xl animate-glow-pulse" style={{ animationDelay: '2s' }} />
      
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />
      
      {/* Scan line effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-green-500/5 to-transparent h-32 animate-[float_4s_ease-in-out_infinite]" />
      
      {/* Corner accents */}
      <div className="absolute top-0 left-0 w-64 h-64 border-l-2 border-t-2 border-green-500/30" />
      <div className="absolute top-0 right-0 w-64 h-64 border-r-2 border-t-2 border-green-500/30" />
      <div className="absolute bottom-0 left-0 w-64 h-64 border-l-2 border-b-2 border-green-500/30" />
      <div className="absolute bottom-0 right-0 w-64 h-64 border-r-2 border-b-2 border-green-500/30" />
    </div>
  );
};

export default BackgroundEffects;
