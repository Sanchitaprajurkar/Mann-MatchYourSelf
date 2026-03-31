import { Flag, ThumbsDown, ThumbsUp } from "lucide-react";
import { useState } from "react";
import type { Review } from "../../types/review.types";
import StarRating from "./StarRating";

interface ReviewCardProps {
  review: Review;
  onVote: (reviewId: string, vote: "up" | "down") => Promise<void>;
  onReport: (reviewId: string) => Promise<void>;
  onOpenLightbox: (images: Review["images"], index: number) => void;
}

const getInitials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

export default function ReviewCard({
  review,
  onVote,
  onReport,
  onOpenLightbox,
}: ReviewCardProps) {
  const [expanded, setExpanded] = useState(false);
  const shouldCollapse = review.body.length > 220;

  return (
    <article className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md transition hover:shadow-lg">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--color-primary)]/10 text-sm font-semibold text-[var(--color-primary)]">
            {getInitials(review.userName)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-semibold text-[var(--color-text)]">
                {review.userName}
              </h3>
              {review.isVerifiedPurchase && (
                <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
                  Verified Purchase
                </span>
              )}
            </div>
            <p className="mt-1 text-xs text-[var(--color-muted)]">
              {new Date(review.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        <StarRating value={review.rating} />
      </div>

      <div className="mt-5 space-y-3">
        <h4 className="text-lg font-semibold text-[var(--color-text)]">
          {review.title}
        </h4>
        <p className="text-sm leading-7 text-[var(--color-text)]/80">
          {shouldCollapse && !expanded
            ? `${review.body.slice(0, 220)}...`
            : review.body}
        </p>
        {shouldCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((current) => !current)}
            className="text-sm font-medium text-[var(--color-accent)] transition hover:opacity-80"
          >
            {expanded ? "Read less" : "Read more"}
          </button>
        )}
      </div>

      {(review.pros.length > 0 || review.cons.length > 0) && (
        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="flex flex-wrap gap-2">
            {review.pros.map((pro) => (
              <span
                key={`${review._id}-pro-${pro}`}
                className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300"
              >
                Pro: {pro}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap gap-2">
            {review.cons.map((con) => (
              <span
                key={`${review._id}-con-${con}`}
                className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-xs text-rose-700 dark:border-rose-500/30 dark:bg-rose-500/10 dark:text-rose-300"
              >
                Con: {con}
              </span>
            ))}
          </div>
        </div>
      )}

      {review.images.length > 0 && (
        <div className="mt-5 flex gap-3 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <button
              key={image.publicId}
              type="button"
              onClick={() => onOpenLightbox(review.images, index)}
              className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-[var(--color-border)]"
            >
              <img
                src={image.url}
                alt={`${review.title} ${index + 1}`}
                className="h-full w-full object-cover transition duration-200 hover:scale-105"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      <div className="mt-6 flex flex-col gap-3 border-t border-[var(--color-border)] pt-5 text-sm md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[var(--color-muted)]">
            Was this review helpful?
          </span>
          <button
            type="button"
            onClick={() => onVote(review._id, "up")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition ${
              review.viewerVote === "up"
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
            }`}
          >
            <ThumbsUp size={14} />
            Yes ({review.helpfulVotes.up})
          </button>
          <button
            type="button"
            onClick={() => onVote(review._id, "down")}
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 transition ${
              review.viewerVote === "down"
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                : "border-[var(--color-border)] text-[var(--color-text)] hover:border-[var(--color-accent)]"
            }`}
          >
            <ThumbsDown size={14} />
            No ({review.helpfulVotes.down})
          </button>
        </div>

        <button
          type="button"
          onClick={() => onReport(review._id)}
          className="inline-flex items-center gap-2 text-sm text-[var(--color-muted)] transition hover:text-[var(--color-accent)]"
        >
          <Flag size={14} />
          Report review
        </button>
      </div>
    </article>
  );
}
