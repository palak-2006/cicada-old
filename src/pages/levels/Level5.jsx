import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import MatrixRain from "../../components/MatrixRain";
import { toast } from "sonner";
import coordinate1 from "../../assets/coordinate-1.jpeg";
import coordinate2 from "../../assets/coordinate-2.jpeg";
import Navbar from "../../components/Navbar";
import { useUserStore } from "../../store/user";

const Level5 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [answer, setAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [timeLeft, setTimeLeft] = useState(20);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // ⏳ Hint timer logic
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setShowHint(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🚀 Handle Submit (with 5-sec countdown)
  const handleSubmit = () => {
    if (!answer.trim()) {
      toast.error("Please enter your decoded answer first!");
      return;
    }

    // start countdown
    let seconds = 5;
    setCountdown(seconds);
    const timer = setInterval(() => {
      seconds--;
      setCountdown(seconds);
      if (seconds <= 0) {
        clearInterval(timer);
        setCountdown(null);
        submitAnswer(); // call actual function
      }
    }, 1000);
  };

  // 🧠 Actual submission logic (same as Level 4)
  const submitAnswer = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ans: answer,
            level: 5,
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Submission failed!");

      if (data.correct) {
        toast.success(data.msg || "Correct! Level unlocked.");
        const newLevel = data.newLevel ?? user.current_level + 1;
        const updatedUser = {
          ...user,
          current_level:
            newLevel > user.current_level ? newLevel : user.current_level,
        };

        setUser(updatedUser);
        localStorage.setItem("Team", JSON.stringify(updatedUser));
        setTimeout(() => navigate("/play"), 1000);
      } else {
        toast.error(data.msg || "Incorrect answer. Try again.");
      }
    } catch (err) {
      console.error("Error submitting answer:", err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <Navbar />

      <div className="relative mt-20 z-10 container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold text-[#22c55e] mb-4 font-mono drop-shadow-[0_0_10px_rgba(34,197,94,0.8)]">
              Level 5: The Cipher Coordinates
            </h1>
            <p className="text-[#22c55e] text-lg font-mono">
              Decode the images
            </p>
            {!showHint && (
              <div className="mt-4 text-yellow-400 font-mono text-sm">
                Hint unlocks in: {timeLeft}s
              </div>
            )}
          </div>

          {/* Coordinates Side by Side */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-green-950/30 backdrop-blur-sm border-2 border-[#22c55e]/50 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <h3 className="text-xl font-bold text-[#22c55e] mb-4 font-mono text-center">
                A
              </h3>
              <div className="flex justify-center">
                <img
                  src={coordinate1}
                  alt="A"
                  className="max-w-full h-auto rounded-lg border-2 border-[#22c55e]/50 shadow-lg"
                />
              </div>
            </div>

            <div className="bg-green-950/30 backdrop-blur-sm border-2 border-[#22c55e]/50 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <h3 className="text-xl font-bold text-[#22c55e] mb-4 font-mono text-center">
                B
              </h3>
              <div className="flex justify-center">
                <img
                  src={coordinate2}
                  alt="B"
                  className="max-w-full h-auto rounded-lg border-2 border-[#22c55e]/50 shadow-lg"
                />
              </div>
            </div>
          </div>

          {/* Hint Section */}
          {showHint && (
            <div className="mb-8 bg-yellow-950/30 backdrop-blur-sm border-2 border-yellow-500/50 rounded-lg p-6 shadow-[0_0_20px_rgba(234,179,8,0.3)] animate-in fade-in duration-500">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4 font-mono text-center">
                💡 Hint: "The Circuit of Fifteen"
              </h3>
              <div className="text-yellow-300 font-mono text-center space-y-1">
                <p>Four stars hum in silent code,</p>
                <p>Three shadows drift where dreams erode.</p>
                <p>One spark burns through silver mist,</p>
                <p>Echoes rise — the gears persist.</p>
                <p>Four paths merge beneath the sun,</p>
                <p>Three hearts fade, their work now done.</p>
              </div>
            </div>
          )}

          {/* Answer Input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
            }}
            className="max-w-2xl mx-auto"
          >
            <div className="bg-green-950/30 backdrop-blur-sm border-2 border-[#22c55e]/50 rounded-lg p-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
              <label className="block text-[#22c55e] font-mono mb-3 text-lg">
                Enter your answer:
              </label>
              <Input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Type your decoded answer..."
                className="w-full bg-black/50 border-2 border-[#22c55e] text-[#22c55e] placeholder:text-[#22c55e]/40 font-mono text-lg focus:ring-2 focus:ring-[#22c55e] focus:border-[#22c55e]"
              />
              <div className="flex gap-4 mt-6">
                <Button
                  type="submit"
                  disabled={isLoading || countdown !== null}
                  className="flex-1 bg-[#22c55e] hover:bg-green-400 text-black font-bold font-mono py-3 text-lg rounded-lg shadow-md shadow-[#22c55e]/40 hover:shadow-[#22c55e]/60 transition-all"
                >
                  {countdown !== null
                    ? `Submitting in ${countdown}s...`
                    : isLoading
                    ? "Checking..."
                    : "SUBMIT"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Level5;
