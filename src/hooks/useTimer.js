import { useState, useEffect, useRef } from 'react';

export function useTimer(initialMinutes = 10) {
  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setIsRunning(false);
            setIsComplete(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const start = () => { setIsRunning(true); setIsComplete(false); };
  const pause = () => setIsRunning(false);
  const reset = () => {
    setIsRunning(false);
    setIsComplete(false);
    setTimeLeft(initialMinutes * 60);
  };

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');
  const progress = 1 - timeLeft / (initialMinutes * 60);

  return { minutes, seconds, progress, isRunning, isComplete, start, pause, reset };
}
