import express from "express";
import { vehiclesController } from "./vehiclesController";

const router = express.Router();

router.post("/", vehiclesController.createVehicles);
router.get("/", vehiclesController.getAllVehicles);

export const vehiclesRoutes = router;