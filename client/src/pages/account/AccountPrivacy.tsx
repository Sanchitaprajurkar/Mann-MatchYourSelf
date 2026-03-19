import React from "react";
import { Shield } from "lucide-react";

const AccountPrivacy = () => {
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Privacy Policy</h2>
        <p className="text-gray-600 mt-1">Last updated: January 23, 2024</p>
      </div>

      <div className="prose max-w-none">
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            1. Information We Collect
          </h3>
          <p className="text-gray-600 mb-6">
            We collect information you provide directly to us, such as when you
            create an account, make a purchase, or contact us for support.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            2. How We Use Your Information
          </h3>
          <p className="text-gray-600 mb-6">
            We use the information we collect to provide, maintain, and improve
            our services, process transactions, and communicate with you.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            3. Information Sharing
          </h3>
          <p className="text-gray-600 mb-6">
            We do not sell, trade, or otherwise transfer your personal
            information to third parties without your consent, except as
            described in this Privacy Policy.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            4. Data Security
          </h3>
          <p className="text-gray-600 mb-6">
            We implement appropriate technical and organizational measures to
            protect your personal information against unauthorized access,
            alteration, disclosure, or destruction.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            5. Cookies and Tracking
          </h3>
          <p className="text-gray-600 mb-6">
            We use cookies and similar tracking technologies to track activity
            on our service and hold certain information to improve your
            experience.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            6. Your Rights
          </h3>
          <p className="text-gray-600 mb-6">
            You have the right to access, update, or delete your personal
            information. You can do this by logging into your account or
            contacting us directly.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            7. Children's Privacy
          </h3>
          <p className="text-gray-600 mb-6">
            Our service does not address anyone under the age of 18. We do not
            knowingly collect personally identifiable information from anyone
            under the age of 18.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            8. Changes to This Policy
          </h3>
          <p className="text-gray-600 mb-6">
            We may update our Privacy Policy from time to time. We will notify
            you of any changes by posting the new Privacy Policy on this page.
          </p>

          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            9. Contact Information
          </h3>
          <p className="text-gray-600">
            If you have any questions about this Privacy Policy, please contact
            us at privacy@mannmatchyourself.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountPrivacy;
