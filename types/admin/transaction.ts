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
}

// Transaction Detail (for individual products in the transaction)
export interface TransactionDetail {
  product_id: number;
  quantity: number;
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
  voucher?: any[]; // Add proper voucher type if needed
}

// Create transaction response
export interface CreateTransactionResponse {
  success: boolean;
  message: string;
  data: Transaction | Transaction[]; // Could be single or multiple transactions
}

// For API service typing
export interface TransactionApiResponse<T = any> {
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