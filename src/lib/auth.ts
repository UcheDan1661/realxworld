import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types/auth';

// In-memory user store (replace with database in production)
const users: User[] = [];

export const config: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = users.find((u) => u.email === email);
        if (!user || !user.password) {
          return null;
        }

        const isPasswordValid = await bcrypt.compare(
          password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role: UserRole }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  pages: {
    signIn: '/signin',
    signOut: '/',
    error: '/signin',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production',
};

// Helper function to create a new user (for signup)
export async function createUser(
  email: string,
  password: string,
  name: string,
  role: UserRole = 'buyer'
): Promise<User | null> {
  // Check if user already exists
  if (users.find((u) => u.email === email)) {
    return null;
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser: User = {
    id: Date.now().toString(),
    email,
    name,
    role,
    password: hashedPassword,
  };

  users.push(newUser);
  return { ...newUser, password: undefined };
}

// Helper function to get user by email
export function getUserByEmail(email: string): User | undefined {
  return users.find((u) => u.email === email);
}

// Export auth function for NextAuth v5
export const { handlers, auth, signIn, signOut } = NextAuth(config);

