import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";
import Spinner from "../components/ui/Spinner";
import Header from "../components/dashboad/Header";
import {
  useGetWishlistQuery,
  useRemoveFromWishlistMutation,
} from "../redux/api/wishListApi";
import { useGetCartCountQuery } from "../redux/api/cartApi";

interface Product {
  id: number | string;
  name: string;
  image?: string;
  badge?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  originalPrice?: number | string;
  wishItemId?: string;
}

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const WISHLIST_KEY = "wishlist";
  const isLoggedIn = !!localStorage.getItem("token");

  // ✅ RTK hooks
  const { data: wishlistData, isLoading: wishlistLoading } =
    useGetWishlistQuery(undefined, { skip: !isLoggedIn });

  const [removeWishlistItem] = useRemoveFromWishlistMutation();

  // ✅ Load wishlist from RTK (logged in) or localStorage (guest)
  useEffect(() => {
    if (isLoggedIn && wishlistData) {
      // 🔥 Important fix: backend returns { data: [...] }
      const list = (wishlistData as any).data || wishlistData;

      const mapped = (list || []).map((it: any) => ({
        id: it.productId?._id || it.productId,
        name: it.productId?.name,
        image: it.productId?.image,
        price: it.productId?.price,
        originalPrice: it.productId?.originalPrice,
        wishItemId: it._id,
      }));

      setItems(mapped);
      return;
    }

    if (!isLoggedIn) {
      try {
        const raw = localStorage.getItem(WISHLIST_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
    }
  }, [wishlistData, isLoggedIn]);

  // ✅ Remove from wishlist
  async function removeFromWishlist(id: Product["id"]) {
    if (isLoggedIn) {
      const found = items.find((p) => String(p.id) === String(id));
      const wishItemId = found?.wishItemId;
      if (!wishItemId) return;

      await removeWishlistItem(String(wishItemId)).unwrap();

      setItems((prev) => prev.filter((p) => p.id !== id));
      return;
    }

    const next = items.filter((p) => p.id !== id);
    setItems(next);
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
  }

  // ✅ Get cart count
  const { data: cartCountData } = useGetCartCountQuery(undefined, {
    skip: !isLoggedIn,
  });

    const cartCount = isLoggedIn
    ? cartCountData?.count || 0
    : JSON.parse(localStorage.getItem("cart") || "[]").length;


  if (wishlistLoading) {
    return <Spinner />;
  }

  if (!items.length) {
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={0}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Your wishlist is empty</h2>
            <p className="text-gray-500 mt-2">
              Add products to your wishlist to see them here.
            </p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
            >
              Shop products
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={cartCount}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="ml-4 mt-3">
        <BackBtn />
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">My Wishlist</h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Wishlist Items */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex gap-4 p-4"
                >
                  <div
                    className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-xl flex-shrink-0 cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h3
                      className="font-semibold text-gray-900 mb-2 line-clamp-2 cursor-pointer"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition flex items-center gap-2"
                      >
                        <Heart className="w-4 h-4" /> Remove
                      </button>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-3 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Wishlist Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Wishlist Summary
              </h3>
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold text-gray-700">
                  Total Items:
                </span>
                <span className="text-2xl font-bold text-purple-600">
                  {items.length}
                </span>
              </div>
              <button
                onClick={() => navigate("/")}
                className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Wishlist;
