import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus, X } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useAuth } from "../../context/AuthContext";
import type {
  ReviewCreatePayload,
  ReviewEligibility,
  ReviewImage,
} from "../../types/review.types";
import { useUploadImages } from "../../hooks/useUploadImages";
import ImageUploader from "./ImageUploader";
import StarRating from "./StarRating";

const reviewSchema = z.object({
  rating: z.number().min(1, "Please select a star rating."),
  title: z.string().trim().min(4, "Add a short headline.").max(120),
  body: z.string().trim().min(20, "Share a little more detail.").max(4000),
  pros: z.array(z.string()).default([]),
  cons: z.array(z.string()).default([]),
});

type ReviewFormSchema = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  productId: string;
  eligibility?: ReviewEligibility;
  isEligibilityLoading?: boolean;
  onSubmitReview: (payload: ReviewCreatePayload) => Promise<unknown>;
  onSuccess: () => void;
}

export default function ReviewForm({
  productId,
  eligibility,
  isEligibilityLoading = false,
  onSubmitReview,
  onSuccess,
}: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const uploadImages = useUploadImages();
  const [files, setFiles] = useState<File[]>([]);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [proInput, setProInput] = useState("");
  const [conInput, setConInput] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReviewFormSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      title: "",
      body: "",
      pros: [],
      cons: [],
    },
  });

  const currentRating = watch("rating");
  const pros = watch("pros");
  const cons = watch("cons");

  const addChip = (field: "pros" | "cons", value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return;

    const nextValues = [...watch(field), trimmed];
    setValue(field, nextValues, { shouldValidate: true });
    if (field === "pros") setProInput("");
    if (field === "cons") setConInput("");
  };

  const removeChip = (field: "pros" | "cons", value: string) => {
    const nextValues = watch(field).filter((item) => item !== value);
    setValue(field, nextValues, { shouldValidate: true });
  };

  const submitHandler = handleSubmit(async (values) => {
    let uploadedImages: ReviewImage[] = [];

    if (files.length > 0) {
      uploadedImages = await uploadImages.mutateAsync(files);
    }

    await onSubmitReview({
      productId,
      rating: values.rating,
      title: values.title,
      body: values.body,
      pros: values.pros,
      cons: values.cons,
      images: uploadedImages,
    });

    onSuccess();
  });

  if (!isAuthenticated) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 text-center shadow-md">
        <p className="text-base text-[var(--color-text)]">
          Sign in to rate this product and share your experience.
        </p>
        <Link
          to="/login"
          className="mt-4 inline-flex rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
        >
          Sign in to review
        </Link>
      </div>
    );
  }

  if (isEligibilityLoading) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md">
        <p className="text-sm text-[var(--color-muted)]">
          Checking whether this order is eligible for review...
        </p>
      </div>
    );
  }

  if (eligibility?.hasReviewed) {
    return (
      <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md">
        <h3 className="text-xl font-semibold text-[var(--color-text)]">
          Review already submitted
        </h3>
        <p className="mt-2 text-sm text-[var(--color-muted)]">
          Your latest review for this product is currently{" "}
          <span className="font-medium capitalize text-[var(--color-accent)]">
            {eligibility.reviewStatus || "pending"}
          </span>
          .
        </p>
      </div>
    );
  }

  if (eligibility && !eligibility.canReview) {
    if (eligibility.reason === "NOT_PURCHASED") {
      return (
        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-md">
          <h3 className="text-xl font-semibold text-[var(--color-text)]">
            Purchase required
          </h3>
          <p className="mt-2 text-sm text-[var(--color-muted)]">
            Please purchase this product to leave a review.
          </p>
          <Link
            to="/shop"
            className="mt-4 inline-flex rounded-2xl bg-[var(--color-primary)] px-4 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90"
          >
            Buy this product
          </Link>
        </div>
      );
    }

    if (eligibility.reason === "NOT_DELIVERED") {
      return (
        <div className="rounded-3xl border border-yellow-200 bg-yellow-50 p-6 shadow-md dark:border-yellow-500/30 dark:bg-yellow-500/10">
          <h3 className="text-xl font-semibold text-[var(--color-text)]">
            Review available after delivery
          </h3>
          <p className="mt-2 text-sm text-yellow-700 dark:text-yellow-300">
            Your order is on the way. You can review after delivery.
          </p>
          <Link
            to="/my-orders"
            className="mt-4 inline-flex rounded-2xl border border-yellow-300 px-4 py-3 text-sm font-semibold text-yellow-800 transition hover:bg-yellow-100 dark:border-yellow-500/30 dark:text-yellow-200 dark:hover:bg-yellow-500/10"
          >
            View my orders
          </Link>
        </div>
      );
    }
  }

  return (
    <form
      onSubmit={submitHandler}
      className="space-y-6 rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-lg"
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-xl font-semibold text-[var(--color-text)]">
            Share your review
          </h3>
          <p className="mt-1 text-sm text-[var(--color-muted)]">
            Flipkart-style details help shoppers make better decisions.
          </p>
        </div>
        <div className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
          {eligibility?.hasVerifiedPurchase
            ? "Verified purchase eligible"
            : "Verified badge is applied automatically"}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
          Your rating
        </label>
        <StarRating
          value={hoveredRating || currentRating}
          interactive
          size={24}
          onHoverChange={setHoveredRating}
          onChange={(value) => setValue("rating", value, { shouldValidate: true })}
        />
        {errors.rating && (
          <p className="mt-2 text-sm text-rose-500">{errors.rating.message}</p>
        )}
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
            Review title
          </label>
          <input
            {...register("title")}
            placeholder="Example: Loved the craftsmanship and fit"
            className="w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          />
          {errors.title && (
            <p className="mt-2 text-sm text-rose-500">{errors.title.message}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
            Detailed review
          </label>
          <textarea
            {...register("body")}
            rows={5}
            placeholder="Talk about the fabric, fit, finish, delivery experience, and overall quality."
            className="w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
          />
          {errors.body && (
            <p className="mt-2 text-sm text-rose-500">{errors.body.message}</p>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
            Pros
          </label>
          <div className="flex gap-2">
            <input
              value={proInput}
              onChange={(event) => setProInput(event.target.value)}
              placeholder="Add a pro"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
            />
            <button
              type="button"
              onClick={() => addChip("pros", proInput)}
              className="rounded-2xl border border-[var(--color-border)] px-4 transition hover:border-[var(--color-accent)]"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {pros.map((pro) => (
              <button
                key={pro}
                type="button"
                onClick={() => removeChip("pros", pro)}
                className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700"
              >
                {pro}
                <X size={12} />
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--color-text)]">
            Cons
          </label>
          <div className="flex gap-2">
            <input
              value={conInput}
              onChange={(event) => setConInput(event.target.value)}
              placeholder="Add a con"
              className="w-full rounded-2xl border border-[var(--color-border)] bg-transparent px-4 py-3 text-sm text-[var(--color-text)] outline-none transition focus:border-[var(--color-accent)]"
            />
            <button
              type="button"
              onClick={() => addChip("cons", conInput)}
              className="rounded-2xl border border-[var(--color-border)] px-4 transition hover:border-[var(--color-accent)]"
            >
              <Plus size={16} />
            </button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {cons.map((con) => (
              <button
                key={con}
                type="button"
                onClick={() => removeChip("cons", con)}
                className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-3 py-1 text-xs text-rose-700"
              >
                {con}
                <X size={12} />
              </button>
            ))}
          </div>
        </div>
      </div>

      <ImageUploader files={files} onChange={setFiles} />

      <button
        type="submit"
        disabled={isSubmitting || uploadImages.isPending}
        className="inline-flex items-center gap-2 rounded-2xl bg-[var(--color-primary)] px-5 py-3 text-sm font-semibold text-white shadow-md transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting || uploadImages.isPending ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Submitting review...
          </>
        ) : (
          "Submit review"
        )}
      </button>
    </form>
  );
}
