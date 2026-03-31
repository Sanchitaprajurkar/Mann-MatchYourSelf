import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";

const sections = [
  {
    title: "1. Acceptance of Terms",
    body: "By accessing or using Mann Match Yourself, you agree to these Terms of Use, our Privacy Policy, and any additional store policies shown on the website.",
  },
  {
    title: "2. Accounts and Eligibility",
    body: "You must provide accurate account information and keep your login credentials secure. You are responsible for activity carried out through your account.",
  },
  {
    title: "3. Orders and Availability",
    body: "All orders are subject to acceptance, stock availability, payment confirmation, and fraud checks. We may cancel or refuse an order if product, pricing, or delivery information is incorrect.",
  },
  {
    title: "4. Pricing and Product Information",
    body: "We aim to keep product descriptions, images, and pricing accurate, but occasional errors may occur. Product colours and textures can vary slightly because of screen settings, lighting, and fabric variation.",
  },
  {
    title: "5. Shipping, Returns, and Refunds",
    body: "Delivery timelines are estimates. Returns, exchanges, and refunds are handled according to our applicable return conditions, product state, and verification process.",
  },
  {
    title: "6. Acceptable Use",
    body: "You agree not to misuse the website, interfere with our systems, upload harmful content, use bots without permission, or copy and redistribute protected content without authorization.",
  },
  {
    title: "7. Intellectual Property",
    body: "All designs, logos, product imagery, content, branding, and website materials belong to Mann Match Yourself or its licensors and may not be reused without permission.",
  },
  {
    title: "8. Limitation of Liability",
    body: "To the extent permitted by law, Mann Match Yourself is not liable for indirect, incidental, or consequential damages arising from use of the website, delayed delivery, site downtime, or third-party service interruptions.",
  },
  {
    title: "9. Changes to These Terms",
    body: "We may update these Terms from time to time. Continued use of the website after changes are posted means you accept the revised version.",
  },
];

const TermsOfUse = () => {
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
              <FileText className="w-6 h-6 text-[#C5A059]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-[#1A1A1A]">
                Terms of Use
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
            These Terms of Use apply to browsing, account registration,
            shopping, payment, product reviews, and all interactions with Mann
            Match Yourself.
          </p>

          {sections.map((section) => (
            <section key={section.title}>
              <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
                {section.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">{section.body}</p>
            </section>
          ))}

          <section>
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              10. Privacy Policy
            </h2>
            <p className="text-gray-700 leading-relaxed">
              Your use of the website is also subject to our{" "}
              <Link to="/privacy" className="text-[#C5A059] hover:underline">
                Privacy Policy
              </Link>
              , which explains how personal information is collected, used, and
              protected.
            </p>
          </section>

          <section className="bg-[#FAF8F5] rounded-lg p-6">
            <h2 className="text-2xl font-serif text-[#1A1A1A] mb-4">
              11. Contact Us
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

export default TermsOfUse;
