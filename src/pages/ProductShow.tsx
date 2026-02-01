import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import BackBtn from "../components/ui/BackBtn";

interface Product {
  id: number | string;
  name: string;
  image?: string;
  badge?: string;
  rating?: number | string;
  reviews?: number | string;
  price?: number | string;
  originalPrice?: number | string;
  description?: string;
}

function ProductShow() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [inCart, setInCart] = useState(false);

  const CART_KEY = "cart";

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetch("/Product.json")
      .then((r) => r.json())
      .then((list: Product[]) => {
        const found = list.find((p) => String(p.id) === String(id));
        setProduct(found ?? null);
        if (found) {
          setInCart(getList(CART_KEY).some((p) => p.id === found.id));
        }
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false));
  }, [id]);

  function getList(key: string): Product[] {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return [];
      return JSON.parse(raw) as Product[];
    } catch {
      return [];
    }
  }

  function saveList(key: string, list: Product[]) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch {}
  }

//   function isInCart(key: string, pid: Product["id"]) {
//     return getList(key).some((p) => p.id === pid);
//   }


  function addToCart(p: Product) {
    const list = getList(CART_KEY);
    const exists = list.some((x) => x.id === p.id);
    const next = exists ? list : [p, ...list];
    saveList(CART_KEY, next);
    setInCart(true);
  }

  if (loading) return <div className="p-8">Loading…</div>;
  if (!product)
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
          <p className="text-gray-500 mt-2">No product matches the id {id}</p>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-4 py-2 bg-purple-600 text-white rounded"
          >
            Back to shop
          </button>
        </div>
      </div>
    );

  return (
    <>
      <div className="ml-4 mt-3">
        <BackBtn />
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image}
              alt={product.name}
              className="w-full object-cover rounded-2xl shadow"
            />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1 text-yellow-400">
                <Star className="w-4 h-4" />
                <span className="font-semibold">{product.rating ?? "—"}</span>
              </div>
              <div className="text-sm text-gray-500">
                ({product.reviews ?? 0} reviews)
              </div>
            </div>
            <div className="text-2xl font-bold text-purple-600 mb-4">
              ${product.price}
            </div>
            {product.originalPrice && (
              <div className="text-sm text-gray-400 line-through mb-4">
                ${product.originalPrice}
              </div>
            )}
            <p className="text-gray-700 mb-6">
              {product.description ?? "No description available."}
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => addToCart(product)}
                className="px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-4 h-4" />
                {inCart ? 'Added' : 'Add to Cart'}
              </button>
              <button className="px-13 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg flex items-center gap-2 cursor-pointer">
                <ShoppingCart className="w-4 h-4" />
                Buy
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductShow;
