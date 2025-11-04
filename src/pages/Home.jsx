import Navbar from '../components/Navbar.jsx';
import MatrixRain from '../components/MatrixRain.jsx';
import BackgroundEffects from '../components/BackgroundEffects.jsx';

function Home() {
  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Matrix rain effect */}
      <MatrixRain />

      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: 'url("/ciad.png")' }}
      />

      {/* Background effects */}
      <BackgroundEffects />

      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <main className="relative z-10 flex items-center justify-center min-h-screen px-4">
        <div className="text-center space-y-8 max-w-4xl mx-auto pt-20 animate-fade-in">
          {/* Subtitle / Message */}
          <p className="text-xl md:text-2xl text-gray-300 font-mono max-w-2xl mx-auto leading-relaxed whitespace-pre-line">
            {'\n\n'}
            Epiphany is upon you. Your pilgrimage has begun.{' '}
            <span className="text-green-400">Enlightenment awaits.</span>
          </p>

          {/* Terminal-style info box */}
          <div className="inline-block mt-8 bg-gray-900/50 backdrop-blur-sm border border-green-500/30 rounded-lg p-6 text-left shadow-2xl shadow-green-500/10">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-green-500/50" />
              </div>
              <span className="text-xs text-gray-500 font-mono">cicada_terminal</span>
            </div>
            <div className="space-y-2 font-mono text-sm">
              <div className="text-green-400">
                <span className="text-cyan-400">$</span> status:{' '}
                <span className="text-green-300">ACTIVE</span>
              </div>
              <div className="text-green-400">
                <span className="text-cyan-400">$</span> puzzles_available:{' '}
                <span className="text-green-300">7</span>
              </div>
              <div className="text-green-400">
                <span className="text-cyan-400">$</span> solvers_online:{' '}
                <span className="text-green-300 animate-pulse">∞</span>
              </div>
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute inset-0 -z-10">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-green-500/50 rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${5 + Math.random() * 10}s`,
                }}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
