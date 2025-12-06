import express from "express";
import { bookingController } from "./booking.controller";
import auth from "../../middleware/auth";

const router = express.Router();

router.post("/", auth("admin", "customer"), bookingController.createBookings);
router.get("/", auth("admin", "customer"), bookingController.getAllBookings);
router.put("/:bookingId", bookingController.updateBookingsById);

export const bookingsRoutes = router;