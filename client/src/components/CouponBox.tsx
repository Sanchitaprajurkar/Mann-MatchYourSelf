import React, { useState } from "react";
import { Tag, Check, X } from "lucide-react";
import API from "../utils/api";

interface CouponBoxProps {
  onCouponApply: (coupon: { _id: string; code: string; discountAmount: number; discountType: string; discountValue: number }) => void;
  onCouponRemove: () => void;
  appliedCoupon?: { code: string; discountAmount: number };
  cartItems: any[];
  cartTotal: number;
  className?: string;
}

const CouponBox: React.FC<CouponBoxProps> = ({
  onCouponApply,
  onCouponRemove,
  appliedCoupon,
  cartItems,
  cartTotal,
  className = "",
}) => {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleApplyCoupon = async () => {
    if (!code.trim()) {
      setError("Please enter a coupon code");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await API.post('/api/coupons/apply', {
        code,
        cartItems,
        cartTotal
      });

      if (response.data.success) {
        onCouponApply({
          _id: response.data.data.coupon._id,
          code: response.data.data.coupon.code,
          discountAmount: response.data.data.discountAmount,
          discountType: response.data.data.discountType,
          discountValue: response.data.data.discountValue
        });
        setCode("");
        setError(null);
      } else {
        setError(response.data.message || "Invalid coupon code");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to apply coupon");
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    onCouponRemove();
    setError(null);
  };

  if (appliedCoupon) {
    return (
      <div
        className={`bg-[#FAF8F5] border border-[#C5A059]/30 rounded-lg p-4 ${className}`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#C5A059]" />
            <div>
              <p className="text-sm font-serif text-[#1A1A1A]">
                Coupon Applied
              </p>
              <p className="text-[10px] tracking-widest uppercase font-bold text-[#C5A059] mt-1">
                {appliedCoupon.code} - ₹{appliedCoupon.discountAmount} OFF
              </p>
            </div>
          </div>
          <button
            onClick={handleRemoveCoupon}
            className="text-gray-400 hover:text-red-500 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`bg-white border border-gray-100 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center gap-2 mb-3">
        <Tag className="w-4 h-4 text-[#C5A059]" />
        <h4 className="text-sm font-serif text-[#1A1A1A]">Apply Coupon Code</h4>
      </div>

      <div className="flex gap-2">
        <input
          id="coupon-code"
          name="couponCode"
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="flex-1 px-4 py-3 bg-[#FAF8F5] border-none rounded-lg focus:ring-1 focus:ring-[#C5A059] outline-none text-sm tracking-widest uppercase"
          onKeyPress={(e) => e.key === "Enter" && handleApplyCoupon()}
        />
        <button
          onClick={handleApplyCoupon}
          disabled={loading || !cartTotal || cartItems.length === 0}
          className="px-6 py-3 bg-[#1A1A1A] text-white text-[10px] font-bold tracking-widest uppercase rounded-lg hover:bg-[#C5A059] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            "Apply"
          )}
        </button>
      </div>

      {error && <p className="text-xs text-red-500 mt-2 tracking-wide">{error}</p>}
    </div>
  );
};

export default CouponBox;
