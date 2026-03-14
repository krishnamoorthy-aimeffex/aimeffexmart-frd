// src/pages/Signup.jsx
import { useState, useEffect } from "react";
import {
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
  ShoppingBag,
  Phone,
} from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { signup as signupAPI } from "../../api/auth.api";
import Spinner from "../../components/ui/Spinner";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";

function Signup() {
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

  // Validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Full name is required"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values: {
    name: string;
    email: string;
    mobile: string;
    password: string;
    confirmPassword: string;
  }) => {
    try {
      setLoading(true);
      setError("");

      const response = await signupAPI({
        name: values.name,
        email: values.email,
        mobile: values.mobile,
        password: values.password,
      });

      localStorage.setItem("token", response.token || "");
      localStorage.setItem("user", JSON.stringify(response.user));

      setTimeout(() => navigate("/"), 1000);
    } catch (err: any) {
      setError(err.response?.data?.message || "Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side */}
        <div className="hidden md:flex flex-col justify-center space-y-6 p-8">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-3 rounded-2xl">
              <ShoppingBag className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Aimeffef Mart
            </h1>
          </div>

          <h2 className="text-3xl font-bold text-gray-800">
            Join Our Community
          </h2>
          <p className="text-gray-600 text-lg">
            Create an account to unlock exclusive deals
          </p>
        </div>

        {/* Right Side */}
        <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-10">
          <h3 className="text-2xl font-bold mb-4">Sign Up</h3>
          {error && (
            <div className="bg-red-100 text-red-600 p-3 rounded mb-3">
              {error}
            </div>
          )}

          <Formik
            initialValues={{
              name: "",
              email: "",
              mobile: "",
              password: "",
              confirmPassword: "",
            }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {() => (
              <Form className="space-y-4">
                {/* Name */}
                <label>Full Name</label>
                <FieldBlock
                  icon={<User />}
                  name="name"
                  placeholder="John Doe"
                />

                {/* Email */}
                <label>Email</label>
                <FieldBlock
                  icon={<Mail />}
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                />

                {/* Mobile */}
                <label>Mobile Number</label>
                <FieldBlock
                  icon={<Phone />}
                  name="mobile"
                  placeholder="0000000000"
                />

                {/* Password */}
                <label>Password</label>
                <PasswordField
                  name="password"
                  showPassword={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                />

                {/* Confirm Password */}
                <label>Confirm Password</label>
                <PasswordField
                  name="confirmPassword"
                  showPassword={showPassword}
                  toggle={() => setShowPassword(!showPassword)}
                />

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 mt-2 rounded-xl font-semibold text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? "Creating..." : "Create Account"}
                </button>

                {/* Divider */}
                <div className="flex items-center my-3">
                  <div className="flex-grow h-px bg-gray-300" />
                  <span className="px-3 text-sm text-gray-500">OR</span>
                  <div className="flex-grow h-px bg-gray-300" />
                </div>

                {/* OAuth */}
                <div className="mt-7 grid grid-cols-2 gap-3">
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

                {/* Login Link */}
                <p className="text-center text-sm">
                  Already have an account?{" "}
                  <a
                    href="/auth/login"
                    className="text-purple-600 font-semibold hover:underline"
                  >
                    Login
                  </a>
                </p>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

// ✅ Reusable Field Component
const FieldBlock = ({ icon, name, type = "text", placeholder }: { icon: React.ReactNode; name: string; type?: string; placeholder: string }) => (
  <div className="flex flex-col gap-2">
    <div className="relative mt-2">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <Field
        name={name}
        type={type}
        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
        placeholder={placeholder}
      />
    </div>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

// ✅ Reusable Password Field Component
const PasswordField = ({ name, showPassword, toggle }: { name: string; showPassword: boolean; toggle: () => void }) => (
  <div className="flex flex-col gap-2">
    <div className="relative mt-2">
      <Lock className="absolute left-3 top-3 text-gray-400" />
      <Field
        name={name}
        type={showPassword ? "text" : "password"}
        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:border-purple-600"
        placeholder={name === "password" ? "Password" : "Confirm Password"}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
      </button>
    </div>
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm"
    />
  </div>
);

export default Signup;
