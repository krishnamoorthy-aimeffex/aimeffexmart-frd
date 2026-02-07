import apiClient from "./auth.api";

export interface BackendCartItem {
  _id: string; // cart item id
  productId: any; // populated product object
  quantity: number;
}

export const getCart = async () => {
  const res = await apiClient.get("/cart");
  return res.data; // { message, data: BackendCartItem[], total, itemCount }
};

export const addToCart = async (productId: string, quantity = 1) => {
  const res = await apiClient.post("/cart/add", { productId, quantity });
  return res.data;
};

export const updateCartQuantity = async (cartItemId: string, quantity: number) => {
  const res = await apiClient.put(`/cart/${cartItemId}`, { quantity });
  return res.data;
};

export const removeFromCart = async (cartItemId: string) => {
  const res = await apiClient.delete(`/cart/${cartItemId}`);
  return res.data;
};

export const clearCart = async () => {
  const res = await apiClient.delete(`/cart/clear`);
  return res.data;
};

export const getCartCount = async () => {
  const res = await apiClient.get(`/cart/count`);
  return res.data; // { count }
};

export default {
  getCart,
  addToCart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  getCartCount,
};
