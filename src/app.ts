import express, { Request, Response } from "express";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";
import { userRoutes } from "./modules/user/user.routes";
import { vehiclesRoutes } from "./modules/vehicles/vehiclesRoutes";
import { bookingsRoutes } from "./modules/bookings/bookings.routes";


const app = express();

//? middleware
app.use(express.json()); // for json data
app.use(express.urlencoded({ extended: true })); // for form data

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
});

//* Initialize DB
initDB();

//* Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/vehicles", vehiclesRoutes);
app.use("/api/v1/bookings", bookingsRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        path: req.url,
        success: false,
        message: "Not Found!",
    });
});

export default app;