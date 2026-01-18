import { auth } from './auth';
import { UserRole } from '@/types/auth';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user || null;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export async function requireRole(role: UserRole) {
  const user = await requireAuth();
  if (user.role !== role && user.role !== 'admin') {
    throw new Error('Forbidden');
  }
  return user;
}

export function hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
  if (userRole === 'admin') return true;
  return userRole === requiredRole;
}

