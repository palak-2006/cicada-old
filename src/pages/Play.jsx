import { useRef, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import Navbar from "../components/Navbar";
import MatrixRain from "../components/MatrixRain";
import cicadaBg from "../assets/cicada-bg.png";
import { useUserStore } from "../store/user";
import { toast } from "sonner";

const Play = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [localUser, setLocalUser] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [showCelebrate, setShowCelebrate] = useState(false);
  const levelRefs = useRef({});

  useEffect(() => {
    if (user && user.current_level) {
      setLocalUser(user);
      setCurrentLevel(user.current_level);
    } else {
      const stored = localStorage.getItem("Team");
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setLocalUser(parsed);
        setCurrentLevel(parsed.current_level || 1);
      } else {
        navigate("/");
      }
    }
  }, [user, setUser, navigate]);

  useEffect(() => {
    if (currentLevel >= 8) {
      setTimeout(() => setShowCelebrate(true), 800);
    }
  }, [currentLevel]);

  useEffect(() => {
    const el = levelRefs.current[currentLevel];
    if (!el) return;

    const targetY =
      el.getBoundingClientRect().top + window.scrollY - window.innerHeight / 2;
    const startY = window.scrollY;
    const distance = targetY - startY;
    const duration = 3500;
    let startTime = null;

    const smoothScroll = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const ease = 1 - Math.pow(1 - progress, 3);
      window.scrollTo(0, startY + distance * ease);
      if (progress < 1) requestAnimationFrame(smoothScroll);
    };

    requestAnimationFrame(smoothScroll);
  }, [currentLevel]);

  useEffect(() => {
    let devToolsOpen = false;
    const detectDevTools = () => {
      const threshold = 160;
      const widthDiff = window.outerWidth - window.innerWidth > threshold;
      const heightDiff = window.outerHeight - window.innerHeight > threshold;

      if (widthDiff || heightDiff) {
        if (!devToolsOpen) {
          devToolsOpen = true;
          toast.warning("⚠️ Developer Tools detected! Redirecting...");
          setTimeout(() => {
            navigate("/");
            window.location.reload();
          }, 1000);
        }
      } else {
        devToolsOpen = false;
      }
    };
    const interval = setInterval(detectDevTools, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  // ✅ Handle play button
  const handlePlayLevel = (level) => {
    if (!localUser) {
      toast.error("You must be logged in to play!");
      navigate("/");
      return;
    }

    if (level > localUser.current_level) {
      toast.error("This level is locked!");
      return;
    }

    const updated =
      level > localUser.current_level
        ? { ...localUser, current_level: level }
        : { ...localUser };

    setUser(updated);
    localStorage.setItem("Team", JSON.stringify(updated));
    setLocalUser(updated);

    let count = 3;
    setCountdown(count);

    const timer = setInterval(() => {
      count -= 1;
      setCountdown(count);

      if (count <= 0) {
        clearInterval(timer);
        setCountdown(null);
        setTimeout(() => navigate(`/level${level}`), 200);
      }
    }, 1000);
  };

  const levelPositions = [
    { x: 50, y: 90 },
    { x: 30, y: 70 },
    { x: 40, y: 50 },
    { x: 60, y: 35 },
    { x: 70, y: 20 },
    { x: 50, y: 10 },
    { x: 30, y: 5 },
  ];

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <Navbar />
      <div
        className="fixed inset-0 opacity-20 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${cicadaBg})`, zIndex: 1 }}
      />
      {countdown && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] bg-black/80 backdrop-blur-md">
          <span className="text-green-400 font-mono text-[8rem] font-bold animate-pulse drop-shadow-[0_0_20px_rgba(34,197,94,0.8)]">
            {countdown}
          </span>
        </div>
      )}
      {showCelebrate && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 backdrop-blur-lg">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse delay-75"></div>
          </div>

          {/* Main card */}
          <div className="relative max-w-4xl p-12 rounded-2xl border-2 border-green-400 bg-gradient-to-br from-black via-green-950/30 to-black shadow-[0_0_80px_rgba(34,197,94,0.4)] text-center animate-in fade-in zoom-in duration-700">
            {/* Glowing corners */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-green-400 rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-green-400 rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-green-400 rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-green-400 rounded-br-2xl"></div>

            {/* Trophy icon with glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 bg-green-400/20 rounded-full blur-2xl animate-pulse"></div>
              </div>
              <div
                className="relative text-8xl animate-bounce"
                style={{ animationDuration: "2s" }}
              >
                🏆
              </div>
            </div>

            <h1 className="text-7xl font-bold text-green-400 font-mono mb-6 animate-pulse drop-shadow-[0_0_30px_rgba(34,197,94,1)]">
              CONGRATULATIONS!
            </h1>

            {/* Description */}
            <p className="text-xl text-green-300 font-mono mb-8 leading-relaxed max-w-lg mx-auto">
              You have completed all challenges. You are truly one of the
              chosen.
            </p>

            {/* Cicada master badge */}
            <div className="relative flex justify-center mb-10">
              {/* Spinning rings */}
              <div
                className="absolute w-48 h-48 border-2 border-green-400/30 rounded-full animate-spin"
                style={{ animationDuration: "8s" }}
              ></div>
              <div
                className="absolute w-56 h-56 border border-green-500/20 rounded-full animate-spin"
                style={{
                  animationDuration: "12s",
                  animationDirection: "reverse",
                }}
              ></div>
              <div
                className="absolute w-64 h-64 border border-green-400/10 rounded-full animate-ping"
                style={{ animationDuration: "3s" }}
              ></div>

              {/* Center badge */}
              <div className="relative z-10 mt-8 px-8 py-4 bg-gradient-to-r from-green-500 to-cyan-500 rounded-full shadow-[0_0_40px_rgba(34,197,94,0.6)]">
                <span className="text-3xl text-black font-bold font-mono">
                  CICADA MASTER 🐛
                </span>
              </div>
            </div>

            {/* Stats or rank indicator */}
            <div className="flex justify-center gap-8 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 font-mono">
                  7
                </div>
                <div className="text-sm text-green-500/70 font-mono">
                  LEVELS
                </div>
              </div>
              <div className="w-px bg-green-400/30"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-400 font-mono">
                  100%
                </div>
                <div className="text-sm text-green-500/70 font-mono">
                  COMPLETE
                </div>
              </div>
            </div>
          </div>

          {[...Array(40)].map((_, i) => (
            <div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${
                i % 3 === 0
                  ? "bg-green-400"
                  : i % 3 === 1
                  ? "bg-cyan-400"
                  : "bg-green-300"
              }`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                animation: `floatConfetti ${
                  2 + Math.random() * 3
                }s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`,
                opacity: 0.7 + Math.random() * 0.3,
              }}
            />
          ))}

          <style>{`
      @keyframes floatConfetti {
        0%, 100% { transform: translateY(0) rotate(0deg) scale(1); opacity: 0; }
        10% { opacity: 1; }
        50% { transform: translateY(-30px) rotate(180deg) scale(1.2); opacity: 1; }
        90% { opacity: 1; }
        100% { transform: translateY(0) rotate(360deg) scale(1); opacity: 0; }
      }
    `}</style>
        </div>
      )}

      <div className="relative z-10 pt-24 px-4">
        <div
          className="relative w-full max-w-4xl mx-auto"
          style={{ height: "200vh" }}
        >
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
          >
            <path
              d="M50,90 
                 Q40,80 30,70 
                 Q35,60 40,50 
                 Q50,42 60,35 
                 Q65,28 70,20 
                 Q60,15 50,10 
                 Q40,7 30,5"
              stroke="rgb(34,197,94)"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeDasharray="2,6"
              fill="none"
              style={{
                filter: "drop-shadow(0 0 5px rgba(34,197,94,0.8))",
                animation: "dashmove 4s linear infinite",
              }}
            />
          </svg>

          <style>{`
            @keyframes dashmove {
              to { stroke-dashoffset: -30; }
            }
          `}</style>

          {/* Levels */}
          {[1, 2, 3, 4, 5, 6, 7].map((level, index) => {
            const isUnlocked = level <= currentLevel;
            const isCurrent = level === currentLevel;
            const pos = levelPositions[index];

            return (
              <div
                key={level}
                ref={(el) => (levelRefs.current[level] = el)}
                className="absolute transform -translate-x-1/2 -translate-y-1/2"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  zIndex: 10,
                }}
              >
                <div className="relative group">
                  {isCurrent && (
                    <div className="absolute inset-0 rounded-full bg-green-500 blur-xl opacity-50 animate-pulse" />
                  )}

                  <div
                    className={`relative w-24 h-24 rounded-full border-4 flex flex-col items-center justify-center font-mono transition-all
                      ${
                        isUnlocked
                          ? "border-green-400 bg-green-500/20 hover:scale-110 hover:border-green-300 hover:shadow-lg hover:shadow-green-500/40"
                          : "border-gray-700 bg-black/60 grayscale opacity-70"
                      }`}
                  >
                    <div
                      className={`text-3xl font-bold ${
                        isUnlocked ? "text-green-400" : "text-gray-600"
                      }`}
                    >
                      {level}
                    </div>
                    <div
                      className={`text-xs ${
                        isUnlocked ? "text-green-500" : "text-gray-700"
                      }`}
                    >
                      LVL
                    </div>
                  </div>

                  {isUnlocked && (
                    <div
                      className={`absolute -bottom-14 left-1/2 transform -translate-x-1/2 transition-all ${
                        isCurrent
                          ? "opacity-100"
                          : "opacity-0 group-hover:opacity-100"
                      }`}
                    >
                      <Button
                        onClick={() => handlePlayLevel(level)}
                        className="bg-green-500 hover:bg-green-600 text-black font-bold px-6 py-2 rounded-lg shadow-md shadow-green-500/50 transition-all hover:shadow-green-500/70 font-mono text-sm whitespace-nowrap"
                      >
                        PLAY
                      </Button>
                    </div>
                  )}

                  {!isUnlocked && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-8 h-8 border-2 border-gray-600 rounded-md flex items-center justify-center text-gray-600 bg-black/70">
                        🔒
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <div className="h-32" />
      </div>
    </div>
  );
};

export default Play;
