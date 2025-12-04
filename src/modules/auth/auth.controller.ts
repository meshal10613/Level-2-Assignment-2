import { Request, Response } from "express";
import { authService } from "./auth.service";

const createUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: result.rows[0],
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const loginUser = async (req: Request, res: Response) => {
    try {
        const result = await authService.loginUser(req.body);
        if (result === null) {
            return res.status(404).json({
                success: false,
                message: `User Not Found`,
            });
        }
        if (result === "password") {
            return res.status(400).json({
                success: false,
                message: `${result} does not match`,
            });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

export const authController = {
    createUser,
    loginUser,
};
