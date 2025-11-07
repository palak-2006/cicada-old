import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { toast } from "sonner";
import MatrixRain from "../../components/MatrixRain";
import { Lock, Unlock, CheckCircle2 } from "lucide-react";
import Navbar from "../../components/Navbar";
import { useUserStore } from "../../store/user";

const videos = {
  1: "/videos/vid1.mp4",
  2: "/videos/vid2.mp4",
  3: "/videos/vid3.mp4",
  4: "/videos/vid4.mp4",
  5: "/videos/vid5.mp4",
  6: "/videos/vid6.mp4",
};

const subpartMap = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
  6: "f",
};

const parts = [
  {
    id: 1,
    title: "Part 1: The Beginning",
    description: "Decode the first message hidden in the video",
  },
  {
    id: 2,
    title: "Part 2: The Cipher",
    description: "Break the cipher to proceed",
  },
  {
    id: 3,
    title: "Part 3: Hidden Layers",
    description: "Find what lies beneath",
  },
  {
    id: 4,
    title: "Part 4: The Pattern",
    description: "Recognize the sequence",
  },
  {
    id: 5,
    title: "Part 5: Cryptographic Truth",
    description: "Decrypt the final layer",
  },
  {
    id: 6,
    title: "Part 6: The Revelation",
    description: "Complete the puzzle",
  },
];

const Level6 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();

  const [currentPart, setCurrentPart] = useState(1);
  const [completedParts, setCompletedParts] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const partRefs = useRef({});

  useEffect(() => {
    if (partRefs.current[currentPart]) {
      partRefs.current[currentPart]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [currentPart]);

  const isPartAccessible = (partId) =>
    partId === 1 || completedParts.includes(partId - 1);

  const isPartCompleted = (partId) => completedParts.includes(partId);

  const handleSubmit = async (partId) => {
    const answer = answers[partId]?.trim();
    if (!answer) {
      toast.error("Please enter your answer before submitting.");
      return;
    }

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
            level: 6,
            subpart: subpartMap[partId], 
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) throw new Error(data.err || "Submission failed.");

      if (data.correct) {
        const partLetter = subpartMap[partId].toUpperCase();
        toast.success(`✅ Part ${partLetter} solved!`);

        const newCompleted = [...completedParts, partId];
        setCompletedParts(newCompleted);

        if (subpartMap[partId] === "f") {
          toast.success("🎉 Congrats! New level unlocked.");
          const newLevel = data.newLevel ?? user.current_level + 1;
          console.log(
            `Navigating to Level ${newLevel}, current level: ${user.current_level}`
          );
          const updatedUser = {
            ...user,
            current_level:
              newLevel > user.current_level ? newLevel : user.current_level,
          };

          setUser(updatedUser);
          localStorage.setItem("Team", JSON.stringify(updatedUser));
          setTimeout(() => navigate("/play"), 1000);
        }
        setTimeout(() => setCurrentPart(partId + 1), 1000);
      } else {
        toast.error(data.msg || "Incorrect answer. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  // Countdown wrapper
  const startCountdown = (partId) => {
    let timer = 5;
    setCountdown({ id: partId, value: timer });
    const interval = setInterval(() => {
      timer--;
      if (timer <= 0) {
        clearInterval(interval);
        setCountdown(null);
        handleSubmit(partId);
      } else {
        setCountdown({ id: partId, value: timer });
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      <MatrixRain />
      <Navbar />

      <div className="relative z-10 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <p className="text-gray-400 text-lg tracking-wide">
            SIX PARTS • SIX KEYS • ONE TRUTH
          </p>

          {/* Progress Bar */}
          <div className="mt-8 max-w-2xl mx-auto">
            <div className="flex justify-between mb-2">
              {parts.map((part) => (
                <div key={part.id} className="flex flex-col items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                      isPartCompleted(part.id)
                        ? "bg-green-500 border-green-500"
                        : isPartAccessible(part.id)
                        ? "border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"
                        : "border-gray-600"
                    }`}
                  >
                    {isPartCompleted(part.id) ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : isPartAccessible(part.id) ? (
                      <Unlock className="w-4 h-4 text-green-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-gray-500" />
                    )}
                  </div>
                  <span className="text-xs text-white">{part.id}</span>
                </div>
              ))}
            </div>
            <div className="h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 to-cyan-500 transition-all duration-500"
                style={{
                  width: `${(completedParts.length / parts.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Main Parts */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {parts
            .filter((part) => isPartAccessible(part.id))
            .map((part) => {
              const completed = isPartCompleted(part.id);

              return (
                <Card
                  key={part.id}
                  ref={(el) => (partRefs.current[part.id] = el)}
                  className={`border-2 transition-all ${
                    completed
                      ? "border-green-500/50 bg-gray-900/60 opacity-60"
                      : "border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] bg-gray-900/80 backdrop-blur-xl"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl text-white font-bold tracking-wide">
                        {part.title}
                      </CardTitle>
                      {completed && (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      )}
                    </div>
                    <CardDescription className="text-gray-400">
                      {part.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    {!completed ? (
                      <>
                        <div className="relative mb-6 rounded-lg overflow-hidden border-2 border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                          <video
                            controls
                            className="w-full aspect-video bg-black"
                            src={videos[part.id]}
                          />
                        </div>

                        <div className="space-y-4">
                          <div className="flex gap-2">
                            <Input
                              placeholder="Enter your answer..."
                              value={answers[part.id] || ""}
                              onChange={(e) =>
                                setAnswers({
                                  ...answers,
                                  [part.id]: e.target.value,
                                })
                              }
                              onKeyDown={(e) => {
                                if (e.key === "Enter") startCountdown(part.id);
                              }}
                              disabled={isLoading || countdown?.id === part.id}
                              className="bg-gray-900 border-green-500/50 focus:border-green-500 focus:ring-green-500 font-mono text-green-400"
                            />
                            <Button
                              onClick={() => startCountdown(part.id)}
                              disabled={isLoading || countdown?.id === part.id}
                              className="bg-green-500 text-white hover:bg-green-600 font-bold tracking-wide min-w-[120px]"
                            >
                              {countdown?.id === part.id
                                ? countdown.value
                                : isLoading
                                ? "CHECKING..."
                                : "SUBMIT"}
                            </Button>
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-green-500 font-bold tracking-wide">
                        ✓ PART {subpartMap[part.id].toUpperCase()} COMPLETED
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Level6;
