import NextAuth from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET as string,
      
      authorization: {
          params: {
              prompt: "consent"
            }
        },
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 1, // Set maxAge to a minimum value (1 second) to effectively expire it immediately
  },
  callbacks: {
    async signIn({ user, account, profile }) {
        
      console.log("User: ", user);
      console.log("Account: ", account);
      console.log("Profile: ", profile)

      if (account?.provider === "google" && profile) {
        return (profile as any).email_verified; 
      }
      return false;
    },
    async jwt() { return {}; },
    async session({ session }) { 
      return { 
        ...session,
        user: {} 
      }; 
    },
    // Redirect to user dashboard page
    async redirect({ url, baseUrl }) {
      // If the URL is our custom redirect, allow it.
      if (url.startsWith(`${baseUrl}/api/set-session-cookie`)) {
          return url;
      }
      // Otherwise, use default behavior.
      return url.startsWith(baseUrl) ? url : baseUrl;
    }
  }
}

export default NextAuth(authOptions)