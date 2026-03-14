import { apiSlice } from "./apiSlice";

export const userApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    updateProfile: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user/update",
        method: "PUT",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getUserCount: builder.query<{ count: number }, void>({
      query: () => "/users/count",
      providesTags: ["User"],
    }),
  }),
});

export const { useUpdateProfileMutation, useGetUserCountQuery } = userApi;
