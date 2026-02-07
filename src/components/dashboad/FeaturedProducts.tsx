import { ChevronRight, Heart, ShoppingCart, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: number | string;
  name: string;
  image?: string;
  badge?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  originalPrice?: number | string;
}

interface FeaturedProductsProps {
  featuredProducts: Product[];
  onToggleWishlist: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  isInWishlist: (id: Product["id"]) => boolean;
  isInCart: (id: Product["id"]) => boolean;
  getCartQuantity?: (id: Product["id"]) => number;
  onIncrementCart?: (id: Product["id"]) => void;
  onDecrementCart?: (id: Product["id"]) => void;
  onResetCategory?: () => void;
  showHeader?: boolean;
}

function FeaturedProducts({
  featuredProducts,
  onToggleWishlist,
  onAddToCart,
  isInWishlist,
  isInCart,
  onResetCategory,
  showHeader = true,
}: FeaturedProductsProps) {
  const navigate = useNavigate();

  return (
    <section id="products" className="py-12 bg-white scroll-mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-1">Handpicked items just for you</p>
            </div>
            <button
              onClick={() => onResetCategory?.()}
              className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        )}

        {featuredProducts.length === 0 ? (
          <div className="py-12 text-center text-gray-500">No products found</div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => navigate(`/product/${product.id}`)}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 cursor-pointer"
            >
              {/* Image Container */}
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                {/* Wishlist */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product);
                  }}
                  className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition cursor-pointer"
                  aria-label="toggle-wishlist"
                >
                  <Heart
                    className={`w-5 h-5 ${isInWishlist(product.id) ? "text-red-500" : "text-gray-700"} `}
                  />
                </button>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-1 mb-3">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span className="text-sm font-semibold text-gray-900">
                    {product.rating}
                  </span>
                  <span className="text-sm text-gray-500">
                    ({product.reviews})
                  </span>
                </div>

                {/* Price */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-purple-600">
                    ₹{product.price}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{product.originalPrice}
                  </span>
                </div>

                {/* Add to Cart Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isInCart(product.id)) {
                      onAddToCart(product);
                    }
                  }}
                  className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4" />
                  {isInCart(product.id) ? "Added" : "Add to Cart"}
                </button>
                <button className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Buy
                </button>
              </div>
            </div>
          ))}
        </div>
        )}
      </div>
    </section>
  );
}

export default FeaturedProducts;
