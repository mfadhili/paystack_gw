import { Request, Response, NextFunction } from "express";

export const verifyPaddleIP = (req: Request, res: Response, next: NextFunction) => {
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const remoteIp = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip;

    // @ts-ignore
    const ip = remoteIp.replace("::ffff:", "");

    const PADDLE_IPS = new Set([
        // Sandbox
        "34.194.127.46", "54.234.237.108", "3.208.120.145",
        "44.226.236.210", "44.241.183.62", "100.20.172.113",
        // Live
        "34.232.58.13", "34.195.105.136", "34.237.3.244",
        "35.155.119.135", "52.11.166.252", "34.212.5.7"
    ]);

    if (!PADDLE_IPS.has(ip)) {
        console.warn(`[SECURITY] Webhook blocked from unauthorized IP: ${ip}`);
        return res.status(403).json({ error: "Forbidden" });
    }

    next();
};
