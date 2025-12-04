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
        const result = await userService.updateUserById(
            userId as string,
            payload
        );
		
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

export const userController = {
    getAllUsers,
    updateUserById,
};
