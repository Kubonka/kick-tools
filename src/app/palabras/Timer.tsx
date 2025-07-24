"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  trigger: { type: "start" | "stop" | "reset"; id: number } | null;
  onTimeFinished: (time: number) => void;
};
export default function Timer({ trigger, onTimeFinished }: Props) {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!trigger) return;

    switch (trigger.type) {
      case "start":
        startTimer();
        break;
      case "stop":
        stopTimer();
        break;
      case "reset":
        resetTimer();
        break;
    }
  }, [trigger?.id]);
  const startTimer = () => {
    if (!isRunning) {
      setIsRunning(true);
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
  };

  const stopTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setIsRunning(false);
    onTimeFinished(seconds);
  };

  const resetTimer = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setSeconds(0);
    setIsRunning(false);
  };

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const formatTime = (secs: number) => {
    const minutes = Math.floor(secs / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (secs % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return <p className="text-2xl font-semibold">{formatTime(seconds)}</p>;
}

// {/* <div className="flex justify-center gap-4">
//         <button onClick={handleStart} className="bg-green-500 text-white px-4 py-2 rounded">
//           Start
//         </button>
//         <button onClick={handleStopAndSubmit} className="bg-blue-500 text-white px-4 py-2 rounded">
//           Stop & Submit
//         </button>
//         <button onClick={handleReset} className="bg-red-500 text-white px-4 py-2 rounded">
//           Reset
//         </button>
//       </div> */}
