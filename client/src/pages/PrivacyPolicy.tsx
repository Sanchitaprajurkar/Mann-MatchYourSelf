import React from "react";
import { Link } from "react-router-dom";
import { Shield, ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Information We Collect",
    body: "We may collect your name, email, mobile number, delivery addresses, order history, preferences, messages, reviews, and limited device or browser information needed to operate the site.",
  },
  {
    title: "2. How We Use Information",
    body: "We use your information to create and manage accounts, process orders, arrange shipping, send transactional updates, support returns, prevent fraud, and improve site performance and customer experience.",
  },
  {
    title: "3. Payments",
    body: "Payments are processed by third-party payment partners. Mann Match Yourself does not store complete card details, CVV, or banking passwords on this website.",
  },
  {
    title: "4. Sharing and Service Providers",
    body: "We may share data with logistics providers, payment processors, technical vendors, and lawful authorities only where necessary to operate the business, comply with law, or protect the platform.",
  },
  {
    title: "5. Cookies and Analytics",
    body: "We use cookies and similar technologies to remember preferences, keep sessions active, understand site usage, and improve browsing and shopping performance.",
  },
  {
    title: "6. Data Security",
    body: "We apply reasonable administrative, technical, and organizational safeguards to protect account and transaction data, but no internet transmission or storage system can be guaranteed completely secure.",
  },
  {
    title: "7. Your Choices",
    body: "You may request access, correction, or deletion of eligible personal data, subject to legal, fraud-prevention, and transaction-retention obligations. Marketing messages can be opted out of at any time.",
  },
  {
    title: "8. Children’s Privacy",
    body: "Our services are not intended for children under 18, and we do not knowingly collect personal information from minors.",
  },
  {
    title: "9. Policy Updates",
    body: "We may revise this Privacy Policy from time to time. The updated version becomes effective when posted on the website with a revised last-updated date.",
  },
];

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
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
                Last Updated: March 31, 2026
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 md:p-12 space-y-8">
          <p className="text-gray-700 leading-relaxed">
            This Privacy Policy explains how Mann Match Yourself collects, uses,
            stores, and protects personal information when you browse the site,
            create an account, place an order, or contact us.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
            </section>
          ))}

          <section className="bg-[#FAF8F5] rounded-lg p-6">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              10. Contact Us
            </h2>
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>Mann Match Yourself</strong>
              </p>
              <p>
                Email:{" "}
                <a
                  href="mailto:contact@mmys.in"
                  className="text-[#C5A059] hover:underline"
                >
                  contact@mmys.in
                </a>
              </p>
              <p>
                Phone:{" "}
                <a
                  href="tel:+918484822315"
                  className="text-[#C5A059] hover:underline"
                >
                  +91 8484822315
                </a>
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
