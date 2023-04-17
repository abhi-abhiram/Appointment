import lucia from "lucia-auth";
import { node } from "lucia-auth/middleware";
import prisma from "@lucia-auth/adapter-prisma";
import { prisma as prismaClient } from "~/server/db";
import { env } from "~/env.mjs";

export const auth = lucia({
    adapter: prisma(prismaClient),
    env: env.NODE_ENV === "development" ? "DEV" : "PROD",
    middleware: node(),
    transformDatabaseUser: (userData) => {
        return {
            userId: userData.id,
            email: userData.email
        };
    }
});

export type Auth = typeof auth;