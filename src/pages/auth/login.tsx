// src/pages/Login.jsx
import { useState, useEffect } from "react";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Phone } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login as loginAPI } from "../../api/auth.api";
import Spinner from "../../components/ui/Spinner";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Simulate 1 second loading delay
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  if (isPageLoading) {
    return <Spinner />;
  }

  // ✅ OAuth handlers (frontend-only for now)
  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
  };

  const handleFacebookLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/auth/facebook`;
  };

  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Email or mobile is required")
      .test(
        "email-or-mobile",
        "Enter valid email or 10-digit mobile number",
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10}$/.test(value),
      ),
    password: Yup.string().min(6).required("Password is required"),
  });

  const handleSubmit = async (values: { identifier: string; password: string }) => {
    try {
      setLoading(true);
      setError("");

      const isEmail = values.identifier.includes("@");
      const payload = isEmail
        ? { email: values.identifier, password: values.password }
        : { mobile: values.identifier, password: values.password };

      const response = await loginAPI(payload);

      if (response.token && response.user) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));

        // use react-router
        setTimeout(() => navigate("/"), 1000);
      } else {
        setError("Invalid response from server. Missing token or user data.");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error. Try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8">
        {/* Left */}
        <div className="hidden md:flex flex-col justify-center p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl">
              <ShoppingBag className="text-white" />
            </div>
            <h1 className="text-4xl font-bold text-purple-600">
              Aimeffef Mart
            </h1>
          </div>
          <h2 className="text-3xl font-bold">Welcome Back!</h2>
          <p className="text-gray-600 mt-2">
            Login using email or mobile number
          </p>
        </div>

        {/* Right */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h3 className="text-2xl font-bold mb-4">Login In</h3>

          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-3">
              {error}
            </div>
          )}

          <Formik
            initialValues={{ identifier: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values }) => (
              <Form className="space-y-4">
                {/* Identifier */}
                <div className="flex flex-col gap-2">
                  <label>Email or Mobile</label>
                  <div className="relative">
                    {values.identifier.match(/^\d/) ? (
                      <Phone className="absolute left-3 top-3 text-gray-400" />
                    ) : (
                      <Mail className="absolute left-3 top-3 text-gray-400" />
                    )}
                    <Field
                      name="identifier"
                      className="w-full pl-10 py-3 border rounded-xl"
                      placeholder="Email or Mobile"
                    />
                  </div>
                  <ErrorMessage
                    name="identifier"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                {/* Password */}
                <div className="flex flex-col gap-2">
                  <label>Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-gray-400" />
                    <Field
                      type={showPassword ? "text" : "password"}
                      name="password"
                      className="w-full pl-10 pr-10 py-3 border rounded-xl"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                  <ErrorMessage
                    name="password"
                    component="div"
                    className="text-red-500 text-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl cursor-pointer hover:bg-purple-700 disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-grow h-px bg-gray-300" />
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                {/* OAuth */}
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={handleGoogleLogin}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    <FcGoogle size={22} className="mr-1" />
                    Google
                  </button>

                  <button
                    type="button"
                    onClick={handleFacebookLogin}
                    className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-xl hover:bg-gray-50 transition cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                    <span className="ml-2 text-sm font-medium text-gray-700">
                      Facebook
                    </span>
                  </button>
                </div>

                <div className="text-center text-sm mt-3">
                  Don't have an account?{" "}
                  <a href="/auth/signup" className="text-purple-600 font-semibold hover:underline">
                    Sign up
                  </a>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default Login;
