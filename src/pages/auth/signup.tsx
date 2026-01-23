// src/pages/Signup.jsx
import React, { useState } from "react";
import { Mail, Lock, User, Eye, EyeOff, Phone, ShoppingBag } from "lucide-react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const validationSchema = Yup.object({
    name: Yup.string().required("Name required"),
    email: Yup.string().email().required("Email required"),
    mobile: Yup.string().matches(/^\d{10}$/).required("Mobile required"),
    password: Yup.string().min(6).required("Password required"),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref("password")], "Passwords must match")
      .required(),
  });

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: values.name,
          email: values.email,
          mobile: values.mobile,
          password: values.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Signup failed");
        return;
      }

      alert("Account created successfully 🎉");
      // navigate("/login");
    } catch (err) {
      setError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg">

        <div className="flex items-center gap-3 mb-4">
          <ShoppingBag className="text-purple-600" />
          <h2 className="text-2xl font-bold">Create Account</h2>
        </div>

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
          <Form className="space-y-4">

            <FieldInput name="name" icon={<User />} placeholder="Full Name" />
            <FieldInput name="email" icon={<Mail />} placeholder="Email" />
            <FieldInput name="mobile" icon={<Phone />} placeholder="Mobile" />

            {/* Password */}
            <div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-400" />
                <Field
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="w-full pl-10 pr-10 py-3 border rounded-xl"
                  placeholder="Password"
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

            <FieldInput
              name="confirmPassword"
              icon={<Lock />}
              placeholder="Confirm Password"
              type={showPassword ? "text" : "password"}
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-purple-600 text-white rounded-xl"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>

            <p className="text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-purple-600 font-semibold">
                Login
              </a>
            </p>
          </Form>
        </Formik>
      </div>
    </div>
  );
}

const FieldInput = ({ name, icon, placeholder, type = "text" }) => (
  <div>
    <div className="relative">
      <span className="absolute left-3 top-3 text-gray-400">{icon}</span>
      <Field
        name={name}
        type={type}
        className="w-full pl-10 py-3 border rounded-xl"
        placeholder={placeholder}
      />
    </div>
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm" />
  </div>
);

export default Signup;
