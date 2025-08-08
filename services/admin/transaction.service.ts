import { apiSlice } from "../base-query";
import { Transaction } from "@/types/admin/transaction"; 

export const transactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Transaction Categories (with pagination)
    getTransactionList: builder.query<
      {
        data: Transaction[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/transaction`,
        method: "GET",
        params: {
          page,
          paginate,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: Transaction[];
          last_page: number;
          total: number;
          per_page: number;
        };
      }) => ({
        data: response.data.data,
        last_page: response.data.last_page,
        current_page: response.data.current_page,
        total: response.data.total,
        per_page: response.data.per_page,
      }),
    }),

    // 🔍 Get Transaction Category by Slug
    getTransactionBySlug: builder.query<Transaction, string>({
      query: (slug) => ({
        url: `/transaction/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // ➕ Create Transaction Category
    createTransaction: builder.mutation<Transaction, FormData>({
      query: (payload) => ({
        url: `/transaction`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // ✏️ Update Transaction Category by Slug
    updateTransaction: builder.mutation<
      Transaction,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/transaction/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Transaction;
      }) => response.data,
    }),

    // ❌ Delete Transaction Category by Slug
    deleteTransaction: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/transaction/${slug}`,
        method: "DELETE",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: null;
      }) => response,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetTransactionListQuery,
  useGetTransactionBySlugQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;