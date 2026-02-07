import { useState } from "react";
import {
  ShoppingBag,
  Search,
  User,
  Heart,
  ShoppingCart,
  Menu,
  X,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface HeaderProps {
  isLoggedIn: boolean;
  cartCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

function Header({
  isLoggedIn,
  cartCount,
  searchQuery,
  onSearchChange,
}: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const hideSearch = location.pathname === "/search";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
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
          {!hideSearch && (
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div
                onClick={() =>
                  navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
                }
                className="relative w-full"
              >
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onFocus={() =>
                    navigate(`/search?query=${encodeURIComponent(searchQuery)}`)
                  }
                  placeholder="Search products..."
                  readOnly
                  className="w-full pl-12 pr-4 py-3 border rounded-xl cursor-pointer"
                />
              </div>
            </div>
          )}

          {/* Right Icons */}
          <div className="flex items-center gap-4">
            {/* ✅ ACCOUNT / LOGIN */}
            <button
              onClick={() => navigate(isLoggedIn ? "/profile" : "/auth/login")}
              className="hidden md:flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">
                {isLoggedIn ? "Account" : "Login"}
              </span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => navigate("/wishlist")}
              className="hidden md:block p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <Heart />
            </button>

            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
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
              onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl"
            >
              <User />
              <span>{isLoggedIn ? "My Account" : "Login"}</span>
            </button>

            <button
              onClick={() => navigate("/wishlist")}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-100 rounded-xl cursor-pointer"
            >
              <Heart />
              <span>Wishlist</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

export default Header;
