import React from "react";
import styles from "./Logo.module.css";

const Logo = ({ className, size = "medium", light = false }) => {
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
        {/* Градієнт для фону */}
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
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
          <linearGradient id="cueGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop
              offset="0%"
              style={{ stopColor: "#8B4513", stopOpacity: 1 }}
            />
            <stop
              offset="50%"
              style={{ stopColor: "#D2691E", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#8B4513", stopOpacity: 1 }}
            />
          </linearGradient>
        </defs>

        {/* Кий */}
        <g className={styles.cueGroup}>
          {/* Тіло кия */}
          <rect
            x="20"
            y="35"
            width="60"
            height="8"
            rx="4"
            fill="url(#cueGradient)"
            className={styles.cueBody}
          />

          {/* Наконечник кия */}
          <rect
            x="80"
            y="36"
            width="15"
            height="6"
            rx="3"
            fill="#654321"
            className={styles.cueTip}
          />

          {/* Обмотка кия */}
          <rect
            x="25"
            y="37"
            width="8"
            height="6"
            rx="3"
            fill="#2F4F4F"
            className={styles.cueWrap}
          />

          {/* Деталі кия */}
          <circle
            cx="30"
            cy="40"
            r="2"
            fill="#FFD700"
            className={styles.cueDetail}
          />
        </g>

        {/* Текст "Більярд" */}
        <text
          x="110"
          y="35"
          className={styles.logoText}
          fill={light ? "#115e59" : "url(#logoGradient)"}
          fontSize="24"
          fontWeight="700"
          fontFamily="Arial, sans-serif"
        >
          Більярд
        </text>

        {/* Текст "Сервіс" */}
        <text
          x="110"
          y="55"
          className={styles.logoText}
          fill={light ? "#115e59" : "url(#logoGradient)"}
          fontSize="18"
          fontWeight="500"
          fontFamily="Arial, sans-serif"
        >
          Сервіс
        </text>

        {/* Декоративна лінія */}
        <line
          x1="110"
          y1="60"
          x2="250"
          y2="60"
          stroke={light ? "#115e59" : "url(#logoGradient)"}
          strokeWidth="2"
          className={styles.decorativeLine}
        />
      </svg>
    </div>
  );
};

export default Logo;
