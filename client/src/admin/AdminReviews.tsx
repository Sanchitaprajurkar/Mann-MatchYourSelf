import React, { useState, useEffect } from "react";
import API from "../utils/api";
import { Check, X, Star, Clock, Trash2 } from "lucide-react";

interface Review {
  _id: string;
  userId?: {
    _id: string;
    name: string;
    email: string;
  };
  name: string;
  productId: {
    _id: string;
    name: string;
    images?: string[];
  };
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  isVerified: boolean;
  createdAt: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const response = await API.get(`/api/reviews/admin`);
      setReviews(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await API.put(`/api/reviews/approve/${id}`);
      setReviews(reviews.map(r => 
        r._id === id ? { ...r, status: "approved" } : r
      ));
    } catch (err) {
      alert("Failed to approve review");
    }
  };

  const handleReject = async (id: string) => {
    try {
      await API.put(`/api/reviews/${id}`, { status: "rejected" });
      setReviews(reviews.map(r => 
        r._id === id ? { ...r, status: "rejected" } : r
      ));
    } catch (err) {
      alert("Failed to reject review");
    }
  };

  if (loading) return <div className="p-8 text-center text-gray-500 font-serif">Loading Moderation Queue...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-serif text-[var(--mann-black)]">Moderation Queue</h1>
          <p className="text-[var(--mann-muted-text)] text-sm mt-1">
            Approve genuine reviews or safely reject spam.
          </p>
        </div>
      </div>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {reviews.length === 0 ? (
        <div className="bg-white p-12 rounded-lg border border-[var(--mann-border-grey)] shadow-sm text-center text-[var(--mann-muted-text)] font-serif italic text-lg">
          No reviews available.
        </div>
      ) : (
        <div className="grid gap-6">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg border border-[var(--mann-border-grey)] shadow-sm flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex-1 w-full">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900 capitalize">
                    {review.name || review.userId?.name || "Anonymous User"}
                  </span>
                  <span className="text-sm text-gray-400">
                    reviewed
                  </span>
                  <span className="font-semibold text-[var(--mann-gold)] underline decoration-transparent hover:decoration-[var(--mann-gold)] transition-all cursor-pointer">
                    {review.productId?.name || "Unknown Product"}
                  </span>
                  {review.isVerified && (
                    <span className="ml-2 px-2 py-0.5 bg-green-50 text-green-600 text-[10px] tracking-widest uppercase font-bold border border-green-200 rounded">
                      Verified Buyer
                    </span>
                  )}
                </div>
                
                <div className="flex items-center gap-1 mb-4 border-b border-gray-100 pb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-3 h-3 ${i < review.rating ? "fill-[var(--mann-gold)] text-[var(--mann-gold)]" : "text-gray-200"}`} 
                    />
                  ))}
                  <span className="text-[11px] text-gray-400 ml-3 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(review.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                  </span>
                  
                  {/* STATUS TAG */}
                  <div className="ml-auto flex shrink-0">
                    {review.status === "pending" && (
                      <span className="px-3 py-1 bg-yellow-50 text-yellow-700 text-xs font-semibold border border-yellow-200 uppercase tracking-widest">
                        Pending Moderation
                      </span>
                    )}
                    {review.status === "approved" && (
                      <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold border border-green-200 uppercase tracking-widest">
                        Approved
                      </span>
                    )}
                    {review.status === "rejected" && (
                      <span className="px-3 py-1 bg-red-50 text-red-700 text-xs font-semibold border border-red-200 uppercase tracking-widest">
                        Rejected
                      </span>
                    )}
                  </div>
                </div>
                
                <p className="text-[#333] font-light italic text-sm bg-[#FAF8F5] p-4 border border-gray-100 rounded">
                  "{review.comment}"
                </p>
              </div>
              
              <div className="flex md:flex-col flex-row gap-3 shrink-0 w-full md:w-32 mt-4 md:mt-2">
                {review.status === "pending" && (
                  <>
                    <button
                      onClick={() => handleApprove(review._id)}
                      className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[var(--mann-black)] text-white py-2.5 rounded hover:bg-[var(--mann-gold)] transition-colors text-[10px] tracking-widest font-bold uppercase"
                    >
                      <Check className="w-3 h-3" /> Approve 
                    </button>
                    <button
                      onClick={() => handleReject(review._id)}
                      className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white border border-[var(--mann-black)] text-[var(--mann-black)] py-2.5 rounded hover:bg-gray-50 transition-colors text-[10px] tracking-widest font-bold uppercase"
                    >
                      <X className="w-3 h-3" /> Reject
                    </button>
                  </>
                )}
                
                {review.status === "rejected" && (
                   <button
                   onClick={() => handleApprove(review._id)}
                   className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-[var(--mann-black)] text-white py-2.5 rounded hover:bg-[var(--mann-gold)] transition-colors text-[10px] tracking-widest font-bold uppercase"
                 >
                   <Check className="w-3 h-3" /> Approve Instead
                 </button>
                )}
                {review.status === "approved" && (
                  <button
                    onClick={() => handleReject(review._id)}
                    className="flex-1 md:flex-none flex justify-center items-center gap-2 bg-white border border-[var(--mann-black)] text-[var(--mann-black)] py-2.5 rounded hover:bg-gray-50 transition-colors text-[10px] tracking-widest font-bold uppercase"
                  >
                    <X className="w-3 h-3" /> Reject Instead
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
