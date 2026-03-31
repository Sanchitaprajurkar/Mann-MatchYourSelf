export interface PricingLineItem {
  price: number;
  quantity: number;
}

export interface PricingSummary {
  subtotal: number;
  productDiscount: number;
  couponDiscount: number;
  gstAmount: number;
  shippingFee: number;
  platformFee: number;
  totalAmount: number;
}

const GST_THRESHOLD_PER_PIECE = 2500;
const GST_LOWER_RATE = 0.05;
const GST_HIGHER_RATE = 0.18;

export const getGstRateForPiece = (piecePrice: number) =>
  piecePrice <= GST_THRESHOLD_PER_PIECE ? GST_LOWER_RATE : GST_HIGHER_RATE;

export const calculateGstAmount = (items: PricingLineItem[]) =>
  Math.round(
    items.reduce(
      (sum, item) => sum + item.price * item.quantity * getGstRateForPiece(item.price),
      0,
    ),
  );

export const calculatePricingSummary = (
  items: PricingLineItem[],
  couponDiscount: number = 0,
): PricingSummary => {
  const subtotal = Math.round(
    items.reduce((total, item) => total + item.price * item.quantity, 0),
  );
  const normalizedCouponDiscount = Math.round(Math.max(0, couponDiscount));
  const gstAmount = calculateGstAmount(items);
  const shippingFee = subtotal > 500 ? 0 : 50;
  const platformFee = 0;
  const totalAmount = Math.max(
    0,
    subtotal + gstAmount - normalizedCouponDiscount + shippingFee + platformFee,
  );

  return {
    subtotal,
    productDiscount: 0,
    couponDiscount: normalizedCouponDiscount,
    gstAmount,
    shippingFee,
    platformFee,
    totalAmount: Math.round(totalAmount),
  };
};
