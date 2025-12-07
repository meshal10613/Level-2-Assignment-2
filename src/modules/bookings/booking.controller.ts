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
        //* if user is customer then, access only his/her bookings
        if (req?.user?.role === "customer") {
            const result = await bookingService.getAllBookingsByUserId(
                req?.user?.id as string
            );
            if (result.rows.length === 0) {
                return res.status(200).json({
                    success: false,
                    message: "No bookings found",
                    data: result.rows,
                });
            }

            return res.status(200).json({
                success: true,
                message: "Bookings retrieved successfully",
                data: result.rows,
            });
        }

        //* if user is admin then, access all bookings
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

const updateBookingsById = async (req: Request, res: Response) => {
    try {
        const id = req.params.bookingId;
        const result = await bookingService.updateBookingsById(
            id as string,
            req.user
        );
        if (typeof result === "string") {
            return res.status(404).json({
                success: false,
                message: result,
            });
        }

        res.status(200).json({
            success: true,
            message: result?.message,
            data: result?.data,
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
    updateBookingsById,
};
