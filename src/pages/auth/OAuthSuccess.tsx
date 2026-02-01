import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function OAuthSuccess() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    const token = params.get("token");
    const userString = params.get("user");

    console.log("URL Params:", { token, userString }); // Debug log

    if (token && userString) {
      try {
        // ✅ Parse the user JSON string
        const user = JSON.parse(userString);
        
        console.log("Parsed user:", user); // Debug log
        
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        console.log("Stored in localStorage:", {
          token: localStorage.getItem("token"),
          user: localStorage.getItem("user"),
        }); // Debug log

        // ✅ Use window.location.href for reliable redirect
        setTimeout(() => {
          window.location.href = "/";
        }, 500);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setTimeout(() => {
          navigate("/login");
        }, 500);
      }
    } else {
      console.error("Missing token or user data in URL");
      console.log("Full URL:", window.location.href); // Debug log
      setTimeout(() => {
        navigate("/login");
      }, 500);
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-lg font-semibold text-gray-700">Signing you in...</p>
        <p className="text-sm text-gray-500 mt-2">Please wait a moment</p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
