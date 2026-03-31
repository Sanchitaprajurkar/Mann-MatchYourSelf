import {
  MapPin,
  Phone,
  Clock,
  Star,
  ArrowRight,
  MessageCircle,
} from "lucide-react";
import { openWhatsAppWithPreloader } from "../utils/whatsapp";

const VisitOurStore = () => {
  return (
    <section className="bg-[#FAF9F6] py-16 md:py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION LABEL - Balanced for all screens */}
        <div className="text-center mb-10 md:mb-14">
          <h2 className="section-heading text-[#C5A059]">Experience Mann</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* CONTENT SECTION - Mobile Second (order-2) */}
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h2 className="font-serif text-3xl md:text-5xl text-[#1A1A1A] leading-tight mb-6">
              Our Nashik Flagship <br />
              <span className="text-xl md:text-2xl italic tracking-[0.2em] text-[#C5A059] uppercase block mt-3 font-normal">
                Boutique
              </span>
            </h2>

            <p className="text-sm md:text-base text-[#555] font-light leading-relaxed mb-10 max-w-md mx-auto lg:ml-0">
              Step into a world of exquisite drapes and artisanal weaves. Our
              flagship store in Nashik houses our complete collection of
              handcrafted sarees and contemporary ethnic wear.
            </p>

            {/* INFO GRID */}
            <div className="space-y-8 text-left max-w-sm mx-auto lg:ml-0">
              {/* Location Card */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                  <MapPin className="w-4 h-4 text-[#C5A059]" />
                </div>
                <div>
                  <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C8273] mb-1">
                    Location
                  </h4>
                  <p className="text-xs md:text-sm text-[#2B2B2B] leading-relaxed">
                    Shop No. 4, Canada Complex, College Rd,
                    <br />
                    Adwait Colony, Nashik, Maharashtra 422005
                  </p>
                </div>
              </div>

              {/* Contact/Hours Split on Tablet+ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <MessageCircle className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C8273] mb-1">
                      WhatsApp
                    </h4>
                    <button
                      type="button"
                      onClick={() => openWhatsAppWithPreloader()}
                      className="text-xs md:text-sm text-[#2B2B2B] hover:text-[#C5A059] transition-colors"
                    >
                      +91 84840 82315
                    </button>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm border border-gray-100">
                    <Clock className="w-4 h-4 text-[#C5A059]" />
                  </div>
                  <div>
                    <h4 className="text-[10px] tracking-[0.2em] uppercase font-bold text-[#8C8273] mb-1">
                      Hours
                    </h4>
                    <p className="text-xs md:text-sm text-[#2B2B2B]">
                      11:00 AM – 9:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* GOOGLE RATING - Centered for Mobile */}
            <div className="mt-10 flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-100 rounded-full w-fit shadow-sm mx-auto lg:ml-0">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-3 h-3 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-[10px] font-medium text-gray-600 tracking-wide uppercase">
                4.6 on Google Reviews
              </span>
            </div>

            {/* ACTION BUTTON */}
            <div className="mt-12 flex justify-center lg:justify-start">
              <a
                href="https://www.google.com/maps?gs_lcrp=EgZjaHJvbWUqBggBECMYJzIGCAAQRRg5MgYIARAjGCcyBggCEEUYPDIGCAMQRRg8MgYIBBBFGDwyBggFEEUYPDIGCAYQRRg8MgYIBxBFGDzSAQg1NjExajBqN6gCALACAA&um=1&ie=UTF-8&fb=1&gl=in&sa=X&geocode=Kdve3lU76907MR7dZEka5uEo&daddr=Shop+No.4,+Canada+Complex,+College+Rd,+Adwait+Colony,+Canada+Corner,+Nashik,+Maharashtra+422005
                "
                target="_blank"
                rel="noreferrer"
                className="group w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 text-[10px] tracking-[0.3em] uppercase bg-[#C5A059] text-white hover:bg-[#1A1A1A] transition-all duration-500 rounded-sm shadow-xl hover:shadow-[#C5A059]/20"
              >
                Get Directions
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>

          {/* IMAGE SECTION - Mobile First (order-1) */}
          <div className="order-1 lg:order-2 relative group">
            <div className="relative z-10 w-full h-[350px] md:h-[550px] rounded-sm overflow-hidden shadow-2xl bg-[#F3F0EA]">
              <img
                src="/VisitOurStore.png"
                alt="Mann Boutique Interior"
                className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
                loading="lazy"
              />

              <div className="absolute inset-0 border-[10px] md:border-[15px] border-white/10 pointer-events-none"></div>

              <div className="absolute bottom-4 left-4 md:bottom-6 md:left-6 z-20">
                <a
                  href="https://www.google.com/local/place/fid/0x3bddeb3b55dededb:0x28e1e61a4964dd1e/photosphere?iu=https://lh3.googleusercontent.com/gps-cs-s/AHVAweo2d0T6-kSHHSk_q4TwQp6p2bV95TVAHHNYy2hEjPfwG_S148DNNK6Z1C_eYlM-RE2ce0sQIyaKUsvl8Ny_d7Ye4EmUzrfxmOdoUoJTm63DB-wuwJsfKJJQBJb_8YfYpQKO0gt%3Dw160-h106-k-no-pi-0-ya354.38638-ro-0-fo100&ik=CAoSFkNJSE0wb2dLRUlDQWdJRDNwSTdPSFE%3D"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 bg-black/70 text-white text-[10px] tracking-[0.2em] uppercase rounded-sm hover:bg-[#C5A059] transition-all duration-300 backdrop-blur-sm"
                >
                  View 360° Store Tour
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
            {/* Decorative Frame - Hidden on smallest screens to avoid clipping issues */}
            <div className="absolute -bottom-4 -right-4 md:-bottom-6 md:-right-6 w-full h-full border border-[#C5A059]/20 -z-0"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisitOurStore;
