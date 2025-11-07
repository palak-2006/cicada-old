import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { useUserStore } from "../store/user";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

const AuthModal = ({ isOpen, onClose, mode, onToggleMode }) => {
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUserStore();
  const [teamName, setTeamName] = useState("");
  const [leaderName, setLeaderName] = useState("");
  const [leaderEmail, setLeaderEmail] = useState("");
  const [member1Name, setMember1Name] = useState("");
  const [member1Email, setMember1Email] = useState("");
  const [member2Name, setMember2Name] = useState("");
  const [member2Email, setMember2Email] = useState("");

  const [countdown, setCountdown] = useState(null);
  const [isCounting, setIsCounting] = useState(false);

  const handleSubmit = async () => {
    setError("");

    if (mode === "signin") {
      try {
        const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/team/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ leader_email: email, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.err || "Login failed");
        localStorage.setItem("Team", JSON.stringify(data.team));
        setUser(data.team);
        toast.success("Logged in successfully!");
        navigate("/play");
        onClose();
      } catch (err) {
        setError(err.message || "Login failed. Please try again.");
      }
    } else {
      const juetPattern = /^[^@]+@juetguna\.in$/i;
      if (
        !juetPattern.test(leaderEmail) ||
        !juetPattern.test(member1Email) ||
        !juetPattern.test(member2Email)
      ) {
        setError("All emails must end with @juetguna.in");
        return;
      }

      if (
        !teamName ||
        !leaderName ||
        !leaderEmail ||
        !member1Name ||
        !member1Email ||
        !member2Name ||
        !member2Email ||
        !password
      ) {
        setError("Please fill out all required fields.");
        return;
      }

      try {
        const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/team/signup`, {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            team_name: teamName,
            leader_name: leaderName,
            leader_email: leaderEmail,
            member1_name: member1Name,
            member1_email: member1Email,
            member2_name: member2Name,
            member2_email: member2Email,
            password,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.err || "Signup failed");
        localStorage.setItem("Team", JSON.stringify(data.team));
        setUser(data.team);
        toast.success("Welcome aboard! Team registered successfully.");
        navigate("/play");
        onClose();
      } catch (err) {
        setError(err.message || "Signup failed. Please try again.");
      }
    }
  };

  const startCountdown = (e) => {
    e.preventDefault();
    if (isCounting) return;

    setIsCounting(true);
    let counter = 5;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(null);
        setIsCounting(false);
        handleSubmit();
      }
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-xl bg-gray-900 border-green-500/50 shadow-2xl max-h-[85vh] overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-gray-800 [&::-webkit-scrollbar-thumb]:bg-green-500/50 [&::-webkit-scrollbar-thumb]:rounded-full hover:[&::-webkit-scrollbar-thumb]:bg-green-500/70 [&>button]:text-green-400 [&>button]:hover:text-green-300 [&>button]:hover:bg-green-500/10">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-mono text-center text-green-400">
            {mode === "signin" ? "Decode Access" : "Join the Hunt"}
          </DialogTitle>
          <DialogDescription className="text-center text-gray-400">
            {mode === "signin"
              ? "Enter your credentials to continue"
              : "Register your team to start solving mysteries"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={startCountdown} className="space-y-6 mt-4">
          {mode === "signin" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-green-400">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="solver@cicada.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-green-400">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                  required
                />
              </div>
            </>
          ) : (
            <>
              {/* Team Name and Password */}
              <div className="flex justify-center">
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400 font-semibold">
                      Team Name
                    </Label>
                    <Input
                      placeholder="The Enigmas"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400 font-semibold">
                      Password
                    </Label>
                    <Input
                      placeholder="Enter Password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Leader Section */}
              <div className="space-y-3">
                <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wide border-b border-green-500/30 pb-2">
                  Team Leader
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Name</Label>
                    <Input
                      placeholder="Alice"
                      value={leaderName}
                      onChange={(e) => setLeaderName(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Email (JUET)</Label>
                    <Input
                      type="email"
                      placeholder="alice@juetguna.in"
                      value={leaderEmail}
                      onChange={(e) => setLeaderEmail(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Member 1 Section */}
              <div className="space-y-3">
                <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wide border-b border-green-500/30 pb-2">
                  Member 1
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Name</Label>
                    <Input
                      placeholder="Bob"
                      value={member1Name}
                      onChange={(e) => setMember1Name(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Email (JUET)</Label>
                    <Input
                      type="email"
                      placeholder="bob@juetguna.in"
                      value={member1Email}
                      onChange={(e) => setMember1Email(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Member 2 Section */}
              <div className="space-y-3">
                <h3 className="text-green-400 font-semibold text-sm uppercase tracking-wide border-b border-green-500/30 pb-2">
                  Member 2
                </h3>
                <div className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Name</Label>
                    <Input
                      placeholder="Charlie"
                      value={member2Name}
                      onChange={(e) => setMember2Name(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <Label className="text-green-400">Email (JUET)</Label>
                    <Input
                      type="email"
                      placeholder="charlie@juetguna.in"
                      value={member2Email}
                      onChange={(e) => setMember2Email(e.target.value)}
                      className="bg-gray-800 border-green-500/50 focus:border-green-500 text-green-400 placeholder:text-gray-600 transition-all"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {error && (
            <p className="text-red-500 text-sm font-medium text-center -mt-2">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={isCounting}
            className={`w-full bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 ${
              isCounting ? "opacity-80 cursor-wait" : ""
            }`}
          >
            {countdown
              ? `Processing in ${countdown}...`
              : mode === "signin"
              ? "Sign In"
              : "Register Team"}
          </Button>

          <div className="text-center text-sm text-gray-400">
            {mode === "signin" ? (
              <>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-green-400 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already registered?{" "}
                <button
                  type="button"
                  onClick={onToggleMode}
                  className="text-green-400 hover:underline font-semibold bg-transparent border-none cursor-pointer"
                >
                  Sign in
                </button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;
