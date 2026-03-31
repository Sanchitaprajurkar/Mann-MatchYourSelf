import { useEffect, useState } from "react";
import { Star, ArrowRight, Quote, CheckCircle } from "lucide-react";
import API from "../utils/api";
import { CLOUDINARY_PRESETS, isCloudinaryUrl } from "../utils/cloudinary";
import { useAuth } from "../context/AuthContext";

// Helper function to optimize community review images
const optimizeReviewImage = (imageUrl: string) => {
  if (!imageUrl) return imageUrl;

  if (isCloudinaryUrl(imageUrl)) {
    return CLOUDINARY_PRESETS.gallery(imageUrl, 600);
  }

  return imageUrl;
};

interface CommunitySectionProps {
  productId?: string;
}

const CommunitySection = ({ productId }: CommunitySectionProps) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");

  useEffect(() => {
    if (user?.name && !name) {
      setName(user.name);
    }
  }, [user]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = async () => {
    if (!productId) return;
    if (isSubmitting) return; // Prevent multiple calls

    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("productId", productId);
    if (user?._id) formData.append("userId", user._id);
    formData.append("name", name);
    formData.append("rating", String(rating));
    formData.append("comment", comment);
    if (location) formData.append("location", location);

    if (image) formData.append("image", image);

    try {
      await API.post("/api/reviews", formData);
      alert("Submitted for review");
      setShowReviewForm(false); // close form

      // Optionally reset form state
      setName("");
      setRating(5);
      setComment("");
      setImage(null);
    } catch (err: any) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setLoading(true);
        // If productId is provided, fetch product specific reviews, otherwise generic or all
        const endpoint = productId
          ? `/api/reviews/product/${productId}`
          : `/api/reviews/latest`;
        const res = await API.get(endpoint);
        if (res.data.success) {
          setReviews(productId ? res.data.data?.reviews || [] : res.data.data || []);
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [productId]);

  if (loading) {
    return (
      <section className="py-24 bg-[#FCFBFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center text-gray-400">
          Loading stories...
        </div>
      </section>
    );
  }

  // Fallback UI if no reviews
  if (reviews.length === 0) {
    return (
      <section className="py-24 bg-[#FCFBFA] overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-[11px] tracking-[0.5em] text-[#8C8273] uppercase mb-4">
            Trusted by Our Community
          </p>
          <h2 className="section-heading text-[#1A1A1A] mb-8">
            Stories Woven by You
          </h2>
          <div className="bg-white p-12 border border-gray-100 rounded-lg max-w-2xl mx-auto shadow-sm">
            <Quote className="w-10 h-10 text-[#F3F0EA] mx-auto mb-4" />
            <p className="text-gray-500 italic mb-6">
              "Be the first to share your story"
            </p>
            {productId && (
              <div className="flex flex-col items-center gap-4">
                <button
                  onClick={() => {
                    console.log("WRITE REVIEW CLICKED");
                    setShowReviewForm(true);
                  }}
                  className="px-8 py-3 bg-[#1A1A1A] text-white text-[10px] tracking-widest uppercase hover:bg-[#C5A059] transition-colors"
                >
                  Write a Review
                </button>
                {showReviewForm && (
                  <div className="mt-6 p-6 border rounded-lg bg-white shadow w-full max-w-sm text-left">
                    <h2 className="text-lg font-semibold mb-4 text-[#1A1A1A]">
                      Write Your Review
                    </h2>

                    <input
                      type="text"
                      placeholder="Your Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                    />

                    <input
                      type="text"
                      placeholder="Location (Optional)"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                    />

                    <select
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                    >
                      <option value={5}>5 ⭐</option>
                      <option value={4}>4 ⭐</option>
                      <option value={3}>3 ⭐</option>
                      <option value={2}>2 ⭐</option>
                      <option value={1}>1 ⭐</option>
                    </select>

                    <textarea
                      placeholder="Write your experience..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059] min-h-[100px]"
                    />

                    <input
                      type="file"
                      onChange={(e) => setImage(e.target.files?.[0] || null)}
                      className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3F0EA] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5]"
                    />

                    <button
                      onClick={handleSubmitReview}
                      disabled={isSubmitting}
                      className="w-full bg-[#1A1A1A] text-white px-4 py-3 rounded text-[10px] tracking-widest uppercase hover:bg-[#C5A059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Review"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Calculate Myntra-style rating summary stats
  const total = reviews.length;
  const avg =
    reviews.reduce((acc: number, r: any) => acc + (r.rating || 5), 0) / total ||
    0;
  const count = [5, 4, 3, 2, 1].map(
    (star) => reviews.filter((r: any) => (r.rating || 5) === star).length,
  );

  return (
    <section className="py-24 bg-[#FCFBFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <div className="text-center mb-12">
          <p className="text-[11px] tracking-[0.5em] text-[#8C8273] uppercase mb-4">
            Trusted by Our Community
          </p>
          <h2 className="section-heading text-[#1A1A1A]">
            Stories Woven by You
          </h2>
          {productId && reviews.length > 0 && (
            <div className="flex flex-col items-center mt-6">
              <button
                onClick={() => {
                  console.log("WRITE REVIEW CLICKED");
                  setShowReviewForm(true);
                }}
                className="px-8 py-3 outline outline-1 outline-[#1A1A1A] text-[#1A1A1A] text-[10px] tracking-widest uppercase hover:bg-[#1A1A1A] hover:text-white transition-all"
              >
                Write a Review
              </button>
              {showReviewForm && (
                <div className="mt-6 p-6 border rounded-lg bg-white shadow w-full max-w-sm text-left">
                  <h2 className="text-lg font-semibold mb-4 text-[#1A1A1A]">
                    Write Your Review
                  </h2>

                  <input
                    type="text"
                    placeholder="Your Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                  />

                  <input
                    type="text"
                    placeholder="Location (Optional)"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                  />

                  <select
                    value={rating}
                    onChange={(e) => setRating(Number(e.target.value))}
                    className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059]"
                  >
                    <option value={5}>5 ⭐</option>
                    <option value={4}>4 ⭐</option>
                    <option value={3}>3 ⭐</option>
                    <option value={2}>2 ⭐</option>
                    <option value={1}>1 ⭐</option>
                  </select>

                  <textarea
                    placeholder="Write your experience..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full border border-gray-200 p-2 mb-3 rounded focus:outline-none focus:border-[#C5A059] min-h-[100px]"
                  />

                  <input
                    type="file"
                    onChange={(e) => setImage(e.target.files?.[0] || null)}
                    className="mb-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-[#F3F0EA] file:text-[#1A1A1A] hover:file:bg-[#E5E5E5]"
                  />

                  <button
                    onClick={handleSubmitReview}
                    disabled={isSubmitting}
                    className="w-full bg-[#1A1A1A] text-white px-4 py-3 rounded text-[10px] tracking-widest uppercase hover:bg-[#C5A059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* MYNTRA-STYLE RATING SUMMARY */}
        {productId && (
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-100 shadow-sm mb-16">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div className="text-center md:text-left md:border-r md:border-gray-100 pr-8">
                <div className="text-5xl font-bold text-[#1A1A1A] mb-2 flex items-center justify-center md:justify-start gap-2">
                  {avg.toFixed(1)}{" "}
                  <Star className="w-8 h-8 fill-[#C5A059] text-[#C5A059]" />
                </div>
                <p className="text-sm text-gray-500 uppercase tracking-widest">
                  Based on {total} Reviews
                </p>
              </div>
              <div className="space-y-2">
                {count.map((c, i) => {
                  const star = 5 - i;
                  const percent = total ? (c / total) * 100 : 0;
                  return (
                    <div
                      key={star}
                      className="flex items-center gap-3 text-sm text-gray-600"
                    >
                      <span className="w-4 font-medium">{star}</span>
                      <Star className="w-4 h-4 text-gray-300 fill-current" />
                      <div className="flex-1 bg-gray-100 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C5A059] h-full rounded-full transition-all duration-1000"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs">{c}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review: any) => {
            const rating = review.rating || 5;
            const fallbackImage = optimizeReviewImage(
              "https://res.cloudinary.com/dmrnnygi5/image/upload/v1714561234/placeholder_image.jpg",
            ); // generic fallback
            const hasImage = !!review.image;

            return (
              <div
                key={review._id}
                className="group h-auto md:h-[450px] md:[perspective:1000px]"
              >
                <div
                  className="
                    relative h-full w-full transition-all duration-700
                    md:[transform-style:preserve-3d]
                    md:group-hover:[transform:rotateY(180deg)]
                  "
                >
                  {/* FRONT */}
                  <div className="relative md:absolute inset-0 bg-white p-8 md:p-10 flex flex-col justify-between border border-gray-100 md:[backface-visibility:hidden]">
                    <div>
                      <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#F3F0EA] mb-6" />

                      <div className="flex mb-4">
                        {Array.from({ length: rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3 h-3 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      <p className="text-base md:text-lg text-[#444] leading-relaxed font-light italic line-clamp-6">
                        “{review.comment}”
                      </p>
                      {hasImage && (
                        <div className="mt-4 md:hidden">
                          <img src={optimizeReviewImage(review.image)} alt="Customer product photo" className="w-14 h-14 object-cover rounded-md border border-gray-200" />
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-4 mt-6 md:mt-8">
                      <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8C8273] flex items-center justify-center text-white text-xs md:text-sm uppercase flex-shrink-0">
                        {review.name ? review.name[0] : "A"}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-[#1A1A1A] capitalize">
                            {review.name || "Anonymous"}
                          </h4>
                          {review.isVerified && (
                            <span title="Verified Buyer">
                              <CheckCircle className="w-3 h-3 text-green-600" />
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] md:text-[11px] tracking-widest uppercase text-[#8C8273] flex items-center gap-2 mt-0.5 whitespace-nowrap flex-wrap">
                          <span>{review.location || "India"}</span>
                          {review.createdAt && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                              <span>{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            </>
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Desktop hint */}
                    <div className="hidden md:block absolute bottom-6 right-8 text-[10px] tracking-widest text-gray-300 uppercase italic">
                      {hasImage
                        ? "Hover to see the look →"
                        : "Hover for details →"}
                    </div>
                  </div>

                  {/* BACK (DESKTOP ONLY) */}
                  <div className="hidden md:block absolute inset-0 [transform:rotateY(180deg)] md:[backface-visibility:hidden] bg-[#1A1A1A]">
                    <img
                      src={
                        review.image
                          ? optimizeReviewImage(review.image)
                          : fallbackImage
                      }
                      alt={review.name || "Customer review"}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImage;
                      }}
                      className={`h-full w-full object-cover transition-all duration-500 ${hasImage ? "grayscale-[20%] group-hover:grayscale-0" : "opacity-30"}`}
                      loading="lazy"
                    />

                    <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
                      <p className="text-[10px] tracking-[0.3em] uppercase mb-2 opacity-80 flex items-center gap-2">
                        {review.isVerified && (
                          <CheckCircle className="w-3 h-3 text-green-400" />
                        )}
                        {review.isVerified
                          ? "Verified Purchase"
                          : "Customer Review"}
                      </p>
                      <h4 className="text-xl font-serif mb-6 line-clamp-2">
                        {review.productId?.name || "Premium Collection"}
                      </h4>
                      <button className="flex items-center gap-2 text-xs tracking-widest uppercase border-b border-white pb-2 w-fit hover:gap-4 transition-all">
                        Shop the Look <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
