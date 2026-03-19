import React, { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";

const AccountDelete = () => {
  const [confirmation, setConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (confirmation !== "DELETE") {
      alert("Please type 'DELETE' to confirm");
      return;
    }

    setIsDeleting(true);
    try {
      // In a real implementation, this would call the delete account API
      await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call

      // After successful deletion, logout and redirect
      alert("Account deleted successfully");
      window.location.href = "/";
    } catch (error) {
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Delete Account</h2>
        <p className="text-gray-600 mt-1">
          Permanently delete your account and all associated data
        </p>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-red-900 mb-2">
              Warning: This action cannot be undone
            </h3>
            <p className="text-sm text-red-700">
              Deleting your account will permanently remove:
            </p>
            <ul className="mt-2 text-sm text-red-700 list-disc list-inside space-y-1">
              <li>Your personal information and profile data</li>
              <li>Order history and purchase records</li>
              <li>Saved addresses and payment methods</li>
              <li>Wishlist and shopping cart items</li>
              <li>Any associated preferences and settings</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Before you go</h3>
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="understand"
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="understand" className="text-sm text-gray-700">
              I understand that this action is irreversible
            </label>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="data-loss"
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="data-loss" className="text-sm text-gray-700">
              I understand that all my data will be permanently lost
            </label>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              id="no-recovery"
              className="w-4 h-4 text-blue-600"
            />
            <label htmlFor="no-recovery" className="text-sm text-gray-700">
              I understand that I cannot recover my account once deleted
            </label>
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h4 className="font-medium text-gray-900 mb-3">Final Confirmation</h4>
          <p className="text-sm text-gray-600 mb-4">
            Type{" "}
            <span className="font-mono bg-gray-100 px-2 py-1 rounded">
              DELETE
            </span>{" "}
            in the box below to confirm:
          </p>
          <input
            type="text"
            value={confirmation}
            onChange={(e) => setConfirmation(e.target.value)}
            placeholder="Type DELETE to confirm"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleDelete}
            disabled={confirmation !== "DELETE" || isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
            {isDeleting ? "Deleting Account..." : "Delete My Account"}
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Cancel
          </button>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="font-semibold text-blue-900 mb-2">Need help?</h3>
        <p className="text-sm text-blue-700 mb-4">
          If you're having issues with your account or have concerns about
          deleting it, our support team is here to help.
        </p>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Contact Support
        </button>
      </div>
    </div>
  );
};

export default AccountDelete;
