import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import MatrixRain from "../../components/MatrixRain";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import cicadaGlow from "../../assets/cicada-bg.png";
import { useUserStore } from "../../store/user";
import { toast } from "sonner";

const Level4 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ===== Handle Submit =====
  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Please enter your decoded answer first!");
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ans: answer,
          level: 4,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.err || "Submission failed!");

      if (data.correct) {
        toast.success(data.msg || "Correct! Level unlocked.");

        const updatedUser = {
          ...user,
          current_level: data.newLevel ?? user.current_level + 1,
        };

        // Update Zustand + localStorage
        setUser(updatedUser);
        localStorage.setItem("team", JSON.stringify(updatedUser));

        // Navigate back to play
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

      {/* Background Cicada */}
      <div
        className="fixed inset-0 bg-center bg-no-repeat opacity-5"
        style={{
          backgroundImage: `url(${cicadaGlow})`,
          backgroundSize: "40%",
          zIndex: 1,
        }}
      />

      <div className="relative z-10 pt-24 pb-12 px-4">
        <div className="max-w-4xl mx-auto mt-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h1
              className="text-4xl font-bold font-mono"
              style={{ textShadow: "0 0 10px #22c55e" }}
            >
              LEVEL 4
            </h1>
            <Button
              onClick={() => navigate("/play")}
              variant="outline"
              className="font-mono border-green-500 text-green-400 hover:bg-green-500/10"
            >
              BACK TO LEVELS
            </Button>
          </div>

          {/* Mission Briefing */}
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 mb-8 backdrop-blur-sm">
            <h2
              className="text-xl font-bold font-mono mb-3 text-green-400"
              style={{ textShadow: "0 0 8px #22c55e" }}
            >
              MISSION BRIEFING
            </h2>
            <p className="font-mono text-sm text-green-300/80 leading-relaxed mb-4">
              Decode the morse code message below. Use standard International
              Morse Code conventions where dots (.) and dashes (-) represent
              letters, and spaces separate characters.
            </p>
            <div className="bg-black/70 border border-green-500/50 rounded p-6">
              <p
                className="font-mono text-2xl text-center text-green-400 tracking-wider break-all"
                style={{ textShadow: "0 0 5px #22c55e" }}
              >
                -.-. -.-- - --- -.-- -. - .... .-
              </p>
            </div>
          </div>

          {/* Decode Input */}
          <div className="bg-black/50 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm">
            <h2
              className="text-xl font-bold font-mono mb-4 text-green-400"
              style={{ textShadow: "0 0 8px #22c55e" }}
            >
              DECODE
            </h2>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Enter decoded message..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                className="font-mono bg-black/70 border-green-500/50 text-green-400 placeholder:text-green-700 focus:border-green-400"
                onKeyPress={(e) => {
                  if (e.key === "Enter" && !isLoading) handleSubmit();
                }}
              />
              <Button
                onClick={handleSubmit}
                disabled={isLoading}
                className="w-full font-mono bg-green-500 text-black hover:bg-green-400"
              >
                {isLoading ? "CHECKING..." : "SUBMIT ANSWER"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level4;
