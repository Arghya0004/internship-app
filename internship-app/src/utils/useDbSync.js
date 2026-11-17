import { useEffect, useState } from "react";

export default function useDbSync(ms = 2000) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((t) => t + 1);
    window.addEventListener("storage", bump);   // onno tab theke change
    window.addEventListener("db-change", bump); // same tab theke change
    const timer = setInterval(bump, ms);
    return () => {
      window.removeEventListener("storage", bump);
      window.removeEventListener("db-change", bump);
      clearInterval(timer);
    };
  }, [ms]);

  return tick;
}

