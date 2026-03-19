import React, { useState, useEffect } from "react";
import axios from "axios";
import { Check, X, Star, Clock } from "lucide-react";

// Configure axios base URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

interface Review {
  _id: string;
  userId: {
    _id: string;
    name: string;
    email: string;
  };
  productId: {
    _id: string;
    name: string;
    images?: string[];
  };
  rating: number;
  comment: string;
  status: "pending" | "approved" | "rejected";
  createdAt: string;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const response = await axios.get(`${API_URL}/reviews/pending`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setReviews(response.data.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pending reviews");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleStatusUpdate = async (id: string, status: "approved" | "rejected") => {
    try {
      const token = localStorage.getItem("adminToken");
      await axios.put(
        `${API_URL}/reviews/${id}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Remove from list or update locally
      setReviews(reviews.filter(r => r._id !== id));
      
    } catch (err) {
      alert("Failed to update status");
    }
  };

  if (loading) return <div className="p-8 text-center">Loading reviews...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Pending Reviews</h1>
      
      {error && <div className="text-red-500 mb-4">{error}</div>}
      
      {reviews.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
          No pending reviews to moderate.
        </div>
      ) : (
        <div className="grid gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white p-6 rounded-lg shadow border border-gray-100 flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-900">
                    {review.userId?.name || "Unknown User"}
                  </span>
                  <span className="text-sm text-gray-500">
                    reviewed
                  </span>
                  <span className="font-semibold text-gray-900">
                    {review.productId?.name || "Unknown Product"}
                  </span>
                </div>
                
                <div className="flex items-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-4 h-4 ${i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
                    />
                  ))}
                  <span className="text-xs text-gray-400 ml-2 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p className="text-gray-700 bg-gray-50 p-3 rounded text-sm italic border border-gray-100">
                  "{review.comment}"
                </p>
              </div>
              
              <div className="flex gap-2 shrink-0">
                <button
                  onClick={() => handleStatusUpdate(review._id, "approved")}
                  className="flex items-center gap-1 bg-green-100 text-green-700 px-4 py-2 rounded hover:bg-green-200 transition-colors text-sm font-medium"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button
                  onClick={() => handleStatusUpdate(review._id, "rejected")}
                  className="flex items-center gap-1 bg-red-100 text-red-700 px-4 py-2 rounded hover:bg-red-200 transition-colors text-sm font-medium"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
