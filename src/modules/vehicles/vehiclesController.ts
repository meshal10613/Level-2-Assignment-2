import { Request, Response } from "express";
import { vehiclesService } from "./vehiclesService";

const createVehicles = async(req: Request, res: Response) => {
	try {
		const result = await vehiclesService.createVehicles(req.body);
		if(result === "Missing required fields" || typeof result === "string") {
			return res.status(400).json({
				success: false,
				message: result,
			})
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
		})
	}
};

export const vehiclesController = {
	createVehicles,
};