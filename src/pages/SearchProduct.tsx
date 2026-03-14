import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Spinner from "../components/ui/Spinner";
import { useGetAllProductsQuery } from "../redux/api/productApi";
import Header from "../components/dashboad/Header";
import FeaturedProducts from "../components/dashboad/FeaturedProducts";
import {
  useGetCartQuery,
  useAddToCartMutation,
} from "../redux/api/cartApi";
import {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
} from "../redux/api/wishListApi";

function SearchProduct() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get("query") || "";

  const [query, setQuery] = useState(initialQuery);
  const [isLoading, setIsLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [cartCount, setCartCount] = useState<number>(0);
  const [backendCart, setBackendCart] = useState<any[]>([]);
  const [backendWishlist, setBackendWishlist] = useState<any[]>([]);
  const isLoggedIn = !!localStorage.getItem("token");

  // RTK Query hooks
  const { data: productsData} = useGetAllProductsQuery() as {
    data: any[] | { data: any[] } | undefined;
    error: any;
  };

  const { data: cartQueryData, refetch: refetchCart } = useGetCartQuery(
    undefined,
    { skip: !isLoggedIn },
  );

  const { data: wishlistQueryData, refetch: refetchWishlist } =
    useGetWishlistQuery(undefined, { skip: !isLoggedIn });

  const [addToCartMut] = useAddToCartMutation();
  const [addToWishlistMut] = useAddToWishlistMutation();
  const [removeFromWishlistMut] = useRemoveFromWishlistMutation();

  // Sync cart from RTK Query
  useEffect(() => {
    if (isLoggedIn && cartQueryData) {
      const items = cartQueryData.data || cartQueryData;
      setBackendCart(items || []);
      const total = (items || []).reduce(
        (sum: number, it: any) => sum + (it.quantity || 0),
        0,
      );
      setCartCount(total);
    }
  }, [isLoggedIn, cartQueryData]);

  // Sync wishlist from RTK Query
  useEffect(() => {
    if (isLoggedIn && wishlistQueryData) {
      const items = Array.isArray(wishlistQueryData)
        ? wishlistQueryData
        : (wishlistQueryData as any).data || wishlistQueryData;
      setBackendWishlist(items || []);
    }
  }, [isLoggedIn, wishlistQueryData]);

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
        // Use RTK Query data for search
        let products = Array.isArray(productsData)
          ? productsData
          : productsData?.data || [];

        if (!products || products.length === 0) {
          // Fallback to static JSON if no data
          const response = await fetch("/Product.json");
          products = await response.json();
        }

        const filtered = (products || [])
          .filter((p: any) =>
            p.name?.toLowerCase().includes(query.toLowerCase()) ||
            p.category?.toLowerCase().includes(query.toLowerCase()),
          )
          .map((p: any) => ({
            ...p,
            id: p._id || p.id,
          }));
        setResults(filtered);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 1000);

    return () => clearTimeout(handler);
  }, [query, productsData]);


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
      removeFromWishlistMut(String(existing._id))
        .unwrap()
        .then(() => {
          if (refetchWishlist) refetchWishlist();
        })
        .catch((err) => {
          console.error("Error removing from wishlist:", err);
        });
    } else {
      addToWishlistMut(productId)
        .unwrap()
        .then(() => {
          if (refetchWishlist) refetchWishlist();
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
    addToCartMut({ productId, quantity: 1 })
      .unwrap()
      .then(() => {
        if (refetchCart) refetchCart();
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
