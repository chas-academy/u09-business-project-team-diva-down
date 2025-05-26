import React, {useEffect, useRef, useState} from "react";
// import css for the countdown

interface CountdownProps {
    duration?: number;
    size?: string;
    color1?: string;
    color2?: string;
    onTimeUpdate?: (remaingTime: number) => void;
}

const Countdown: React.FC<CountdownProps> = ({
  duration = 30,
  size = '3em',
  color1 = '#00ccff',
  color2 = 'hotpink',
  onTimeUpdate,
}) => {
  const countdownRef = useRef<HTMLDivElement>(null);
  const [remainingTime, setRemainingTime] = useState(duration);

  useEffect(() => {
    // Set CSS custom properties when component mounts
    if (countdownRef.current) {
      countdownRef.current.style.setProperty('--t-initial', duration.toString());
      countdownRef.current.style.setProperty('--d', size);
      countdownRef.current.style.setProperty('--t', duration.toString());
      countdownRef.current.style.setProperty('--c1', color1);
      countdownRef.current.style.setProperty('--c2', color2);
    }

    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1;
        if (onTimeUpdate) onTimeUpdate(newTime); // Notify parent
        if (newTime <= 0) clearInterval(timer);
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer); // Cleanup

  }, [duration, size, color1, color2, onTimeUpdate]);

  return (
    <>
        <div className="countdown" ref={countdownRef}>
        <svg viewBox="-50 -50 100 100" strokeWidth="10">
            <circle r="45" />
            <circle r="45" pathLength="1" />
        </svg>
        </div>
    </>
  );
};

export default Countdown;