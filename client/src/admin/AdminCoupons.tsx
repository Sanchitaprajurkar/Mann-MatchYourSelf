import React, { useState, useEffect } from "react";
import API from "../utils/api";

interface Coupon {
  _id: string;
  title: string;
  description: string;
  code: string;
  discountType: string;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount: number;
  validFrom: string;
  validTill: string;
  isActive: boolean;
  usageLimit: number;
  usedCount: number;
  userUsageLimit: number;
}

const AdminCoupons: React.FC = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscountAmount: 0,
    validFrom: "",
    validTill: "",
    isActive: true,
    usageLimit: 0,
    userUsageLimit: 1,
  });

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await API.get("/api/coupons/admin");
      if (res.data.success) {
        setCoupons(res.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch coupons", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
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
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscountAmount: 0,
      validFrom: "",
      validTill: "",
      isActive: true,
      usageLimit: 0,
      userUsageLimit: 1,
    });
    setEditingCoupon(null);
    setShowForm(false);
  };

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title || "",
      description: coupon.description || "",
      code: coupon.code || "",
      discountType: coupon.discountType || "percentage",
      discountValue: coupon.discountValue || 0,
      minOrderAmount: coupon.minOrderAmount || 0,
      maxDiscountAmount: coupon.maxDiscountAmount || 0,
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().slice(0, 16) : "",
      validTill: coupon.validTill ? new Date(coupon.validTill).toISOString().slice(0, 16) : "",
      isActive: coupon.isActive ?? true,
      usageLimit: coupon.usageLimit || 0,
      userUsageLimit: coupon.userUsageLimit || 1,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this coupon forever?")) return;
    try {
      await API.delete(`/api/coupons/admin/${id}`);
      fetchCoupons();
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await API.patch(`/api/coupons/admin/${id}/toggle-active`);
      fetchCoupons();
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
      if (payload.maxDiscountAmount === 0) delete (payload as any).maxDiscountAmount;

      if (editingCoupon) {
        await API.put(`/api/coupons/admin/${editingCoupon._id}`, payload);
      } else {
        await API.post("/api/coupons/admin", payload);
      }
      resetForm();
      fetchCoupons();
    } catch (error: any) {
      alert(error.response?.data?.message || "Failed to save coupon");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F7F7] min-h-screen">
      <div className="max-w-[1440px] mx-auto px-8 py-10">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="font-serif text-3xl text-[#1A1A1A] mb-2">Coupons Management</h1>
            <p className="text-[#6B6B6B] text-sm">Create and manage discount codes for customers.</p>
          </div>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="bg-[#1A1A1A] text-white px-6 py-3 rounded-lg hover:bg-[#C5A059] transition-colors font-sans"
          >
            + Add Coupon
          </button>
        </div>

        {showForm && (
          <div className="bg-white border border-[#E6E6E6] rounded-xl p-8 mb-8">
            <h2 className="font-serif text-xl text-[#1A1A1A] mb-6">
              {editingCoupon ? "Edit Coupon" : "New Coupon"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Code *</label>
                  <input required name="code" value={formData.code} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none uppercase" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Title *</label>
                  <input required name="title" value={formData.title} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Description</label>
                  <input name="description" value={formData.description} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Discount Type</label>
                  <select name="discountType" value={formData.discountType} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none bg-transparent">
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                    <option value="free_shipping">Free Shipping</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Discount Value * {formData.discountType === 'percentage' ? '(%)' : '(₹)'}</label>
                  <input type="number" required name="discountValue" value={formData.discountValue} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Min Order Amount (₹)</label>
                  <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Max Discount Amount (₹)</label>
                  <input type="number" name="maxDiscountAmount" value={formData.maxDiscountAmount} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" placeholder="Only for percentage" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Total Global Usage Limit</label>
                  <input type="number" name="usageLimit" value={formData.usageLimit} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" placeholder="0 = unlimited" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Valid From</label>
                  <input type="datetime-local" name="validFrom" value={formData.validFrom} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.3em] text-[#6B6B6B] mb-2">Valid Till</label>
                  <input type="datetime-local" name="validTill" value={formData.validTill} onChange={handleInputChange} className="w-full border-b border-[#E6E6E6] py-2 focus:border-[#C5A059] outline-none" />
                </div>
                <div className="flex gap-6 mt-4 items-center md:col-span-2">
                  <label className="flex items-center gap-2"><input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleInputChange} /> Active Status</label>
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-[#E6E6E6]">
                <button type="submit" disabled={submitting} className="bg-[#1A1A1A] text-white px-8 py-3 rounded hover:bg-[#C5A059] transition flex-1">
                  {submitting ? "Saving..." : "Save Coupon"}
                </button>
                <button type="button" onClick={resetForm} className="border border-[#1A1A1A] text-[#1A1A1A] px-8 py-3 rounded hover:text-[#C5A059] hover:border-[#C5A059] flex-1">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {loading ? (
          <p>Loading coupons...</p>
        ) : (
          <div className="bg-white border border-[#E6E6E6] rounded-xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap">
                <thead className="bg-[#FAF8F5] border-b border-[#E6E6E6]">
                  <tr>
                    <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Code</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Title</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Value</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Validation</th>
                    <th className="text-left py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Limits</th>
                    <th className="text-center py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Status</th>
                    <th className="text-right py-4 px-6 text-[10px] uppercase tracking-[0.2em] text-[#6B6B6B] font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E6E6E6]">
                  {coupons.map((coupon) => (
                    <tr key={coupon._id} className="hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-6">
                        <span className="font-bold text-[#1A1A1A] bg-gray-100 px-2 py-1 rounded cursor-copy" title="Copy">{coupon.code}</span>
                      </td>
                      <td className="py-4 px-6 font-serif text-[#1A1A1A]">{coupon.title}</td>
                      <td className="py-4 px-6 text-sm text-[#6B6B6B]">
                        {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : `₹${coupon.discountValue}`}
                        <span className="block text-[10px] text-gray-400">Type: {coupon.discountType}</span>
                      </td>
                      <td className="py-4 px-6 text-[#6B6B6B] text-xs space-y-1">
                        {coupon.minOrderAmount > 0 && <p>Min: ₹{coupon.minOrderAmount}</p>}
                        {coupon.maxDiscountAmount > 0 && <p>Max: ₹{coupon.maxDiscountAmount}</p>}
                      </td>
                      <td className="py-4 px-6 text-[#6B6B6B] text-xs">
                        <p>Total: {coupon.usedCount} / {coupon.usageLimit || '∞'}</p>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className={`text-[10px] px-2 py-1 rounded-full uppercase tracking-wider font-bold ${coupon.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-3">
                        <button onClick={() => handleEdit(coupon)} className="text-[#C5A059] hover:text-[#1A1A1A] text-sm font-medium">Edit</button>
                        <button onClick={() => handleToggleActive(coupon._id)} className="text-blue-500 hover:text-blue-700 text-sm font-medium">{coupon.isActive ? 'Disable' : 'Enable'}</button>
                        <button onClick={() => handleDelete(coupon._id)} className="text-red-500 hover:text-red-700 text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {coupons.length === 0 && (
              <div className="p-12 text-center text-[#6B6B6B]">
                No coupons found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
