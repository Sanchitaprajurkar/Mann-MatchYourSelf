import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const TermsOfUse = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#C5A059] transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-[#FAF8F5] rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                Terms of Use
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Last Updated: January 1, 2025
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              1. Acceptance of Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Mann Match Yourself. By accessing, browsing, or using our website, you agree to be bound by these Terms of Use, along with our Privacy Policy and any other policies referenced herein.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              If you do not agree with any part of these Terms, please do not use our website or services. Your continued use of the website constitutes your acceptance of these Terms and any future modifications.
            </p>
          </section>

          {/* Eligibility */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              2. Eligibility to Use the Website
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You must be at least 18 years of age to use our website, create an account, or make a purchase. By using our services, you represent and warrant that you meet this age requirement and have the legal capacity to enter into binding contracts.
            </p>
          </section>

          {/* User Account */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              3. User Account Responsibilities
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              When creating an account, you agree to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Provide accurate, current, and complete information</li>
              <li>Maintain and promptly update your account information</li>
              <li>Keep your password secure and confidential</li>
              <li>Notify us immediately of any unauthorized use of your account</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              You are responsible for all activities that occur under your account. We are not liable for any loss or damage arising from your failure to maintain account security.
            </p>
          </section>

          {/* Prohibited Use */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              4. Prohibited Use of the Website
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You agree not to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Engage in any fraudulent, illegal, or unauthorized activities</li>
              <li>Attempt to gain unauthorized access to our systems or networks</li>
              <li>Interfere with or disrupt the website's functionality or security</li>
              <li>Use automated tools, bots, or scripts without permission</li>
              <li>Copy, reproduce, or distribute our content without authorization</li>
              <li>Harass, threaten, or harm other users or our staff</li>
              <li>Resell products for commercial purposes without authorization</li>
            </ul>
          </section>

          {/* Product Information */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              5. Product Information and Images
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant that product information is complete, accurate, or error-free.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-gray-700 leading-relaxed">
                <strong>Important:</strong> Product colors, textures, and appearances may vary slightly from the images displayed on our website due to differences in device screens, monitors, lighting conditions, and natural variations in fabric and materials.
              </p>
            </div>
          </section>

          {/* Pricing */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              6. Pricing, Availability, and Errors
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              All prices are listed in Indian Rupees (INR) and are subject to change without prior notice. In the event of a pricing error, we reserve the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Cancel the affected order and issue a full refund</li>
              <li>Contact you to confirm whether you wish to proceed at the correct price</li>
              <li>Refuse to honor the incorrect price</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Product availability is subject to change without notice. If a product becomes unavailable after you place an order, we will notify you and offer a refund or alternative options.
            </p>
          </section>

          {/* Orders and Payment */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              7. Orders, Payment, and Cancellation
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              An order is confirmed only after successful payment processing and verification. We reserve the right to cancel or refuse any order for reasons including:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Pricing or product information errors</li>
              <li>Product unavailability or stock shortages</li>
              <li>Suspected fraudulent or unauthorized transactions</li>
              <li>Inability to verify payment or delivery information</li>
              <li>Violation of these Terms of Use</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              All payment transactions are processed through secure third-party payment gateways. We do not store your complete card details or sensitive payment information.
            </p>
          </section>

          {/* Shipping */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              8. Shipping and Delivery
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Estimated delivery timelines are provided at checkout and are for reference only. Actual delivery times may vary due to factors beyond our control, including courier delays, weather conditions, public holidays, or remote locations.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You are responsible for providing accurate and complete delivery information. We are not responsible for failed or delayed deliveries due to incorrect or incomplete addresses.
            </p>
          </section>

          {/* Returns */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              9. Returns, Exchanges, and Refunds
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              We accept returns only for:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Defective products with manufacturing defects or damage</li>
              <li>Incorrect products that do not match your order</li>
              <li>Quality issues that do not meet described standards</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4 mb-3">
              <strong>Return Conditions:</strong>
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Return request must be raised within <strong>3 days of delivery</strong></li>
              <li>Products must be unused, unwashed, and in original condition</li>
              <li>Original tags, labels, and packaging must be intact</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Refunds will be processed within 7-10 business days after we receive and inspect the returned item. Contact us at <a href="mailto:contact@mmys.in" className="text-[#C5A059] hover:underline">contact@mmys.in</a> to initiate a return.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              10. Intellectual Property
            </h2>
            <p className="text-gray-700 leading-relaxed">
              All content on this website, including text, images, graphics, logos, designs, and software, is the exclusive property of Mann Match Yourself and is protected by copyright, trademark, and other intellectual property laws. Unauthorized use is strictly prohibited.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              11. Limitation of Liability
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              To the fullest extent permitted by law, Mann Match Yourself shall not be liable for any:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li>Indirect, incidental, consequential, or punitive damages</li>
              <li>Loss of profits, revenue, data, or business opportunities</li>
              <li>Damages arising from your use or inability to use the website</li>
              <li>Website downtime or interruptions</li>
              <li>Issues caused by third-party services</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              Our total liability shall not exceed the amount you paid for the specific product or service giving rise to the claim.
            </p>
          </section>

          {/* Privacy Policy */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              12. Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of our website is also governed by our <Link to="/privacy" className="text-[#C5A059] hover:underline">Privacy Policy</Link>, which explains how we collect, use, and protect your personal information. By using our website, you consent to the practices described in our Privacy Policy.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              13. Changes to Terms
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or modify these Terms at any time. When we make significant changes, we will update the "Last Updated" date and notify you via email or a prominent notice on our website. Your continued use of the website after any changes constitutes your acceptance of the updated Terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              14. Governing Law and Jurisdiction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              These Terms of Use shall be governed by and construed in accordance with the laws of India. Any disputes arising out of or relating to these Terms shall be subject to the exclusive jurisdiction of the courts in India.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF8F5] rounded-lg p-6">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              15. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions or concerns regarding these Terms of Use, please contact us:
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Mann Match Yourself</strong>
              </p>
              <p className="text-gray-700">
                📧 Email: <a href="mailto:contact@mmys.in" className="text-[#C5A059] hover:underline">contact@mmys.in</a>
              </p>
              <p className="text-gray-700">
                📞 Phone: <a href="tel:+918484822315" className="text-[#C5A059] hover:underline">+91 8484822315</a>
              </p>
            </div>
          </section>
        </div>

        {/* Back to Top */}
        <div className="text-center mt-8">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="text-sm text-gray-600 hover:text-[#C5A059] transition-colors"
          >
            Back to Top ↑
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfUse;
