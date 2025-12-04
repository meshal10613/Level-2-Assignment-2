import dotenv from "dotenv";
import path from "path";

dotenv.config();

const config = {
	port: process.env.PORT || 5000,
};

export default config;