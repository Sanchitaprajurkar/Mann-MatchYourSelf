import { Search } from "lucide-react";
import { useState } from "react";
import { useReviews } from "../../hooks/useReviews";
import type { ReviewImage, ReviewSortOption } from "../../types/review.types";
import ImageLightbox from "./ImageLightbox";
import RatingSummary from "./RatingSummary";
import ReviewCard from "./ReviewCard";
import ReviewForm from "./ReviewForm";
import ReviewToast from "./ReviewToast";

interface ReviewListProps {
  productId: string;
}

interface ToastState {
  message: string;
  tone: "success" | "error";
}

const sortOptions: { value: ReviewSortOption; label: string }[] = [
  { value: "most_recent", label: "Most Recent" },
  { value: "most_helpful", label: "Most Helpful" },
  { value: "highest_rated", label: "Highest Rated" },
  { value: "lowest_rated", label: "Lowest Rated" },
];

export default function ReviewList({ productId }: ReviewListProps) {
  const [showForm, setShowForm] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [lightbox, setLightbox] = useState<{
    images: ReviewImage[];
    index: number;
  } | null>(null);

  const {
    reviews,
    summary,
    eligibility,
    isLoading,
    isFetching,
    isEligibilityLoading,
    sortBy,
    filters,
    search,
    page,
    totalPages,
    totalResults,
    setSearch,
    setSortBy,
    setFilters,
    setPage,
    submitReview,
    voteReview,
    reportReview,
  } = useReviews(productId);

  const showToast = (message: string, tone: ToastState["tone"]) => {
    setToast({ message, tone });
  };

  const handleVote = async (reviewId: string, vote: "up" | "down") => {
    try {
      await voteReview({ reviewId, vote });
      showToast("Vote recorded.", "success");
    } catch (error) {
      showToast("Could not save your vote right now.", "error");
    }
  };

  const handleReport = async (reviewId: string) => {
    try {
      await reportReview(reviewId);
      showToast("Review reported to our team.", "success");
    } catch (error) {
      showToast("You may have already reported this review.", "error");
    }
  };

  return (
    <section className="bg-[var(--color-background)] py-16">
      <div className="mx-auto max-w-6xl px-6">
        <div className="mb-8 flex flex-col gap-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[var(--color-muted)]">
            Customer Reviews
          </p>
          <h2 className="text-3xl font-semibold text-[var(--color-text)]">
            Honest feedback from our shoppers
          </h2>
          <p className="max-w-2xl text-sm leading-7 text-[var(--color-text)]/75">
            Browse detailed ratings, helpful photos, and practical pros and cons before you decide.
          </p>
        </div>

        {summary && <RatingSummary summary={summary} onWriteReview={() => setShowForm(true)} />}

        {showForm && (
          <div className="mt-8">
            <ReviewForm
              productId={productId}
              eligibility={eligibility}
              isEligibilityLoading={isEligibilityLoading}
              onSubmitReview={async (payload) => {
                try {
                  return await submitReview(payload);
                } catch (error) {
                  showToast("Review submission failed. Please try again.", "error");
                  throw error;
                }
              }}
              onSuccess={() => {
                setShowForm(false);
                showToast("Review submitted successfully.", "success");
              }}
            />
          </div>
        )}

        <div className="mt-8 grid gap-4 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-md md:grid-cols-[1fr_180px_180px]">
          <label className="relative">
            <Search
              size={16}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-muted)]"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search review text, title, pros or cons"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-transparent py-3 pl-11 pr-4 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
            />
          </label>

          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as ReviewSortOption)}
            className="rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <div className="flex flex-wrap items-center gap-2">
            {[5, 4, 3, 2, 1].map((rating) => (
              <button
                key={rating}
                type="button"
                onClick={() =>
                  setFilters({
                    ...filters,
                    rating: filters.rating === rating ? null : rating,
                  })
                }
                className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                  filters.rating === rating
                    ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "border-[var(--color-border)] text-[var(--color-text)]"
                }`}
              >
                {rating}★
              </button>
            ))}
            <button
              type="button"
              onClick={() => setFilters({ ...filters, withPhotos: !filters.withPhotos })}
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                filters.withPhotos
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-text)]"
              }`}
            >
              With Photos
            </button>
            <button
              type="button"
              onClick={() =>
                setFilters({ ...filters, verifiedOnly: !filters.verifiedOnly })
              }
              className={`rounded-full border px-3 py-2 text-xs font-medium transition ${
                filters.verifiedOnly
                  ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "border-[var(--color-border)] text-[var(--color-text)]"
              }`}
            >
              Verified Purchase
            </button>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm text-[var(--color-muted)]">
          <span>
            {isFetching ? "Refreshing reviews..." : `${totalResults} matching reviews`}
          </span>
          {!showForm && (
            <button
              type="button"
              onClick={() => setShowForm(true)}
              className="font-medium text-[var(--color-accent)] transition hover:opacity-80"
            >
              Write a review
            </button>
          )}
        </div>

        <div className="mt-8 space-y-5">
          {isLoading &&
            Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md"
              >
                <div className="h-4 w-40 rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-4 h-4 w-56 rounded bg-black/10 dark:bg-white/10" />
                <div className="mt-4 space-y-2">
                  <div className="h-3 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-3 rounded bg-black/10 dark:bg-white/10" />
                  <div className="h-3 w-4/5 rounded bg-black/10 dark:bg-white/10" />
                </div>
              </div>
            ))}

          {!isLoading && reviews.length === 0 && (
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center shadow-md">
              <p className="text-lg font-medium text-[var(--color-text)]">
                No reviews match these filters yet.
              </p>
              <p className="mt-2 text-sm text-[var(--color-muted)]">
                Try a different rating filter or be the first to share a review.
              </p>
            </div>
          )}

          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onVote={handleVote}
              onReport={handleReport}
              onOpenLightbox={(images, index) => setLightbox({ images, index })}
            />
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, index) => {
              const nextPage = index + 1;
              return (
                <button
                  key={nextPage}
                  type="button"
                  onClick={() => setPage(nextPage)}
                  className={`h-10 w-10 rounded-full border text-sm transition ${
                    page === nextPage
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : "border-[var(--color-border)] text-[var(--color-text)]"
                  }`}
                >
                  {nextPage}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {lightbox && (
        <ImageLightbox
          images={lightbox.images}
          activeIndex={lightbox.index}
          onClose={() => setLightbox(null)}
          onPrev={() =>
            setLightbox((current) =>
              current
                ? {
                    ...current,
                    index:
                      (current.index - 1 + current.images.length) %
                      current.images.length,
                  }
                : null,
            )
          }
          onNext={() =>
            setLightbox((current) =>
              current
                ? {
                    ...current,
                    index: (current.index + 1) % current.images.length,
                  }
                : null,
            )
          }
        />
      )}

      {toast && (
        <ReviewToast
          message={toast.message}
          tone={toast.tone}
          onClose={() => setToast(null)}
        />
      )}
    </section>
  );
}
