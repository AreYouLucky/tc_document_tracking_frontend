import { useEffect, useState } from "react";

export const useIdle = (timeout: number = 60000) => {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    const resetTimer = () => {
      clearTimeout(timer);
      setIsIdle(false);
      timer = setTimeout(() => setIsIdle(true), timeout);
    };

    const events = ["mousemove", "mousedown", "keydown", "scroll", "touchstart"];

    events.forEach((event) => window.addEventListener(event, resetTimer));

    resetTimer(); // start timer

    return () => {
      clearTimeout(timer);
      events.forEach((event) =>
        window.removeEventListener(event, resetTimer)
      );
    };
  }, [timeout]);

  return isIdle;
};