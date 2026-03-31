import React, { useState } from "react";
import {
  addressService,
  CreateAddressData,
  PostalLookupResult,
} from "../services/addressService";

const COLORS = { gold: "#C5A059", black: "#1A1A1A", cream: "#FAF8F5", border: "#E5E5E5" };

interface AddressFormProps {
  onSave: (address: CreateAddressData) => void;
  onCancel: () => void;
  initialData?: CreateAddressData;
}

const AddressForm: React.FC<AddressFormProps> = ({ onSave, onCancel, initialData }) => {
  const [form, setForm] = useState<CreateAddressData>(
    initialData || {
      name: "",
      mobile: "",
      pincode: "",
      state: "",
      house: "",
      addressLine: "",
      locality: "",
      city: "",
      addressType: "HOME",
      openSaturday: false,
      openSunday: false,
      isDefault: false,
    }
  );
  const [lookupMessage, setLookupMessage] = useState("");
  const [isLookupLoading, setIsLookupLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    const nextValue =
      type === "checkbox"
        ? checked
        : name === "pincode"
          ? value.replace(/\D/g, "").slice(0, 6)
          : value;

    setForm({ ...form, [name]: nextValue as never });
  };

  const applyLookupResult = (lookup: PostalLookupResult, source: "pincode" | "city") => {
    setForm((prev) => ({
      ...prev,
      pincode: lookup.pincode || prev.pincode,
      state: lookup.state || prev.state,
      city: lookup.city || prev.city,
      locality: prev.locality || lookup.locality || "",
    }));
    setLookupMessage(
      source === "pincode"
        ? "City and state auto-filled from pincode."
        : "Pincode and state auto-filled from city.",
    );
  };

  const handlePincodeBlur = async () => {
    if (form.pincode.trim().length !== 6) return;

    setIsLookupLoading(true);
    const lookup = await addressService.lookupByPincode(form.pincode);
    setIsLookupLoading(false);

    if (lookup) {
      applyLookupResult(lookup, "pincode");
    } else {
      setLookupMessage("Could not auto-fill location from this pincode.");
    }
  };

  const handleCityBlur = async () => {
    if (form.city.trim().length < 3) return;

    setIsLookupLoading(true);
    const lookup = await addressService.lookupByCity(form.city);
    setIsLookupLoading(false);

    if (lookup) {
      applyLookupResult(lookup, "city");
    } else {
      setLookupMessage("Could not auto-fill pincode from this city.");
    }
  };

  const handleSubmit = () => {
    // Sanitize data before sending
    const sanitizedData: CreateAddressData = {
      name: form.name.trim(),
      mobile: form.mobile.trim().replace(/\s+/g, ''), // Remove all spaces
      pincode: form.pincode.trim().replace(/\s+/g, ''), // Remove all spaces
      state: form.state.trim(),
      house: form.house.trim(),
      addressLine: form.addressLine.trim(),
      locality: form.locality.trim(),
      city: form.city.trim(),
      addressType: form.addressType,
      openSaturday: form.openSaturday,
      openSunday: form.openSunday,
      isDefault: form.isDefault,
    };

    // Normalize mobile number - ensure it starts with +91
    if (sanitizedData.mobile && !sanitizedData.mobile.startsWith('+91')) {
      // Remove any leading 0 or 91
      let cleanMobile = sanitizedData.mobile.replace(/^(0|91)/, '');
      sanitizedData.mobile = `+91${cleanMobile}`;
    }

    // Ensure pincode is exactly 6 digits
    if (sanitizedData.pincode) {
      sanitizedData.pincode = sanitizedData.pincode.replace(/\D/g, '').slice(0, 6);
    }

    onSave(sanitizedData);
  };

  return (
    <div className="bg-white p-8 border border-gray-100 shadow-sm">
      <h3 className="text-[11px] font-bold tracking-[0.2em] uppercase mb-8 flex items-center gap-2">
        <span className="text-[#C5A059]">+</span> Add New Address
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-gray-400">Full Name *</label>
          <input 
            name="name" 
            placeholder="Enter your full name"
            value={form.name} 
            onChange={handleChange} 
            className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-gray-400">Mobile *</label>
          <input 
            name="mobile" 
            placeholder="+91 98765 43210"
            value={form.mobile} 
            onChange={handleChange} 
            className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
          />
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-gray-400">Pincode *</label>
          <input 
            name="pincode" 
            placeholder="400001"
            value={form.pincode} 
            onChange={handleChange} 
            onBlur={handlePincodeBlur}
            className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
          />
          <p className="text-[10px] text-gray-400 mt-1">
            Enter pincode to auto-fill city and state
          </p>
        </div>
        <div className="space-y-1">
          <label className="text-[9px] uppercase tracking-widest text-gray-400">State *</label>
          <input 
            name="state" 
            placeholder="Maharashtra"
            value={form.state} 
            onChange={handleChange} 
            className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
          />
        </div>
      </div>

      <div className="md:col-span-2 space-y-1 mt-6">
        <label className="text-[9px] uppercase tracking-widest text-gray-400">House No / Tower / Block *</label>
        <input 
          name="house" 
          placeholder="123, Tower A, Block B"
          value={form.house} 
          onChange={handleChange} 
          className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
        />
      </div>

      <div className="md:col-span-2 space-y-1 mt-6">
        <label className="text-[9px] uppercase tracking-widest text-gray-400">Building, Street, Area *</label>
        <input 
          name="addressLine" 
          placeholder="Silk Weaver's Lane, Heritage Complex"
          value={form.addressLine} 
          onChange={handleChange} 
          className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
        />
      </div>

      <div className="md:col-span-2 space-y-1 mt-6">
        <label className="text-[9px] uppercase tracking-widest text-gray-400">Locality / Town *</label>
        <input 
          name="locality" 
          placeholder="Old Nashik"
          value={form.locality} 
          onChange={handleChange} 
          className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
        />
      </div>

      <div className="md:col-span-2 space-y-1 mt-6">
        <label className="text-[9px] uppercase tracking-widest text-gray-400">City / District *</label>
        <input 
          name="city" 
          placeholder="Nashik"
          value={form.city} 
          onChange={handleChange} 
          onBlur={handleCityBlur}
          className="w-full border-b border-gray-200 py-2 focus:border-[#C5A059] outline-none text-sm bg-transparent" 
        />
        <p className="text-[10px] text-gray-400 mt-1">
          Enter city to auto-fill pincode and state
        </p>
      </div>

      {(lookupMessage || isLookupLoading) && (
        <div className="mt-4 text-[11px] text-gray-500">
          {isLookupLoading ? "Looking up location..." : lookupMessage}
        </div>
      )}

      {/* Address Type */}
      <div className="mt-8">
        <p className="text-[9px] uppercase tracking-widest text-gray-400 mb-4">Type of Address</p>
        <div className="flex gap-6">
          {["HOME", "OFFICE"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="addressType"
                value={type}
                checked={form.addressType === type}
                onChange={handleChange}
                className="text-[#C5A059] focus:ring-[#C5A059]"
              />
              <span className="text-sm">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Office Options */}
      {form.addressType === "OFFICE" && (
        <div className="mt-6 space-y-3">
          <label className="flex gap-2 items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="openSaturday" 
              checked={form.openSaturday} 
              onChange={handleChange}
              className="text-[#C5A059] focus:ring-[#C5A059]" 
            />
            <span className="text-sm">Open on Saturday</span>
          </label>
          <label className="flex gap-2 items-center cursor-pointer">
            <input 
              type="checkbox" 
              name="openSunday" 
              checked={form.openSunday} 
              onChange={handleChange}
              className="text-[#C5A059] focus:ring-[#C5A059]" 
            />
            <span className="text-sm">Open on Sunday</span>
          </label>
        </div>
      )}

      {/* Default */}
      <label className="flex gap-2 items-center mt-8 cursor-pointer">
        <input 
          type="checkbox" 
          name="isDefault" 
          checked={form.isDefault} 
          onChange={handleChange}
          className="text-[#C5A059] focus:ring-[#C5A059]" 
        />
        <span className="text-sm">Make this my default address</span>
      </label>

      {/* Actions */}
      <div className="mt-10 flex items-center gap-4">
        <button
          onClick={handleSubmit}
          className="px-10 py-4 bg-black text-white text-[10px] font-bold tracking-[0.3em] uppercase hover:bg-[#C5A059] transition-all"
        >
          Save Address
        </button>
        <button 
          onClick={onCancel} 
          className="px-10 py-4 border border-gray-200 text-[10px] font-bold tracking-[0.3em] uppercase hover:border-[#C5A059] hover:text-[#C5A059] transition-all"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddressForm;
