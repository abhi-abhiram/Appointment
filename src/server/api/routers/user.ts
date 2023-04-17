import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import * as bcrypt from "bcrypt";

export const userRouter = createTRPCRouter({
  me: protectedProcedure.query(({ ctx }) => {
    return {
      id: ctx.session.user.id,
    }
  }),
  login: publicProcedure
    .input(z.object({ email: z.string(), password: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.findUnique({
        where: {
          email: input.email,
        },
      });

      if (!user)
        throw new TRPCError({
          message: "Invalid email or password",
          code: "NOT_FOUND",
        });

      const cred = await ctx.prisma.credentials.findUnique({
        where: {
          userID: user.id,
        },
      });

      if (!cred) {
        throw new TRPCError({
          message: "Invalid email or password",
          code: "NOT_FOUND",
        });
      }

      const valid = await bcrypt.compare(input.password, cred.password);
      if (!valid) {
        throw new Error("Invalid password");
      }
      // console.log("userss", user);

      return user;
    }),

  signup: publicProcedure
    .input(
      z.object({
        email: z.string(),
        password: z.string(),
        name: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const user = await ctx.prisma.user.create({
        data: {
          email: input.email,
          name: input.name,
        },
      });

      await ctx.prisma.credentials.create({
        data: {
          password: await bcrypt.hash(input.password, 10),
          userID: user.id,
        },
      });

      return user;
    }),
});
