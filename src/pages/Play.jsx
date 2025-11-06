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
    if (!localUser) return;
  }, [localUser]);

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
