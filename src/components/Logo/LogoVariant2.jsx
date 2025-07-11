import React from "react";
import styles from "./Logo.module.css";

const LogoVariant2 = ({ className, size = "medium", light = false }) => {
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
          <linearGradient id="ballGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop
              offset="0%"
              style={{ stopColor: "#FFD700", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#FFA500", stopOpacity: 1 }}
            />
          </linearGradient>
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
          <radialGradient id="ballShadow" cx="50%" cy="50%" r="50%">
            <stop
              offset="0%"
              style={{ stopColor: "#000000", stopOpacity: 0.3 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#000000", stopOpacity: 0 }}
            />
          </radialGradient>
        </defs>

        {/* Більярдний куля */}
        <g className={styles.ballGroup}>
          <circle
            cx="40"
            cy="40"
            r="25"
            fill="url(#ballGradient)"
            className={styles.ball}
          />
          <circle
            cx="40"
            cy="40"
            r="25"
            fill="url(#ballShadow)"
            className={styles.ballShadow}
          />
          {/* Номер куля */}
          <text
            x="40"
            y="45"
            textAnchor="middle"
            fill="#000"
            fontSize="16"
            fontWeight="700"
            fontFamily="Arial, sans-serif"
            className={styles.ballNumber}
          >
            8
          </text>
        </g>

        {/* Текст "Більярд" */}
        <text
          x="80"
          y="35"
          className={styles.logoText}
          fill="url(#textGradient)"
          fontSize="24"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          Більярд
        </text>

        {/* Текст "Сервіс" */}
        <text
          x="80"
          y="55"
          className={styles.logoText}
          fill="url(#textGradient)"
          fontSize="18"
          fontWeight="500"
          fontFamily="Arial, sans-serif"
        >
          Сервіс
        </text>

        {/* Декоративні точки */}
        <circle
          cx="250"
          cy="30"
          r="3"
          fill="#115e59"
          className={styles.decorativeDot}
        />
        <circle
          cx="260"
          cy="40"
          r="2"
          fill="#115e59"
          className={styles.decorativeDot}
        />
        <circle
          cx="270"
          cy="50"
          r="2.5"
          fill="#115e59"
          className={styles.decorativeDot}
        />
      </svg>
    </div>
  );
};

export default LogoVariant2;
