import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const PrivacyPolicy = () => {
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
              <Shield className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                Privacy Policy
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
              1. Introduction
            </h2>
            <p className="text-gray-700 leading-relaxed">
              At Mann Match Yourself, we value your trust and are committed to protecting your privacy. This Privacy Policy explains how we collect, use, store, and protect your personal information when you visit our website or purchase our products.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              By using our website and services, you agree to the collection and use of information in accordance with this Privacy Policy. If you do not agree with any part of this policy, please do not use our website.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              2. Information We Collect
            </h2>
            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3">
              2.1 Personal Information You Provide
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you create an account, place an order, or contact us, we may collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Contact Information:</strong> Full name, email address, phone number</li>
              <li><strong>Delivery Information:</strong> Shipping address, billing address, landmark details</li>
              <li><strong>Account Information:</strong> Username, password (encrypted), account preferences</li>
              <li><strong>Order Information:</strong> Purchase history, product preferences, order details</li>
              <li><strong>Payment Information:</strong> Payment method details (processed securely by third-party payment gateways—we do not store complete card details or CVV numbers)</li>
              <li><strong>Communication Data:</strong> Messages, feedback, reviews, and customer support inquiries</li>
            </ul>

            <h3 className="text-lg font-semibold text-[#1A1A1A] mb-3 mt-6">
              2.2 Information Collected Automatically
            </h3>
            <p className="text-gray-700 leading-relaxed mb-3">
              When you visit our website, we may automatically collect:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Device Information:</strong> IP address, browser type, operating system, device identifiers</li>
              <li><strong>Usage Data:</strong> Pages visited, time spent on pages, links clicked, search queries</li>
              <li><strong>Location Data:</strong> Approximate geographic location based on IP address</li>
              <li><strong>Cookies and Tracking Data:</strong> Information collected through cookies, web beacons, and similar technologies</li>
            </ul>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  Order Processing and Fulfillment
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Process and confirm your orders, arrange delivery and shipment tracking, send order confirmations and updates, handle returns and refunds.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  Customer Service
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Respond to your inquiries, provide customer assistance, and resolve issues.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  Website Improvement
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Analyze website usage to improve functionality, personalize content and recommendations, conduct research and analytics.
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                  Marketing (with your consent)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Send promotional emails, newsletters, and special offers only if you have opted in.
                </p>
              </div>
            </div>
          </section>

          {/* Payment Security */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              4. Payments and Third-Party Payment Gateways
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              All payment transactions are processed through secure third-party payment gateways. <strong>We do not directly collect, process, or store your complete credit/debit card details, CVV numbers, or banking passwords.</strong>
            </p>
            <p className="text-gray-700 leading-relaxed">
              When you make a payment, your payment information is transmitted directly to our payment gateway partners over encrypted connections. These partners handle payment processing in compliance with industry security standards.
            </p>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              5. Data Security
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              We implement reasonable technical, administrative, and physical security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. These measures include SSL encryption, secure servers, firewalls, and access controls.
            </p>
            <p className="text-gray-700 leading-relaxed">
              While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security, but we are committed to using industry-standard practices to safeguard your data.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              6. Your Rights
            </h2>
            <p className="text-gray-700 leading-relaxed mb-3">
              You have the following rights regarding your personal information:
            </p>
            <ul className="list-disc list-inside text-gray-700 space-y-2 ml-4">
              <li><strong>Right to Access:</strong> Request access to the personal information we hold about you</li>
              <li><strong>Right to Correction:</strong> Request that we correct or update inaccurate information</li>
              <li><strong>Right to Deletion:</strong> Request that we delete your personal information (subject to legal exceptions)</li>
              <li><strong>Right to Object:</strong> Object to the processing of your information for marketing purposes</li>
              <li><strong>Right to Data Portability:</strong> Request a copy of your data in a structured format</li>
            </ul>
            <p className="text-gray-700 leading-relaxed mt-4">
              To exercise any of these rights, please contact us at <a href="mailto:contact@mmys.in" className="text-[#C5A059] hover:underline">contact@mmys.in</a> or call <a href="tel:+918484822315" className="text-[#C5A059] hover:underline">+91 8484822315</a>.
            </p>
          </section>

          {/* Marketing Communications */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              7. Marketing Communications and Opt-Out
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have opted in to receive marketing communications, we may send you promotional emails about new products, special offers, and updates.
            </p>
            <p className="text-gray-700 leading-relaxed">
              You can opt out at any time by clicking the "Unsubscribe" link in any promotional email, updating your communication preferences in your account settings, or contacting us directly.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              8. Children's Privacy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Our website and services are not intended for children under the age of 18. We do not knowingly collect personal information from children. If you are under 18, please do not provide any personal information on our website.
            </p>
          </section>

          {/* Policy Updates */}
          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              9. Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              We reserve the right to update or modify this Privacy Policy at any time. When we make significant changes, we will update the "Last Updated" date and notify you via email or a prominent notice on our website. Your continued use of our website after any changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-[#FAF8F5] rounded-lg p-6">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              10. Contact Us
            </h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              If you have any questions, concerns, or requests regarding this Privacy Policy, please contact us:
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

export default PrivacyPolicy;
