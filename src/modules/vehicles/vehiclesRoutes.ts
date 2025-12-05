import express from "express";
import { vehiclesController } from "./vehiclesController";

const router = express.Router();

router.post("/", vehiclesController.createVehicles);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehiclesById);
router.delete("/:vehicleId", vehiclesController.deleteVehiclesById);

export const vehiclesRoutes = router;