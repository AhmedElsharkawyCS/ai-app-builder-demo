import { useState, useEffect, useRef } from 'react';

interface UseCountdownOptions {
  seconds: number;
  onComplete: () => void;
}

export function useCountdown({ seconds, onComplete }: UseCountdownOptions) {
  const [countdown, setCountdown] = useState(seconds);
  const countdownRef = useRef(seconds);

  useEffect(() => {
    countdownRef.current = seconds;
    setCountdown(seconds);

    const interval = setInterval(() => {
      countdownRef.current -= 1;
      if (countdownRef.current <= 0) {
        onComplete();
        countdownRef.current = seconds;
        setCountdown(seconds);
      } else {
        setCountdown(countdownRef.current);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [seconds, onComplete]);

  return countdown;
}
