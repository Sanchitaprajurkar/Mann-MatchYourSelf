import React from "react";
import { FileText, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

const AccountTerms = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-[#FAF8F5] flex items-center justify-center">
          <FileText className="w-6 h-6 text-[#C5A059]" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Terms of Use</h2>
          <p className="text-gray-600 mt-1">Last updated: March 31, 2026</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6 md:p-8 space-y-6">
        <p className="text-gray-700 leading-relaxed">
          These Terms govern your access to and use of Mann Match Yourself,
          including account creation, shopping, checkout, reviews, and all
          related services. By continuing to use the site, you agree to follow
          these terms and our store policies.
        </p>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Using the site
          </h3>
          <p className="text-gray-600 leading-relaxed">
            You agree to provide accurate account, contact, and delivery
            details, keep your login credentials secure, and use the site only
            for lawful personal shopping purposes.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Orders, pricing, and availability
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Prices, offers, and inventory may change without notice. We may
            cancel or adjust orders if a product is unavailable, a listing
            contains an error, or a transaction appears fraudulent.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Delivery and returns
          </h3>
          <p className="text-gray-600 leading-relaxed">
            Delivery timelines are estimates. Returns and exchanges are subject
            to our product condition rules and approval workflow. Items must be
            unused and returned with original tags and packaging when eligible.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Content and intellectual property
          </h3>
          <p className="text-gray-600 leading-relaxed">
            All designs, imagery, brand assets, copy, and site content remain
            the property of Mann Match Yourself unless stated otherwise. They
            may not be copied, reused, or distributed without permission.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Need the full legal version?
          </h3>
          <Link
            to="/terms"
            className="inline-flex items-center gap-2 text-[#C5A059] hover:text-[#1A1A1A] transition-colors"
          >
            Open full Terms of Use <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AccountTerms;
