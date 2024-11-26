// components/CircularProgress.tsx
import React from "react";
import styles from "../CircularProgress.module.css";

interface CircularProgressProps {
  size?: number;
  thickness?: number;
  color?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  size = 40,
  thickness = 4,
  color = "#7AA7A5",
}) => {
  const diameter = size;
  const strokeWidth = thickness;
  const radius = diameter / 4 - strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;

  const style = {
    width: `${diameter}px`,
    height: `${diameter}px`,
    borderColor: color,
    borderWidth: `${strokeWidth}px`,
    borderTopColor: "transparent",
  };

  return (
    <div className={styles.container} style={style}>
      <svg
        className={styles.svg}
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          className={styles.circle}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          cx={diameter / 2}
          cy={diameter / 2}
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={0}  // Puedes ajustar esto para mostrar un progreso específico
        />
      </svg>
    </div>
  );
};

export default CircularProgress;
