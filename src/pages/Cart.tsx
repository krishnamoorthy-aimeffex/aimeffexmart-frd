import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Trash2 } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";
import Spinner from "../components/ui/Spinner";
import Header from "../components/dashboad/Header";
import {
  useGetCartQuery,
  useRemoveFromCartMutation,
  useUpdateCartMutation,
} from "../redux/api/cartApi";

interface Product {
  id: string; // cart item id
  productId?: string;
  name: string;
  image?: string;
  price?: number | string;
  originalPrice?: number | string;
  quantity?: number;
}

function Cart() {
  const navigate = useNavigate();
  const [items, setItems] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const CART_KEY = "cart";
  const isLoggedIn = !!localStorage.getItem("token");

  const { data: cartData, isLoading: cartLoading } = useGetCartQuery(
    undefined,
    {
      skip: !isLoggedIn,
    },
  );

  const [removeCartItem] = useRemoveFromCartMutation();
  const [updateQuantity] = useUpdateCartMutation();

  useEffect(() => {
    if (isLoggedIn) {
      // backend returns { data: [...] } — normalize to `payload`
      const payload = Array.isArray(cartData) ? cartData : cartData?.data;
      if (!cartLoading && Array.isArray(payload)) {
        const mapped = payload.map((b: any) => ({
          id: b._id, // cart item id
          productId: b.productId?._id,
          name: b.productId?.name || "",
          image: b.productId?.image,
          price: b.productId?.price || 0,
          originalPrice: b.productId?.originalPrice || 0,
          quantity: b.quantity || 1,
        }));
        setItems(mapped);
      }
      setIsLoading(Boolean(cartLoading));
    } else {
      // not logged in — load from localStorage once
      try {
        const raw = localStorage.getItem(CART_KEY);
        setItems(raw ? JSON.parse(raw) : []);
      } catch {
        setItems([]);
      }
      setIsLoading(false);
    }
  }, [cartData, cartLoading, isLoggedIn]);

  function saveCart(list: Product[]) {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(list));
      setItems(list);
    } catch {}
  }

  function incrementQuantity(id: Product["id"]) {
    if (isLoggedIn) {
      const item = items.find((p) => p.id === id);
      if (!item) return;

      const newQty = (item.quantity || 1) + 1;

      updateQuantity({ cartItemId: String(id), quantity: newQty });

      const next = items.map((p) =>
        p.id === id ? { ...p, quantity: newQty } : p,
      );
      setItems(next);
      return;
    }

    const next = items.map((p) =>
      p.id === id ? { ...p, quantity: (p.quantity || 1) + 1 } : p,
    );
    saveCart(next);
  }

  function decrementQuantity(id: Product["id"]) {
    if (isLoggedIn) {
      const item = items.find((p) => p.id === id);
      if (!item) return;

      const newQty = (item.quantity || 1) - 1;

      if (newQty <= 0) {
        removeCartItem(String(id));
        setItems(items.filter((p) => p.id !== id));
        return;
      }

      updateQuantity({ cartItemId: String(id), quantity: newQty });

      const next = items.map((p) =>
        p.id === id ? { ...p, quantity: newQty } : p,
      );
      setItems(next);
      return;
    }

    const next = items
      .map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(0, (p.quantity || 1) - 1) }
          : p,
      )
      .filter((p) => p.quantity && p.quantity > 0);

    saveCart(next);
  }

  function removeFromCart(id: Product["id"]) {
    if (isLoggedIn) {
      removeCartItem(String(id));
      setItems(items.filter((p) => p.id !== id));
      return;
    }

    const next = items.filter((p) => p.id !== id);
    saveCart(next);
  }

  if (isLoading) {
    return <Spinner />;
  }

  if (!items.length) {
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={items.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Your cart is empty</h2>
            <p className="text-gray-500 mt-2">
              Add products to your cart to see them here.
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

  const totalQuantity = items.reduce((sum, p) => sum + (p.quantity || 1), 0);
  const total = items.reduce(
    (acc, it) => acc + Number(it.price || 0) * (it.quantity || 1),
    0,
  );

  return (
    <>
      <Header
        isLoggedIn={isLoggedIn}
        cartCount={totalQuantity}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />
      <div className="ml-4 mt-3">
        <BackBtn />
      </div>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Your Cart</h2>
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Products Column - Left */}
          <div className="lg:col-span-2">
            <div className="flex flex-col gap-6">
              {items.map((product) => (
                <div
                  key={product.id}
                  className="group bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 flex gap-4 p-4"
                >
                  {/* Product Image */}
                  <div className="relative w-32 h-32 overflow-hidden bg-gray-100 rounded-xl flex-shrink-0">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-2xl font-bold text-purple-600">
                        ₹{product.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        x {product.quantity || 1} = ₹
                        {(
                          Number(product.price || 0) * (product.quantity || 1)
                        ).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {/* Quantity Control */}
                      <div className="flex items-center gap-2 bg-gray-200 rounded-xl p-1 w-fit">
                        <button
                          onClick={() =>
                            (product.quantity || 1) === 1
                              ? removeFromCart(product.id)
                              : decrementQuantity(product.id)
                          }
                          className="w-8 h-8 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition text-sm flex items-center justify-center"
                        >
                          {(product.quantity || 1) === 1 ? (
                            <Trash2 className="w-4 h-4" />
                          ) : (
                            "−"
                          )}
                        </button>
                        <div className="w-8 h-8 bg-white text-black rounded-lg font-bold text-center text-sm flex items-center justify-center">
                          {product.quantity || 1}
                        </div>
                        <button
                          onClick={() => incrementQuantity(product.id)}
                          className="w-8 h-8 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${product.id}`)}
                        className="px-3 py-2 h-9.5 flex-1 sm:flex-none bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition flex items-center justify-center gap-2"
                      >
                        <ShoppingCart className="w-4 h-4" /> View Details
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total Summary - Right */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-20">
              <div className="flex items-center justify-between mb-4">
                <span className="text-lg font-semibold text-gray-700">
                  Total Items:
                </span>
                <span className="text-lg font-bold text-purple-600">
                  {totalQuantity}
                </span>
              </div>
              <div className="border-t pt-4 flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  ₹{total.toFixed(2)}
                </span>
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cart;
