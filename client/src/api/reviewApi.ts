import axios from "axios";
import API from "../utils/api";
import type {
  ProductReviewsResponse,
  Review,
  ReviewCreatePayload,
  ReviewEligibility,
  ReviewImage,
  ReviewVote,
} from "../types/review.types";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

type LegacyReviewEligibility = Pick<
  ReviewEligibility,
  "hasVerifiedPurchase" | "hasReviewed" | "reviewStatus"
>;

const normalizeReviewEligibility = (
  data: ReviewEligibility | LegacyReviewEligibility,
): ReviewEligibility => {
  if ("canReview" in data) {
    return data;
  }

  const hasReviewed = Boolean(data.hasReviewed);
  const hasVerifiedPurchase = Boolean(data.hasVerifiedPurchase);

  return {
    canReview: hasVerifiedPurchase && !hasReviewed,
    reason: hasReviewed ? "ALREADY_REVIEWED" : hasVerifiedPurchase ? null : "NOT_PURCHASED",
    hasVerifiedPurchase,
    hasReviewed,
    reviewStatus: data.reviewStatus || null,
  };
};

export const reviewApi = {
  async getProductReviews(productId: string): Promise<ProductReviewsResponse> {
    const response = await API.get<ApiResponse<ProductReviewsResponse>>(
      `/api/reviews/product/${productId}`,
    );
    return response.data.data;
  },

  async getReviewEligibility(productId: string): Promise<ReviewEligibility> {
    try {
      const response = await API.get<ApiResponse<ReviewEligibility | LegacyReviewEligibility>>(
        `/api/reviews/product/${productId}/eligibility`,
      );
      return normalizeReviewEligibility(response.data.data);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        const fallbackResponse = await API.get<ApiResponse<ReviewEligibility>>(
          `/api/reviews/can-review/${productId}`,
        );
        return normalizeReviewEligibility(fallbackResponse.data.data);
      }

      throw error;
    }
  },

  async getLatestReviews(): Promise<Review[]> {
    const response = await API.get<ApiResponse<Review[]>>("/api/reviews/latest");
    return response.data.data;
  },

  async uploadImages(files: File[]): Promise<ReviewImage[]> {
    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));

    const response = await API.post<ApiResponse<ReviewImage[]>>(
      "/api/reviews/upload-images",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    return response.data.data;
  },

  async createReview(payload: ReviewCreatePayload): Promise<Review> {
    const response = await API.post<ApiResponse<Review>>("/api/reviews", payload);
    return response.data.data;
  },

  async voteReview(reviewId: string, vote: ReviewVote) {
    const response = await API.post<
      ApiResponse<{ helpfulVotes: Review["helpfulVotes"]; viewerVote: ReviewVote | null }>
    >(`/api/reviews/${reviewId}/vote`, { vote });

    return response.data.data;
  },

  async reportReview(reviewId: string) {
    const response = await API.post<ApiResponse<null>>(
      `/api/reviews/${reviewId}/report`,
    );
    return response.data.message || "Review reported.";
  },
};
