import { useState } from 'react';
import AuthModal from './AuthModal.jsx';
import { Button } from './ui/button.jsx';

const Navbar = () => {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('signup');  

  const openAuth = (mode) => {
    setAuthMode(mode);
    setIsAuthOpen(true);
  };

  return (
     <>
      <nav className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-7xl">
        <div className="bg-gray-900/80 backdrop-blur-xl border border-green-500/50 rounded-2xl px-6 py-4 shadow-2xl shadow-green-500/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl font-bold font-mono tracking-wider text-green-400">
                CICADA
              </span>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                className="text-green-400 hover:text-green-300 hover:bg-green-500/10 transition-all duration-300"
                onClick={() => openAuth('signin')}
              >
                Play
              </Button>
              <Button
                className="bg-green-500 hover:bg-green-600 text-black font-semibold shadow-lg shadow-green-500/20 hover:shadow-green-500/40 transition-all duration-300"
                onClick={() => openAuth('signup')}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onToggleMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
      />
    </>
  );
};

export default Navbar;
