import { apiSlice } from "./base-query";
import { User } from "@/types/user";

export const authApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Login
    login: builder.mutation({
      query: (credentials) => ({
        url: "/login",
        method: "POST",
        body: credentials,
      }),
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // ✅ Get current user (/me)
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: "/me",
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: User;
      }) => response.data,
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;
