import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Trash2,
  ShieldAlert,
  ArrowRight,
  Mail,
} from "lucide-react";
import { deleteUserAccount } from "../../services/userService";

const COLORS = {
  gold: "#C5A059",
  black: "#1A1A1A",
  cream: "#FAF8F5",
  border: "#E5E5E5",
  textMuted: "#6B7280",
  danger: "#9F2D2D",
};

const AccountDelete = () => {
  const navigate = useNavigate();
  const [confirmation, setConfirmation] = useState("");
  const [understand, setUnderstand] = useState(false);
  const [acceptLoss, setAcceptLoss] = useState(false);
  const [acceptRecovery, setAcceptRecovery] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  const canDelete = useMemo(
    () =>
      confirmation.trim().toUpperCase() === "DELETE" &&
      understand &&
      acceptLoss &&
      acceptRecovery &&
      !isDeleting,
    [acceptLoss, acceptRecovery, confirmation, isDeleting, understand],
  );

  const handleDelete = async () => {
    if (!canDelete) {
      setError("Please complete all confirmations before deleting your account.");
      return;
    }

    setError("");
    setIsDeleting(true);

    try {
      await deleteUserAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("adminToken");
      localStorage.removeItem("adminUser");
      window.dispatchEvent(new CustomEvent("user-logout"));
      navigate("/", { replace: true });
    } catch (apiError: any) {
      if (apiError.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        window.dispatchEvent(new CustomEvent("user-logout"));
        navigate("/login", {
          replace: true,
          state: {
            message: "Your session expired. Please sign in again to delete your account.",
          },
        });
        return;
      }

      setError(
        apiError.message ||
          apiError.response?.data?.message ||
          "Failed to delete account. Please try again.",
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="border-b border-gray-100 pb-6">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C5A059] mb-3">
          Account Control
        </p>
        <h2 className="text-3xl font-serif text-[#1A1A1A]">Delete Account</h2>
        <p className="text-sm text-[#6B7280] mt-2 max-w-2xl leading-relaxed">
          If you’re certain, you can permanently remove your MANN account and
          associated personal data from this experience.
        </p>
      </div>

      <div className="bg-[#FFF8F3] border rounded-2xl p-6 md:p-8" style={{ borderColor: "#F0D9C2" }}>
        <div className="flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-[#9F2D2D] mt-0.5" />
          <div>
            <h3 className="font-semibold text-[#1A1A1A] mb-2">
              This action is permanent
            </h3>
            <p className="text-sm text-[#6B7280]">
              Once deleted, the account cannot be restored. This will remove:
            </p>
            <ul className="mt-3 text-sm text-[#6B7280] list-disc list-inside space-y-1">
              <li>Your personal information and profile data</li>
              <li>Order records associated with this account</li>
              <li>Saved addresses</li>
              <li>Reviews and uploaded review images</li>
              <li>Wishlist and shopping cart items</li>
              <li>Any account-linked preferences and settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border rounded-2xl p-6 md:p-8 shadow-sm" style={{ borderColor: COLORS.border }}>
        <h3 className="font-serif text-xl text-[#1A1A1A] mb-2">
          Before you continue
        </h3>
        <p className="text-sm text-[#6B7280] mb-6 leading-relaxed">
          We need a final confirmation to help prevent accidental deletion.
        </p>

        <div className="space-y-4 mb-6">
          <label className="flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#EFE7DB] cursor-pointer">
            <input
              type="checkbox"
              id="understand"
              checked={understand}
              onChange={(e) => setUnderstand(e.target.checked)}
              className="w-4 h-4 accent-[#C5A059]"
            />
            <span className="text-sm text-[#1A1A1A]">
              I understand that this action is irreversible
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#EFE7DB] cursor-pointer">
            <input
              type="checkbox"
              id="data-loss"
              checked={acceptLoss}
              onChange={(e) => setAcceptLoss(e.target.checked)}
              className="w-4 h-4 accent-[#C5A059]"
            />
            <span className="text-sm text-[#1A1A1A]">
              I understand that all my data will be permanently lost
            </span>
          </label>

          <label className="flex items-center gap-3 p-4 bg-[#FAF8F5] rounded-xl border border-[#EFE7DB] cursor-pointer">
            <input
              type="checkbox"
              id="no-recovery"
              checked={acceptRecovery}
              onChange={(e) => setAcceptRecovery(e.target.checked)}
              className="w-4 h-4 accent-[#C5A059]"
            />
            <span className="text-sm text-[#1A1A1A]">
              I understand that I cannot recover my account once deleted
            </span>
          </label>
        </div>

        <div className="border-t border-gray-100 pt-6">
          <h4 className="font-medium text-[#1A1A1A] mb-3">Final confirmation</h4>
          <p className="text-sm text-[#6B7280] mb-4">
            Type
            {" "}
            <span className="font-mono bg-[#FAF8F5] px-2 py-1 rounded text-[#1A1A1A]">
              DELETE
            </span>
            {" "}
            in the box below to confirm:
          </p>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => {
              setConfirmation(e.target.value);
              if (error) setError("");
            }}
            placeholder="Type DELETE to confirm"
            className="w-full px-4 py-3 border rounded-xl focus:outline-none transition-colors"
            style={{
              borderColor: error ? COLORS.danger : COLORS.border,
            }}
          />
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-[#F1C6C6] bg-[#FFF5F5] px-4 py-3 text-sm text-[#9F2D2D]">
            {error}
          </div>
        )}

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleDelete}
            disabled={!canDelete}
            className="px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-[11px] tracking-[0.22em] uppercase font-bold"
            style={{
              backgroundColor: COLORS.black,
              color: "#FFFFFF",
            }}
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting Account..." : "Delete My Account"}
          </button>

          <button
            onClick={() => navigate("/account")}
            className="px-6 py-3 border rounded-xl transition-colors text-[11px] tracking-[0.22em] uppercase font-bold"
            style={{
              borderColor: COLORS.border,
              color: COLORS.textMuted,
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      <div className="bg-[#1A1A1A] rounded-2xl p-6 md:p-8 text-center shadow-sm">
        <p className="text-[10px] tracking-[0.35em] uppercase text-[#C5A059] mb-3">
          Need Support?
        </p>
        <h3 className="font-serif text-xl text-white mb-3">
          We can help before you make this final decision.
        </h3>
        <p className="text-sm text-white/70 mb-6 max-w-xl mx-auto leading-relaxed">
          If the issue is related to orders, delivery, or account access, our
          team may be able to resolve it without losing your purchase history.
        </p>
        <a
          href="mailto:contact@mmys.in"
          className="inline-flex items-center gap-2 px-6 py-3 bg-white text-[#1A1A1A] text-[11px] tracking-[0.22em] uppercase font-bold rounded-xl hover:bg-[#C5A059] hover:text-white transition-all"
        >
          <Mail className="w-4 h-4" />
          Contact Support
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>
    </div>
  );
};

export default AccountDelete;
