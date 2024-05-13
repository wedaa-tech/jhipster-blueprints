import KeycloakProvider from 'next-auth/providers/keycloak';
import NextAuth from 'next-auth';
export const authOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    jwt: async ({ token, user,account }) => {
      if(user){
        token.user = user;
      }
      if(account){
        token.accessToken = account.access_token;
      }
      return token
    },
    session: async ({ session, token }) => {
        session.user = token.user;
        session.accessToken = token.accessToken;
        return session
    }
  },
  providers: [
    KeycloakProvider({
      clientId: process.env.OIDC_CLIENT_ID,
      clientSecret: process.env.OIDC_SECRET,
      issuer: process.env.OIDC_AUTHORITY,
    }),
  ],
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
