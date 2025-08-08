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