import React, { useEffect, useState, useRef } from "react";
import { Text, StyleProp, TextStyle } from "react-native";

interface CountdownProps {
  targetTime: string;
  style?: StyleProp<TextStyle>;
  dangerColor?: string;
  onComplete?: () => void;
}

const formatRemainingTime = (ms: number): string => {
  if (ms <= 0) return "00:00:00";

  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600)
    .toString()
    .padStart(2, "0");
  const minutes = Math.floor((totalSeconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");

  return `${hours}:${minutes}:${seconds}`;
};

const Countdown: React.FC<CountdownProps> = ({
  targetTime,
  style,
  dangerColor = "#FF3B30",
  onComplete,
}) => {
  const [remaining, setRemaining] = useState(
    new Date(targetTime).getTime() - Date.now()
  );
  const hasCalledComplete = useRef(false); // 防止重复调用

  useEffect(() => {
    const timer = setInterval(() => {
      const delta = new Date(targetTime).getTime() - Date.now();
      setRemaining(delta);

      if (delta <= 0 && !hasCalledComplete.current) {
        hasCalledComplete.current = true;
        clearInterval(timer);
        onComplete?.(); // 触发刷新逻辑
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetTime, onComplete]);

  const totalSeconds = Math.floor(remaining / 1000);
  const isDanger = totalSeconds <= 30 && totalSeconds > 0;

  return (
    <Text style={[style, isDanger && { color: dangerColor }]}>
      {formatRemainingTime(remaining)}
    </Text>
  );
};

export default Countdown;
