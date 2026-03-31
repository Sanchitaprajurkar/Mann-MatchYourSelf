import React from "react";
import { Shield, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const AccountPrivacy = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center">
          <Shield className="w-6 h-6 text-[#C5A059]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
          <p className="text-gray-600 mt-1">Last updated: March 31, 2026</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
        <p className="text-gray-700 leading-relaxed">
          We collect only the information needed to run your account, process
          orders, arrange delivery, support payments, and improve the shopping
          experience. We do not sell your personal data.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            What we collect
          </h3>
          <p className="text-gray-600 leading-relaxed">
            This may include your name, email, phone number, saved addresses,
            order history, product preferences, and limited technical data such
            as browser and device information.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            How we use it
          </h3>
          <p className="text-gray-600 leading-relaxed">
            We use your data to fulfil orders, handle support, send order
            updates, prevent fraud, and improve site performance and product
            recommendations.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Your control
          </h3>
          <p className="text-gray-600 leading-relaxed">
            You can request corrections or deletion of account data, subject to
            legal and transaction-record obligations. Marketing communication
            preferences can be changed at any time.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need the full legal version?
          </h3>
          <Link
            to="/privacy"
            className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#1A1A1A] transition-colors"
          >
            Open full Privacy Policy <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountPrivacy;
