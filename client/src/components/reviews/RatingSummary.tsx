import type { ReviewSummary } from "../../types/review.types";
import StarRating from "./StarRating";

interface RatingSummaryProps {
  summary: ReviewSummary;
  onWriteReview: () => void;
}

export default function RatingSummary({
  summary,
  onWriteReview,
}: RatingSummaryProps) {
  return (
    <div className="grid gap-8 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg md:grid-cols-[280px_1fr]">
      <div className="flex flex-col justify-center rounded-2xl bg-black/[0.03] p-6 dark:bg-white/[0.04]">
        <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
          Overall Rating
        </p>
        <div className="mt-4 flex items-end gap-3">
          <span className="text-5xl font-semibold text-[var(--color-text)]">
            {summary.averageRating.toFixed(1)}
          </span>
          <span className="pb-2 text-sm text-[var(--color-muted)]">
            / 5
          </span>
        </div>
        <div className="mt-4">
          <StarRating value={Math.round(summary.averageRating)} size={20} />
        </div>
        <p className="mt-3 text-sm text-[var(--color-muted)]">
          Based on {summary.totalReviews} verified customer reviews.
        </p>
        <button
          type="button"
          onClick={onWriteReview}
          className="mt-6 rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Rate this product
        </button>
      </div>

      <div className="space-y-4">
        {summary.ratingBreakdown.map((item) => (
          <div key={item.rating} className="grid grid-cols-[48px_1fr_48px] items-center gap-3">
            <span className="text-sm font-medium text-[var(--color-text)]">
              {item.rating}★
            </span>
            <div className="h-3 overflow-hidden rounded-full bg-black/[0.06] dark:bg-white/[0.08]">
              <div
                className="h-full rounded-full bg-[var(--color-accent)] transition-all duration-300"
                style={{ width: `${item.percentage}%` }}
              />
            </div>
            <span className="text-right text-sm text-[var(--color-muted)]">
              {item.count}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
