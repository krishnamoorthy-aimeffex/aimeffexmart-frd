// src/components/dashBoard/HeroSection.tsx
import { ArrowRight, Package } from "lucide-react";
import { useGetProductCountQuery } from "../../redux/api/productApi";
import { useGetUserCountQuery } from "../../redux/api/userApi";

function HeroSection() {
  // ✅ RTK Query hooks
  const { data: productData } = useGetProductCountQuery();
  const { data: userData } = useGetUserCountQuery();

  // ✅ Keep same variable names used in JSX
  const productCount = productData?.count ?? 0;
  const userCount = userData?.count ?? 0;

  const handleShopNow = () => {
    const productsSection = document.getElementById("products");
    productsSection?.scrollIntoView({ behavior: "smooth" });
  };

  const handleViewCategories = () => {
    const categoriesSection = document.getElementById("categories");
    categoriesSection?.scrollIntoView({ behavior: "smooth" });
  };

  return (
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
              <button
                onClick={handleShopNow}
                className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-xl hover:opacity-90 transition flex items-center gap-2"
              >
                Shop Now
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={handleViewCategories}
                className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-xl font-semibold shadow-xl hover:bg-purple-50 transition"
              >
                View Categories
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {productCount}
                </div>
                <div className="text-sm text-gray-600">Products</div>
              </div>

              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {userCount}
                </div>
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
  );
}

export default HeroSection;
