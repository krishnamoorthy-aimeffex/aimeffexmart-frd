import { apiSlice } from "./apiSlice";

export const cartApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCart: builder.query<
      {
        message?: string;
        data: any[];
        total?: string | number;
        itemCount?: number;
      },
      void
    >({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),

    addToCart: builder.mutation<void, any>({
      query: (body) => ({
        url: "/cart/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    updateCart: builder.mutation<
      { cartItemId: string; quantity: number },
      { cartItemId: string; quantity: number }
    >({
      query: (body) => ({
        url: `/cart/${body.cartItemId}`,
        method: "PUT",
        body: { quantity: body.quantity },
      }),
      invalidatesTags: ["Cart"],
    }),

    removeFromCart: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cart/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    clearCart: builder.mutation<void, void>({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),

    getCartCount: builder.query<{ count: number }, void>({
      query: () => "/cart/count",
      providesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
  useGetCartCountQuery,
} = cartApi;
