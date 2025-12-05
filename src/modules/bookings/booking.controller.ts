import { Request, Response } from "express";
import { bookingService } from "./booking.service";

const createBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.createBookings(req.body);
        if (typeof result === "string") {
            return res.status(400).json({
                success: false,
                message: result,
            });
        }
        res.status(201).json({
            success: true,
            message: "Bookings created successfully",
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

const getAllBookings = async (req: Request, res: Response) => {
    try {
        const result = await bookingService.getAllBookings();
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No bookings found",
                data: result.rows,
            });
        }
        res.status(200).json({
            success: true,
            message: "Bookings retrieved successfully",
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

export const bookingController = {
    createBookings,
    getAllBookings,
};
