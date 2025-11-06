import { useState, useEffect } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Card } from "../../components/ui/card";
import MatrixRain from "../../components/MatrixRain";
import Navbar from "../../components/Navbar";
import cicadaBg from "../../assets/cicada-bg.png";
import level2img from "../../assets/level3.png"; // assumed correct
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useUserStore } from "../../store/user";

const Level3 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [partAAnswer, setPartAAnswer] = useState("");
  const [partBAnswer, setPartBAnswer] = useState("");
  const [showHint, setShowHint] = useState(false);
  const [currentPart, setCurrentPart] = useState("A");
  const [isLoading, setIsLoading] = useState(false);

  // Show hint after 20 seconds for Part A
  useEffect(() => {
    if (currentPart === "A") {
      const timer = setTimeout(() => setShowHint(true), 20000);
      return () => clearTimeout(timer);
    }
  }, [currentPart]);

  const handlePartASubmit = async () => {
    if (!partAAnswer.trim()) {
      toast.error("Please enter your answer before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ans: partAAnswer,
          level: 3,
          subpart: "a",
        }),
      });

      const data = await res.json();

      if (data.correct) {
        toast.success(data.msg || "Correct! Proceed to Part B.");
        setTimeout(() => {
          setCurrentPart("B");
          setShowHint(false);
        }, 1000);
      } else {
        toast.error(data.msg || "Incorrect answer. Try again.");
      }
    } catch (err) {
      console.error("Error submitting Part A:", err);
      toast.error("Something went wrong while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Part B Submission
  const handlePartBSubmit = async () => {
    if (!partBAnswer.trim()) {
      toast.error("Please enter your answer before submitting.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          ans: partBAnswer,
          level: 3,
          subpart: "b",
        }),
      });

      const data = await res.json();

      if (data.correct) {
        toast.success(data.msg || "Level 2 completed!");

        const updatedUser = {
          ...user,
          current_level: data.newLevel ?? user.current_level + 1,
        };
        setUser(updatedUser);
        localStorage.setItem("Team", JSON.stringify(updatedUser));

        setTimeout(() => navigate("/play"), 1200);
      } else {
        toast.error(data.msg || "Incorrect answer. Try again.");
      }
    } catch (err) {
      console.error("Error submitting Part B:", err);
      toast.error("Something went wrong while submitting.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <Navbar />

      {/* Background */}
      <div
        className="fixed inset-0 opacity-20 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${cicadaBg})`, zIndex: 1 }}
      />

      {/* Main Content */}
      <div className="relative z-10 pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto space-y-8">

          {currentPart === "A" ? (
            // === PART A ===
            <Card className="border border-green-600 bg-black/60 p-8 space-y-6 backdrop-blur-md">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-green-400 font-mono tracking-widest">
                  PART A
                </h2>
                <p className="text-green-300/70">Decipher the hidden message.</p>
              </div>

              <div className="relative rounded-lg overflow-hidden border border-green-500/50 bg-black/50 flex items-center justify-center">
                <img
                  src={level2img}
                  alt="Level 2 Cipher"
                  className="w-full max-w-md mx-auto p-4"
                />
              </div>

              {/* Input */}
              <div className="space-y-4">
                <Input
                  value={partAAnswer}
                  onChange={(e) => setPartAAnswer(e.target.value)}
                  placeholder="Enter your answer..."
                  className="bg-gray-900 border-green-700 focus:border-green-500 text-green-400 placeholder:text-green-700 h-12"
                />
                <Button
                  disabled={isLoading}
                  onClick={handlePartASubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all"
                >
                  {isLoading ? "Checking..." : "SUBMIT"}
                </Button>
              </div>

              {/* Hint Section */}
              {showHint ? (
                <div className="border border-green-600 bg-black/40 p-4 rounded animate-fade-in font-mono text-sm text-green-300">
                  <p>
                    💡 <span className="font-semibold text-green-400">Hint:</span> 
                    {" "}Three numbers, three tails: num % 10 — join them into an 11-digit ISBN.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-green-700 text-center">
                  Hint will appear after 20 seconds...
                </p>
              )}
            </Card>
          ) : (
            // === PART B ===
            <Card className="border border-green-600 bg-black/60 p-8 space-y-6 backdrop-blur-md">
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-bold text-green-400 font-mono tracking-widest">
                  PART B
                </h2>
                <p className="text-green-300/70">Decode the coordinates.</p>
              </div>

              {/* Coordinates Table */}
              <div className="overflow-x-auto border border-green-800 rounded">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-green-500/10">
                      <th className="border border-green-800 px-4 py-2 text-left font-mono">Page</th>
                      <th className="border border-green-800 px-4 py-2 text-left font-mono">Line</th>
                      <th className="border border-green-800 px-4 py-2 text-left font-mono">Char</th>
                    </tr>
                  </thead>
                  <tbody className="font-mono text-green-400 text-sm">
                    {[
                      ["1C", "11", "01"],
                      ["1D", "09", "0D"],
                      ["1E", "0F", "1C"],
                      ["1F", "1B", "14"],
                      ["6F", "1A", "19"],
                      ["CF", "1B", "24"],
                      ["10F", "19", "1F"],
                      ["13F", "1A", "1F"],
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-green-500/5">
                        {row.map((cell, i) => (
                          <td key={i} className="border border-green-800 px-4 py-2">
                            {cell}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-4">
                <Input
                  value={partBAnswer}
                  onChange={(e) => setPartBAnswer(e.target.value)}
                  placeholder="Enter decoded message..."
                  className="bg-gray-900 border-green-700 focus:border-green-500 text-green-400 placeholder:text-green-700 h-12"
                />
                <Button
                  disabled={isLoading}
                  onClick={handlePartBSubmit}
                  className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg transition-all"
                >
                  {isLoading ? "Checking..." : "SUBMIT"}
                </Button>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default Level3;
