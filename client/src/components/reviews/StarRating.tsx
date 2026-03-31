import { Star } from "lucide-react";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  onHoverChange?: (value: number) => void;
  interactive?: boolean;
  size?: number;
  className?: string;
}

export default function StarRating({
  value,
  onChange,
  onHoverChange,
  interactive = false,
  size = 18,
  className = "",
}: StarRatingProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {Array.from({ length: 5 }, (_, index) => {
        const starValue = index + 1;
        const filled = starValue <= value;
        const commonClass =
          "transition-transform duration-200 ease-in-out hover:scale-110";

        if (interactive && onChange) {
          return (
            <button
              key={starValue}
              type="button"
              aria-label={`Rate ${starValue} star${starValue > 1 ? "s" : ""}`}
              className={commonClass}
              onClick={() => onChange(starValue)}
              onMouseEnter={() => onHoverChange?.(starValue)}
              onMouseLeave={() => onHoverChange?.(0)}
            >
              <Star
                size={size}
                className={filled ? "fill-[#FFD700] text-[#FFD700]" : "text-[#E0E0E0]"}
              />
            </button>
          );
        }

        return (
          <Star
            key={starValue}
            size={size}
            className={filled ? "fill-[#FFD700] text-[#FFD700]" : "text-[#E0E0E0]"}
          />
        );
      })}
    </div>
  );
}
