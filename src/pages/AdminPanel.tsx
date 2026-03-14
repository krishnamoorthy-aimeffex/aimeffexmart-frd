import { useState, useEffect } from "react";
import { ShoppingBag, Search, Plus, Menu, X, Edit2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useGetAllProductsQuery, useDeleteProductMutation } from "../redux/api/productApi";

interface Product {
  _id: string;
  name: string;
  price: number;
  originalPrice?: number;
  category: string;
  stock: number;
  rating: number;
  reviews: number;
  description: string;
  image: string;
}

function AdminPanel() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<{
    isOpen: boolean;
    productId: string | null;
    productName: string | null;
  }>({
    isOpen: false,
    productId: null,
    productName: null,
  });
  const [deleting, setDeleting] = useState(false);

  // RTK Query hooks
  const {
    data: productsData,
    isLoading: loading,
    error: queryError,
  } = useGetAllProductsQuery();

  const [deleteProductMut] = useDeleteProductMutation();

  const error = queryError ? ((queryError as any).message || "Failed to fetch products") : "";

  // Sync products data from RTK Query
  useEffect(() => {
    if (productsData) {
      const items = Array.isArray(productsData)
        ? productsData
        : (productsData as any).data || [];
      setProducts(items || []);
    }
  }, [productsData]);

  const openDeleteConfirm = (id: string, name: string) => {
    setDeleteConfirm({
      isOpen: true,
      productId: id,
      productName: name,
    });
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirm({
      isOpen: false,
      productId: null,
      productName: null,
    });
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirm.productId) return;

    try {
      setDeleting(true);
      await deleteProductMut(deleteConfirm.productId)
        .unwrap();
      setProducts(products.filter((p) => p._id !== deleteConfirm.productId));
      closeDeleteConfirm();
      alert("Product deleted successfully!");
    } catch (err) {
      alert((err as any)?.data?.message || (err as Error)?.message || "Failed to delete product");
    } finally {
      setDeleting(false);
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {/* Admin Navbar */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between py-4">
            {/* Logo */}
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/")}
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2.5 rounded-xl">
                <ShoppingBag className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            </div>

            {/* Search */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <div className="relative w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full pl-12 pr-4 py-3 border rounded-xl"
                />
              </div>
            </div>

            {/* Add Product Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/afx-admin/add-product")}
                className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition cursor-pointer"
              >
                <Plus className="w-5 h-5" />
                <span className="font-medium">Add Product</span>
              </button>

              {/* Mobile Menu */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-white">
            <div className="px-4 py-4 space-y-3">
              <button
                onClick={() => navigate("/afx-admin/add-product")}
                className="w-full flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl"
              >
                <Plus className="w-5 h-5" />
                <span>Add Product</span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Panel Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Products</h2>
            <p className="text-gray-600 mt-1">Manage all products in your store</p>
          </div>
          <button
            onClick={() => navigate("/afx-admin/add-product")}
            className="md:hidden flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition"
          >
            <Plus className="w-5 h-5" />
            Add Product
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-xl">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition group cursor-pointer"
              >
                {/* Image Container */}
                <div className="relative overflow-hidden bg-gray-100 h-64">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://via.placeholder.com/256?text=No+Image";
                    }}
                  />

                  {/* Badges */}
                  <div className="absolute top-4 left-4">
                    {product.stock > 0 ? (
                      <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-block bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                        Out of Stock
                      </span>
                    )}
                  </div>

                </div>

                {/* Content */}
                <div className="p-4">
                  {/* Product Name */}
                  <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2">
                    {product.name}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-yellow-400">⭐</span>
                    <span className="font-semibold text-gray-900">
                      {product.rating?.toFixed(1) || "0"}
                    </span>
                    <span className="text-gray-600 text-sm">
                      ({product.reviews || 0})
                    </span>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                      ₹{product.price}
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">
                        ₹{product.originalPrice}
                      </span>
                    )}
                  </div>

                  {/* Stock Info */}
                  <p className="text-xs text-gray-600 mb-4">
                    {product.stock} in stock
                  </p>

                  {/* Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => navigate(`/afx-admin/update-product/${product._id}`)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      <Edit2 className="w-5 h-5" />
                      Update
                    </button>
                    <button
                      onClick={() => openDeleteConfirm(product._id, product.name)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
                    >
                      <Trash2 className="w-5 h-5" />
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {products.length === 0 ? "No products yet" : "No products found"}
            </h3>
            <p className="text-gray-600 mb-6">
              {products.length === 0
                ? "Start by adding your first product"
                : "Try adjusting your search filters"}
            </p>
            {products.length === 0 && (
              <button
                onClick={() => navigate("/afx-admin/add-product")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:shadow-lg transition"
              >
                <Plus className="w-5 h-5" />
                Add First Product
              </button>
            )}
          </div>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirm.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Overlay */}
          <div
            className="absolute inset-0 bg-opacity-10 backdrop-blur-sm"
            onClick={closeDeleteConfirm}
          ></div>

          {/* Modal */}
          <div className="relative bg-white rounded-2xl shadow-2xl p-6 max-w-sm mx-4 z-10 animate-in fade-in zoom-in-95">
            {/* Close Button */}
            <button
              onClick={closeDeleteConfirm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Icon */}
            <div className="flex justify-center mb-4">
              <div className="bg-red-100 p-4 rounded-full">
                <Trash2 className="w-8 h-8 text-red-600" />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Delete Product?
            </h3>

            {/* Message */}
            <p className="text-gray-600 text-center mb-6">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900">
                "{deleteConfirm.productName}"
              </span>
              ? This action cannot be undone.
            </p>

            {/* Buttons */}
            <div className="flex gap-3">
              <button
                onClick={closeDeleteConfirm}
                disabled={deleting}
                className="flex-1 px-4 py-3 border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition disabled:opacity-50"
              >
                No, Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={deleting}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-semibold hover:shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="w-5 h-5" />
                    Yes, Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminPanel;