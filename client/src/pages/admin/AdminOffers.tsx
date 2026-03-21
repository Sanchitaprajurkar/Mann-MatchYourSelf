import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  EyeOff, 
  Search, 
  Filter,
  ChevronDown,
  Calendar,
  Tag,
  Percent,
  CreditCard,
  Truck
} from 'lucide-react';

interface Offer {
  _id: string;
  title: string;
  description: string;
  code?: string;
  discountType: 'percentage' | 'flat' | 'free_shipping' | 'bank_offer';
  discountValue: number;
  minOrderAmount: number;
  bankName?: string;
  validTill?: string;
  isActive: boolean;
  showOnCart: boolean;
  showOnCheckout: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

const AdminOffers: React.FC = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/offers', {
        headers: {
          'Authorization': Bearer 
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch offers');
      }
      
      const data = await response.json();
      setOffers(data.offers || []);
    } catch (err: any) {
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (offerId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(/api/admin/offers/, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': Bearer 
        },
        body: JSON.stringify({ isActive: !currentStatus })
      });

      if (!response.ok) {
        throw new Error('Failed to update offer');
      }

      setOffers(prev => prev.map(offer => 
        offer._id === offerId ? { ...offer, isActive: !currentStatus } : offer
      ));
    } catch (err: any) {
      setError(err.message || 'Failed to update offer');
    }
  };

  const handleDelete = async (offerId: string) => {
    if (!window.confirm('Are you sure you want to delete this offer?')) {
      return;
    }

    try {
      const response = await fetch(/api/admin/offers/, {
        method: 'DELETE',
        headers: {
          'Authorization': Bearer 
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete offer');
      }

      setOffers(prev => prev.filter(offer => offer._id !== offerId));
    } catch (err: any) {
      setError(err.message || 'Failed to delete offer');
    }
  };

  const getDiscountIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'flat':
        return <Tag className="w-4 h-4" />;
      case 'free_shipping':
        return <Truck className="w-4 h-4" />;
      case 'bank_offer':
        return <CreditCard className="w-4 h-4" />;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const getDiscountText = (offer: Offer) => {
    switch (offer.discountType) {
      case 'percentage':
        return ${offer.discountValue}% OFF;
      case 'flat':
        return ? OFF;
      case 'free_shipping':
        return 'Free Shipping';
      case 'bank_offer':
        return ${offer.bankName} - % OFF;
      default:
        return '';
    }
  };

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         offer.code?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || 
                          (filterStatus === 'active' && offer.isActive) ||
                          (filterStatus === 'inactive' && !offer.isActive);
    
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-64 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-16 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={fetchOffers}
            className="bg-[#C5A059] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-serif text-[#1A1A1A] mb-2">Offers Management</h1>
          <p className="text-gray-600">Manage promotional offers and discounts</p>
        </div>
        <button
          onClick={() => navigate('/admin/offers/add')}
          className="bg-[#C5A059] text-white px-6 py-3 rounded-lg hover:bg-[#B8941F] transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Offer
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-xl border border-gray-100 p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search offers by title or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:border-[#C5A059] focus:ring-1 focus:ring-[#C5A059]/20 outline-none"
            />
          </div>

          {/* Status Filter */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:border-[#C5A059] transition-colors"
            >
              <Filter className="w-4 h-4" />
              <span>
                {filterStatus === 'all' ? 'All Offers' : 
                 filterStatus === 'active' ? 'Active' : 'Inactive'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showFilters && (
              <div className="absolute top-full mt-2 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[150px]">
                <button
                  onClick={() => { setFilterStatus('all'); setShowFilters(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  All Offers
                </button>
                <button
                  onClick={() => { setFilterStatus('active'); setShowFilters(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Active
                </button>
                <button
                  onClick={() => { setFilterStatus('inactive'); setShowFilters(false); }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 transition-colors"
                >
                  Inactive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Offers Table */}
      <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
        {filteredOffers.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-serif text-[#1A1A1A] mb-2">No offers found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filters'
                : 'Get started by creating your first offer'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => navigate('/admin/offers/add')}
                className="bg-[#C5A059] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
              >
                Create First Offer
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Min Order
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Till
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Placement
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOffers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-[#1A1A1A]">{offer.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{offer.description}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {offer.code ? (
                        <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">
                          {offer.code}
                        </span>
                      ) : (
                        <span className="text-sm text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="text-[#C5A059]">
                          {getDiscountIcon(offer.discountType)}
                        </div>
                        <span className="font-medium">{getDiscountText(offer)}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">
                        {offer.minOrderAmount > 0 
                          ? ?
                          : 'No minimum'
                        }
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {offer.validTill 
                            ? new Date(offer.validTill).toLocaleDateString('en-IN')
                            : 'No expiry'
                          }
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(offer._id, offer.isActive)}
                        className={inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium transition-colors }
                      >
                        {offer.isActive ? (
                          <>
                            <Eye className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <EyeOff className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        {offer.showOnCart && (
                          <span className="inline-block px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded">
                            Cart
                          </span>
                        )}
                        {offer.showOnCheckout && (
                          <span className="inline-block px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                            Checkout
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium">{offer.priority}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => navigate(/admin/offers/edit/)}
                          className="p-2 text-gray-500 hover:text-[#C5A059] hover:bg-[#FAF8F5] rounded-lg transition-colors"
                          title="Edit Offer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id)}
                          className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
