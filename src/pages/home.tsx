// src/pages/Home.tsx
import { useState, useEffect } from "react";
import Header from "../components/dashboad/Header";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/dashboad/HeroSection";
import CategoriesSection from "../components/dashboad/CategoriesSection";
import FeaturedProducts from "../components/dashboad/FeaturedProducts";
import FeaturesSection from "../components/dashboad/FeaturesSection";
import Footer from "../components/dashboad/Footer";
import Spinner from "../components/ui/Spinner";
import { getAllProducts } from "../api/product.api";
import cartApi from "../api/cart.api";
import wishListApi from "../api/wishList.api";

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
  category?: string;
  description?: string;
  stock?: number;
  quantity?: number;
}

interface Category {
  name: string;
  color?: string;
}

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState<number>(0);
  const [backendCart, setBackendCart] = useState<any[]>([]);
  const [backendWishlist, setBackendWishlist] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  //  AUTH CHECK
  const isLoggedIn = !!localStorage.getItem("token");

  // Load data from API and fallback to static JSON
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch products from database
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const data = await getAllProducts();
        const products = data.data || data;
        
        if (Array.isArray(products)) {
          // Transform DB products to component format
          const transformedProducts = products.map((p: any) => ({
            _id: p._id,
            id: p._id,
            name: p.name,
            image: p.image,
            rating: p.rating,
            reviews: p.reviews,
            price: p.price,
            originalPrice: p.originalPrice,
            category: p.category,
            description: p.description,
            stock: p.stock,
          }));
          setFeaturedProducts(transformedProducts);
        }
      } catch (err) {
        console.warn("Failed to fetch products from API, loading from static JSON:", err);
        // Fallback to static JSON
        fetch("/Product.json")
          .then((res) => res.json())
          .then((data) => setFeaturedProducts(data))
          .catch(() => setFeaturedProducts([]));
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();

    // Load categories from static JSON (can be moved to API later)
    fetch("/ProductCategory.json")
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


  function isInWishlist(id: Product["id"]) {
    if (isLoggedIn) {
      return backendWishlist.some((w) => String(w.productId?._id || w.productId) === String(id));
    }
    return getWishlist().some((p) => p.id === id);
  }

  function toggleWishlist(product: Product) {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    // When logged in, sync with backend wishlist
    const existing = backendWishlist.find(
      (w) => String(w.productId?._id || w.productId) === String(product._id || product.id)
    );
    if (existing) {
      // remove
      wishListApi
        .removeFromWishlist(String(existing._id))
        .then(() => wishListApi.getWishlist())
        .then((res) => {
          const items = res.data || res;
          setBackendWishlist(items || []);
        })
        .catch(() => {});
    } else {
      const pid = String(product._id || product.id);
      wishListApi
        .addToWishlist(pid)
        .then(() => wishListApi.getWishlist())
        .then((res) => {
          const items = res.data || res;
          setBackendWishlist(items || []);
        })
        .catch(() => {});
    }
    // Keep local UI reference stable
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

  function getCartQuantity(id: Product["id"]): number {
    if (isLoggedIn) {
      const found = backendCart.find((c) => {
        const pid = c.productId?._id || c.productId;
        return String(pid) === String(id) || String(c._id) === String(id);
      });
      return found?.quantity || 0;
    }
    const cart = getCart();
    const product = cart.find((p) => p.id === id);
    return product?.quantity || 0;
  }

  function isInCart(id: Product["id"]) {
    if (isLoggedIn) {
      return backendCart.some((c) => {
        const pid = c.productId?._id || c.productId;
        return String(pid) === String(id) || String(c._id) === String(id);
      });
    }
    return getCart().some((p) => p.id === id);
  }

  function addToCart(product: Product) {
    if (!isLoggedIn) {
      navigate("/auth/login");
      return;
    }

    if (isLoggedIn) {
      const productId = (product._id || product.id) as any;
      cartApi
        .addToCart(String(productId), 1)
        .then(() => {
          // refresh backend cart
          return cartApi.getCart();
        })
        .then((res) => {
          const items = res.data || res;
          setBackendCart(items || []);
          const total = (items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
          setCartCount(total);
        })
        .catch(() => {});
      return;
    }

    const list = getCart();
    const existingProduct = list.find((p) => p.id === product.id);
    let next: Product[];

    if (existingProduct) {
      next = list.map((p) =>
        p.id === product.id
          ? { ...p, quantity: (p.quantity || 1) + 1 }
          : p
      );
    } else {
      next = [{ ...product, quantity: 1 }, ...list];
    }

    saveCart(next);
    setCartCount(next.reduce((sum, p) => sum + (p.quantity || 1), 0));
  }

  function incrementCart(id: Product["id"]) {
    if (isLoggedIn) {
      const found = backendCart.find((c) => String(c.productId?._id || c.productId) === String(id));
      if (!found) return;
      const cartItemId = found._id;
      const newQty = (found.quantity || 0) + 1;
      cartApi
        .updateCartQuantity(String(cartItemId), newQty)
        .then(() => cartApi.getCart())
        .then((res) => {
          const items = res.data || res;
          setBackendCart(items || []);
          const total = (items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
          setCartCount(total);
        })
        .catch(() => {});
      return;
    }

    const list = getCart();
    const next = list.map((p) =>
      p.id === id
        ? { ...p, quantity: (p.quantity || 1) + 1 }
        : p
    );
    saveCart(next);
    setCartCount(next.reduce((sum, p) => sum + (p.quantity || 1), 0));
  }

  function decrementCart(id: Product["id"]) {
    if (isLoggedIn) {
      const found = backendCart.find((c) => String(c.productId?._id || c.productId) === String(id));
      if (!found) return;
      const cartItemId = found._id;
      const newQty = Math.max(0, (found.quantity || 1) - 1);
      if (newQty === 0) {
        cartApi
          .removeFromCart(String(cartItemId))
          .then(() => cartApi.getCart())
          .then((res) => {
            const items = res.data || res;
            setBackendCart(items || []);
            const total = (items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
            setCartCount(total);
          })
          .catch(() => {});
        return;
      }

      cartApi
        .updateCartQuantity(String(cartItemId), newQty)
        .then(() => cartApi.getCart())
        .then((res) => {
          const items = res.data || res;
          setBackendCart(items || []);
          const total = (items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
          setCartCount(total);
        })
        .catch(() => {});
      return;
    }

    const list = getCart();
    const next = list
      .map((p) =>
        p.id === id
          ? { ...p, quantity: Math.max(0, (p.quantity || 1) - 1) }
          : p
      )
      .filter((p) => p.quantity && p.quantity > 0);
    saveCart(next);
    setCartCount(next.reduce((sum, p) => sum + (p.quantity || 1), 0));
  }

  // initialize cart on mount (backend for logged-in users)
  useEffect(() => {
    const init = async () => {
      if (isLoggedIn) {
        try {
          const res = await cartApi.getCart();
          const items = res.data || res;
          setBackendCart(items || []);
          const total = (items || []).reduce((sum: number, it: any) => sum + (it.quantity || 0), 0);
          setCartCount(total);
        } catch (e) {
          // fallback to localStorage
          const local = getCart();
          setCartCount(local.reduce((sum, p) => sum + (p.quantity || 1), 0));
        }
      } else {
        const local = getCart();
        setCartCount(local.reduce((sum, p) => sum + (p.quantity || 1), 0));
      }
    };

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]);

  // initialize wishlist for logged-in users
  useEffect(() => {
    const initWishlist = async () => {
      if (isLoggedIn) {
        try {
          const res = await wishListApi.getWishlist();
          const items = res.data || res;
          setBackendWishlist(items || []);
        } catch (e) {
          setBackendWishlist([]);
        }
      } else {
        setBackendWishlist([]);
      }
    };
    initWishlist();
  }, [isLoggedIn]);

  // Filter products by selected category (handle string or object categories)
  const filteredProducts = selectedCategory
    ? featuredProducts.filter((p) => {
        const cat = p.category as any;
        // category may be a string, an object with `name`/`title`, or an object id
        const catName =
          (typeof cat === "string" && cat) ||
          (cat && (cat.name || cat.title)) ||
          "";

        return String(catName).toLowerCase() === selectedCategory.toLowerCase();
      })
    : featuredProducts;

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className="min-h-screen bg-gray-50">
          <Header
            isLoggedIn={isLoggedIn}
            cartCount={cartCount}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
          <HeroSection />
          <CategoriesSection 
            categories={categories}
            onCategoryClick={setSelectedCategory}
            selectedCategory={selectedCategory}
          />
          <FeaturedProducts
            featuredProducts={filteredProducts}
            onToggleWishlist={toggleWishlist}
            onAddToCart={addToCart}
            isInWishlist={isInWishlist}
            getCartQuantity={getCartQuantity}
            isInCart={isInCart}
            onIncrementCart={incrementCart}
            onDecrementCart={decrementCart}
            onResetCategory={() => setSelectedCategory("")}
          />
          <FeaturesSection />
          <Footer />
        </div>
      )}
    </>
  );
}

export default Home;
