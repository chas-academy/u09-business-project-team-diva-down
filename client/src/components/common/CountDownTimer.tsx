import React, {useEffect, useRef} from "react";
// import css for the countdown

interface CountdownProps {
    duration?: number;
    size?: string;
    color1?: string;
    color2?: string;
}

const Countdown: React.FC<CountdownProps> = ({
  duration = 30,
  size = '3em',
  color1 = '#00ccff',
  color2 = 'hotpink',
}) => {
  const countdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Set CSS custom properties when component mounts
    if (countdownRef.current) {
      countdownRef.current.style.setProperty('--t-initial', duration.toString());
      countdownRef.current.style.setProperty('--d', size);
      countdownRef.current.style.setProperty('--t', duration.toString());
      countdownRef.current.style.setProperty('--c1', color1);
      countdownRef.current.style.setProperty('--c2', color2);
    }
  }, [duration, size, color1, color2]);

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