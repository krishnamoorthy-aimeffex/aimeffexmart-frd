import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import { getAllProducts } from "../api/product.api";
import Header from "../components/dashboad/Header";
import FeaturedProducts from "../components/dashboad/FeaturedProducts";
import cartApi from "../api/cart.api";
import wishListApi from "../api/wishList.api";

function SearchProduct() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true); // initial page load
  const [searching, setSearching] = useState(false); // search in-progress
  const [results, setResults] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [backendCart, setBackendCart] = useState<any[]>([]);
  const [backendWishlist, setBackendWishlist] = useState<any[]>([]);
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    if (isLoggedIn) {
      cartApi
        .getCart()
        .then((res) => {
          const items = res.data || res;
          setBackendCart(items || []);
          const total = (items || []).reduce(
            (sum: number, it: any) => sum + (it.quantity || 0),
            0,
          );
          setCartCount(total);
        })
        .catch(() => {
          setCartCount(0);
        });

      wishListApi
        .getWishlist()
        .then((res) => {
          const items = res.data || res;
          setBackendWishlist(items || []);
        })
        .catch(() => setBackendWishlist([]));
    }
  }, [isLoggedIn]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 600);
    return () => clearTimeout(timer);
  }, []);

  // Update URL param when query changes (non-debounced)
  useEffect(() => {
    if (query) setSearchParams({ query });
    else setSearchParams({});
  }, [query, setSearchParams]);

  // Debounced search effect
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (!query.trim()) {
        setResults([]);
        setSearching(false);
        return;
      }

      setSearching(true);
      try {
        const data = await getAllProducts();
        // Attempt to read array — adapt if API shape differs
        const products = Array.isArray(data) ? data : data?.data || [];
        const filtered = products
          .filter((p: any) =>
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()),
          )
          .map((p: any) => ({
            ...p,
            id: p._id || p.id, // Normalize id field
          }));
        setResults(filtered);
      } catch (err) {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [query]);


  // Helper: check if product in wishlist
  function isInWishlist(id: string | number): boolean {
    return backendWishlist.some(
      (w) => String(w.productId?._id || w.productId) === String(id),
    );
  }

  // Helper: toggle wishlist
  function toggleWishlist(product: any) {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    const productId = String(product._id || product.id);
    const existing = backendWishlist.find(
      (w) => String(w.productId?._id || w.productId) === productId,
    );

    if (existing) {
      wishListApi
        .removeFromWishlist(String(existing._id))
        .then(() => wishListApi.getWishlist())
        .then((res) => {
          const items = res.data || res;
          setBackendWishlist(items || []);
        })
        .catch((err) => {
          console.error("Error removing from wishlist:", err);
        });
    } else {
      wishListApi
        .addToWishlist(productId)
        .then(() => wishListApi.getWishlist())
        .then((res) => {
          const items = res.data || res;
          setBackendWishlist(items || []);
        })
        .catch((err) => {
          console.error("Error adding to wishlist:", err);
        });
    }
  }

  // Helper: check if product in cart
  function isInCart(id: string | number): boolean {
    return backendCart.some((c) => {
      const pid = c.productId?._id || c.productId;
      return String(pid) === String(id) || String(c._id) === String(id);
    });
  }

  // Helper: add to cart
  function addToCart(product: any) {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    const productId = String(product._id || product.id);
    cartApi
      .addToCart(productId, 1)
      .then(() => cartApi.getCart())
      .then((res) => {
        const items = res.data || res;
        setBackendCart(items || []);
        const total = (items || []).reduce(
          (sum: number, it: any) => sum + (it.quantity || 0),
          0,
        );
        setCartCount(total);
      })
      .catch((err) => {
        console.error("Error adding to cart:", err);
      });
  }

  if (isLoading) return <Spinner />;

  return (
    <>
      <div>
        <Header
          isLoggedIn={isLoggedIn}
          cartCount={cartCount}
          searchQuery={query}
          onSearchChange={setQuery}
        />
        <div className="px-4 md:px-8">
          <div className="relative py-8">
            <div className="absolute left-4 top-1/2 -translate-y-1/2"></div>

            <div className="flex justify-center">
              <input
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products"
                className="w-full md:w-2/3 lg:w-1/2 pl-6 pr-6 py-4 border-2 rounded-lg text-lg md:text-xl font-semibold focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-6">
            {searching ? (
              <div className="flex justify-center">
                <Spinner />
              </div>
            ) : (
              <>
                {results.length === 0 ? (
                  <p className="text-center text-gray-500">No results</p>
                ) : (
                  <FeaturedProducts
                    featuredProducts={results}
                    onToggleWishlist={toggleWishlist}
                    onAddToCart={addToCart}
                    isInWishlist={isInWishlist}
                    isInCart={isInCart}
                    showHeader={false}
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default SearchProduct;
