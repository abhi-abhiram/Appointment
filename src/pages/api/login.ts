import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "~/auth/lucia";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST")
        return res.status(404).json({ error: "Not found" });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { email, password } = JSON.parse(req.body) as { email: string, password: string };
    if (typeof email !== "string" || typeof password !== "string")
        return res.status(400).json({});
    try {
        const authRequest = auth.handleRequest(req, res);
        const key = await auth.useKey("email", email, password);
        const session = await auth.createSession(key.userId);
        authRequest.setSession(session); // set cookie
        return res.redirect(302, "/"); // redirect to profile page
    } catch {
        // invalid
        return res.status(200).json({
            error: "Incorrect email or password"
        });
    }
};