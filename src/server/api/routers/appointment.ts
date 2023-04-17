import { CreateAppointmentInput } from "~/zodObjs/appointment";
import { protectedProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const appointmentRouter = createTRPCRouter({
    create: publicProcedure.input(CreateAppointmentInput).mutation(async ({ ctx, input }) => {
        const appointment = await ctx.prisma.appointment.create({
            data: input
        })

        return {
            appointment
        }
    }),

    appointments: protectedProcedure.query(async ({ ctx }) => {
        const appointments = await ctx.prisma.appointment.findMany({

        })

        return {
            appointments
        }
    }),

    assign: protectedProcedure.input(z.object({
        appointmentId: z.string(),
    })).mutation(async ({ ctx, input }) => {
        const appointment = await ctx.prisma.appointment.update({
            where: {
                id: input.appointmentId
            },
            data: {
                assignedTo: ctx.session.user.id
            }
        })

        return {
            appointment
        }
    }),


})
