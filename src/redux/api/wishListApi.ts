import { apiSlice } from "./apiSlice";

export const wishListApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWishlist: builder.query<any[], void>({
      query: () => "/wishlist",
      providesTags: ["Wishlist"],
    }),

    addToWishlist: builder.mutation<void, any>({
      query: (body) => ({
        url: "/wishlist",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Wishlist"],
    }),

    removeFromWishlist: builder.mutation<void, string>({
      query: (id) => ({
        url: `/wishlist/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    clearWishlist: builder.mutation<void, void>({
      query: () => ({
        url: "/wishlist/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Wishlist"],
    }),

    getWishlistCount: builder.query<{ count: number }, void>({
      query: () => "/wishlist/count",
      providesTags: ["Wishlist"],
    }),
  }),
});

export const {
  useGetWishlistQuery,
  useAddToWishlistMutation,
  useRemoveFromWishlistMutation,
  useClearWishlistMutation,
  useGetWishlistCountQuery,
} = wishListApi;
