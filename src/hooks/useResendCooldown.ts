import { useCallback, useEffect, useRef, useState } from 'react';

export function useResendCooldown(seconds = 45) {
  const [remaining, setRemaining] = useState(0);
  const timerRef = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => stop, [stop]);

  const start = useCallback(() => {
    stop();
    setRemaining(seconds);
    timerRef.current = window.setInterval(() => {
      setRemaining((value) => {
        if (value <= 1) {
          stop();
          return 0;
        }
        return value - 1;
      });
    }, 1000);
  }, [seconds, stop]);

  return { remaining, start, ready: remaining === 0 };
}