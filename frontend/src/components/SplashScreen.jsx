import { useEffect, useState } from "react";
import Logo from "./Logo";

function SplashScreen({ onFinish }) {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFadingOut(true), 900);
    const doneTimer = setTimeout(() => onFinish(), 1250);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(doneTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 bg-canvas flex items-center justify-center z-50 transition-opacity duration-350 ${
        fadingOut ? "opacity-0" : "opacity-100"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <Logo size="lg" showWordmark={false} />
        <span className="font-display text-teal text-2xl font-semibold tracking-tight">
          AutoLedger
        </span>
        <span className="font-body text-ink/50 text-xs uppercase tracking-widest">
          Dealership Inventory
        </span>
      </div>
    </div>
  );
}

export default SplashScreen;
