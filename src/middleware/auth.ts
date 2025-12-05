import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import config from "../config";

const auth = (...roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            const token = req.headers.authorization?.split(" ")[1];
            if (!token)
                return res.status(401).json({ message: "Unauthorized Access" });

            const decoded = jwt.verify(
                token,
                config.jwt_secret as string
            ) as JwtPayload;
            req.user = decoded;
            if (roles.length && !roles.includes(decoded.role)) {
                return res.status(401).json({ message: "Unauthorized Access" });
            };
            next();
        } catch (error: any) {
            res.status(500).json({
                path: req.url,
                success: false,
                message: error.message,
                details: error,
            });
        }
    };
};

export default auth;
