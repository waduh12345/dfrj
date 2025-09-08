// services/product-merk.service.ts
import { apiSlice } from "./base-query";
import { ProductMerk } from "@/types/master/product-merk";

export const productMerkApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 🔍 Get All Product Merks (with pagination)
    getProductMerkList: builder.query<
      {
        data: ProductMerk[];
        last_page: number;
        current_page: number;
        total: number;
        per_page: number;
      },
      { page: number; paginate: number }
    >({
      query: ({ page, paginate }) => ({
        url: `/public/product-merks`,
        method: "GET",
        params: { page, paginate },
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: {
          current_page: number;
          data: ProductMerk[];
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

    // 🔍 Get Product Merk by Slug
    getProductMerkBySlug: builder.query<ProductMerk, string>({
      query: (slug) => ({
        url: `/public/product-merks/${slug}`,
        method: "GET",
      }),
      transformResponse: (response: {
        code: number;
        message: string;
        data: ProductMerk;
      }) => response.data,
    }),
  }),
  overrideExisting: false,
});

export const { useGetProductMerkListQuery, useGetProductMerkBySlugQuery } =
  productMerkApi;