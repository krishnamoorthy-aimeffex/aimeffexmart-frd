import { apiSlice } from "./apiSlice";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<any, { email: string; password: string }>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/register",
        method: "POST",
        body,
      }),
    }),

    getProfile: builder.query<any, void>({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
} = authApi;
