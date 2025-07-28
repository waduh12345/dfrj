export interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  phone: string;
  status: number;
  sales_category_id?: number;
  sales_type_id?: number;
  roles: { id: number; name: string }[];
}

export interface CreateUserPayload {
  role_id: number;
  name: string;
  email: string;
  phone: string;
  password: string;
  password_confirmation: string;
  status: number;
  sales_category_id?: number;
  sales_type_id?: number;
}

export interface Role {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface FormCreateRoleProps {
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  initialData?: Role;
  roleName: string;
  setRoleName: (name: string) => void;
  isSubmitting: boolean;
}

export interface AuthenticatedUser extends User {
  token: string;
}

export interface LoginResponse {
  user: AuthenticatedUser;
  expires: string;
}
