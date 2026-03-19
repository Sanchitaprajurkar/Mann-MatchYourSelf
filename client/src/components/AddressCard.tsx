import { Edit, Trash2, Home, Building } from "lucide-react";
import { Address } from "../services/addressService";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
};

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string) => void;
  isSelected?: boolean;
  onSelect?: (addressId: string) => void;
  showSelection?: boolean;
}

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  onEdit,
  onDelete,
  isSelected = false,
  onSelect,
  showSelection = false,
}) => {
  const formatAddress = () => {
    const parts = [
      address.house,
      address.addressLine,
      address.locality,
      address.city,
      address.state,
      address.pincode,
    ].filter(Boolean);

    return parts.join(", ");
  };

  return (
    <div
      onClick={() => showSelection && onSelect && onSelect(address.id)}
      className={`flex flex-col h-full p-4 md:p-6 lg:p-8 bg-white cursor-pointer transition-all border-2 justify-between shadow-sm rounded-lg ${
        isSelected
          ? "border-[#C5A059]"
          : "border-transparent hover:border-gray-200"
      } ${showSelection ? "cursor-pointer" : ""}`}
    >
      <div className="flex-grow">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="flex items-center gap-2">
            {address.addressType === "HOME" ? (
              <Home size={12} className="text-gray-400" />
            ) : (
              <Building size={12} className="text-gray-400" />
            )}
            <span className="text-[8px] md:text-[9px] px-2 py-1 bg-gray-100 uppercase tracking-widest">
              {address.addressType}
            </span>
            {address.isDefault && (
              <span className="text-[8px] md:text-[9px] px-2 py-1 bg-[#C5A059] text-white uppercase tracking-widest">
                DEFAULT
              </span>
            )}
          </div>

          {!showSelection && (
            <div className="flex gap-2 md:gap-3 text-gray-300">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(address);
                }}
                className="hover:text-black transition-colors"
              >
                <Edit size={12} strokeWidth={1.5} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(address.id);
                }}
                className="hover:text-black transition-colors"
              >
                <Trash2 size={12} strokeWidth={1.5} />
              </button>
            </div>
          )}
        </div>

        <p className="font-bold text-sm mb-1">{address.name}</p>
        <p className="text-xs text-gray-500 leading-relaxed italic mb-2">
          {formatAddress()}
        </p>
        <p className="text-xs text-gray-400">{address.mobile}</p>

        {address.addressType === "OFFICE" && (
          <div className="mt-3 flex gap-3 text-[8px] md:text-[9px] text-gray-400">
            {address.openSaturday && <span>Sat</span>}
            {address.openSunday && <span>Sun</span>}
          </div>
        )}
      </div>

      {!showSelection && (
        <div className="mt-auto pt-4 md:pt-6 border-t border-gray-50 flex justify-end gap-3 md:gap-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(address);
            }}
            className="hover:text-black transition-colors"
          >
            <Edit size={12} strokeWidth={1.5} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(address.id);
            }}
            className="hover:text-black transition-colors"
          >
            <Trash2 size={12} strokeWidth={1.5} />
          </button>
        </div>
      )}
    </div>
  );
};

export default AddressCard;
