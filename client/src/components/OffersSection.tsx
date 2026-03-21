import React, { useState, useEffect } from 'react';
import { Percent, ChevronDown, ChevronUp, Tag } from 'lucide-react';
import API from '../utils/api';

interface Offer {
  _id: string;
  title: string;
  description: string;
  code?: string;
  offerType: string;
  discountValue?: number;
  minOrderAmount?: number;
  bankName?: string;
  validTill?: string;
}

interface OffersSectionProps {
  className?: string;
}

const OffersSection: React.FC<OffersSectionProps> = ({ className = '' }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await API.get('/api/offers/active?placement=cart');
      if (res.data.success) {
        setOffers(res.data.data);
      }
      setError(null);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const displayOffers = showAll ? offers : offers.slice(0, 2);

  if (loading) {
    return (
      <div className={`bg-[#FAF8F5] rounded-xl border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || offers.length === 0) {
    return null;
  }

  return (
    <div className={`bg-[#FAF8F5] rounded-xl border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#C5A059]" />
          <h3 className="text-lg font-serif text-[#1A1A1A]">Available Offers</h3>
        </div>
        {offers.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#C5A059] hover:text-[#1A1A1A] transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"
          >
            {showAll ? (
              <>
                Show Less <ChevronUp className="w-4 h-4" />
              </>
            ) : (
              <>
                Show More <ChevronDown className="w-4 h-4" />
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-3">
        {displayOffers.map((offer) => (
          <div key={offer._id} className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-50 shadow-sm transition-all hover:border-[#C5A059]/30">
            <div className="flex-shrink-0 w-10 h-10 bg-[#FAF8F5] rounded-full flex items-center justify-center">
              <Percent className="w-4 h-4 text-[#C5A059]" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-serif text-[#1A1A1A] leading-tight mb-1">{offer.title}</h4>
                {offer.code && (
                  <span className="text-[10px] bg-[#FAF8F5] text-[#C5A059] tracking-widest uppercase font-bold py-1 px-2 rounded border border-[#C5A059]/20 whitespace-nowrap">
                    {offer.code}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mb-1">{offer.description}</p>
              
              <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                {offer.minOrderAmount! > 0 && (
                  <span>Min Order: ₹{offer.minOrderAmount}</span>
                )}
                {offer.bankName && (
                  <span>Bank: {offer.bankName}</span>
                )}
                {offer.validTill && (
                  <span className="text-[#C5A059]">
                    Valid Till: {new Date(offer.validTill).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;
