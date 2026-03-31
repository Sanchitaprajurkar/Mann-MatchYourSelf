import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  calculatePricingSummary,
  PricingLineItem,
  PricingSummary,
} from "../utils/pricing";

// ── Types ─────────────────────────────────────────────────────────
export interface AppliedCoupon {
  _id: string;
  code: string;
  title?: string;
  discountType: string;
  discountValue: number;
  discountAmount: number;
}

interface CheckoutContextType {
  appliedCoupon: AppliedCoupon | null;
  pricing: PricingSummary | null;
  setAppliedCoupon: (coupon: AppliedCoupon | null) => void;
  setPricing: (pricing: PricingSummary) => void;
  clearCheckout: () => void;
  computePricing: (
    items: PricingLineItem[],
    couponDiscount?: number,
  ) => PricingSummary;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [appliedCoupon, setAppliedCouponState] = useState<AppliedCoupon | null>(null);
  const [pricing, setPricingState] = useState<PricingSummary | null>(null);

  const computePricing = useCallback((
    items: PricingLineItem[],
    couponDiscount: number = 0,
  ): PricingSummary => calculatePricingSummary(items, couponDiscount), []);

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
