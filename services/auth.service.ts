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

    // Register
    register: builder.mutation({
      query: (payload) => ({
        url: "/register",
        method: "POST",
        body: payload,
      }),
    }),

    // ✅ Resend Verification Email
    resendVerification: builder.mutation<void, { email: string }>({
      query: ({ email }) => ({
        url: "/email/resend",
        method: "POST",
        body: { email },
      }),
    }),

    // Logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),

    // Get current user
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
  useRegisterMutation,
  useResendVerificationMutation,
  useLogoutMutation,
  useGetCurrentUserQuery,
} = authApi;