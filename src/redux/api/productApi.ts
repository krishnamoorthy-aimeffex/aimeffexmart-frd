import { apiSlice } from "./apiSlice";

export const productApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllProducts: builder.query<any[], void>({
      query: () => "/products",
      providesTags: ["Product"],
    }),

    getProductById: builder.query<any, string>({
      query: (id) => `/products/${id}`,
    }),

      getProductCount: builder.query<{ count: number }, void>({
      query: () => "/products/count",
      providesTags: ["Product"],
    }),

    getProductsByCategory: builder.query<any[], string>({
      query: (category) => `/products/category/${category}`,
      providesTags: ["Product"],
    }),
     
    postProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: "/products/add",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Product"],
    }),

    updateProduct: builder.mutation<any, { id: string; data: any }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),

    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
  }),
});

export const {
  useGetAllProductsQuery,
  useGetProductByIdQuery,
  useGetProductCountQuery,
  useGetProductsByCategoryQuery,
  usePostProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
