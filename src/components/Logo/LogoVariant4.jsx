import React from "react";
import styles from "./Logo.module.css";

const LogoVariant4 = ({ className, size = "medium", light = false }) => {
  return (
    <div
      className={`${styles.logo} ${styles[size]} ${light ? styles.light : ""} ${
        className || ""
      }`}
    >
      <svg
        viewBox="0 0 300 80"
        xmlns="http://www.w3.org/2000/svg"
        className={styles.logoSvg}
      >
        {/* Градієнти */}
        <defs>
          <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{
                stopColor: light ? "#115e59" : "#115e59",
                stopOpacity: 1,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor: light ? "#134e4a" : "#134e4a",
                stopOpacity: 1,
              }}
            />
          </linearGradient>
          <linearGradient
            id="accentGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#FFD700", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#FFA500", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Фоновий прямокутник */}
        <rect
          x="10"
          y="15"
          width="280"
          height="50"
          rx="25"
          fill="none"
          stroke="url(#textGradient)"
          strokeWidth="2"
          className={styles.backgroundRect}
        />

        {/* Текст "Більярд" */}
        <text
          x="150"
          y="35"
          textAnchor="middle"
          className={styles.logoText}
          fill="url(#textGradient)"
          fontSize="28"
          fontWeight="800"
          fontFamily="Georgia, serif"
          letterSpacing="2"
        >
          БІЛЬЯРД
        </text>

        {/* Текст "Сервіс" */}
        <text
          x="150"
          y="55"
          textAnchor="middle"
          className={styles.logoText}
          fill="url(#accentGradient)"
          fontSize="16"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
          letterSpacing="1"
        >
          СЕРВІС
        </text>

        {/* Декоративні елементи */}
        <circle
          cx="25"
          cy="40"
          r="3"
          fill="url(#accentGradient)"
          className={styles.decorativeDot}
        />
        <circle
          cx="275"
          cy="40"
          r="3"
          fill="url(#accentGradient)"
          className={styles.decorativeDot}
        />

        {/* Лінії */}
        <line
          x1="40"
          y1="40"
          x2="60"
          y2="40"
          stroke="url(#accentGradient)"
          strokeWidth="1"
          className={styles.decorativeLine}
        />
        <line
          x1="240"
          y1="40"
          x2="260"
          y2="40"
          stroke="url(#accentGradient)"
          strokeWidth="1"
          className={styles.decorativeLine}
        />
      </svg>
    </div>
  );
};

export default LogoVariant4;
