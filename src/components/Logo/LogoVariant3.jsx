import React from "react";
import styles from "./Logo.module.css";

const LogoVariant3 = ({ className, size = "medium", light = false }) => {
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
          <linearGradient
            id="tableGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop
              offset="0%"
              style={{ stopColor: "#228B22", stopOpacity: 1 }}
            />
            <stop
              offset="100%"
              style={{ stopColor: "#006400", stopOpacity: 1 }}
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
        </defs>

        {/* Більярдний стіл */}
        <g className={styles.tableGroup}>
          {/* Основа столу */}
          <rect
            x="15"
            y="25"
            width="50"
            height="30"
            rx="3"
            fill="#8B4513"
            className={styles.tableBase}
          />

          {/* Сукно столу */}
          <rect
            x="18"
            y="28"
            width="44"
            height="24"
            rx="2"
            fill="url(#tableGradient)"
            className={styles.tableFelt}
          />

          {/* Лузи */}
          <circle cx="18" cy="28" r="3" fill="#000" className={styles.pocket} />
          <circle cx="62" cy="28" r="3" fill="#000" className={styles.pocket} />
          <circle cx="18" cy="52" r="3" fill="#000" className={styles.pocket} />
          <circle cx="62" cy="52" r="3" fill="#000" className={styles.pocket} />
          <circle cx="40" cy="28" r="2" fill="#000" className={styles.pocket} />
          <circle cx="40" cy="52" r="2" fill="#000" className={styles.pocket} />

          {/* Білі кулі */}
          <circle
            cx="30"
            cy="40"
            r="2"
            fill="#FFF"
            className={styles.whiteBall}
          />
          <circle
            cx="50"
            cy="40"
            r="2"
            fill="#FFF"
            className={styles.whiteBall}
          />
        </g>

        {/* Текст "Більярд" */}
        <text
          x="85"
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
          x="85"
          y="55"
          className={styles.logoText}
          fill="url(#textGradient)"
          fontSize="18"
          fontWeight="500"
          fontFamily="Arial, sans-serif"
        >
          Сервіс
        </text>

        {/* Декоративна рамка */}
        <rect
          x="80"
          y="15"
          width="200"
          height="50"
          rx="8"
          fill="none"
          stroke="url(#textGradient)"
          strokeWidth="2"
          strokeDasharray="10,5"
          className={styles.decorativeFrame}
        />
      </svg>
    </div>
  );
};

export default LogoVariant3;
