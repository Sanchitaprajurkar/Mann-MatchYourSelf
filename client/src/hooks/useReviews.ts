import {
  startTransition,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { reviewApi } from "../api/reviewApi";
import type {
  ProductReviewsResponse,
  Review,
  ReviewCreatePayload,
  ReviewFilters,
  ReviewSortOption,
  ReviewVote,
} from "../types/review.types";

const DEFAULT_FILTERS: ReviewFilters = {
  rating: null,
  withPhotos: false,
  verifiedOnly: false,
};

const PAGE_SIZE = 10;

const filterAndSortReviews = (
  reviews: Review[],
  search: string,
  filters: ReviewFilters,
  sortBy: ReviewSortOption,
) => {
  const normalizedSearch = search.trim().toLowerCase();

  const filtered = reviews.filter((review) => {
    if (filters.rating && review.rating !== filters.rating) return false;
    if (filters.withPhotos && review.images.length === 0) return false;
    if (filters.verifiedOnly && !review.isVerifiedPurchase) return false;

    if (!normalizedSearch) return true;

    const haystack = [
      review.userName,
      review.title,
      review.body,
      review.pros.join(" "),
      review.cons.join(" "),
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalizedSearch);
  });

  return filtered.sort((left, right) => {
    switch (sortBy) {
      case "highest_rated":
        return right.rating - left.rating;
      case "lowest_rated":
        return left.rating - right.rating;
      case "most_helpful":
        return (
          right.helpfulVotes.up -
          right.helpfulVotes.down -
          (left.helpfulVotes.up - left.helpfulVotes.down)
        );
      case "most_recent":
      default:
        return (
          new Date(right.createdAt).getTime() -
          new Date(left.createdAt).getTime()
        );
    }
  });
};

export function useReviews(productId: string) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<ReviewSortOption>("most_recent");
  const [filters, setFilters] = useState<ReviewFilters>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const deferredSearch = useDeferredValue(search);

  const reviewsQuery = useQuery({
    queryKey: ["reviews", productId],
    queryFn: () => reviewApi.getProductReviews(productId),
    enabled: Boolean(productId),
  });

  const eligibilityQuery = useQuery({
    queryKey: ["reviews", productId, "eligibility"],
    queryFn: () => reviewApi.getReviewEligibility(productId),
    enabled: Boolean(productId) && Boolean(localStorage.getItem("token")),
  });

  const createReviewMutation = useMutation({
    mutationFn: (payload: ReviewCreatePayload) => reviewApi.createReview(payload),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
      await queryClient.invalidateQueries({
        queryKey: ["reviews", productId, "eligibility"],
      });
    },
  });

  const voteReviewMutation = useMutation({
    mutationFn: ({ reviewId, vote }: { reviewId: string; vote: ReviewVote }) =>
      reviewApi.voteReview(reviewId, vote),
    onMutate: async ({ reviewId, vote }) => {
      await queryClient.cancelQueries({ queryKey: ["reviews", productId] });
      const previous = queryClient.getQueryData<ProductReviewsResponse>([
        "reviews",
        productId,
      ]);

      if (previous) {
        const optimistic = previous.reviews.map((review) => {
          if (review._id !== reviewId) return review;

          const nextReview = { ...review };
          const previousVote = nextReview.viewerVote;

          if (previousVote === vote) {
            nextReview.viewerVote = null;
            nextReview.helpfulVotes = {
              ...nextReview.helpfulVotes,
              [vote]: Math.max(0, nextReview.helpfulVotes[vote] - 1),
            };
            return nextReview;
          }

          if (previousVote) {
            nextReview.helpfulVotes = {
              ...nextReview.helpfulVotes,
              [previousVote]: Math.max(
                0,
                nextReview.helpfulVotes[previousVote] - 1,
              ),
            };
          }

          nextReview.viewerVote = vote;
          nextReview.helpfulVotes = {
            ...nextReview.helpfulVotes,
            [vote]: nextReview.helpfulVotes[vote] + 1,
          };

          return nextReview;
        });

        queryClient.setQueryData<ProductReviewsResponse>(["reviews", productId], {
          ...previous,
          reviews: optimistic,
        });
      }

      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["reviews", productId], context.previous);
      }
    },
    onSettled: async () => {
      await queryClient.invalidateQueries({ queryKey: ["reviews", productId] });
    },
  });

  const reportReviewMutation = useMutation({
    mutationFn: (reviewId: string) => reviewApi.reportReview(reviewId),
  });

  useEffect(() => {
    setPage(1);
  }, [deferredSearch, sortBy, filters.rating, filters.withPhotos, filters.verifiedOnly]);

  const allReviews = reviewsQuery.data?.reviews || [];
  const filteredReviews = filterAndSortReviews(
    allReviews,
    deferredSearch,
    filters,
    sortBy,
  );

  const totalPages = Math.max(1, Math.ceil(filteredReviews.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginatedReviews = filteredReviews.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  return {
    reviews: paginatedReviews,
    allReviews,
    summary: reviewsQuery.data?.summary,
    eligibility: eligibilityQuery.data,
    isLoading: reviewsQuery.isLoading,
    isFetching: reviewsQuery.isFetching,
    isEligibilityLoading: eligibilityQuery.isLoading,
    isSubmitting: createReviewMutation.isPending,
    isVoting: voteReviewMutation.isPending,
    isReporting: reportReviewMutation.isPending,
    sortBy,
    filters,
    search,
    page: currentPage,
    totalPages,
    totalResults: filteredReviews.length,
    setSearch: (value: string) => {
      startTransition(() => setSearch(value));
    },
    setSortBy: (value: ReviewSortOption) => {
      startTransition(() => setSortBy(value));
    },
    setFilters: (value: ReviewFilters) => {
      startTransition(() => setFilters(value));
    },
    setPage: (value: number) => {
      startTransition(() => setPage(value));
    },
    submitReview: createReviewMutation.mutateAsync,
    voteReview: voteReviewMutation.mutateAsync,
    reportReview: reportReviewMutation.mutateAsync,
    refetch: reviewsQuery.refetch,
  };
}
