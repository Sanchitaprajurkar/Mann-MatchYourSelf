import React, { useState, useEffect } from "react";
import API from "../utils/api";

interface Offer {
  _id: string;
  title: string;
  description: string;
  code: string;
  offerType: string;
  discountValue: number;
  minOrderAmount: number;
  bankName: string;
  validFrom: string;
  validTill: string;
  isActive: boolean;
  showOnCart: boolean;
  showOnCheckout: boolean;
  priority: number;
  usageLimit: number;
  usedCount: number;
}

const AdminOffers: React.FC = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    offerType: "info",
    discountValue: 0,
    minOrderAmount: 0,
    bankName: "",
    validFrom: "",
    validTill: "",
    isActive: true,
    showOnCart: true,
    showOnCheckout: true,
    priority: 0,
    usageLimit: 0,
  });

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/offers/admin");
      if (res.data.success) {
        setOffers(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch offers", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let finalValue = value;
    
    if (type === "checkbox") {
      finalValue = (e.target as HTMLInputElement).checked as any;
    } else if (type === "number") {
      finalValue = Number(value) as any;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: finalValue,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      code: "",
      offerType: "info",
      discountValue: 0,
      minOrderAmount: 0,
      bankName: "",
      validFrom: "",
      validTill: "",
      isActive: true,
      showOnCart: true,
      showOnCheckout: true,
      priority: 0,
      usageLimit: 0,
    });
    setEditingOffer(null);
    setShowForm(false);
  };

  const handleEdit = (offer: Offer) => {
    setEditingOffer(offer);
    setFormData({
      title: offer.title || "",
      description: offer.description || "",
      code: offer.code || "",
      offerType: offer.offerType || "info",
      discountValue: offer.discountValue || 0,
      minOrderAmount: offer.minOrderAmount || 0,
      bankName: offer.bankName || "",
      validFrom: offer.validFrom ? new Date(offer.validFrom).toISOString().slice(0, 16) : "",
      validTill: offer.validTill ? new Date(offer.validTill).toISOString().slice(0, 16) : "",
      isActive: offer.isActive ?? true,
      showOnCart: offer.showOnCart ?? true,
      showOnCheckout: offer.showOnCheckout ?? true,
      priority: offer.priority || 0,
      usageLimit: offer.usageLimit || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this offer forever?")) return;
    try {
      await API.delete(`/api/offers/admin/${id}`);
      fetchOffers();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await API.patch(`/api/offers/admin/${id}/toggle-active`);
      fetchOffers();
    } catch (error) {
      console.error("Failed to toggle", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const payload = { ...formData };
      if (!payload.validFrom) delete (payload as any).validFrom;
      if (!payload.validTill) delete (payload as any).validTill;
      if (payload.usageLimit === 0) delete (payload as any).usageLimit;

      if (editingOffer) {
        await API.put(`/api/offers/admin/${editingOffer._id}`, payload);
      } else {
        await API.post("/api/offers/admin", payload);
      }
      resetForm();
      fetchOffers();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save offer");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Offers Management</h1>
            <p className="text-[#6B6B6B] text-sm">Manage cart and checkout promotional offers.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#C5A059] transition-colors font-sans"
          >
            + Add Offer
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 mb-8">
            <h2 className="font-serif text-xl text-[#1A1A1A] mb-6">
              {editingOffer ? "Edit Offer" : "New Offer"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Title *</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Description *</label>
                  <input required name="description" value={formData.description} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Code (Optional)</label>
                  <input name="code" value={formData.code} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Offer Type</label>
                  <select name="offerType" value={formData.offerType} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none bg-transparent">
                    <option value="percentage">Percentage Off</option>
                    <option value="flat">Flat Off</option>
                    <option value="free_shipping">Free Shipping</option>
                    <option value="bank_offer">Bank Offer</option>
                    <option value="info">Informational only</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Discount Value</label>
                  <input type="number" name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Min Order Amount</label>
                  <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Bank Name</label>
                  <input name="bankName" value={formData.bankName} onChange={handleInputChange} placeholder="e.g. HDFC Bank" className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Priority (Higher shows first)</label>
                  <input type="number" name="priority" value={formData.priority} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Valid From</label>
                  <input type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Valid Till</label>
                  <input type="datetime-local" name="validTill" value={formData.validTill} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="showOnCart" checked={formData.showOnCart} onChange={handleInputChange} /> Show on Cart</label>
                <label className="flex items-center gap-2"><input type="checkbox" name="showOnCheckout" checked={formData.showOnCheckout} onChange={handleInputChange} /> Show on Checkout</label>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#E6E6E6]">
                <button type="submit" disabled={submitting} className="bg-[#1A1A1A] text-white px-8 py-3 rounded hover:bg-[#C5A059] transition flex-1">
                  {submitting ? "Saving..." : "Save Offer"}
                </button>
                <button type="button" onClick={resetForm} className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 rounded hover:text-[#C5A059] hover:border-[#C5A059] flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading offers...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {offers.map(offer => (
              <div key={offer._id} className="bg-white border border-[#E6E6E6] p-6 rounded-xl flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-serif text-lg text-[#1A1A1A]">{offer.title}</h3>
                    <span className={`text-[10px] px-2 py-1 rounded uppercase tracking-wider font-bold ${offer.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {offer.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  <p className="text-sm text-[#6B6B6B] mb-4">{offer.description}</p>
                  
                  <div className="space-y-1 text-xs text-[#6B6B6B]">
                    {offer.code && <p><span className="font-bold text-[#1A1A1A]">Code:</span> {offer.code}</p>}
                    <p><span className="font-bold text-[#1A1A1A]">Type:</span> {offer.offerType}</p>
                    {offer.minOrderAmount > 0 && <p><span className="font-bold text-[#1A1A1A]">Min Order:</span> ₹{offer.minOrderAmount}</p>}
                    <p><span className="font-bold text-[#1A1A1A]">Visibility:</span> {offer.showOnCart ? 'Cart' : ''} {offer.showOnCheckout ? 'Checkout' : ''}</p>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E6E6E6] flex gap-2">
                  <button onClick={() => handleEdit(offer)} className="flex-1 border text-sm py-2 rounded border-[#E6E6E6] hover:border-[#C5A059] hover:text-[#C5A059]">Edit</button>
                  <button onClick={() => handleToggleActive(offer._id)} className="flex-1 border text-sm py-2 rounded border-[#E6E6E6] hover:bg-gray-50">{offer.isActive ? 'Deactivate' : 'Activate'}</button>
                  <button onClick={() => handleDelete(offer._id)} className="flex-1 border text-sm py-2 rounded border-red-200 text-red-600 hover:bg-red-50">Delete</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOffers;
