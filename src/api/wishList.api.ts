import apiClient from "./auth.api";

export const getWishlist = async () => {
  const res = await apiClient.get("/wishlist");
  return res.data; // { message, data: WishListItem[] }
};

export const addToWishlist = async (productId: string) => {
  const res = await apiClient.post("/wishlist/add", { productId });
  return res.data;
};

export const removeFromWishlist = async (wishItemId: string) => {
  const res = await apiClient.delete(`/wishlist/${wishItemId}`);
  return res.data;
};

export const clearWishlist = async () => {
  const res = await apiClient.delete(`/wishlist/clear`);
  return res.data;
};

export const getWishlistCount = async () => {
  const res = await apiClient.get(`/wishlist/count`);
  return res.data; // { count }
};

export default {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  getWishlistCount,
};
