import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductShow from "./pages/ProductShow";
import AdminPanel from "./pages/AdminPanel";
import AddProduct from "./pages/productForm/AddProduct";
import UpdateProduct from "./pages/productForm/UpadateProduct";
import SearchProduct from "./pages/SearchProduct";
import "./App.css";
import OAuthSuccess from "./pages/auth/OAuthSuccess";


function App() {
  useEffect(() => {
    if (window.location.hash === "#_=_") {
      window.history.replaceState(
        null,
        "",
        window.location.pathname + window.location.search,
      );
    }
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/oauth-success" element={<OAuthSuccess />} />
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductShow />} />
        <Route path="/search" element={<SearchProduct />} />
        <Route path="/afx-admin" element={<AdminPanel />} />
        <Route path="/afx-admin/add-product" element={<AddProduct />} />
        <Route path="/afx-admin/update-product/:id" element={<UpdateProduct />} />
      </Routes>
    </Router>
  );
}

export default App;
