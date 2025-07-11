import React from "react";

const LogoCustom = ({ className = "", width = 420, height = 180 }) => (
  <svg
    className={className}
    width={width}
    height={height}
    viewBox="0 0 420 180"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ display: "block", maxWidth: "100%", height: "auto" }}
  >
    {/* Трикутник */}
    <polygon
      points="60,120 120,40 180,120"
      fill="none"
      stroke="#222"
      strokeWidth="6"
      strokeLinejoin="round"
    />
    {/* Зелений шар */}
    <circle
      cx="120"
      cy="110"
      r="13"
      fill="#1abc3a"
      stroke="#222"
      strokeWidth="4"
    />
    <ellipse cx="120" cy="120" rx="13" ry="4" fill="#000" opacity="0.18" />
    {/* Кий */}
    <rect
      x="60"
      y="85"
      width="300"
      height="8"
      rx="4"
      fill="#fff"
      stroke="#222"
      strokeWidth="4"
    />
    {/* Наконечник кия */}
    <rect
      x="355"
      y="86.5"
      width="20"
      height="5"
      rx="2.5"
      fill="#bbb"
      stroke="#222"
      strokeWidth="2"
    />
    {/* Тінь від кия */}
    <rect
      x="60"
      y="93"
      width="315"
      height="3"
      rx="1.5"
      fill="#000"
      opacity="0.13"
    />
    {/* Текст Більярд */}
    <text
      x="210"
      y="70"
      textAnchor="middle"
      fontFamily="Montserrat, Arial, sans-serif"
      fontWeight="900"
      fontSize="54"
      fill="#FFD600"
      stroke="#222"
      strokeWidth="3"
      letterSpacing="7"
      style={{ textTransform: "uppercase" }}
    >
      Більярд
    </text>
    {/* Текст сервіс */}
    <text
      x="210"
      y="160"
      textAnchor="middle"
      fontFamily="Montserrat, Arial, sans-serif"
      fontWeight="900"
      fontSize="44"
      fill="#FFD600"
      stroke="#222"
      strokeWidth="3"
      letterSpacing="7"
      style={{ textTransform: "uppercase" }}
    >
      сервіс
    </text>
  </svg>
);

export default LogoCustom;
