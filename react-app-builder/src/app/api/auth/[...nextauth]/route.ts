// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from 'next-auth';
import GitHubProvider from 'next-auth/providers/github';

declare module 'next-auth' {
  interface Session {
    accessToken?: string;
  }
}

// Create NextAuth handler
export const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID || '',
      clientSecret: process.env.GITHUB_SECRET || '',
      authorization: {
        params: {
          scope: 'repo read:org user gist', // Request additional permissions
          profile(profile:any) {
            return {
              id: profile.id,
              name: profile.name || profile.login,
              email: profile.email,
              image: profile.avatar_url,
              username: profile.login // Get the username here
            };
          },
        },
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, account }: { token: any; account?: any }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};

// Named exports for the HTTP methods
export const GET = NextAuth(authOptions);
export const POST = NextAuth(authOptions);
