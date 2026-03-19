import React from "react";
import { FileText } from "lucide-react";

const AccountTerms = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Terms of Use</h2>
        <p className="text-gray-600 mt-1">Last updated: January 23, 2024</p>
      </div>

      <div className="prose max-w-none">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            1. Acceptance of Terms
          </h3>
          <p className="text-gray-600 mb-6">
            By accessing and using MANN Match Your Self, you accept and agree to
            be bound by the terms and provision of this agreement.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2. Use License
          </h3>
          <p className="text-gray-600 mb-6">
            Permission is granted to temporarily download one copy of the
            materials on MANN Match Your Self for personal, non-commercial
            transitory viewing only.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            3. Disclaimer
          </h3>
          <p className="text-gray-600 mb-6">
            The materials on MANN Match Your Self are provided on an 'as is'
            basis. MANN Match Your Self makes no warranties, expressed or
            implied, and hereby disclaims and negates all other warranties
            including without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or
            non-infringement of intellectual property or other violation of
            rights.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            4. Limitations
          </h3>
          <p className="text-gray-600 mb-6">
            In no event shall MANN Match Your Self or its suppliers be liable
            for any damages (including, without limitation, damages for loss of
            data or profit, or due to business interruption) arising out of the
            use or inability to use the materials on MANN Match Your Self.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            5. Privacy Policy
          </h3>
          <p className="text-gray-600 mb-6">
            Your Privacy Policy is incorporated into this Agreement by reference
            and is also posted on our website. Please review our Privacy Policy,
            which also governs the Site and informs users of our data collection
            practices.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            6. Revisions and Errata
          </h3>
          <p className="text-gray-600 mb-6">
            The materials appearing on MANN Match Your Self could include
            technical, typographical, or photographic errors. We do not warrant
            that any of the materials on its website are accurate, complete, or
            current.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            7. Contact Information
          </h3>
          <p className="text-gray-600">
            Questions about the Terms of Use should be sent to us at
            support@mannmatchyourself.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountTerms;
