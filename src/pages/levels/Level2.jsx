import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import Navbar from "../../components/Navbar";
import MatrixRain from "../../components/MatrixRain";
import InteractiveClock from "../../components/InteractiveClock";
import cicadaImage from "../../assets/cicada-bg.png";
import { toast } from "sonner";
import { useUserStore } from "../../store/user";

const Level2 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [question1Answer, setQuestion1Answer] = useState("");
  const [question2Answer, setQuestion2Answer] = useState("");
  const [showQuestion2, setShowQuestion2] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);

  // ===== Load Part B Access on Mount =====
  useEffect(() => {
    const checkPartACompletion = async () => {
      try {
        // check localStorage first for instant UX
        const partAStatus = localStorage.getItem("level2_partA_done");
        if (partAStatus === "true") {
          setShowQuestion2(true);
          return;
        }

        // otherwise verify from backend (optional but safer)
        const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/level-status/2`, {
          credentials: "include",
        });
        if (res.ok) {
          const data = await res.json();
          if (data?.subpartACompleted) {
            setShowQuestion2(true);
            localStorage.setItem("level2_partA_done", "true");
          }
        }
      } catch (err) {
        console.error("Error verifying Part A completion:", err);
      }
    };

    checkPartACompletion();
  }, []);

  // ===== Common Countdown Logic =====
  const startCountdown = (callback) => {
    let counter = 5;
    setCountdown(counter);
    const timer = setInterval(() => {
      counter--;
      setCountdown(counter);
      if (counter <= 0) {
        clearInterval(timer);
        setCountdown(null);
        callback();
      }
    }, 1000);
  };

  // ===== PART A (Q1) Submission =====
  const handleSubmitQuestion1 = () => {
    if (!question1Answer.trim()) {
      toast.error("Please enter your answer before submitting.");
      return;
    }
    startCountdown(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ans: question1Answer,
            level: 2,
            subpart: "a",
          }),
        });

        const data = await res.json();

        if (data.correct) {
          toast.success(data.msg || "Correct! Proceed to Q-2.");
          localStorage.setItem("level2_partA_done", "true");
          setTimeout(() => setShowQuestion2(true), 1000);
        } else {
          toast.error(data.msg || "Incorrect answer. Try again.");
        }
      } catch (err) {
        console.error("Error submitting Q1:", err);
        toast.error("Something went wrong while submitting.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  // ===== PART B (Q2) Submission =====
  const handleFinalSubmit = () => {
    if (!question2Answer.trim()) {
      toast.error("Please enter your answer before submitting.");
      return;
    }

    startCountdown(async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            ans: question2Answer,
            level: 2,
            subpart: "b",
          }),
        });

        const data = await res.json();

        if (data.correct) {
          toast.success(data.msg || "Level 2 completed!");
          localStorage.removeItem("level2_partA_done");

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
        console.error("Error submitting Q2:", err);
        toast.error("Something went wrong while submitting.");
      } finally {
        setIsLoading(false);
      }
    });
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <Navbar />

      {/* Background Image */}
      <div
        className="fixed inset-0 opacity-20 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${cicadaImage})`, zIndex: 1 }}
      />

      {/* Content */}
      <div className="relative z-10 pt-32 px-4 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="border-2 border-green-500 bg-black/80 p-8 rounded-lg backdrop-blur-sm">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <h1
                className="text-4xl font-bold text-green-400 font-mono"
                style={{ textShadow: "0 0 15px #22c55e" }}
              >
                LEVEL 2
              </h1>
              <Button
                onClick={() => navigate("/play")}
                variant="outline"
                className="border-green-500 text-green-400 hover:bg-green-500/20 font-mono"
              >
                BACK TO LEVELS
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Left Side - Clock */}
              <div className="flex items-center justify-center">
                <InteractiveClock />
              </div>

              {/* Right Side - Questions */}
              <div className="space-y-6">
                {/* Q1 */}
                <div className="border border-green-600 bg-black/60 p-6 rounded-lg">
                  <h2
                    className="text-xl font-bold text-green-400 mb-4 font-mono"
                    style={{ textShadow: "0 0 10px #22c55e" }}
                  >
                    Q-1
                  </h2>
                  <p className="text-green-500 font-mono leading-relaxed mb-4">
                    You're trying to run a <span className="text-green-400 font-bold">_____</span> none of the{" "}
                    <span className="text-green-400 font-bold">_______</span> seem to be{" "}
                    <span className="text-green-400 font-bold">_______</span> with each other.
                    You've checked your code and all the individual nodes work correctly when{" "}
                    <span className="text-green-400 font-bold">______</span>.
                    What is the most likely issue with your{" "}
                    <span className="text-green-400 font-bold">______</span> that is causing this problem?
                  </p>

                  <Input
                    type="text"
                    placeholder="Enter your answer..."
                    value={question1Answer}
                    onChange={(e) => setQuestion1Answer(e.target.value)}
                    className="w-full bg-gray-900 border-green-600 text-green-400 font-mono focus:border-green-400 focus:ring-green-400 mb-4"
                    disabled={showQuestion2}
                  />

                  {!showQuestion2 && (
                    <Button
                      onClick={handleSubmitQuestion1}
                      disabled={isLoading || countdown !== null}
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg font-mono shadow-md shadow-green-500/50"
                    >
                      {countdown !== null ? countdown : isLoading ? "Checking..." : "SUBMIT Q-1"}
                    </Button>
                  )}
                </div>

                {/* Q2 */}
                {showQuestion2 && (
                  <div className="border border-green-600 bg-black/60 p-6 rounded-lg animate-in fade-in slide-in-from-top-4 duration-500">
                    <h2
                      className="text-xl font-bold text-green-400 mb-4 font-mono"
                      style={{ textShadow: "0 0 10px #22c55e" }}
                    >
                      Q-2
                    </h2>
                    <p className="text-green-500 font-mono leading-relaxed mb-4">
                      You have a <span className="text-green-400 font-bold">______</span> with two frames,{" "}
                      <span className="text-green-400 font-bold">_______</span> and{" "}
                      <span className="text-green-400 font-bold">__</span>. You're trying to get the{" "}
                      <span className="text-green-400 font-bold">________</span> from{" "}
                      <span className="text-green-400 font-bold">__________</span> to{" "}
                      <span className="text-green-400 font-bold">________</span> but you get an error indicating the{" "}
                      <span className="text-green-400 font-bold">_________</span> is not available. List possible{" "}
                      <span className="text-green-400 font-bold">___________</span> for this error.
                    </p>

                    <Input
                      type="text"
                      placeholder="Enter your answer..."
                      value={question2Answer}
                      onChange={(e) => setQuestion2Answer(e.target.value)}
                      className="w-full bg-gray-900 border-green-600 text-green-400 font-mono focus:border-green-400 focus:ring-green-400 mb-4"
                    />

                    <Button
                      onClick={handleFinalSubmit}
                      disabled={isLoading || countdown !== null}
                      className="w-full bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg font-mono shadow-md shadow-green-500/50"
                    >
                      {countdown !== null ? countdown : isLoading ? "Checking..." : "SUBMIT Q-2"}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Level2;
