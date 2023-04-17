import NextAuth, { type NextAuthOptions } from "next-auth";
import { env } from "~/env.mjs";
import CredentialsProvider from "next-auth/providers/credentials";
import { client } from "~/utils/api";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const authOptions: NextAuthOptions = {
    session: {
        strategy: "jwt",
    },
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            if (token.id && session.user) {
                const user = await prisma.user.findUnique({
                    where: {
                        id: token.id,
                    },
                });

                if (!user) {
                    throw new Error("User not found");
                }

                session.user = {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                };
            }
            return session;
        },
        async signIn({ account, profile, user }) {
            if (account?.provider === "google") {
                // console.log("google", account, profile);
                if (profile) {
                    const existUser = await prisma.user.findUnique({
                        where: {
                            email: profile.email,
                        },
                    });

                    if (existUser) {
                        profile.id = existUser.id;
                        user.id = existUser.id;

                        return true;
                    }

                    try {
                        const authRes = await prisma.user.create({
                            data: {
                                email: profile.email!,
                                name: profile.name!,
                            },
                        });
                        profile.id = authRes.id;
                        user.id = authRes.id;
                        // user.firstName = authRes.firstName;
                    } catch (error) {
                        console.log(error);
                    }

                    return true;
                }
            }
            return true; // Do different verification for other providers that don't have `email_verified`
        },
    },

    providers: [

        CredentialsProvider({
            async authorize(credentials) {
                if (!credentials) {
                    return null;
                }
                const authRes = await client.user.login.mutate({
                    email: credentials.email,
                    password: credentials.password,
                });

                return {
                    ...authRes,

                };
            },
            credentials: {
                email: { label: "Email", type: "text", placeholder: "jsmith" },
                password: { label: "Password", type: "password" },
            },
        }),
    ],
    secret: env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/login",
    },
};

export default NextAuth(authOptions);
