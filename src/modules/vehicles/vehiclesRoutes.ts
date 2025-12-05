import express from "express";
import { vehiclesController } from "./vehiclesController";

const router = express.Router();

router.post("/", vehiclesController.createVehicles);

export const vehiclesRoutes = router;