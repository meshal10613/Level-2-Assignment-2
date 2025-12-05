import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/", bookingController.createBookings)

export const bookingsRoutes = router;