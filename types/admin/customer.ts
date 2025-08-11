// Base Transaction interface (for responses)
export interface Customer {
  id: number;
  name: string;
  phone: number;
  email: string;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface UpdateCustomerStatusRequest {
  id: string;
  email_verified_at: string; // Changed from number to boolean
}