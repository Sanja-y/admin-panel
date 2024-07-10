import NextAuth from 'next-auth/next';
import { NextAuthOptions } from 'next-auth';
import GitHubProvider from "next-auth/providers/github";

const allowedEmails = ['sanjaym0919@gmail.com'];

export const authOptions: NextAuthOptions = {
    session: {
        strategy: 'jwt',
        maxAge: 30 * 24 * 60 * 60, // 30 days in seconds
    },
    providers: [
        GitHubProvider({
            clientId: process.env.AUTH_GITHUB_ID!,
            clientSecret: process.env.AUTH_GITHUB_SECRET!,
            async profile(profile, tokens) {
                const response = await fetch('https://api.github.com/user/emails', {
                    headers: {
                        Authorization: `token ${tokens.access_token}`,
                    },
                });
                const emails = await response.json();
                const primaryEmail = emails.find((email: { primary: boolean }) => email.primary)?.email;
                console.log("Response",response,primaryEmail, emails)
                if (!allowedEmails.includes(primaryEmail)) {
                    throw new Error('You are not authorized to sign in with this account.');
                }
                
                return {
                    id: profile.id.toString(),
                    name: profile.name || profile.login,
                    email: primaryEmail,
                    image: profile.avatar_url,
                };
                
            },
        }),
    ],
    secret: "fuckyou",
    pages: {
        signIn: '/',
        signOut: '/logout',
        error: '/wrong',
        verifyRequest: '/verify',
        newUser: '/getting-started',
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.image = user.image;
            }
            console.log("Callback",user,token)
            return token;
        },
        async session({ session, token }) {
            session.user = {
                id: token.id as string,
                email: token.email,
                name: token.name,
                image: token.image as string,
            };
            console.log("Session",session)
            return session;
        },
        async redirect({ baseUrl }) {
            console.log("Baseurl", baseUrl)
            return "";
        },
    },
    debug: true,
};

export default NextAuth(authOptions);
