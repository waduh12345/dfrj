import { apiSlice } from "../base-query";
import { Customer } from "@/types/admin/customer"; 

export const customerApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Customer Categories (with pagination)
    getCustomerList: builder.query<
      {
        data: Customer[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/user`,
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
          data: Customer[];
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

    // 🔍 Get Customer Category by Slug
    getCustomerBySlug: builder.query<Customer, string>({
      query: (slug) => ({
        url: `/user/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ➕ Create Customer Category
    createCustomer: builder.mutation<Customer, FormData>({
      query: (payload) => ({
        url: `/user`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ✏️ Update Customer Category by Slug
    updateCustomer: builder.mutation<
      Customer,
      { slug: string; payload: FormData }
    >({
      query: ({ slug, payload }) => ({
        url: `/user/${slug}?_method=PUT`,
        method: "POST",
        body: payload,
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // 🔄 Update Customer Status by ID
    updateCustomerStatus: builder.mutation<
      Customer,
      { id: string; status: boolean } // Changed from number to boolean
    >({
      query: ({ id, status }) => ({
        url: `/customer/${id}`,
        method: "PUT",
        body: {
          status,
        },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: Customer;
      }) => response.data,
    }),

    // ❌ Delete Customer Category by Slug
    deleteCustomer: builder.mutation<
      { code: number; message: string },
      string
    >({
      query: (slug) => ({
        url: `/user/${slug}`,
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
  useGetCustomerListQuery,
  useGetCustomerBySlugQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useUpdateCustomerStatusMutation,
  useDeleteCustomerMutation,
} = customerApi;