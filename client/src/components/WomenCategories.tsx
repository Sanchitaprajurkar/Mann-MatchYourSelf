/*import { Link } from "react-router-dom";

const categories = [
  { name: "New Arrivals", image: "/images/cat-new.jpg", link: "/shop?tag=new" },
  { name: "Heels", image: "/images/cat-heels.jpg", link: "/shop?category=Heels" },
  { name: "Sandals", image: "/images/cat-sandals.jpg", link: "/shop?category=Sandals" },
  { name: "Flats", image: "/images/cat-flats.jpg", link: "/shop?category=Flats" },
  { name: "Slippers", image: "/images/cat-slippers.jpg", link: "/shop?category=Slippers" },
  { name: "Best Seller", image: "/images/cat-best.jpg", link: "/shop?tag=best" },
];

const WomenCategories = () => {
  return (
    <section className="py-16 bg-white">
      <h2 className="text-3xl font-semibold text-center mb-10">
        Shop By Category
      </h2>

      <div className="flex justify-center gap-10 overflow-x-auto px-6">
        {categories.map((cat) => (
          <Link
            to={cat.link}
            key={cat.name}
            className="flex flex-col items-center min-w-[110px]"
          >
            <div className="w-24 h-24 rounded-full border border-gray-200 overflow-hidden hover:border-[#D4AF37] transition">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="mt-3 text-sm font-medium">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default WomenCategories;*/
