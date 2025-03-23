"use client";

import { useState } from "react";
import style from "../style/AsideIcon.module.css";

interface AsideIconProps {
  onClick: () => void; // Function to toggle the aside panel
  isAsideOpen: boolean; // Whether the aside panel is open
}

export default function AsideIcon({ onClick, isAsideOpen }: AsideIconProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <button
      className={`${style.asideIcon} ${isAsideOpen ? style.open : ""}`}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      aria-label="Toggle aside panel"
    >
      <div className={style.bar} />
      <div className={style.bar} />
      <div className={style.bar} />
    </button>
  );
}