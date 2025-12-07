import { Request, Response } from "express";
import { userService } from "./user.service";

const getAllUsers = async (req: Request, res: Response) => {
    try {
        const result = await userService.getAllUsers();
        res.status(200).json({
            success: true,
            message: "Users retrieved successfully",
            data: result.rows,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

const updateUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;
        const payload = req.body;
        if (req?.user?.role !== "admin" && req?.user?.id !== parseInt(userId as string)) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized Access",
            });
        }
        const result = await userService.updateUserById(
            userId as string,
            payload
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
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

const deleteUserById = async (req: Request, res: Response) => {
    try {
        const result = await userService.deleteUserById(
            req.params.userId as string
        );
        if (typeof result === "string") {
            return res.status(404).json({
                success: false,
                message: result,
            });
        }
        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

export const userController = {
    getAllUsers,
    updateUserById,
    deleteUserById,
};
