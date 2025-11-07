import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "../../components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "../../components/Navbar";
import MatrixRain from "../../components/MatrixRain";
import cicadaBg from "../../assets/cicada-bg.png";
import { useUserStore } from "../../store/user";
import { toast } from "sonner";

const Level1 = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [panelInput, setPanelInput] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const cipherLines = [
    "Ϊ9'μ8 β0Ω8Γ$π# ω3Ή0Σ2Γ$Σ2 ς3Ϊ9Γ$ς3μ1Ϊ9†6Ϟ9 μ8Σ2Σ2†6 †6Ή0Σ2 Ϟ9μ1π#",
    "ʒ4 μ1Ϟ9β0∂7ƒ5 χ%Ϊ9β0μ1 ∂7ρ@Σ2ƒ5†6 μ1ʒ4μ8μ8 μ1Ϊ9ƒ5 ∂7ρ@μ8ρ@Ϟ9 ʒ4†6 χ%ρ@Ω8",
    "Ψ7ʒ4ψ8†6ψ8 Ω8κ7ρ@ƒ5μ1 Ψ7κ7†6ψ8 ς3ρ@ƒ5 √2ʒ4ψ8 μ1Γ$ς3†6μ8μ1 π#κ7χ%ψ8",
    "φ4∂7ρ@Ή0 ω3κ7Ή0 Ϊ9Ή0√2ω3 ζ0κ7Ή0μ1Ή0 ω3Ή0ƒ5κ7 ƒ5Γ$ρ@Ή0√2 ∂7Ω8λ5Ψ7Ή0",
  ];

  const cipherTable = [
    { english: "A", cybertronen: "Δ1" },
    { english: "B", cybertronen: "β0" },
    { english: "C", cybertronen: "ς3" },
    { english: "D", cybertronen: "∂7" },
    { english: "E", cybertronen: "Σ2" },
    { english: "F", cybertronen: "ƒ5" },
    { english: "G", cybertronen: "ψ8" },
    { english: "H", cybertronen: "Ή0" },
    { english: "I", cybertronen: "Ϊ9" },
    { english: "J", cybertronen: "ʒ4" },
    { english: "K", cybertronen: "κ7" },
    { english: "L", cybertronen: "λ5" },
    { english: "M", cybertronen: "μ8" },
    { english: "N", cybertronen: "π#" },
    { english: "O", cybertronen: "Ω8" },
    { english: "P", cybertronen: "ρ@" },
    { english: "Q", cybertronen: "φ4" },
    { english: "R", cybertronen: "Γ$" },
    { english: "S", cybertronen: "Ϟ9" },
    { english: "T", cybertronen: "†6" },
    { english: "U", cybertronen: "μ1" },
    { english: "V", cybertronen: "√2" },
    { english: "W", cybertronen: "ω3" },
    { english: "X", cybertronen: "χ%" },
    { english: "Y", cybertronen: "Ψ7" },
    { english: "Z", cybertronen: "ζ0" },
  ];

  const handlePanelInputKeyDown = (e) => {
    if (e.key === "Enter") {
      setShowTable(true);
    }
  };

  const handleSubmit = async () => {
    if (!answer.trim()) {
      toast.error("Please enter your decoded answer first!");
      return;
    }
    console.log("Submitting answer:", user);
    setIsLoading(true);
    try {
      const res = await fetch(
        `${import.meta.env.VITE_DEV_ENDPOINT}/api/submit/ans`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            ans: answer,
            level: parseInt(1),
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) throw new Error(data.err || "Submission failed!");
      if (data.correct) {
        toast.success("Correct! Level unlocked.");
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
      } else {
        toast.error("Incorrect answer. Try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 relative overflow-hidden">
      <MatrixRain />
      <Navbar />
      <div
        className="fixed inset-0 opacity-10 bg-center bg-no-repeat bg-contain"
        style={{ backgroundImage: `url(${cicadaBg})`, zIndex: 1 }}
      />
      <div className="relative z-10 pt-32 px-4 pb-12">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-5xl font-bold text-green-400 font-mono tracking-wider">
              LEVEL 1
            </h1>
            <Button
              onClick={() => navigate("/play")}
              variant="outline"
              className="border-green-500/50 text-green-400 hover:bg-green-500/10 font-mono"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              LEVELS
            </Button>
          </div>

          <div className="space-y-8">
            <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-lg border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-400 mb-3 font-mono">
                &gt; MISSION BRIEFING
              </h2>
              <p className="text-green-300/80 font-mono leading-relaxed">
                Decode the encrypted message to proceed to the next level. Only
                those with exceptional intelligence will succeed.
              </p>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-lg border-l-4 border-green-600">
              <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                &gt; ENCRYPTED DATA
              </h2>
              <div className="bg-gray-950 p-6 rounded font-mono text-base text-green-400 leading-loose space-y-3 border border-green-900">
                {cipherLines.map((line, i) => (
                  <p key={i} className="tracking-wide">
                    {line}
                  </p>
                ))}
              </div>
            </div>

            <div className="bg-gray-900/40 backdrop-blur-sm p-6 rounded-lg border-l-4 border-green-500">
              <h2 className="text-2xl font-bold text-green-400 mb-4 font-mono">
                &gt; DECODE
              </h2>
              <input
                type="text"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
                placeholder="Enter decoded message..."
                className="w-full bg-gray-950 border border-green-900 text-green-400 px-4 py-3 rounded font-mono focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all placeholder:text-green-800"
              />
              <Button
                disabled={isLoading}
                onClick={handleSubmit}
                className="w-full mt-4 bg-green-500 hover:bg-green-600 text-black font-bold py-3 rounded-lg font-mono transition-all"
              >
                {isLoading ? "Submitting..." : "SUBMIT"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`fixed top-0 right-0 h-full bg-gray-900/95 backdrop-blur-md border-l border-green-500/30 transition-transform duration-300 ease-in-out z-50 ${
          isPanelOpen ? "translate-x-0" : "translate-x-full"
        } w-96`}
      >
        <div
          className="p-6 h-full overflow-y-auto"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          <h3 className="text-xl font-bold text-green-400 mb-4 font-mono">
            CIPHER KEY
          </h3>

          <input
            type="text"
            placeholder="Type anything and press Enter..."
            value={panelInput}
            onChange={(e) => setPanelInput(e.target.value)}
            onKeyDown={handlePanelInputKeyDown}
            className="w-full bg-gray-950 border border-green-900 text-green-400 px-4 py-2 rounded font-mono focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 mb-6 placeholder:text-green-800"
          />

          {showTable && (
            <div className="animate-fade-in">
              <table className="w-full border border-green-900">
                <thead>
                  <tr className="bg-green-500/10">
                    <th className="border border-green-900 px-3 py-2 text-left font-mono text-green-400">
                      English
                    </th>
                    <th className="border border-green-900 px-3 py-2 text-left font-mono text-green-400">
                      Cybertronen
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {cipherTable.map((row, idx) => (
                    <tr
                      key={idx}
                      className="hover:bg-green-500/5 transition-colors"
                    >
                      <td className="border border-green-900 px-3 py-2 font-mono text-green-400">
                        {row.english}
                      </td>
                      <td className="border border-green-900 px-3 py-2 font-mono text-green-500">
                        {row.cybertronen}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsPanelOpen(!isPanelOpen)}
        className={`fixed bottom-0 -translate-y-1/2 bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm border border-green-500/50 text-green-400 p-3 transition-all duration-300 z-40 ${
          isPanelOpen ? "right-96" : "right-0"
        } rounded-l-lg`}
      >
        {isPanelOpen ? (
          <ChevronRight className="h-6 w-6" />
        ) : (
          <ChevronLeft className="h-6 w-6" />
        )}
      </button>
    </div>
  );
};

export default Level1;
