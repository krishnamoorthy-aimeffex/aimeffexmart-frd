import { useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";
import { usePostProductMutation } from "../../redux/api/productApi";

interface ProductFormData {
  name: string;
  image: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  stock: number;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().min(3, "Name must be at least 3 characters").max(100, "Name must be less than 100 characters").required("Product name is required"),
  category: Yup.string().required("Category is required"),
  price: Yup.number().min(0, "Price must be 0 or greater").required("Price is required"),
  originalPrice: Yup.number().min(0, "Original price must be 0 or greater"),
  description: Yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
  stock: Yup.number().min(0, "Stock must be 0 or greater"),
  rating: Yup.number().min(0, "Rating must be 0 or greater").max(5, "Rating cannot exceed 5"),
  reviews: Yup.number().min(0, "Reviews must be 0 or greater"),
  image: Yup.string().required("Product image is required"),
});

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [imagePreview, setImagePreview] = useState<string>("");

  // RTK Query mutation
  const [postProductMut] = usePostProductMutation();

  const formik = useFormik({
    initialValues: {
      name: "",
      image: "",
      rating: 0,
      reviews: 0,
      price: 0,
      originalPrice: 0,
      description: "",
      category: "",
      stock: 0,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const categories = [
    "Electronics",
    "Fashion",
    "Home & Garden",
    "Sports",
    "Books",
    "Toys",
    "Health & Beauty",
    "Food & Beverage",
    "Other",
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64 = reader.result as string;
      formik.setFieldValue("image", base64);
      setImagePreview(base64);
    };
  };

  async function handleSubmit(values: ProductFormData) {
    setApiError("");
    try {
      setLoading(true);
      await postProductMut(values)
        .unwrap();
      navigate("/afx-admin");
    } catch (err) {
      setApiError((err as any)?.data?.message || (err as Error)?.message || "Error adding product");
    } finally {
      setLoading(false);
    }
  }

  const getFieldError = (fieldName: keyof ProductFormData): string | undefined => {
    return formik.touched[fieldName] && formik.errors[fieldName] ? formik.errors[fieldName] : undefined;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/afx-admin")}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Add New Product
          </h1>
        </div>
      </div>

      {/* Form Container */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {apiError && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {apiError}
            </div>
          )}

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            {/* Row 1: Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Product Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formik.values.name}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter product name"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("name") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("name") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("name")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formik.values.category}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("category") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {getFieldError("category") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("category")}</p>
                )}
              </div>
            </div>

            {/* Row 2: Price and Original Price */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Price <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="price"
                  value={formik.values.price || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("price") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("price") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("price")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Original Price (Optional)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={formik.values.originalPrice || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("originalPrice") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("originalPrice") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("originalPrice")}</p>
                )}
              </div>
            </div>

            {/* Row 3: Stock and Rating */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <input
                  type="number"
                  name="stock"
                  value={formik.values.stock || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("stock") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("stock") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("stock")}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Rating
                </label>
                <input
                  type="number"
                  name="rating"
                  value={formik.values.rating || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0"
                  step="0.1"
                  min="0"
                  max="5"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("rating") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("rating") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("rating")}</p>
                )}
              </div>
            </div>

              {/* Row 4: Reviews */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Reviews
                </label>
                <input
                  type="number"
                  name="reviews"
                  value={formik.values.reviews || ""}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="0"
                  min="0"
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("reviews") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("reviews") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("reviews")}</p>
                )}
              </div>

              {/* Row 5: Description */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  placeholder="Enter product description"
                  rows={5}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 resize-none ${
                    getFieldError("description") ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("description") && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("description")}</p>
                )}
              </div>

              {/* Row 6: Image */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Image <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}
                  className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${
                    getFieldError("image") && formik.touched.image ? "border-red-500 focus:ring-red-500" : "border-gray-300 focus:ring-purple-600"
                  }`}
                />
                {getFieldError("image") && formik.touched.image && (
                  <p className="text-red-500 text-sm mt-1">{getFieldError("image")}</p>
                )}
                {(imagePreview || formik.values.image) && (
                  <div className="mt-3 p-3 bg-gray-100 rounded-xl">
                    <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                    <img
                      src={imagePreview || formik.values.image}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-lg"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://via.placeholder.com/128?text=Invalid+Image";
                      }}
                    />
                  </div>
                )}
              </div>

            {/* Buttons */}
            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => navigate("/afx-admin")}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || !formik.isValid}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70"
              >
                <Plus className="w-5 h-5" />
                {loading ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProduct;
