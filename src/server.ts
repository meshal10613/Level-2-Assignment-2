import express, { Request, Response } from "express";
import config from "./config";
import initDB from "./config/db";
import { authRoutes } from "./modules/auth/auth.routes";


const app = express();
const port = config.port;

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
// app.use("/users", userRoutes);

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
})