import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect } from "react";
import type { ReviewImage } from "../../types/review.types";

interface ImageLightboxProps {
  images: ReviewImage[];
  activeIndex: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}

export default function ImageLightbox({
  images,
  activeIndex,
  onClose,
  onPrev,
  onNext,
}: ImageLightboxProps) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
      if (event.key === "ArrowLeft") onPrev();
      if (event.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, onNext, onPrev]);

  const activeImage = images[activeIndex];
  if (!activeImage) return null;

  return (
    <div
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 rounded-full bg-white/10 p-2 text-white transition hover:bg-white/20"
        aria-label="Close image viewer"
      >
        <X size={20} />
      </button>

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onPrev();
        }}
        className="absolute left-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        aria-label="Previous image"
      >
        <ChevronLeft size={24} />
      </button>

      <img
        src={activeImage.url}
        alt={`Review image ${activeIndex + 1}`}
        className="max-h-[85vh] max-w-[90vw] rounded-2xl object-contain shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      />

      <button
        type="button"
        onClick={(event) => {
          event.stopPropagation();
          onNext();
        }}
        className="absolute right-5 rounded-full bg-white/10 p-3 text-white transition hover:bg-white/20"
        aria-label="Next image"
      >
        <ChevronRight size={24} />
      </button>
    </div>
  );
}
