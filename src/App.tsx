import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import Login from "./pages/auth/login";
import Signup from "./pages/auth/signup";
import Home from "./pages/home";
import Profile from "./pages/Profile";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import ProductShow from "./pages/ProductShow";
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
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/product/:id" element={<ProductShow />} />
      </Routes>
    </Router>
  );
}

export default App;
