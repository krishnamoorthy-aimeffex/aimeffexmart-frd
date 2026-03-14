import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";
import Header from "../components/dashboad/Header";
import { useGetProductByIdQuery } from "../redux/api/productApi";
import {
  useGetCartQuery,
  useAddToCartMutation,
  useGetCartCountQuery,
} from "../redux/api/cartApi";

interface Product {
  _id?: string;
  id: number | string;
  name: string;
  image?: string;
  badge?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  originalPrice?: number | string;
  description?: string;
}

function ProductShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [inCart, setInCart] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const isLoggedIn = !!localStorage.getItem("token");

  const CART_KEY = "cart";

  // RTK Query hooks
  const {
    data: productData,
    error: productError,
    isLoading: productLoading,
  } = useGetProductByIdQuery(String(id), { skip: !id });

  const { data: cartQueryData } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });

  const [addToCartMut] = useAddToCartMutation();

  // Sync product data from RTK Query
  useEffect(() => {
    if (!productData) return;

    const p = productData.data || productData;
    if (p && typeof p === "object") {
      const normalized: Product = {
        _id: p._id || p.id,
        id: p._id || p.id,
        name: p.name,
        image: p.image,
        badge: p.badge,
        rating: p.rating,
        reviews: p.reviews,
        price: p.price,
        originalPrice: p.originalPrice,
        description: p.description,
      };
      setProduct(normalized);
    }
  }, [productData]);

  // Fallback to static JSON on error
  useEffect(() => {
    if (productError && id && !productData) {
      (async () => {
        try {
          const list: Product[] = await fetch("/Product.json").then((r) =>
            r.json(),
          );
          const found = list.find(
            (p) =>
              String(p.id) === String(id) ||
              String((p as any)._id) === String(id),
          );
          setProduct(found ?? null);
        } catch (err) {
          setProduct(null);
        }
      })();
    }
  }, [productError, id, productData]);

  function getList(key: string): Product[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw) as Product[];
    } catch {
      return [];
    }
  }

  //   function isInCart(key: string, pid: Product["id"]) {
  //     return getList(key).some((p) => p.id === pid);
  //   }

  function addToCart(p: Product) {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    // Skip if already in cart
    if (inCart) {
      return;
    }

    // Use RTK mutation to add to cart
    const productId = String((p as any)._id || p.id);
    addToCartMut({ productId, quantity: 1 })
      .unwrap()
      .then(() => {
        setInCart(true);
      })
      .catch((err) => {
        console.error("Failed to add to cart", err);
      });
  }

  // Check cart membership from RTK Query data
  useEffect(() => {
    if (!product) return;

    if (isLoggedIn && cartQueryData) {
      const items = cartQueryData.data || cartQueryData;
      const found = (items || []).find((it: any) => {
        const pid = it.productId?._id || it.productId;
        return (
          String(pid) === String(product.id) ||
          String(pid) === String((product as any)._id)
        );
      });
      setInCart(!!found);
    } else {
      const local = getList(CART_KEY);
      const exists = local.some(
        (x) => String(x.id) === String(product.id),
      );
      setInCart(exists);
    }
  }, [product, isLoggedIn, cartQueryData]);

  const { data: cartCountData } = useGetCartCountQuery(undefined, {
    skip: !isLoggedIn,
  });

  const cartCount = isLoggedIn
    ? cartCountData?.count || 0
    : JSON.parse(localStorage.getItem("cart") || "[]").length; 

  function isCurrentlyInCart() {
    return inCart;
  }

  if (productLoading)
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="p-8">Loading…</div>
      </>
    );
  if (!product)
    return (
      <>
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Product not found</h2>
            <p className="text-gray-500 mt-2">No product matches the id {id}</p>
            <button
              onClick={() => navigate("/")}
              className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
            >
              Back to shop
            </button>
          </div>
        </div>
      </>
    );

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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-cover rounded-2xl shadow"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="font-semibold">{product.rating ?? "—"}</span>
              </div>
              <div className="text-sm text-gray-500">
                ({product.reviews ?? 0} reviews)
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-4">
              ₹{product.price}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through mb-4">
                ₹{product.originalPrice}
              </div>
            )}
            <p className="text-gray-700 mb-6">
              {product.description ?? "No description available."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product)}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {isCurrentlyInCart() ? "Added" : "Add to Cart"}
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductShow;
