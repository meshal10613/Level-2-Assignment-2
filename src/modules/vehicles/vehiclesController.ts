import { Request, Response } from "express";
import { vehiclesService } from "./vehiclesService";

const createVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.createVehicles(req.body);
        if (
            result === "Missing required fields" ||
            typeof result === "string"
        ) {
            return res.status(400).json({
                success: false,
                message: result,
            });
        }
        res.status(201).json({
            success: true,
            message: "Vehicles created successfully",
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

const getAllVehicles = async (req: Request, res: Response) => {
    try {
        const result = await vehiclesService.getAllVehicles();
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No vehicles found",
                data: result.rows,
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const getVehiclesById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const result = await vehiclesService.getVehiclesById(id as string);
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No vehicles found",
                data: result.rows,
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles retrieved successfully",
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

const updateVehiclesById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
		const payload = req.body;
        const result = await vehiclesService.updateVehiclesById(id as string, payload);
        if (result?.length === 0 || typeof result === "string") {
            return res.status(404).json({
                success: false,
                message: "Vehicles not found",
            });
        }
		res.status(200).json({
			success: true,
			message: "Vehicles updated successfully",
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

const deleteVehiclesById = async (req: Request, res: Response) => {
    try {
        const id = req.params.vehicleId;
        const result = await vehiclesService.deleteVehiclesById(id as string);
        if (result.rows.length === 0) {
            return res.status(200).json({
                success: false,
                message: "No vehicles found",
                data: result.rows,
            });
        }
        res.status(200).json({
            success: true,
            message: "Vehicles deleted successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message,
            errors: error,
        });
    }
};

export const vehiclesController = {
    createVehicles,
    getAllVehicles,
    getVehiclesById,
    updateVehiclesById,
    deleteVehiclesById,
};
