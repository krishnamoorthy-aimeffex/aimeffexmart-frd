import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "../../components/ui/Spinner";

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

        // ✅ Use window.location.href for reliable redirect after 1 second
        setTimeout(() => {
          window.location.href = "/";
        }, 1000);
      } catch (error) {
        console.error("Failed to parse user data:", error);
        setTimeout(() => {
          navigate("/auth/login");
        }, 1000);
      }
    } else {
      console.error("Missing token or user data in URL");
      console.log("Full URL:", window.location.href); // Debug log
      setTimeout(() => {
        navigate("/auth/login");
      }, 1000);
    }
  }, [navigate]);

  return <Spinner />;
}

export default OAuthSuccess;
