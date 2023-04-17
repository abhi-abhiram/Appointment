import { z } from "zod"

export const CreateAppointmentInput = z.object({
    email: z.string().email(),
    name: z.string(),
    time: z.string(),
    date: z.string(),
})