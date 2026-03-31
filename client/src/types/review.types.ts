export type ReviewVote = "up" | "down";

export type ReviewSortOption =
  | "most_recent"
  | "most_helpful"
  | "highest_rated"
  | "lowest_rated";

export interface ReviewImage {
  url: string;
  publicId: string;
}

export interface ReviewHelpfulVotes {
  up: number;
  down: number;
}

export interface ReviewProductRef {
  _id: string;
  name: string;
  images: string[];
}

export interface ReviewUserRef {
  _id: string;
  name: string;
}

export interface Review {
  _id: string;
  productId: string | ReviewProductRef;
  userId: string | ReviewUserRef;
  userName: string;
  name: string;
  rating: number;
  title: string;
  body: string;
  comment: string;
  pros: string[];
  cons: string[];
  images: ReviewImage[];
  image: string;
  isVerifiedPurchase: boolean;
  isVerified: boolean;
  helpfulVotes: ReviewHelpfulVotes;
  viewerVote: ReviewVote | null;
  isApproved: boolean;
  status: "pending" | "approved" | "rejected";
  reportCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface RatingBreakdownItem {
  rating: number;
  count: number;
  percentage: number;
}

export interface ReviewSummary {
  averageRating: number;
  totalReviews: number;
  ratingBreakdown: RatingBreakdownItem[];
}

export interface ProductReviewsResponse {
  reviews: Review[];
  summary: ReviewSummary;
}

export interface ReviewEligibility {
  hasVerifiedPurchase: boolean;
  hasReviewed: boolean;
  reviewStatus: Review["status"] | null;
}

export interface ReviewFilters {
  rating: number | null;
  withPhotos: boolean;
  verifiedOnly: boolean;
}

export interface ReviewFormValues {
  rating: number;
  title: string;
  body: string;
  pros: string[];
  cons: string[];
}

export interface ReviewCreatePayload extends ReviewFormValues {
  productId: string;
  images: ReviewImage[];
}

export interface ReviewListState {
  search: string;
  sortBy: ReviewSortOption;
  filters: ReviewFilters;
  page: number;
  pageSize: number;
}
