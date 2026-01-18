export type UserRole = 'buyer' | 'seller' | 'agent' | 'admin';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  password?: string; // Only for server-side use
}

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
}

