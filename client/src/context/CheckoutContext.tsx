import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";

// ── Types ─────────────────────────────────────────────────────────
export interface AppliedCoupon {
  _id: string;
  code: string;
  title?: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

export interface PricingSummary {
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  shippingFee: number;
  platformFee: number;
  totalAmount: number;
}

interface CheckoutContextType {
  appliedCoupon: AppliedCoupon | null;
  pricing: PricingSummary | null;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  setPricing: (pricing: PricingSummary) => void;
  clearCheckout: () => void;
  computePricing: (subtotal: number, couponDiscount?: number) => PricingSummary;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(null);
  const [pricing, setPricingState] = useState<PricingSummary | null>(null);

  const computePricing = useCallback((
    subtotal: number,
    couponDiscount: number = 0,
  ): PricingSummary => {
    const shippingFee = subtotal > 500 ? 0 : 50;
    const platformFee = 10;
    const totalAmount = Math.max(0, subtotal - couponDiscount + shippingFee + platformFee);
    return {
      subtotal,
      productDiscount: 0,
      couponDiscount,
      shippingFee,
      platformFee,
      totalAmount,
    };
  }, []);

  const setAppliedCoupon = useCallback((coupon: AppliedCoupon | null) => {
    setAppliedCouponState(coupon);
  }, []);

  const setPricing = useCallback((p: PricingSummary) => {
    setPricingState(p);
  }, []);

  const clearCheckout = useCallback(() => {
    setAppliedCouponState(null);
    setPricingState(null);
  }, []);

  return (
    <CheckoutContext.Provider
      value={{
        appliedCoupon,
        pricing,
        setAppliedCoupon,
        setPricing,
        clearCheckout,
        computePricing,
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const ctx = useContext(CheckoutContext);
  if (!ctx) throw new Error("useCheckout must be used within CheckoutProvider");
  return ctx;
}
