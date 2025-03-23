"use client";
import '../style/UploadIcon.css'; // Import the CSS file

interface UploadIconProps {
  onClick: () => void; // Function to handle click events
}

export default function UploadIcon({ onClick }: UploadIconProps) {
  return (
    <button className="uploadIcon" onClick={onClick} aria-label="Upload file">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="uploadIconSvg"
      >
        {/* Upload icon */}
        <path d="M19 13v5a2 2 0 01-2 2H7a2 2 0 01-2-2v-5" />
        <path d="M12 15V3" />
        <path d="M8 7l4-4 4 4" />
      </svg>
    </button>
  );
};
