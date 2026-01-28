import NextAuth, { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { User, UserRole } from '@/types/auth';
import connectMongo from '@/dbconfig/dbconn';
import UserModel from '@/models/User';

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

        try {
          // Connect to database
          await connectMongo();

          const email = credentials.email as string;
          const password = credentials.password as string;

          // Find user by email and include password
          const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+password');

          if (!user || !user.password) {
            return null;
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
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
  try {
    // Connect to database
    await connectMongo();

    // Check if user already exists
    const existingUser = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return null;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = await UserModel.create({
      email: email.toLowerCase(),
      name: name.trim(),
      password: hashedPassword,
      role,
    });

    console.log('✅ User created successfully:', {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    });

    // Return user without password
    return {
      id: newUser._id.toString(),
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
    };
  } catch (error) {
    // MongoDB duplicate key (E11000) = email already exists (race or unique index)
    const mongoErr = error as { code?: number };
    if (mongoErr?.code === 11000 || mongoErr?.code === 11001) {
      return null; // → signup route returns 409 "User already exists"
    }
    console.error('❌ Error creating user:', error);
    throw error; // re-throw so route returns 500, not 409
  }
}

// Helper function to get user by email
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    // Connect to database
    await connectMongo();

    const user = await UserModel.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      return null;
    }

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    console.error('Error getting user by email:', error);
    return null;
  }
}

// Export auth function for NextAuth v5
export const { handlers, auth, signIn, signOut } = NextAuth(config);

