import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../utils/api";
import { motion } from "framer-motion";
import { Star, ArrowRight } from "lucide-react";

const ReviewPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing review token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await API.post(`/api/reviews/submit`, {
        token,
        rating,
        comment,
      });
      setSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
        <div className="max-w-[1400px] mx-auto">
          <div className="text-center mb-16">
            <h1 className="section-heading text-[#1A1A1A]">
              Review Submitted
            </h1>
          </div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-xl mx-auto text-center py-20 px-6 bg-[#FAF8F5] rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
              <Star className="w-8 h-8 text-[#C5A059] fill-current" />
            </div>
            <h2 className="text-2xl font-serif mb-4">Thank You</h2>
            <p className="text-gray-500 font-light mb-10 leading-relaxed italic">
              "Your feedback curates our journey." <br/>
              We appreciate your valuable review.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#C5A059] text-white text-xs font-bold uppercase tracking-widest hover:bg-[#1A1A1A] transition-all duration-500 rounded-full"
            >
              Return Home
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-24 px-6 md:px-12 min-h-screen bg-white">
      <div className="max-w-[1400px] mx-auto">
        <div className="text-center mb-16">
          <h1 className="section-heading text-[#1A1A1A]">
            Share Your Experience
          </h1>
          <p className="text-sm tracking-[0.2em] uppercase text-gray-400 mt-2">
            Rate your recent purchase
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-xl mx-auto bg-[#FAF8F5] rounded-2xl border border-gray-100 p-8 md:p-12 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl mb-8 text-sm text-center border border-red-100">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center mb-10 space-x-3">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className="focus:outline-none transition-transform hover:scale-110"
                  onMouseEnter={() => setHoveredStar(star)}
                  onMouseLeave={() => setHoveredStar(0)}
                  onClick={() => setRating(star)}
                >
                  <Star 
                    className={`w-10 h-10 transition-colors duration-300 ${
                      star <= (hoveredStar || rating) 
                        ? "text-[#C5A059] fill-current" 
                        : "text-gray-300 stroke-1"
                    }`} 
                  />
                </button>
              ))}
            </div>

            <div className="mb-8">
              <label className="block text-[11px] uppercase tracking-widest font-bold text-[#1A1A1A] mb-4 text-center">
                Your Comments
              </label>
              <textarea
                id="review-comment"
                name="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Tell us about the fit, fabric, and overall experience..."
                className="w-full bg-white border border-gray-200 rounded-xl p-5 focus:ring-1 focus:ring-[#C5A059] focus:border-[#C5A059] outline-none resize-none h-40 text-gray-600 font-light placeholder:text-gray-300 transition-all shadow-sm"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !token}
              className={`w-full py-5 rounded-full text-white text-xs font-bold uppercase tracking-widest transition-all duration-500 flex items-center justify-center gap-3 ${
                loading || !token 
                  ? "bg-gray-300 cursor-not-allowed" 
                  : "bg-[#1A1A1A] hover:bg-[#C5A059] shadow-md hover:shadow-lg"
              }`}
            >
              {loading ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default ReviewPage;
