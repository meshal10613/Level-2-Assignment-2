import dotenv from "dotenv";
import path from "path";

dotenv.config({path: path.join(process.cwd(), ".env")});

const config = {
	port: process.env.PORT || 5000,
	psql_string: process.env.PSQL_STRING,
	jwt_secret: process.env.JWT_SECRET,
};

export default config;