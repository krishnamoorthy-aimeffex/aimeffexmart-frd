import { useState, useEffect } from "react";
import { CheckCircle, ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useGetProductByIdQuery, useUpdateProductMutation } from "../../redux/api/productApi";
import { Formik } from "formik";
import type { FormikHelpers } from "formik";
import * as Yup from "yup";

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

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Product name is required"),
  price: Yup.number().typeError("Price must be a number").positive("Price must be positive").required("Price is required"),
  originalPrice: Yup.number().typeError("Original price must be a number").min(0, "Must be >= 0").notRequired(),
  description: Yup.string().required("Description is required").min(10, "Description is too short"),
  category: Yup.string().required("Category is required"),
  image: Yup.string().required("Product image is required"),
  stock: Yup.number().typeError("Stock must be a number").integer("Stock must be an integer").min(0, "Stock cannot be negative").notRequired(),
  rating: Yup.number().typeError("Rating must be a number").min(0).max(5).notRequired(),
  reviews: Yup.number().typeError("Reviews must be a number").integer().min(0).notRequired(),
});

function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [initialValues, setInitialValues] = useState<ProductFormData>({
    name: "",
    image: "",
    rating: 0,
    reviews: 0,
    price: 0,
    originalPrice: 0,
    description: "",
    category: "",
    stock: 0,
  });

  // RTK Query hooks
  const {
    data: productData,
    isLoading: loading,
    error: queryError,
  } = useGetProductByIdQuery(String(id), { skip: !id });

  const [updateProductMut] = useUpdateProductMutation();

  // Sync product data from RTK Query
  useEffect(() => {
    if (productData) {
      const product = (productData && (productData.data || productData)) || {};
      setInitialValues({
        name: product.name || "",
        image: product.image || "",
        rating: product.rating ?? 0,
        reviews: product.reviews ?? 0,
        price: product.price ?? 0,
        originalPrice: product.originalPrice ?? 0,
        description: product.description || "",
        category: product.category || "",
        stock: product.stock ?? 0,
      });
    }

    if (queryError) {
      setError((queryError as any)?.message || "Failed to fetch product");
    }
  }, [productData, queryError]);

  const handleFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  const handleSubmit = async (values: ProductFormData, actions: FormikHelpers<ProductFormData>) => {
    setError("");
    try {
      setSubmitting(true);
      if (!id) {
        setError("Product ID not found");
        return;
      }
      await updateProductMut({ id, data: values })
        .unwrap();
      actions.setSubmitting(false);
      navigate("/afx-admin");
    } catch (err) {
      setError((err as any)?.data?.message || (err as Error)?.message || "Update failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate("/afx-admin")}
            className="p-2 hover:bg-gray-100 rounded-xl"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Update Product
          </h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue, handleSubmit, isSubmitting }) => (
              <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter product name"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.name && touched.name ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-600'}`}
                    />
                    {errors.name && touched.name && <div className="text-sm text-red-600 mt-1">{errors.name}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={values.category}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.category && touched.category ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-600'}`}
                    >
                      <option value="">Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                    {errors.category && touched.category && <div className="text-sm text-red-600 mt-1">{errors.category}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={values.price as unknown as string}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.price && touched.price ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-600'}`}
                    />
                    {errors.price && touched.price && <div className="text-sm text-red-600 mt-1">{errors.price}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Original Price (Optional)</label>
                    <input
                      type="number"
                      name="originalPrice"
                      value={values.originalPrice as unknown as string}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0.00"
                      step="0.01"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.originalPrice && touched.originalPrice && <div className="text-sm text-red-600 mt-1">{errors.originalPrice}</div>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      value={values.stock as unknown as string}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      min="0"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.stock && touched.stock && <div className="text-sm text-red-600 mt-1">{errors.stock}</div>}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                    <input
                      type="number"
                      name="rating"
                      value={values.rating as unknown as string}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="0"
                      step="0.1"
                      min="0"
                      max="5"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    {errors.rating && touched.rating && <div className="text-sm text-red-600 mt-1">{errors.rating}</div>}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Reviews</label>
                  <input
                    type="number"
                    name="reviews"
                    value={values.reviews as unknown as string}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="0"
                    min="0"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />
                  {errors.reviews && touched.reviews && <div className="text-sm text-red-600 mt-1">{errors.reviews}</div>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Description <span className="text-red-500">*</span></label>
                  <textarea
                    name="description"
                    value={values.description}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="Enter product description"
                    rows={5}
                    className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 ${errors.description && touched.description ? 'border-red-400 focus:ring-red-300' : 'border-gray-300 focus:ring-purple-600'}`}
                  />
                  {errors.description && touched.description && <div className="text-sm text-red-600 mt-1">{errors.description}</div>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Product Image <span className="text-red-500">*</span></label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.currentTarget.files?.[0];
                      if (!file) return;
                      try {
                        const base64 = await handleFileToBase64(file);
                        setFieldValue('image', base64);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                  />

                  {values.image && (
                    <div className="mt-3 p-3 bg-gray-100 rounded-xl">
                      <p className="text-sm text-gray-600 mb-2">Image Preview:</p>
                      <img
                        src={values.image}
                        alt="Preview"
                        className="h-32 w-32 object-cover rounded-lg"
                        onError={(e) => { (e.target as HTMLImageElement).src = "https://via.placeholder.com/128?text=Invalid+Image"; }}
                      />
                    </div>
                  )}
                  {errors.image && touched.image && <div className="text-sm text-red-600 mt-1">{errors.image}</div>}
                </div>

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
                    disabled={isSubmitting || submitting}
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-70"
                  >
                    <CheckCircle className="w-5 h-5" />
                    {isSubmitting || submitting ? "Updating..." : "Update Product"}
                  </button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
}

export default UpdateProduct;
