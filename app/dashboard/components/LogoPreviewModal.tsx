import React from "react";
import Image from "next/image";
import { X } from "lucide-react";

type LogoPreviewModalProps = {
  logoUrl: string | null;
  onClose: () => void;
};

export default function LogoPreviewModal({
  logoUrl,
  onClose,
}: LogoPreviewModalProps) {
  if (!logoUrl) return null;

  return (
    <div
      className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 bg-black/50 rounded-full p-2 transition-colors"
        aria-label="Close preview"
      >
        <X className="w-6 h-6" />
      </button>
      <Image
        src={logoUrl}
        alt="Full size logo"
        width={600}
        height={600}
        className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}