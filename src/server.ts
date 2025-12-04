import express, { Request, Response } from "express";
import config from "./config";


const app = express();
const port = config.port;

app.get("/", (req: Request, res: Response) => {
	res.send("Hello World!");
})

app.listen(port, () => {
	console.log(`Server is running on http://localhost:${port}`);
})