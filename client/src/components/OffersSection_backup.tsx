import React, { useState, useEffect } from 'react';
import { Percent, ChevronDown, ChevronUp, Tag } from 'lucide-react';

interface Offer {
  id: string;
  title: string;
  description: string;
  code?: string;
  discount: number;
  minAmount?: number;
  validUntil?: string;
  applicableCategories?: string[];
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
      // Mock data - replace with actual API call
      // const response = await fetch('/api/offers/active');
      // const data = await response.json();
      
      // Mock offers data
      const mockOffers: Offer[] = [
        {
          id: '1',
          title: 'Extra 10% OFF',
          description: 'On orders above ₹2000',
          code: 'EXTRA10',
          discount: 10,
          minAmount: 2000,
          validUntil: '2024-12-31'
        },
        {
          id: '2',
          title: 'Flat ₹200 OFF',
          description: 'On minimum purchase of ₹1000',
          code: 'FLAT200',
          discount: 200,
          minAmount: 1000,
          validUntil: '2024-12-25'
        },
        {
          id: '3',
          title: 'Free Shipping',
          description: 'On all orders above ₹500',
          discount: 0,
          minAmount: 500,
          validUntil: '2024-12-31'
        },
        {
          id: '4',
          title: 'Bank Offer',
          description: '5% instant discount on HDFC cards',
          discount: 5,
          validUntil: '2024-12-20'
        }
      ];
      
      setOffers(mockOffers);
      setError(null);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const displayOffers = showAll ? offers : offers.slice(0, 2);

  if (loading) {
    return (
      <div className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded mb-4 w-32"></div>
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
    <div className={`bg-white rounded-xl border border-gray-100 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Tag className="w-5 h-5 text-[#C5A059]" />
          <h3 className="text-lg font-serif text-[#1A1A1A]">Available Offers</h3>
        </div>
        {offers.length > 2 && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-[#C5A059] hover:underline text-sm flex items-center gap-1"
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
          <div key={offer.id} className="flex items-start gap-3 p-3 bg-[#FAF8F5] rounded-lg">
            <div className="flex-shrink-0 w-8 h-8 bg-[#C5A059] rounded-full flex items-center justify-center">
              <Percent className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-sm text-[#1A1A1A]">{offer.title}</h4>
              <p className="text-xs text-gray-600">{offer.description}</p>
              {offer.code && (
                <p className="text-xs text-[#C5A059] mt-1">Code: {offer.code}</p>
              )}
              {offer.validUntil && (
                <p className="text-xs text-gray-500 mt-1">Valid until: {offer.validUntil}</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OffersSection;
