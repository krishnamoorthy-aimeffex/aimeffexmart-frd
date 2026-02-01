// src/pages/Home.jsx
import { useState, useEffect, type ReactNode } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  ShoppingCart,
  Star,
  Package,
  Truck,
  Shield,
  Menu,
  X,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
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

interface Category {
  name: string;
  color?: string;
  icon?: ReactNode;
}

function Home() {
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState<number>(0);

  // ✅ AUTH CHECK
  const isLoggedIn = !!localStorage.getItem("token");

  // Sample data loaded from public/ via fetch
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/Product.json')
      .then((res) => res.json())
      .then((data) => setFeaturedProducts(data))
      .catch(() => setFeaturedProducts([]));

    fetch('/ProductCategory.json')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setCategories([]));
  }, []);

  // --- Wishlist helpers (stored as full product objects under key 'wishlist')
  const WISHLIST_KEY = "wishlist";

  function getWishlist(): Product[] {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Product[];
    } catch {
      return [];
    }
  }

  function saveWishlist(list: Product[]) {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
    } catch {}
  }

  function isInWishlist(id: Product["id"]) {
    return getWishlist().some((p) => p.id === id);
  }

  function toggleWishlist(product: Product) {
    const list = getWishlist();
    const exists = list.some((p) => p.id === product.id);
    let next: Product[];
    if (exists) next = list.filter((p) => p.id !== product.id);
    else next = [product, ...list];
    saveWishlist(next);
    // Force update featuredProducts state reference so UI can reflect changes if needed
    setFeaturedProducts((prev) => [...prev]);
  }

  // --- Cart helpers (stored as full product objects under key 'cart')
  const CART_KEY = "cart";

  function getCart(): Product[] {
    try {
      const raw = localStorage.getItem(CART_KEY);
      if (!raw) return [];
      return JSON.parse(raw) as Product[];
    } catch {
      return [];
    }
  }

  function saveCart(list: Product[]) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(list));
    } catch {}
  }

  function isInCart(id: Product["id"]) {
    return getCart().some((p) => p.id === id);
  }

  function addToCart(product: Product) {
    const list = getCart();
    const exists = list.some((p) => p.id === product.id);
    let next: Product[];
    if (exists) {
      next = list; // already in cart; keep as-is (could increment qty if you add qty support)
    } else {
      next = [product, ...list];
    }
    saveCart(next);
    setCartCount(next.length);
  }

  // function removeFromCart(id: Product["id"]) {
  //   const list = getCart();
  //   const next = list.filter((p) => p.id !== id);
  //   saveCart(next);
  //   setCartCount(next.length);
  // }

  // initialize cart count on mount
  useEffect(() => {
    setCartCount(getCart().length);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Aimeffex Mart
              </h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Right Icons */}
            <div className="flex items-center gap-4">
              {/* ✅ ACCOUNT / LOGIN */}
              <button
                onClick={() =>
                  navigate(isLoggedIn ? "/profile" : "/login")
                }
                className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer"
              >
                <User className="w-5 h-5" />
                <span className="text-sm font-medium">
                  {isLoggedIn ? "Account" : "Login"}
                </span>
              </button>

              {/* Wishlist */}
              <button onClick={() => navigate("/wishlist")} className="hidden md:block p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <Heart />
              </button>

              {/* Cart */}
              <button onClick={() => navigate('/cart')} className="relative p-2 hover:bg-gray-100 rounded-xl cursor-pointer">
                <ShoppingCart />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* ================= MOBILE MENU ================= */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() =>
                  navigate(isLoggedIn ? "/profile" : "/login")
                }
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
              >
                <User />
                <span>{isLoggedIn ? "My Account" : "Login"}</span>
              </button>

              <button onClick={() => navigate("/wishlist")} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl cursor-pointer">
                <Heart />
                <span>Wishlist</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 via-white to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-10">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            {/* Left Content */}
            <div className="space-y-6">
              <div className="inline-block">
                <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full text-sm font-semibold">
                  🎉 New Collection 2026
                </span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Discover Amazing
                <span className="block bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Products
                </span>
              </h1>
              <p className="text-lg text-gray-600">
                Shop the latest trends and exclusive deals. Quality products at
                unbeatable prices.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center gap-2">
                  Shop Now
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold hover:bg-purple-50 transition">
                  View Categories
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">10K+</div>
                  <div className="text-sm text-gray-600">Products</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">50K+</div>
                  <div className="text-sm text-gray-600">Customers</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">4.8★</div>
                  <div className="text-sm text-gray-600">Rating</div>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl transform rotate-6"></div>
              <img
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600"
                alt="Shopping"
                className="relative rounded-3xl shadow-2xl object-cover w-full h-96"
              />
              {/* Floating Badge */}
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-2xl p-4 flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-bold text-gray-900">Free Shipping</div>
                  <div className="text-sm text-gray-600">
                    On orders over $50
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Shop by Category
            </h2>
            <button className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group cursor-pointer bg-gray-50 rounded-2xl p-6 text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2"
              >
                <div
                  className={`w-16 h-16 mx-auto bg-gradient-to-br ${category.color} rounded-2xl flex items-center justify-center text-3xl mb-3 group-hover:scale-110 transition-transform`}
                >
                  {category.icon}
                </div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Featured Products
              </h2>
              <p className="text-gray-600 mt-1">
                Handpicked items just for you
              </p>
            </div>
            <button className="text-purple-600 font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              View All
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => navigate(`/product/${product.id}`)}
                className="group bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative aspect-square overflow-hidden bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {/* Badge */}
                  <span className="absolute top-3 left-3 bg-purple-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {product.badge}
                  </span>
                  {/* Wishlist */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleWishlist(product);
                    }}
                    className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-lg hover:bg-red-50 transition cursor-pointer"
                    aria-label="toggle-wishlist"
                  >
                    <Heart
                      className={`w-5 h-5 ${isInWishlist(product.id) ? 'text-red-500' : 'text-gray-700'} `}
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
                      ${product.price}
                    </span>
                    <span className="text-sm text-gray-400 line-through">
                      ${product.originalPrice}
                    </span>
                  </div>

                  {/* Add to Cart Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(product);
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    {isInCart(product.id) ? 'Added' : 'Add to Cart'}
                  </button>
                  <button className="w-full mt-2 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:opacity-90 transition flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Buy
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-4 rounded-xl">
                <Truck className="w-8 h-8 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Free Shipping
                </h3>
                <p className="text-gray-600">On orders over $50</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-4 rounded-xl">
                <Shield className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Secure Payment
                </h3>
                <p className="text-gray-600">100% secure transactions</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-green-100 p-4 rounded-xl">
                <Package className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  Easy Returns
                </h3>
                <p className="text-gray-600">30-day return policy</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-xl">
                  <ShoppingBag className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-xl font-bold">Aimeffef Mart</h2>
              </div>
              <p className="text-gray-400 text-sm">
                Your one-stop destination for quality products at amazing
                prices.
              </p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Shop</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Electronics</li>
                <li className="hover:text-white cursor-pointer">Fashion</li>
                <li className="hover:text-white cursor-pointer">
                  Home & Living
                </li>
                <li className="hover:text-white cursor-pointer">Beauty</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Customer Service</h5>
              <ul className="space-y-2 text-gray-400 text-sm">
                <li className="hover:text-white cursor-pointer">Contact Us</li>
                <li className="hover:text-white cursor-pointer">
                  Shipping Info
                </li>
                <li className="hover:text-white cursor-pointer">Returns</li>
                <li className="hover:text-white cursor-pointer">FAQ</li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Follow Us</h5>
              <div className="flex space-x-4">
                <button className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
                <button className="bg-gray-800 p-3 rounded-full hover:bg-purple-600 transition-colors">
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.14.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.905.131 5.775.072 7.053.012 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.558 2.913.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.766.296 1.636.499 2.913.558C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.262 2.913-.558.788-.306 1.459-.718 2.126-1.384.666-.667 1.079-1.335 1.384-2.126.296-.765.499-1.636.558-2.913.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.262-2.149-.558-2.913-.306-.789-.718-1.459-1.384-2.126C21.319 1.347 20.651.935 19.86.63c-.765-.297-1.636-.499-2.913-.558C15.667.012 15.26 0 12 0zm0 2.16c3.203 0 3.585.016 4.85.071 1.17.055 1.805.249 2.227.415.562.217.96.477 1.382.896.419.42.679.819.896 1.381.164.422.36 1.057.413 2.227.057 1.266.07 1.646.07 4.85s-.015 3.585-.074 4.85c-.061 1.17-.256 1.805-.421 2.227-.224.562-.479.96-.899 1.382-.419.419-.824.679-1.38.896-.42.164-1.065.36-2.235.413-1.274.057-1.649.07-4.859.07-3.211 0-3.586-.015-4.859-.074-1.171-.061-1.816-.256-2.236-.421-.569-.224-.96-.479-1.379-.899-.421-.419-.69-.824-.9-1.38-.165-.42-.359-1.065-.42-2.235-.045-1.26-.061-1.649-.061-4.844 0-3.196.016-3.586.061-4.861.061-1.17.255-1.814.42-2.234.21-.57.479-.96.9-1.381.419-.419.81-.689 1.379-.898.42-.166 1.051-.361 2.221-.421 1.275-.045 1.65-.06 4.859-.06l.045.03zm0 3.678c-3.405 0-6.162 2.76-6.162 6.162 0 3.405 2.76 6.162 6.162 6.162 3.405 0 6.162-2.76 6.162-6.162 0-3.405-2.76-6.162-6.162-6.162zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm7.846-10.405c0 .795-.646 1.44-1.44 1.44-.795 0-1.44-.646-1.44-1.44 0-.794.646-1.439 1.44-1.439.793-.001 1.44.645 1.44 1.439z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400 text-sm">
            <p>&copy; 2026 Aimeffef Mart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
