import React, { useState, useEffect } from "react";
import { MapPin, Plus, Edit, Trash2 } from "lucide-react";
import AddressForm from "../../components/AddressForm";
import AddressCard from "../../components/AddressCard";
import {
  addressService,
  Address,
  CreateAddressData,
} from "../../services/addressService";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
};

const AccountAddresses = () => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Fetch addresses from backend
  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      setLoading(true);
      setError(null);
      const fetchedAddresses = await addressService.getAddresses();
      setAddresses(fetchedAddresses);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch addresses",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAddress = async (addressData: CreateAddressData) => {
    try {
      setSubmitting(true);
      setError(null);

      // Validate address data
      const validation = addressService.validateAddress(addressData);
      if (!validation.isValid) {
        setError(validation.errors.join(", "));
        return;
      }

      let savedAddress: Address;
      if (editingAddress) {
        // Update existing address
        savedAddress = await addressService.updateAddress(
          editingAddress._id,
          addressData,
        );
        setAddresses((prev) =>
          prev.map((addr) =>
            addr._id === editingAddress._id ? savedAddress : addr,
          ),
        );
        setEditingAddress(null);
      } else {
        // Add new address
        savedAddress = await addressService.createAddress(addressData);
        setAddresses((prev) => [...prev, savedAddress]);
      }

      setShowAddForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save address");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setShowAddForm(true);
    setError(null);
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!window.confirm("Are you sure you want to delete this address?")) {
      return;
    }

    try {
      setError(null);
      await addressService.deleteAddress(addressId);
      setAddresses((prev) => prev.filter((addr) => addr._id !== addressId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete address");
    }
  };

  const handleSetDefault = async (addressId: string) => {
    try {
      setError(null);
      const updatedAddress = await addressService.setDefaultAddress(addressId);
      setAddresses((prev) =>
        prev.map((addr) => ({
          ...addr,
          isDefault: addr._id === addressId,
        })),
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to set default address",
      );
    }
  };

  const handleRetry = () => {
    fetchAddresses();
  };

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="w-8 h-8 border-2 border-gray-300 border-t-[#C5A059] rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-sm text-gray-500">Loading your addresses...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 md:mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2
            className="font-serif text-2xl md:text-3xl tracking-tight"
            style={{ color: COLORS.black }}
          >
            Saved Addresses
          </h2>
          <p className="text-[9px] md:text-[10px] tracking-[0.3em] uppercase text-gray-400 mt-1 md:mt-2 italic">
            Manage your delivery locations for faster checkout
          </p>
        </div>
        {!showAddForm && (
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 md:px-6 md:py-3 rounded-lg transition-all flex items-center gap-2 text-[10px] font-bold tracking-[0.3em] uppercase self-start sm:self-auto"
            style={{
              backgroundColor: COLORS.black,
              color: "#FFFFFF",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.gold)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor = COLORS.black)
            }
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Add Address</span>
            <span className="sm:hidden">Add</span>
          </button>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 md:mb-6 p-3 md:p-4 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-medium text-red-800">Error</h4>
              <p className="text-sm text-red-600 mt-1">{error}</p>
            </div>
            <button
              onClick={handleRetry}
              className="text-sm text-red-600 hover:text-red-800 underline flex-shrink-0"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* Add/Edit Address Form */}
      {showAddForm && (
        <AddressForm
          onSave={handleSaveAddress}
          onCancel={() => {
            setShowAddForm(false);
            setEditingAddress(null);
            setError(null);
          }}
          initialData={
            editingAddress
              ? {
                  name: editingAddress.name,
                  mobile: editingAddress.mobile,
                  pincode: editingAddress.pincode,
                  state: editingAddress.state,
                  house: editingAddress.house,
                  addressLine: editingAddress.addressLine,
                  locality: editingAddress.locality,
                  city: editingAddress.city,
                  addressType: editingAddress.addressType,
                  openSaturday: editingAddress.openSaturday,
                  openSunday: editingAddress.openSunday,
                  isDefault: editingAddress.isDefault,
                }
              : undefined
          }
        />
      )}

      {/* Addresses List */}
      {!showAddForm && (
        <>
          {addresses.length === 0 ? (
            // Empty State
            <div className="text-center py-12 md:py-16">
              <div
                className="w-12 h-12 md:w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 md:mb-6"
                style={{ backgroundColor: COLORS.cream }}
              >
                <MapPin
                  className="w-6 h-6 md:w-8 h-8"
                  style={{ color: COLORS.gold }}
                />
              </div>
              <h3
                className="font-serif text-xl md:text-2xl mb-3 md:mb-4"
                style={{ color: COLORS.black }}
              >
                No Addresses Saved
              </h3>
              <p className="mb-6 md:mb-8 text-gray-500 leading-relaxed px-4 md:px-0">
                You haven't saved any addresses yet. Add your first address to
                make checkout faster.
              </p>
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 md:px-8 md:py-4 rounded-lg transition-all flex items-center gap-2 mx-auto text-[10px] font-bold tracking-[0.3em] uppercase"
                style={{
                  backgroundColor: COLORS.black,
                  color: "#FFFFFF",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.backgroundColor = COLORS.gold)
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.backgroundColor = COLORS.black)
                }
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Add Your First Address</span>
                <span className="sm:hidden">Add Address</span>
              </button>
            </div>
          ) : (
            // Addresses Grid
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-7xl mx-auto">
              {addresses.map((address) => (
                <div key={address._id} className="relative h-full">
                  <AddressCard
                    address={address}
                    onEdit={handleEditAddress}
                    onDelete={handleDeleteAddress}
                    showSelection={false}
                  />

                  {/* Set Default Button */}
                  {!address.isDefault && (
                    <button
                      onClick={() => handleSetDefault(address._id)}
                      className="mt-3 text-[9px] uppercase tracking-widest text-gray-400 hover:text-[#C5A059] transition-colors"
                    >
                      <span className="hidden sm:inline">Set as Default</span>
                      <span className="sm:hidden">Default</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AccountAddresses;
