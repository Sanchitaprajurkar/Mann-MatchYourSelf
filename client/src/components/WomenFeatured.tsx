/*import { Link } from "react-router-dom";
import { Product } from "../data/mockData";
import { BASE_URL } from "../config";

interface Props {
  products: Product[];
}

const WomenFeatured = ({ products }: Props) => {
  return (
    <section className="py-16 bg-gray-50">
      <h2 className="text-3xl font-semibold text-center mb-12">
        Featured Products
      </h2>

      <div className="flex gap-6 overflow-x-auto px-6">
        {products.map((product) => (
          <div
            key={product._id}
            className="min-w-[260px] bg-white border rounded-lg overflow-hidden"
          >
            <img
              src={`${BASE_URL}${product.images[0]}`}
              alt={product.name}
              className="w-full h-64 object-cover"
            />

            <div className="p-4">
              <h3 className="text-sm font-semibold mb-1">
                {product.name}
              </h3>
              <p className="text-[#D4AF37] font-semibold">
                ₹{product.price.toLocaleString()}
              </p>

              <Link
                to={`/product/${product._id}`}
                className="mt-3 block bg-black text-white text-center py-2 text-sm"
              >
                Add to cart
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default WomenFeatured;
*/
