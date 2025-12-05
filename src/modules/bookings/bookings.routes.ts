import express from "express";
import { bookingController } from "./booking.controller";

const router = express.Router();

router.post("/", bookingController.createBookings);
router.get("/", bookingController.getAllBookings);
router.put("/:bookingId", bookingController.updateBookingsById);

export const bookingsRoutes = router;