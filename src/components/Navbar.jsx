import { toast } from "sonner";
import { useState } from "react";
import AuthModal from "./AuthModal.jsx";
import { Button } from "./ui/button.jsx";
import { useUserStore } from "../store/user.js";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [countdown, setCountdown] = useState(null);
  const { user, setUser } = useUserStore();
  const navigate = useNavigate();

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_DEV_ENDPOINT}/api/team/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.err || "Logout failed");

      if (setUser) setUser(null);

      toast.success("You’ve been successfully logged out.");
      localStorage.removeItem("Team");
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Logout failed. Please try again.");
    }
  };

  // Countdown before logout
  const startLogoutCountdown = () => {
    let counter = 5;
    setCountdown(counter);

    const interval = setInterval(() => {
      counter -= 1;
      if (counter > 0) {
        setCountdown(counter);
      } else {
        clearInterval(interval);
        setCountdown(null);
        handleLogout(); // finally log out
      }
    }, 1000);
  };

  return (
    <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-green-500/50 rounded-2xl px-6 py-4 shadow-2xl shadow-green-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className="text-2xl font-bold font-mono tracking-wider text-green-400 cursor-pointer select-none"
                onClick={() => navigate("/")}
              >
                CICADA
              </span>
            </div>

            <div className="flex items-center gap-3">
              {user && location.pathname !== "/play" && (
                <Button
                  variant="ghost"
                  className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-300"
                  onClick={() => navigate("/play")}
                >
                  Play
                </Button>
              )}

              {!user ? (
                <Button
                  className="bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
                  onClick={() => openAuth("signup")}
                >
                  Sign Up
                </Button>
              ) : (
                <Button
                  disabled={countdown !== null}
                  className={`bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300 ${
                    countdown ? "opacity-80 cursor-wait" : ""
                  }`}
                  onClick={startLogoutCountdown}
                >
                  {countdown ? `Logging out in ${countdown}...` : "Logout"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onToggleMode={() =>
          setAuthMode(authMode === "signin" ? "signup" : "signin")
        }
      />
    </>
  );
};

export default Navbar;
