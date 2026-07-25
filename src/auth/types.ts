export type UserType = {
  id: number;
  name: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  profile_picture?: string | null;
  status: string;
  role: string | string[];
  all_permissions: string[];
  created_by?: number | null;
  updated_by?: number | null;
  needs_password_change?: boolean;
};

export type AuthStateType = {
  loading: boolean;
  user: UserType | null;
};

export type AuthContextType = {
  user: UserType | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
  changePassword: (data: any) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (data: any) => Promise<void>;
};
