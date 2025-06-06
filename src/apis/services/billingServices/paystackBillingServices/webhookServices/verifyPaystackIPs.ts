import { Request, Response, NextFunction } from "express";


export const verifyPaystackIP = (req: Request, res: Response, next: NextFunction) => {
    const forwardedFor = req.headers["x-forwarded-for"] as string;
    const remoteIp = forwardedFor ? forwardedFor.split(",")[0].trim() : req.ip;

    // @ts-ignore
    const ip = remoteIp.replace("::ffff:", "");

    const allowedIps = ["52.31.139.75", "52.49.173.169", "52.214.14.220"];
    if (!allowedIps.includes(ip)) {
        return res.status(403).send("Forbidden IP");
    }
    next();
};


/*
* USAGE
*
* router.post("/webhook-paystack", verifyPaystackIP, paystackWebhookController);

* */