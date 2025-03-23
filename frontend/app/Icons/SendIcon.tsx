"use client";
import '../style/SendIcon.css'; // Correct import path

interface SendIconProps {
  onClick: () => void; // Function to handle click events
}

export default function SendIcon({ onClick }: SendIconProps) {
  return (
    <button className="sendIcon" onClick={onClick}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="sendIconSvg"
      >
        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
      </svg>
    </button>
  );
}