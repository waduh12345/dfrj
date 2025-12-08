import { Voucher } from "../voucher";

// Base Transaction interface (for responses)
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
  user_phone?: string;
  guest_name?: string;
  guest_email?: string;
  guest_phone?: string;
  address_line_1: string;
  postal_code: string;
  receipt_code?: string;
  shipment_status?: number;
  stores: TransactionStore[];
}
// Transaction per shop (for multi-shop transactions)
export interface TransactionStore {
  id: number;
  transaction_id: number;
  shop_id: number;
  receipt_code: string;
  shipment_status: number;
  created_at: string;
  updated_at: string;
  shop: {
    id: number;
    user_id: number;
    name: string;
    slug: string;
    phone: string;
    email: string;
    address: string;
    description: string;
    latitude: string;
    longitude: string;
    rating: string;
    total_reviews: number;
    status: boolean;
    created_at: string;
    updated_at: string;
    rajaongkir_province_id: number;
    rajaongkir_city_id: number;
    rajaongkir_district_id: string;
  };
  details: TransactionDetail[];
}

// Transaction Detail (for individual products in the transaction)
export interface TransactionDetail {
  product_id: number;
  quantity: number;
  price?: number;
  total_price?: number;
  product_name?: string;
  product_image?: string;
  product_slug?: string;
  variant?: string;
}

// Shipment information
export interface ShipmentInfo {
  parameter: string; // JSON string containing shipping parameters
  shipment_detail: string; // JSON string containing shipping details
  courier: string;
  cost: number;
}

// Parsed shipment parameter (what's inside the parameter JSON string)
export interface ShipmentParameter {
  destination: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  diameter: number;
  courier: string;
}

// Parsed shipment detail (what's inside the shipment_detail JSON string)
export interface ShipmentDetail {
  name: string;
  code: string;
  service: string;
  description: string;
  cost: number;
  etd: string;
}

// Single transaction data (for one shop)
export interface TransactionData {
  shop_id: number;
  details: TransactionDetail[];
  shipment: ShipmentInfo;
}

// Create transaction request payload
export interface CreateTransactionRequest {
  data: TransactionData[];
  voucher?: Voucher[]; // Add proper voucher type if needed
}

// Create transaction response
export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  data: Transaction | Transaction[]; // Could be single or multiple transactions
}

// For API service typing
export interface TransactionApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
}

// Update transaction status request
export interface UpdateTransactionStatusRequest {
  id: number;
  status: number;
}

// Transaction list query parameters
export interface TransactionListParams {
  page?: number;
  limit?: number;
  status?: number;
  search?: string;
}