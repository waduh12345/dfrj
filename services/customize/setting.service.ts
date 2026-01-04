import { apiSecondSlice } from "@/services/base-query";
import {
  PengaturanDetailResponse,
  PengaturanListParams,
  PengaturanListResponse,
} from "@/types/customization/setting";

export const pengaturanApi = apiSecondSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📋 Get List
    // URL: /website/pengaturan?client_code=...
    getPengaturanList: builder.query<
      PengaturanListResponse,
      PengaturanListParams
    >({
      query: (params) => ({
        url: "/website/pengaturan",
        method: "GET",
        params: params,
      }),
      providesTags: (result) =>
        result?.data?.items
          ? [
              ...result.data.items.map(({ id }) => ({
                type: "Pengaturan" as const,
                id,
              })),
              { type: "Pengaturan", id: "LIST" },
            ]
          : [{ type: "Pengaturan", id: "LIST" }],
    }),

    // ➕ Create (POST)
    // URL: /website/pengaturan
    createPengaturan: builder.mutation<PengaturanDetailResponse, FormData>({
      query: (body) => ({
        url: "/website/pengaturan",
        method: "POST",
        body: body,
      }),
      invalidatesTags: [{ type: "Pengaturan", id: "LIST" }],
    }),

    // ✏️ Update (PUT)
    // URL: /website/pengaturan/:id
    updatePengaturan: builder.mutation<
      PengaturanDetailResponse,
      { id: number | string; data: FormData }
    >({
      query: ({ id, data }) => ({
        url: `/website/pengaturan/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Pengaturan", id: "LIST" },
        { type: "Pengaturan", id },
      ],
    }),
  }),
});

// ==========================================
// 3. Hooks Export
// ==========================================

export const {
  useGetPengaturanListQuery,
  useCreatePengaturanMutation,
  useUpdatePengaturanMutation,
} = pengaturanApi;