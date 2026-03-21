import React, { useState, useEffect } from "react";
import {
  addressService,
  Address,
  CreateAddressData,
} from "../services/addressService";
import { MapPin, Check, X, Plus } from "lucide-react";
import AddressForm from "./AddressForm";

interface AddressSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAddressId: string;
  onAddressSelect: (address: Address) => void;
}

const AddressSelectionModal: React.FC<AddressSelectionModalProps> = ({
  isOpen,
  onClose,
  selectedAddressId,
  onAddressSelect,
}) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddAddressForm, setShowAddAddressForm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchAddresses();
    }
  }, [isOpen]);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const data = await addressService.getAddresses();
      setAddresses(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to fetch addresses");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAddress = (address: Address) => {
    onAddressSelect(address);
    onClose();
  };

  const handleAddAddress = async (addressData: CreateAddressData) => {
    try {
      console.log("🏠 Adding address:", addressData);
      const newAddress = await addressService.createAddress(addressData);
      console.log("🏠 Address added successfully:", newAddress);
      setAddresses((prev) => [...prev, newAddress]);
      setShowAddAddressForm(false);
      // Auto-select the newly created address
      handleSelectAddress(newAddress);
    } catch (err: any) {
      console.error("🏠 Failed to add address:", err);
      setError(err.message || "Failed to add address");
    }
  };

  const handleAddAddressClick = () => {
    setShowAddAddressForm(true);
  };

  const handleCancelAddAddress = () => {
    setShowAddAddressForm(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-xl font-serif text-[#1A1A1A]">
            {showAddAddressForm ? "Add New Address" : "Select Delivery Address"}
          </h2>
          <button
            onClick={showAddAddressForm ? handleCancelAddAddress : onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {showAddAddressForm ? (
            <AddressForm
              onSave={handleAddAddress}
              onCancel={handleCancelAddAddress}
            />
          ) : (
            <>
              {loading ? (
                <div className="text-center py-8">
                  <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading addresses...</p>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchAddresses}
                    className="text-[#C5A059] hover:underline"
                  >
                    Try Again
                  </button>
                </div>
              ) : addresses.length === 0 ? (
                <div className="text-center py-8">
                  <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No saved addresses</p>
                  <button
                    onClick={handleAddAddressClick}
                    className="bg-[#C5A059] text-white px-6 py-2 rounded-lg hover:bg-[#B8941F] transition-colors"
                  >
                    <Plus className="w-4 h-4 inline mr-2" />
                    Add New Address
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-4 mb-6">
                    {addresses.map((address) => (
                      <div
                        key={address._id}
                        onClick={() => handleSelectAddress(address)}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${
                          selectedAddressId === address._id
                            ? "border-[#C5A059] bg-[#FAF8F5]"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <p className="font-medium text-sm">
                                {address.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {address.mobile}
                              </p>
                              {address.isDefault && (
                                <span className="px-2 py-1 text-xs rounded bg-[#FAF8F5] text-[#C5A059]">
                                  Default
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">
                              {address.house}, {address.addressLine},{" "}
                              {address.locality}
                            </p>
                            <p className="text-sm text-gray-600">
                              {address.city}, {address.pincode}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {address.addressType}
                            </p>
                          </div>
                          <div className="ml-4">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                                selectedAddressId === address._id
                                  ? "border-[#C5A059] bg-[#C5A059]"
                                  : "border-gray-300"
                              }`}
                            >
                              {selectedAddressId === address._id && (
                                <Check className="w-3 h-3 text-white" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Address Button */}
                  <button
                    onClick={handleAddAddressClick}
                    className="w-full py-3 border border-[#C5A059] text-[#C5A059] rounded-lg hover:bg-[#C5A059] hover:text-white transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Add New Address
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddressSelectionModal;
