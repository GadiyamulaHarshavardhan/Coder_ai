"use client";

import React, { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";

interface CopyButtonProps {
  textToCopy: string;
}

export default function CopyButton({ textToCopy }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1 rounded hover:bg-gray-600 transition-colors"
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? (
        <CheckIcon className="w-4 h-4 text-green-400" />
      ) : (
        <CopyIcon className="w-4 h-4 text-gray-300" />
      )}
    </button>
  );
}