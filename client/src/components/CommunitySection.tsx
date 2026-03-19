import { Star, ArrowRight, Quote } from "lucide-react";

type Review = {
  id: number;
  name: string;
  location: string;
  text: string;
  image: string;
  rating: number;
  outfit: string;
};

const reviews: Review[] = [
  {
    id: 1,
    name: "Ananya Sharma",
    location: "Mumbai",
    text: "The drape of the Chanderi silk is just divine. I wore it for my brother's wedding and received so many compliments!",
    image: "/reviews/customer-1.jpg",
    rating: 5,
    outfit: "Midnight Bloom Saree",
  },
  {
    id: 2,
    name: "Priya Patel",
    location: "Nashik",
    text: "Finally found a brand that understands modern silhouettes without losing traditional essence. Perfect fit!",
    image: "/reviews/customer-2.jpg",
    rating: 5,
    outfit: "Ivory Silk Lehenga",
  },
  {
    id: 3,
    name: "Meera Reddy",
    location: "Bangalore",
    text: "The hand-embroidery details are even more beautiful in person. Mann is now my go-to for festive wear.",
    image: "/reviews/customer-3.jpg",
    rating: 5,
    outfit: "Ruby Red Anarkali",
  },
];

const CommunitySection = () => {
  return (
    <section className="py-24 bg-[#FCFBFA] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}
        <div className="text-center mb-20">
          <p className="text-[11px] tracking-[0.5em] text-[#8C8273] uppercase mb-4">
            Trusted by Our Community
          </p>
          <h2 className="section-heading text-[#1A1A1A]">
            Stories Woven by You
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="group h-auto md:h-[450px] md:[perspective:1000px]"
            >
              <div
                className="
                  relative h-full w-full transition-all duration-700
                  md:[transform-style:preserve-3d]
                  md:group-hover:[transform:rotateY(180deg)]
                "
              >

                {/* FRONT */}
                <div className="relative md:absolute inset-0 bg-white p-8 md:p-10 flex flex-col justify-between border border-gray-100 md:[backface-visibility:hidden]">
                  <div>
                    <Quote className="w-8 h-8 md:w-10 md:h-10 text-[#F3F0EA] mb-6" />

                    <div className="flex mb-4">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>

                    <p className="text-base md:text-lg text-[#444] leading-relaxed font-light italic">
                      “{review.text}”
                    </p>
                  </div>

                  <div className="flex items-center gap-4 mt-8">
                    <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-[#8C8273] flex items-center justify-center text-white text-xs md:text-sm">
                      {review.name[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-[#1A1A1A]">
                        {review.name}
                      </h4>
                      <p className="text-[10px] md:text-[11px] tracking-widest uppercase text-[#8C8273]">
                        {review.location}
                      </p>
                    </div>
                  </div>

                  {/* Desktop hint */}
                  <div className="hidden md:block absolute bottom-6 right-8 text-[10px] tracking-widest text-gray-300 uppercase italic">
                    Hover to see the look →
                  </div>
                </div>

                {/* BACK (DESKTOP ONLY) */}
                <div className="hidden md:block absolute inset-0 [transform:rotateY(180deg)] md:[backface-visibility:hidden]">
                  <img
                    src={review.image}
                    alt={review.outfit}
                    className="h-full w-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-500"
                  />

                  <div className="absolute inset-0 bg-black/40 flex flex-col justify-end p-8 text-white">
                    <p className="text-[10px] tracking-[0.3em] uppercase mb-2 opacity-80">
                      Wearing
                    </p>
                    <h4 className="text-xl font-serif mb-6">
                      {review.outfit}
                    </h4>
                    <button className="flex items-center gap-2 text-xs tracking-widest uppercase border-b border-white pb-2 w-fit hover:gap-4 transition-all">
                      Shop the Look <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <button className="px-12 py-4 border border-[#1A1A1A] text-[#1A1A1A] text-[11px] tracking-[0.3em] uppercase hover:bg-[#1A1A1A] hover:text-white transition-all duration-500">
            View All Stories
          </button>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;
