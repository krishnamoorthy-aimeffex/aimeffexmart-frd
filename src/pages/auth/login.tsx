// src/pages/Login.jsx
import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, ShoppingBag, Phone } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    identifier: Yup.string()
      .required("Email or mobile is required")
      .test(
        "email-or-mobile",
        "Enter valid email or 10-digit mobile number",
        (value) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || /^\d{10}$/.test(value)
      ),
    password: Yup.string().min(6).required("Password is required"),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");

      const isEmail = values.identifier.includes("@");
      const payload = isEmail
        ? { email: values.identifier, password: values.password }
        : { mobile: values.identifier, password: values.password };

      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Login failed");
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      alert("Login successful ✅");
      // navigate("/"); // use react-router
    } catch (err) {
      setError("Server error. Try again later.");
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
          <h3 className="text-2xl font-bold mb-2">Sign In</h3>

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
                <div>
                  <label>Email or Mobile</label>
                  <div className="relative">
                    {values.identifier.match(/^\d/)
                      ? <Phone className="absolute left-3 top-3 text-gray-400" />
                      : <Mail className="absolute left-3 top-3 text-gray-400" />}
                    <Field
                      name="identifier"
                      className="w-full pl-10 py-3 border rounded-xl"
                      placeholder="Email or Mobile"
                    />
                  </div>
                  <ErrorMessage name="identifier" component="div" className="text-red-500 text-sm" />
                </div>

                {/* Password */}
                <div>
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
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm" />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-purple-600 text-white rounded-xl"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>

                <div className="text-center text-sm mt-3">
                  Don’t have an account?{" "}
                  <a href="/signup" className="text-purple-600 font-semibold">
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
