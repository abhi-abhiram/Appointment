import type { NextApiRequest, NextApiResponse } from "next";
import { auth } from "~/auth/lucia";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method !== "POST")
        return res.status(404).json({ error: "Not found" });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const { email, password, name } = JSON.parse(req.body) as { email: string, password: string, name: string };

    const authRequest = auth.handleRequest(req, res);
    try {
        const user = await auth.createUser({
            primaryKey: {
                providerId: "email",
                providerUserId: email,
                password,
            },
            attributes: {
                email,
                name
            }
        });
        const session = await auth.createSession(user.userId);
        authRequest.setSession(session);
        return res.redirect(302, "/");
    } catch (e) {
        console.error(e);
        return res.status(400).json({});
    }
};