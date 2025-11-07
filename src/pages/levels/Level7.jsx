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
import MatrixRain from "../../components/MatrixRain";
import { toast } from "sonner";
import {
  Lock,
  Unlock,
  CheckCircle2,
  Brain,
  Network,
  Hexagon,
} from "lucide-react";
import { useUserStore } from "../../store/user";
import Navbar from "../../components/Navbar";

const parts = [
  {
    id: 1,
    title: "Part 1: The Prince's Question",
    riddle: `In the dark prince's speech of doubt and dread,
A question lingers—both alive and dead.
Look not just at the words, but what they imply,
Sum the letters of the choice's reply.
Consider vowels' weight in his solemn call,
Find the total, it's the key to it all.`,
  },
  {
    id: 2,
    title: "Part 2: The Mediator",
    riddle: `The mind, layered in thought as in sheets of glass,
Reflects itself, consciousness amassed.
In Freud's trio, which guides the self,
It's neither id nor super, but what holds them itself.`,
  },
  {
    id: 3,
    title: "Part 3: The Neural Helm",
    riddle: `As the mind is housed in a network so vast,
Think where decisions and morals are cast.
It's found in a region at the brain's very helm,
A cortex supreme in the neural realm.`,
  },
  {
    id: 4,
    title: "Part 4: Artificial Cognition",
    riddle: `Artificial minds, mimicking our own,
Layers upon layers, each neuron grown.
Machines now learn from structures we trace,
A network of nodes, in clusters of space.`,
  },
  {
    id: 5,
    title: "Part 5: Geometric Harmony",
    riddle: `From ancient wisdom and geometric lore,
A figure emerges with symmetry at its core.
A perfect square, twice thrice aligned,
A harmony in numbers, both even and prime.
Seek the shape where six meets six,
In this dual harmony, the answer sticks.`,
  },
];

const subpartMap = {
  1: "a",
  2: "b",
  3: "c",
  4: "d",
  5: "e",
};

const Level7 = () => {
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

  const isPartAccessible = (id) =>
    id === 1 || completedParts.includes(id - 1);
  const isPartCompleted = (id) => completedParts.includes(id);

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
            level: 7,
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

        // ✅ Final part (E)
        if (subpartMap[partId] === "e") {
          toast.success("🎉 Congrats! New level unlocked.");
          const newLevel = data.newLevel ?? user.current_level + 1;
          const updatedUser = {
            ...user,
            current_level:
              newLevel > user.current_level ? newLevel : user.current_level,
          };
          setUser(updatedUser);
          localStorage.setItem("Team", JSON.stringify(updatedUser));
          setTimeout(() => navigate("/play"), 1200);
        } else {
          setTimeout(() => setCurrentPart(partId + 1), 1000);
        }
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

  // ✅ Countdown wrapper (5 seconds)
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
      {/* glowing orbs and grid */}
      <div className="fixed  top-20 left-20 w-96 h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="fixed bottom-20 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div
        className="fixed inset-0 opacity-30 bg-green-500/[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgb(34 197 94 / 0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgb(34 197 94 / 0.03) 1px, transparent 1px)
          `,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative mt-18 z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Brain className="w-12 h-12 text-purple-500 animate-pulse" />
            <h1 className="text-5xl md:text-7xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-cyan-500 to-green-500">
              LEVEL <span className="animate-pulse text-white">VII</span>
            </h1>
            <Network className="w-12 h-12 text-cyan-500 animate-pulse" />
          </div>
          <p className="text-gray-400 text-lg tracking-wide font-mono">
            FIVE RIDDLES • FIVE KEYS • COGNITIVE TRUTH
          </p>
        </div>

        {/* Riddles */}
        <div className="grid gap-8 max-w-4xl mx-auto">
          {parts
            .filter((part) => isPartAccessible(part.id))
            .map((part) => {
              const completed = isPartCompleted(part.id);
              return (
                <Card
                  key={part.id}
                  ref={(el) => (partRefs.current[part.id] = el)}
                  className={`border-2 ${
                    completed
                      ? "border-purple-500/50 bg-gray-900/60 opacity-60"
                      : "border-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.3)] bg-gray-900/80"
                  }`}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-2xl font-bold text-purple-400">
                        {part.title}
                      </CardTitle>
                      {completed && (
                        <CheckCircle2 className="w-6 h-6 text-purple-500" />
                      )}
                    </div>
                  </CardHeader>

                  <CardContent>
                    <pre className="whitespace-pre-wrap font-mono text-cyan-400 bg-black/50 p-6 rounded-lg border border-purple-500/30 mb-4">
                      {part.riddle}
                    </pre>

                    {!completed ? (
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
                          className="bg-gray-900 border-purple-500/50 text-purple-400 focus:border-purple-500 focus:ring-purple-500"
                        />
                        <Button
                          onClick={() => startCountdown(part.id)}
                          disabled={isLoading || countdown?.id === part.id}
                          className="bg-purple-500 hover:bg-purple-600 text-white font-bold min-w-[120px]"
                        >
                          {countdown?.id === part.id
                            ? countdown.value
                            : isLoading
                            ? "CHECKING..."
                            : "SUBMIT"}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-purple-500 font-bold">
                        ✓ RIDDLE {part.id} SOLVED
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
        </div>

        {/* Completion message */}
        {completedParts.length === parts.length && (
          <div className="mt-12 text-center">
            <Card className="border-purple-500 shadow-[0_0_30px_rgba(168,85,247,0.4)] bg-gray-900/80 backdrop-blur-xl max-w-2xl mx-auto">
              <CardContent className="py-12">
                <div className="flex items-center justify-center gap-4 mb-4">
                  <Hexagon
                    className="w-12 h-12 text-cyan-500 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                  <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-cyan-500">
                    LEVEL VII COMPLETE
                  </h2>
                  <Hexagon
                    className="w-12 h-12 text-purple-500 animate-spin"
                    style={{ animationDuration: "3s" }}
                  />
                </div>
                <p className="text-xl text-gray-400">
                  "The mind that can solve, can transcend."
                </p>
                <p className="text-sm text-purple-500 mt-4 font-mono">
                  // Cognitive mastery achieved
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Level7;
