import express from "express";
import { vehiclesController } from "./vehiclesController";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin"), vehiclesController.createVehicles);
router.get("/", vehiclesController.getAllVehicles);
router.get("/:vehicleId", vehiclesController.getVehiclesById);
router.put("/:vehicleId", auth("admin"), vehiclesController.updateVehiclesById);
router.delete("/:vehicleId", auth("admin"), vehiclesController.deleteVehiclesById);

export const vehiclesRoutes = router;