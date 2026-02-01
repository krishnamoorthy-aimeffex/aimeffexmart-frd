import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Heart } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";

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

function Wishlist() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const WISHLIST_KEY = "wishlist";

  useEffect(() => {
    try {
      const raw = localStorage.getItem(WISHLIST_KEY);
      if (!raw) return setItems([]);
      setItems(JSON.parse(raw));
    } catch {
      setItems([]);
    }
  }, []);

  function removeFromWishlist(id: Product["id"]) {
    const next = items.filter((p) => p.id !== id);
    setItems(next);
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next));
    } catch {}
  }

  if (!items.length) {
    return (
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
    );
  }

  return (
    <>
      <div className="ml-4 mt-3">
        <BackBtn />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">My Wishlist</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((product) => (
            <div
              key={product.id}
              className="group bg-white border border-gray-200 rounded-2xl overflow-hidden"
            >
              <div className="relative aspect-square overflow-hidden bg-gray-100">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    No image
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                  {product.name}
                </h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-2xl font-bold text-purple-600">
                    ${product.price}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="px-3 py-2 bg-red-500 text-white rounded flex items-center gap-2"
                  >
                    <Heart className="w-4 h-4" /> Remove
                  </button>
                  <button
                    onClick={() => navigate("/")}
                    className="px-3 py-2 bg-gray-100 rounded flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" /> Continue shopping
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default Wishlist;
