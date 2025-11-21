import { apiSlice } from "@/services/base-query";

/** ===== Types persis payload publik ===== */

export interface Transaction {
  id: number;
  user_id: number | string | null;
  reference: string;
  ref_number: number;
  total: number;
  discount_total: number;
  shipment_cost: number;
  grand_total: number;
  order_id: string;
  payment_link: string;
  expires_at: string;
  paid_at: string | null;
  status: number;
  created_at: string;
  updated_at: string;
  user_name: string;
  user_email: string;
  address_line_1: string;
  postal_code: string;
}

export interface TransactionDetail {
  product_id?: number;
  product_variant_id?: number;
  quantity: number;
}

export interface ShipmentInfo {
  parameter: string; // JSON.stringify dari parameter ongkir
  shipment_detail: string; // JSON.stringify dari detail ongkir
  courier: string; // jne | pos | tiki
  cost: number;
}

export interface TransactionData {
  shop_id: number;
  details: TransactionDetail[];
  shipment: ShipmentInfo;
}

export interface CreatePublicTransactionRequest {
  address_line_1: string;
  address_line_2?: string;
  postal_code: string;
  guest_name: string;
  guest_email: string;
  guest_phone: string;
  payment_type: string;
  data: TransactionData[];
  voucher?: number[]; // ← array of id (sesuai contoh payload)
}

export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  data: Transaction | Transaction[];
}

export const publicTransactionApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createPublicTransaction: builder.mutation<
      CreateTransactionResponse,
      CreatePublicTransactionRequest
    >({
      query: (payload) => ({
        url: `/public/transaction`,
        method: "POST",
        body: payload,
        headers: { "Content-Type": "application/json" },
      }),
      transformResponse: (res: {
        code: number;
        message: string;
        data: Transaction | Transaction[];
      }): CreateTransactionResponse => ({
        success: res.code === 200 || res.code === 201,
        message: res.message,
        data: res.data,
      }),
    }),

    getPublicTransactionById: builder.query<Transaction, string | number>({
      query: (id) => ({
        url: `/public/transaction/${id}`,
        method: "GET",
        params: { include: "details.product" },
      }),
      transformResponse: (res: {
        code: number;
        message: string;
        data: Transaction;
      }) => res.data,
    }),
  }),
});

export const {
  useCreatePublicTransactionMutation,
  useGetPublicTransactionByIdQuery,
  useLazyGetPublicTransactionByIdQuery,
} = publicTransactionApi;